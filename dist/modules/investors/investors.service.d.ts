import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { Investor, InvestorDocument } from '../../models/investor.model';
import { CreateInvestorDto } from '../../dto/investor/create-investor.dto';
import { InvestorLoginDto } from '../../dto/investor/investor-login.dto';
import { VerifyInvestorOtpDto } from '../../dto/investor/verify-investor-otp.dto';
import { CreateOfferDto } from '../../dto/investor/create-offer.dto';
import { SendMessageDto } from '../../dto/investor/send-message.dto';
import { Offer, OfferDocument } from '../../models/offer.model';
import { Message, MessageDocument } from '../../models/message.model';
import { Review, ReviewDocument } from '../../models/review.model';
import { PropertyDocument } from '../../models/property.model';
import { UserDocument } from '../../models/user.model';
export declare class InvestorsService {
    private investorModel;
    private offerModel;
    private messageModel;
    private reviewModel;
    private propertyModel;
    private userModel;
    private jwtService;
    private mailerService;
    constructor(investorModel: Model<InvestorDocument>, offerModel: Model<OfferDocument>, messageModel: Model<MessageDocument>, reviewModel: Model<ReviewDocument>, propertyModel: Model<PropertyDocument>, userModel: Model<UserDocument>, jwtService: JwtService, mailerService: MailerService);
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
    resendOTP(email: string): Promise<{
        message: string;
        email: string;
    }>;
    getProfile(investorId: string): Promise<import("mongoose").Document<unknown, {}, InvestorDocument, {}> & Investor & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateProfile(investorId: string, updateData: Partial<Investor>): Promise<(import("mongoose").Document<unknown, {}, InvestorDocument, {}> & Investor & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    private generateOTP;
    private sendOTPEmail;
    makeOffer(investorId: string, createOfferDto: CreateOfferDto): Promise<{
        message: string;
        offer: {
            id: import("mongoose").Types.ObjectId;
            propertyId: import("mongoose").Types.ObjectId;
            offerAmount: number;
            status: import("../../models/offer.model").OfferStatus;
            expiresAt: Date;
        };
    }>;
    getMyOffers(investorId: string): Promise<(import("mongoose").Document<unknown, {}, OfferDocument, {}> & Offer & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getOfferDetails(offerId: string, investorId: string): Promise<import("mongoose").Document<unknown, {}, OfferDocument, {}> & Offer & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    sendMessage(investorId: string, sendMessageDto: SendMessageDto): Promise<{
        message: string;
        messageId: import("mongoose").Types.ObjectId;
    }>;
    getMessages(investorId: string): Promise<(import("mongoose").Document<unknown, {}, MessageDocument, {}> & Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    markMessageAsRead(messageId: string, investorId: string): Promise<{
        message: string;
    }>;
    getWholesalerReviews(wholesalerId: string): Promise<(import("mongoose").Document<unknown, {}, ReviewDocument, {}> & Review & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
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
    saveProperty(investorId: string, propertyId: string): Promise<{
        message: string;
    }>;
    removeSavedProperty(investorId: string, propertyId: string): Promise<{
        message: string;
    }>;
    getSavedProperties(investorId: string): Promise<string[]>;
    updatePreferences(investorId: string, preferences: Partial<Investor['preferences']>): Promise<{
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
