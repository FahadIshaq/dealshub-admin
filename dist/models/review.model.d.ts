import { Document, Types } from 'mongoose';
export type ReviewDocument = Review & Document;
export declare class Review {
    _id: Types.ObjectId;
    wholesalerId: Types.ObjectId;
    reviewerId: Types.ObjectId;
    rating: number;
    title: string;
    comment: string;
    tags: string[];
    isVerified: boolean;
    isActive: boolean;
    verifiedAt: Date;
    verifiedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ReviewSchema: import("mongoose").Schema<Review, import("mongoose").Model<Review, any, any, any, Document<unknown, any, Review, any> & Review & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, Document<unknown, {}, import("mongoose").FlatRecord<Review>, {}> & import("mongoose").FlatRecord<Review> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
