import * as $protobuf from "protobufjs";
/** Namespace proto. */
export namespace proto {

    /** Properties of a ADVDeviceIdentity. */
    interface IADVDeviceIdentity {

        /** ADVDeviceIdentity rawId */
        rawId?: (number|null);

        /** ADVDeviceIdentity timestamp */
        timestamp?: (number|Long|null);

        /** ADVDeviceIdentity keyIndex */
        keyIndex?: (number|null);

        /** ADVDeviceIdentity accountType */
        accountType?: (proto.ADVEncryptionType|null);

        /** ADVDeviceIdentity deviceType */
        deviceType?: (proto.ADVEncryptionType|null);
    }

    /** Represents a ADVDeviceIdentity. */
    class ADVDeviceIdentity implements IADVDeviceIdentity {

        /**
         * Constructs a new ADVDeviceIdentity.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IADVDeviceIdentity);

        /** ADVDeviceIdentity rawId. */
        public rawId: number;

        /** ADVDeviceIdentity timestamp. */
        public timestamp: (number|Long);

        /** ADVDeviceIdentity keyIndex. */
        public keyIndex: number;

        /** ADVDeviceIdentity accountType. */
        public accountType: proto.ADVEncryptionType;

        /** ADVDeviceIdentity deviceType. */
        public deviceType: proto.ADVEncryptionType;

        /**
         * Creates a new ADVDeviceIdentity instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ADVDeviceIdentity instance
         */
        public static create(properties?: proto.IADVDeviceIdentity): proto.ADVDeviceIdentity;

        /**
         * Encodes the specified ADVDeviceIdentity message. Does not implicitly {@link proto.ADVDeviceIdentity.verify|verify} messages.
         * @param message ADVDeviceIdentity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IADVDeviceIdentity, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ADVDeviceIdentity message, length delimited. Does not implicitly {@link proto.ADVDeviceIdentity.verify|verify} messages.
         * @param message ADVDeviceIdentity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IADVDeviceIdentity, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ADVDeviceIdentity message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ADVDeviceIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.ADVDeviceIdentity;

        /**
         * Decodes a ADVDeviceIdentity message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ADVDeviceIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.ADVDeviceIdentity;

        /**
         * Verifies a ADVDeviceIdentity message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ADVDeviceIdentity message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ADVDeviceIdentity
         */
        public static fromObject(object: { [k: string]: any }): proto.ADVDeviceIdentity;

        /**
         * Creates a plain object from a ADVDeviceIdentity message. Also converts values to other types if specified.
         * @param message ADVDeviceIdentity
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.ADVDeviceIdentity, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ADVDeviceIdentity to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** ADVEncryptionType enum. */
    enum ADVEncryptionType {
        E2EE = 0,
        HOSTED = 1
    }

    /** Properties of a ADVKeyIndexList. */
    interface IADVKeyIndexList {

        /** ADVKeyIndexList rawId */
        rawId?: (number|null);

        /** ADVKeyIndexList timestamp */
        timestamp?: (number|Long|null);

        /** ADVKeyIndexList currentIndex */
        currentIndex?: (number|null);

        /** ADVKeyIndexList validIndexes */
        validIndexes?: (number[]|null);

        /** ADVKeyIndexList accountType */
        accountType?: (proto.ADVEncryptionType|null);
    }

    /** Represents a ADVKeyIndexList. */
    class ADVKeyIndexList implements IADVKeyIndexList {

        /**
         * Constructs a new ADVKeyIndexList.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IADVKeyIndexList);

        /** ADVKeyIndexList rawId. */
        public rawId: number;

        /** ADVKeyIndexList timestamp. */
        public timestamp: (number|Long);

        /** ADVKeyIndexList currentIndex. */
        public currentIndex: number;

        /** ADVKeyIndexList validIndexes. */
        public validIndexes: number[];

        /** ADVKeyIndexList accountType. */
        public accountType: proto.ADVEncryptionType;

