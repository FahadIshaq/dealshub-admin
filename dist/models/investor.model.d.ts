import { Document, Types } from 'mongoose';
export type InvestorDocument = Investor & Document;
export declare class Investor {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    otp: string | null;
    otpExpiry: Date | null;
    isEmailVerified: boolean;
    isActive: boolean;
    isPhoneVerified: boolean;
    phone: string;
    receiveTexts: boolean;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    stripeCustomerId: string;
    stripePaymentMethodId: string;
    savedProperties: string[];
    favoriteProperties: string[];
    preferences: {
        propertyTypes: string[];
        priceRange: {
            min: number;
            max: number;
        };
        locations: string[];
        bedrooms: number;
        bathrooms: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const InvestorSchema: import("mongoose").Schema<Investor, import("mongoose").Model<Investor, any, any, any, Document<unknown, any, Investor, any> & Investor & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Investor, Document<unknown, {}, import("mongoose").FlatRecord<Investor>, {}> & import("mongoose").FlatRecord<Investor> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
