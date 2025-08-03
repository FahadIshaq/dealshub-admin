import { InvestorsService } from './investors.service';
import { CreateInvestorDto } from '../../dto/investor/create-investor.dto';
import { InvestorLoginDto } from '../../dto/investor/investor-login.dto';
import { VerifyInvestorOtpDto } from '../../dto/investor/verify-investor-otp.dto';
import { CreateOfferDto } from '../../dto/investor/create-offer.dto';
import { SendMessageDto } from '../../dto/investor/send-message.dto';
import { UpdateInvestorDto } from '../../dto/investor/update-investor.dto';
import { UpdatePreferencesDto } from '../../dto/investor/update-preferences.dto';
export declare class InvestorsController {
    private readonly investorsService;
    constructor(investorsService: InvestorsService);
    signup(createInvestorDto: CreateInvestorDto): Promise<{
        message: string;
        email: string;
    }>;
    login(loginDto: InvestorLoginDto): Promise<{
        message: string;
        email: string;
    }>;
    verifyOTP(verifyOtpDto: VerifyInvestorOtpDto): Promise<{
        message: string;
        token: string;
        investor: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            firstName: string;
            lastName: string;
            isEmailVerified: boolean;
            isActive: boolean;
        };
    }>;
    verifyEmail(verifyOtpDto: VerifyInvestorOtpDto): Promise<{
        message: string;
        investor: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            firstName: string;
            lastName: string;
            isEmailVerified: boolean;
        };
    }>;
    resendOTP(body: {
        email: string;
    }): Promise<{
        message: string;
        email: string;
    }>;
    getProfile(req: any): Promise<import("mongoose").Document<unknown, {}, import("../../models/investor.model").InvestorDocument, {}> & import("../../models/investor.model").Investor & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateProfile(req: any, updateData: UpdateInvestorDto): Promise<(import("mongoose").Document<unknown, {}, import("../../models/investor.model").InvestorDocument, {}> & import("../../models/investor.model").Investor & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    makeOffer(req: any, createOfferDto: CreateOfferDto): Promise<{
        message: string;
        offer: {
            id: import("mongoose").Types.ObjectId;
            propertyId: import("mongoose").Types.ObjectId;
            offerAmount: number;
            status: import("../../models/offer.model").OfferStatus;
            expiresAt: Date;
        };
    }>;
    getMyOffers(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../../models/offer.model").OfferDocument, {}> & import("../../models/offer.model").Offer & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getOfferDetails(req: any, offerId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/offer.model").OfferDocument, {}> & import("../../models/offer.model").Offer & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    sendMessage(req: any, sendMessageDto: SendMessageDto): Promise<{
        message: string;
        messageId: import("mongoose").Types.ObjectId;
    }>;
    getMessages(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../../models/message.model").MessageDocument, {}> & import("../../models/message.model").Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    markMessageAsRead(req: any, messageId: string): Promise<{
        message: string;
    }>;
    getWholesalerReviews(wholesalerId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/review.model").ReviewDocument, {}> & import("../../models/review.model").Review & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getWholesalerRating(wholesalerId: string): Promise<{
        averageRating: number;
        totalReviews: number;
        ratingBreakdown: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
    saveProperty(req: any, propertyId: string): Promise<{
        message: string;
    }>;
    removeSavedProperty(req: any, propertyId: string): Promise<{
        message: string;
    }>;
    getSavedProperties(req: any): Promise<string[]>;
    updatePreferences(req: any, preferences: UpdatePreferencesDto): Promise<{
        message: string;
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
    }>;
}
