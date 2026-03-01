"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMessagesRecvSocket = void 0;
const boom_1 = require("@hapi/boom");
const crypto_1 = require("crypto");
const node_cache_1 = __importDefault(require("@cacheable/node-cache"));
const WAProto_1 = require("../../WAProto");
const Defaults_1 = require("../Defaults");
const Types_1 = require("../Types");
const Utils_1 = require("../Utils");
const make_mutex_1 = require("../Utils/make-mutex");
const WABinary_1 = require("../WABinary");
const groups_1 = require("./groups");
const messages_send_1 = require("./messages-send");
const makeMessagesRecvSocket = (config) => {
    const {
        logger,
        retryRequestDelayMs, 
        maxMsgRetryCount,
        getMessage, 
        shouldIgnoreJid 
    } = config;
    const sock = (0, messages_send_1.makeMessagesSocket)(config);
    const { 
        ev,
        authState, 
        ws,
        processingMutex,
        signalRepository,
        query,
        upsertMessage,
        resyncAppState,
        groupMetadata,
        onUnexpectedError, 
        assertSessions,
        sendNode,
        relayMessage,
        sendReceipt,
        uploadPreKeys,
        createParticipantNodes,
        getUSyncDevices, 
        sendPeerDataOperationMessage
    } = sock;
    /** this mutex ensures that each retryRequest will wait for the previous one to finish */
    const retryMutex = (0, make_mutex_1.makeMutex)();
    const msgRetryCache = config.msgRetryCounterCache || new node_cache_1.default({
        stdTTL: Defaults_1.DEFAULT_CACHE_TTLS.MSG_RETRY, // 1 hour
        useClones: false
    });
    const callOfferCache = config.callOfferCache || new node_cache_1.default({
        stdTTL: Defaults_1.DEFAULT_CACHE_TTLS.CALL_OFFER, // 5 mins
        useClones: false
    });
    const placeholderResendCache = config.placeholderResendCache || new node_cache_1.default({
        stdTTL: Defaults_1.DEFAULT_CACHE_TTLS.MSG_RETRY, // 1 hour
        useClones: false
    });
    let sendActiveReceipts = false;
    const sendMessageAck = async ({ tag, attrs, content }, errorCode) => {
        const stanza = {
            tag: 'ack',
            attrs: {
                id: attrs.id,
                to: attrs.from,
                class: tag
            }
        }
        if (!!errorCode) {
            stanza.attrs.error = errorCode.toString();
        }
        if (!!attrs.participant) {
            stanza.attrs.participant = attrs.participant;
        }
        if (!!attrs.recipient) {
            stanza.attrs.recipient = attrs.recipient;
        }
        if (!!attrs.type && (tag !== 'message' || (0, WABinary_1.getBinaryNodeChild)({ tag, attrs, content }, 'unavailable') || errorCode !== 0)) {
            stanza.attrs.type = attrs.type;
        }
        if (tag === 'message' && (0, WABinary_1.getBinaryNodeChild)({ tag, attrs, content }, 'unavailable')) {
            stanza.attrs.from = authState.creds.me.id;
        }
        logger.debug({ 
            recv: {
                tag,
                attrs 
            },
            sent: stanza.attrs }, 'sent ack');
        await sendNode(stanza);
    };
    const offerCall = async (toJid, isVideo = false) => {
        const callId = (0, crypto_1.randomBytes)(16).toString('hex').toUpperCase().substring(0, 64);
        const offerContent = [];
        offerContent.push({
            tag: 'audio',
            attrs: {
                enc: 'opus',
                rate: '16000'
            }, content: undefined
        });
        offerContent.push({
            tag: 'audio',
            attrs: {
                enc: 'opus',
                rate: '8000' 
            }, content: undefined 
        });
        if (isVideo) {
            offerContent.push({
                tag: 'video',
                attrs: {
                    orientation: '0',
                    'screen_width': '1920',
                    'screen_height': '1080',
                    'device_orientation': '0',
                    enc: 'vp8',
                    dec: 'vp8',
                }
            });
        }
        offerContent.push({
            tag: 'net',
            attrs: {
                medium: '3'
            },  content: undefined 
        });
        offerContent.push({ 
            tag: 'capability',
            attrs: {
                ver: '1'
            },  content: new Uint8Array([1, 4, 255, 131, 207, 4]) });
        offerContent.push({
            tag: 'encopt',
            attrs: { 
                keygen: '2'
            },  content: undefined
        })
        const encKey = (0, crypto_1.randomBytes)(32);
        const devices = (await getUSyncDevices([toJid], true, false)).map(({ user, device }) => (0, WABinary_1.jidEncode)(user, 's.whatsapp.net', device));
        await assertSessions(devices, true);
        const { nodes: destinations, shouldIncludeDeviceIdentity } = await createParticipantNodes(devices, {
            call: {
                callKey: encKey
            }
        });
        offerContent.push({ tag: 'destination', attrs: {}, content: destinations });
        if (shouldIncludeDeviceIdentity) {
            offerContent.push({
                tag: 'device-identity',
                attrs: {},
                content: (0, Utils_1.encodeSignedDeviceIdentity)(authState.creds.account, true)
            });
        }
        const stanza = ({
            tag: 'call',
            attrs: {
                to: toJid,
            },
            content: [{
                    tag: 'offer',
                    attrs: {
                        'call-id': callId,
                        'call-creator': authState.creds.me.id,
                    },
                    content: offerContent,
                }],
        });
        await query(stanza);
        return {
            callId,
            toJid,
            isVideo,
        };
    };
    const rejectCall = async (callId, callFrom) => {
        const stanza = ({
            tag: 'call',
            attrs: {
                from: authState.creds.me.id,
                to: callFrom,
            },
            content: [{
                    tag: 'reject',
                    attrs: {
                        'call-id': callId,
                        'call-creator': callFrom,
                        count: '0',
                    },
                    content: undefined,
                }],
        });
        await query(stanza);
    };
    const sendRetryRequest = async (node, forceIncludeKeys = false) => {
        const { fullMessage } = (0, Utils_1.decodeMessageNode)(node, authState.creds.me.id, authState.creds.me.lid || '');
        const { key: msgKey } = fullMessage;
        const msgId = msgKey.id;
        const key = `${msgId}:${msgKey === null || msgKey === void 0 ? void 0 : msgKey.participant}`;
        let retryCount = msgRetryCache.get(key) || 0;
        if (retryCount >= maxMsgRetryCount) {
            logger.debug({ retryCount, msgId }, 'reached retry limit, clearing');
            msgRetryCache.del(key);
            return;
        }
        retryCount += 1;
        msgRetryCache.set(key, retryCount);
        const { account, signedPreKey, signedIdentityKey: identityKey } = authState.creds;
        if (retryCount === 1) {
            //request a resend via phone
            const msgId = await requestPlaceholderResend(msgKey);
            logger.debug(`sendRetryRequest: requested placeholder resend for message ${msgId}`);
        }
        const deviceIdentity = (0, Utils_1.encodeSignedDeviceIdentity)(account, true);
        await authState.keys.transaction(async () => {
            const receipt = {
                tag: 'receipt',
                attrs: {
                    id: msgId,
                    type: 'retry',
                    to: node.attrs.from
                },
                content: [
                    {
                        tag: 'retry',
                        attrs: {
                            count: retryCount.toString(),
                            id: node.attrs.id,
                            t: node.attrs.t,
                            v: '1'
                        }
                    },
                    {
                        tag: 'registration',
                        attrs: {},
                        content: (0, Utils_1.encodeBigEndian)(authState.creds.registrationId)
                    }
                ]
            };
            if (node.attrs.recipient) {
                receipt.attrs.recipient = node.attrs.recipient;
            }
            if (node.attrs.participant) {
                receipt.attrs.participant = node.attrs.participant;
            }
            if (retryCount > 1 || forceIncludeKeys) {
                const { update, preKeys } = await (0, Utils_1.getNextPreKeys)(authState, 1);
                const [keyId] = Object.keys(preKeys);
                const key = preKeys[+keyId];
                const content = receipt.content;
                content.push({
                    tag: 'keys',
                    attrs: {},
                    content: [
                        { tag: 'type', attrs: {}, content: Buffer.from(Defaults_1.KEY_BUNDLE_TYPE) },
                        { tag: 'identity', attrs: {}, content: identityKey.public },
                        (0, Utils_1.xmppPreKey)(key, +keyId),
                        (0, Utils_1.xmppSignedPreKey)(signedPreKey),
                        { tag: 'device-identity', attrs: {}, content: deviceIdentity }
                    ]
                });
                ev.emit('creds.update', update);
            }
            await sendNode(receipt);
            logger.info({ msgAttrs: node.attrs, retryCount }, 'sent retry receipt');
        });
    };
    const handleEncryptNotification = async (node) => {
        const from = node.attrs.from;
        if (from === WABinary_1.S_WHATSAPP_NET) {
            const countChild = (0, WABinary_1.getBinaryNodeChild)(node, 'count');
            const count = +countChild.attrs.value;
            const shouldUploadMorePreKeys = count < Defaults_1.MIN_PREKEY_COUNT;
            logger.debug({ count, shouldUploadMorePreKeys }, 'recv pre-key count');
            if (shouldUploadMorePreKeys) {
                await uploadPreKeys();
            }
        }
        else {
            const identityNode = (0, WABinary_1.getBinaryNodeChild)(node, 'identity');
            if (identityNode) {
                logger.info({ jid: from }, 'identity changed');
                // not handling right now
                // signal will override new identity anyway
            }
            else {
                logger.info({ node }, 'unknown encrypt notification');
            }
        }
    };
    const handleGroupNotification = (participant, child, msg) => {
        var _a, _b, _c, _d;
        const participantJid = ((_b = (_a = (0, WABinary_1.getBinaryNodeChild)(child, 'participant')) === null || _a === void 0 ? void 0 : _a.attrs) === null || _b === void 0 ? void 0 : _b.jid) || participant;
        switch (child === null || child === void 0 ? void 0 : child.tag) {
            case 'create':
                const metadata = (0, groups_1.extractGroupMetadata)(child);
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_CREATE;
                msg.messageStubParameters = [metadata.subject];
                msg.key = { participant: metadata.owner };
                ev.emit('chats.upsert', [{
                        id: metadata.id,
                        name: metadata.subject,
                        conversationTimestamp: metadata.creation,
                    }]);
                ev.emit('groups.upsert', [{
                        ...metadata,
                        author: participant
                    }]);
                break;
            case 'ephemeral':
            case 'not_ephemeral':
                msg.message = {
                    protocolMessage: {
                        type: WAProto_1.proto.Message.ProtocolMessage.Type.EPHEMERAL_SETTING,
                        ephemeralExpiration: +(child.attrs.expiration || 0)
                    }
                };
                break;
            case 'modify':
                const oldNumber = (0, WABinary_1.getBinaryNodeChildren)(child, 'participant').map(p => p.attrs.jid);
                msg.messageStubParameters = oldNumber || [];
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_PARTICIPANT_CHANGE_NUMBER;
                break;
            case 'promote':
            case 'demote':
            case 'remove':
            case 'add':
            case 'leave':
                const stubType = `GROUP_PARTICIPANT_${child.tag.toUpperCase()}`;
                msg.messageStubType = Types_1.WAMessageStubType[stubType];
                const participants = (0, WABinary_1.getBinaryNodeChildren)(child, 'participant').map(p => p.attrs.jid);
                if (participants.length === 1 &&
                    // if recv. "remove" message and sender removed themselves
                    // mark as left
                    (0, WABinary_1.areJidsSameUser)(participants[0], participant) &&
                    child.tag === 'remove') {
                    msg.messageStubType = Types_1.WAMessageStubType.GROUP_PARTICIPANT_LEAVE;
                }
                msg.messageStubParameters = participants;
                break;
            case 'subject':
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_CHANGE_SUBJECT;
                msg.messageStubParameters = [child.attrs.subject];
                break;
            case 'description':
                const description = (_d = (_c = (0, WABinary_1.getBinaryNodeChild)(child, 'body')) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.toString();
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_CHANGE_DESCRIPTION;
                msg.messageStubParameters = description ? [description] : undefined;
                break;
            case 'announcement':
            case 'not_announcement':
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_CHANGE_ANNOUNCE;
                msg.messageStubParameters = [(child.tag === 'announcement') ? 'on' : 'off'];
                break;
            case 'locked':
            case 'unlocked':
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_CHANGE_RESTRICT;
                msg.messageStubParameters = [(child.tag === 'locked') ? 'on' : 'off'];
                break;
            case 'invite':
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_CHANGE_INVITE_LINK;
                msg.messageStubParameters = [child.attrs.code];
                break;
            case 'member_add_mode':
                const addMode = child.content;
                if (addMode) {
                    msg.messageStubType = Types_1.WAMessageStubType.GROUP_MEMBER_ADD_MODE;
                    msg.messageStubParameters = [addMode.toString()];
                }
                break;
            case 'membership_approval_mode':
                const approvalMode = (0, WABinary_1.getBinaryNodeChild)(child, 'group_join');
                if (approvalMode) {
                    msg.messageStubType = Types_1.WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_MODE;
                    msg.messageStubParameters = [approvalMode.attrs.state];
                }
                break;
            case 'created_membership_requests':
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD;
                msg.messageStubParameters = [participantJid, 'created', child.attrs.request_method];
                break;
            case 'revoked_membership_requests':
                const isDenied = (0, WABinary_1.areJidsSameUser)(participantJid, participant);
                msg.messageStubType = Types_1.WAMessageStubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD;
                msg.messageStubParameters = [participantJid, isDenied ? 'revoked' : 'rejected'];
                break;
                break;
            default:
            // console.log("BAILEYS-DEBUG:", JSON.stringify({ ...child, content: Buffer.isBuffer(child.content) ? child.content.toString() : child.content, participant }, null, 2))
        }
    };
    const handleNewsletterNotification = (id, node) => {
        const messages = (0, WABinary_1.getBinaryNodeChild)(node, 'messages');
        const message = (0, WABinary_1.getBinaryNodeChild)(messages, 'message');
        const serverId = message.attrs.server_id;
        const reactionsList = (0, WABinary_1.getBinaryNodeChild)(message, 'reactions');
        const viewsList = (0, WABinary_1.getBinaryNodeChildren)(message, 'views_count');
        if (reactionsList) {
            const reactions = (0, WABinary_1.getBinaryNodeChildren)(reactionsList, 'reaction');
            if (reactions.length === 0) {
                ev.emit('newsletter.reaction', { id, 'server_id': serverId, reaction: { removed: true } });
            }
            reactions.forEach(item => {
                var _a, _b;
                ev.emit('newsletter.reaction', { id, 'server_id': serverId, reaction: { code: (_a = item.attrs) === null || _a === void 0 ? void 0 : _a.code, count: +((_b = item.attrs) === null || _b === void 0 ? void 0 : _b.count) } });
            });
        }
        if (viewsList.length) {
            viewsList.forEach(item => {
                ev.emit('newsletter.view', { id, 'server_id': serverId, count: +item.attrs.count });
            });
        }
    };
    const handleMexNewsletterNotification = (id, node) => {
        var _a;
        const operation = node === null || node === void 0 ? void 0 : node.attrs.op_name;
        const content = JSON.parse((_a = node === null || node === void 0 ? void 0 : node.content) === null || _a === void 0 ? void 0 : _a.toString());
        let contentPath;
        if (operation === Types_1.MexOperations.PROMOTE || operation === Types_1.MexOperations.DEMOTE) {
            let action;
            if (operation === Types_1.MexOperations.PROMOTE) {
                action = 'promote';
                contentPath = content.data[Types_1.XWAPaths.PROMOTE];
            }
            if (operation === Types_1.MexOperations.DEMOTE) {
                action = 'demote';
                contentPath = content.data[Types_1.XWAPaths.DEMOTE];
            }
            ev.emit('newsletter-participants.update', { id, author: contentPath.actor.pn, user: contentPath.user.pn, new_role: contentPath.user_new_role, action });
        }
        if (operation === Types_1.MexOperations.UPDATE) {
            contentPath = content.data[Types_1.XWAPaths.METADATA_UPDATE];
            ev.emit('newsletter-settings.update', { id, update: contentPath.thread_metadata.settings });
        }
    };
    const processNotification = async (node) => {
        var _a, _b;
        const result = {};
        const [child] = (0, WABinary_1.getAllBinaryNodeChildren)(node);
        const nodeType = node.attrs.type;
        const from = (0, WABinary_1.jidNormalizedUser)(node.attrs.from);
        switch (nodeType) {
            case 'privacy_token':
                const tokenList = (0, WABinary_1.getBinaryNodeChildren)(child, 'token');
                for (const { attrs, content } of tokenList) {
                    const jid = attrs.jid;
                    ev.emit('chats.update', [
                        {
                            id: jid,
                            tcToken: content
                        }
                    ]);
                    logger.debug({ jid }, 'got privacy token update');
                }
                break;
            case 'newsletter':
                handleNe
