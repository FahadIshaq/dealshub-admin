import { Document, Types } from 'mongoose';
export type OfferDocument = Offer & Document;
export declare enum OfferStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    COUNTER_OFFER = "counter_offer",
    EXPIRED = "expired"
}
export declare class Offer {
    _id: Types.ObjectId;
    investorId: Types.ObjectId;
    propertyId: Types.ObjectId;
    wholesalerId: Types.ObjectId;
    offerAmount: number;
    message: string;
    terms: string;
    contingencies: number;
    status: OfferStatus;
    expiresAt: Date;
    acceptedAt: Date;
    rejectedAt: Date;
    rejectionReason: string;
    counterOfferAmount: number;
    counterOfferMessage: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const OfferSchema: import("mongoose").Schema<Offer, import("mongoose").Model<Offer, any, any, any, Document<unknown, any, Offer, any> & Offer & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Offer, Document<unknown, {}, import("mongoose").FlatRecord<Offer>, {}> & import("mongoose").FlatRecord<Offer> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