        /**
         * Creates a new ADVKeyIndexList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ADVKeyIndexList instance
         */
        public static create(properties?: proto.IADVKeyIndexList): proto.ADVKeyIndexList;

        /**
         * Encodes the specified ADVKeyIndexList message. Does not implicitly {@link proto.ADVKeyIndexList.verify|verify} messages.
         * @param message ADVKeyIndexList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IADVKeyIndexList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ADVKeyIndexList message, length delimited. Does not implicitly {@link proto.ADVKeyIndexList.verify|verify} messages.
         * @param message ADVKeyIndexList message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IADVKeyIndexList, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ADVKeyIndexList message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ADVKeyIndexList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.ADVKeyIndexList;

        /**
         * Decodes a ADVKeyIndexList message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ADVKeyIndexList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.ADVKeyIndexList;

        /**
         * Verifies a ADVKeyIndexList message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ADVKeyIndexList message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ADVKeyIndexList
         */
        public static fromObject(object: { [k: string]: any }): proto.ADVKeyIndexList;

        /**
         * Creates a plain object from a ADVKeyIndexList message. Also converts values to other types if specified.
         * @param message ADVKeyIndexList
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.ADVKeyIndexList, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ADVKeyIndexList to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ADVSignedDeviceIdentity. */
    interface IADVSignedDeviceIdentity {

        /** ADVSignedDeviceIdentity details */
        details?: (Uint8Array|null);

        /** ADVSignedDeviceIdentity accountSignatureKey */
        accountSignatureKey?: (Uint8Array|null);

        /** ADVSignedDeviceIdentity accountSignature */
        accountSignature?: (Uint8Array|null);

        /** ADVSignedDeviceIdentity deviceSignature */
        deviceSignature?: (Uint8Array|null);
    }

    /** Represents a ADVSignedDeviceIdentity. */
    class ADVSignedDeviceIdentity implements IADVSignedDeviceIdentity {

        /**
         * Constructs a new ADVSignedDeviceIdentity.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IADVSignedDeviceIdentity);

        /** ADVSignedDeviceIdentity details. */
        public details: Uint8Array;

        /** ADVSignedDeviceIdentity accountSignatureKey. */
        public accountSignatureKey: Uint8Array;

        /** ADVSignedDeviceIdentity accountSignature. */
        public accountSignature: Uint8Array;

        /** ADVSignedDeviceIdentity deviceSignature. */
        public deviceSignature: Uint8Array;

        /**
         * Creates a new ADVSignedDeviceIdentity instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ADVSignedDeviceIdentity instance
         */
        public static create(properties?: proto.IADVSignedDeviceIdentity): proto.ADVSignedDeviceIdentity;

        /**
         * Encodes the specified ADVSignedDeviceIdentity message. Does not implicitly {@link proto.ADVSignedDeviceIdentity.verify|verify} messages.
         * @param message ADVSignedDeviceIdentity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IADVSignedDeviceIdentity, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ADVSignedDeviceIdentity message, length delimited. Does not implicitly {@link proto.ADVSignedDeviceIdentity.verify|verify} messages.
         * @param message ADVSignedDeviceIdentity message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IADVSignedDeviceIdentity, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ADVSignedDeviceIdentity message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ADVSignedDeviceIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.ADVSignedDeviceIdentity;

        /**
         * Decodes a ADVSignedDeviceIdentity message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ADVSignedDeviceIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.ADVSignedDeviceIdentity;

        /**
         * Verifies a ADVSignedDeviceIdentity message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ADVSignedDeviceIdentity message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ADVSignedDeviceIdentity
         */
        public static fromObject(object: { [k: string]: any }): proto.ADVSignedDeviceIdentity;

        /**
         * Creates a plain object from a ADVSignedDeviceIdentity message. Also converts values to other types if specified.
         * @param message ADVSignedDeviceIdentity
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.ADVSignedDeviceIdentity, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ADVSignedDeviceIdentity to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ADVSignedDeviceIdentityHMAC. */
    interface IADVSignedDeviceIdentityHMAC {

        /** ADVSignedDeviceIdentityHMAC details */
        details?: (Uint8Array|null);

        /** ADVSignedDeviceIdentityHMAC hmac */
        hmac?: (Uint8Array|null);

        /** ADVSignedDeviceIdentityHMAC accountType */
        accountType?: (proto.ADVEncryptionType|null);
    }

    /** Represents a ADVSignedDeviceIdentityHMAC. */
    class ADVSignedDeviceIdentityHMAC implements IADVSignedDeviceIdentityHMAC {

        /**
         * Constructs a new ADVSignedDeviceIdentityHMAC.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IADVSignedDeviceIdentityHMAC);

        /** ADVSignedDeviceIdentityHMAC details. */
        public details: Uint8Array;

        /** ADVSignedDeviceIdentityHMAC hmac. */
        public hmac: Uint8Array;

        /** ADVSignedDeviceIdentityHMAC accountType. */
        public accountType: proto.ADVEncryptionType;

        /**
         * Creates a new ADVSignedDeviceIdentityHMAC instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ADVSignedDeviceIdentityHMAC instance
         */
        public static create(properties?: proto.IADVSignedDeviceIdentityHMAC): proto.ADVSignedDeviceIdentityHMAC;

        /**
         * Encodes the specified ADVSignedDeviceIdentityHMAC message. Does not implicitly {@link proto.ADVSignedDeviceIdentityHMAC.verify|verify} messages.
         * @param message ADVSignedDeviceIdentityHMAC message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IADVSignedDeviceIdentityHMAC, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ADVSignedDeviceIdentityHMAC message, length delimited. Does not implicitly {@link proto.ADVSignedDeviceIdentityHMAC.verify|verify} messages.
         * @param message ADVSignedDeviceIdentityHMAC message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IADVSignedDeviceIdentityHMAC, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ADVSignedDeviceIdentityHMAC message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ADVSignedDeviceIdentityHMAC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto.ADVSignedDeviceIdentityHMAC;

        /**
         * Decodes a ADVSignedDeviceIdentityHMAC message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ADVSignedDeviceIdentityHMAC
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto.ADVSignedDeviceIdentityHMAC;

        /**
         * Verifies a ADVSignedDeviceIdentityHMAC message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ADVSignedDeviceIdentityHMAC message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ADVSignedDeviceIdentityHMAC
         */
        public static fromObject(object: { [k: string]: any }): proto.ADVSignedDeviceIdentityHMAC;

        /**
         * Creates a plain object from a ADVSignedDeviceIdentityHMAC message. Also converts values to other types if specified.
         * @param message ADVSignedDeviceIdentityHMAC
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.ADVSignedDeviceIdentityHMAC, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ADVSignedDeviceIdentityHMAC to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ADVSignedKeyIndexList. */
    interface IADVSignedKeyIndexList {

        /** ADVSignedKeyIndexList details */
        details?: (Uint8Array|null);

        /** ADVSignedKeyIndexList accountSignature */
        accountSignature?: (Uint8Array|null);

        /** ADVSignedKeyIndexList accountSignatureKey */
        accountSignatureKey?: (Uint8Array|null);
    }

    /** Represents a ADVSignedKeyIndexList. */
    class ADVSignedKeyIndexList implements IADVSignedKeyIndexList {

        /**
         * Constructs a new ADVSignedKeyIndexList.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IADVSignedKeyIndexList);

        /** ADVSignedKeyIndexList details. */
        public details: Uint8Array;

        /** ADVSignedKeyIndexList accountSignature. */
        public accountSignature: Uint8Array;

        /** ADVSignedKeyIndexList accountSignatureKey. */
        public accountSignatureKey: Uint8Array;

        /**
         * Creates a new ADVSignedKeyIndexList instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ADVSignedKeyIndexList instance
         */
        public static create(properties?: proto.IADVSignedKeyIndexList): proto.ADVSignedKeyIndexList;

        /**
         * Encodes the specified ADVSignedKeyIndexList message. Does not implicitly {@link proto.ADVSignedKeyIndexList.verify|verify} messages.
         * @param message A
