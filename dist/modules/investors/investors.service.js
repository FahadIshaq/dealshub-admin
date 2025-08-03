"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorsService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const mailer_1 = require("@nestjs-modules/mailer");
const investor_model_1 = require("../../models/investor.model");
const offer_model_1 = require("../../models/offer.model");
const message_model_1 = require("../../models/message.model");
const review_model_1 = require("../../models/review.model");
const property_model_1 = require("../../models/property.model");
const user_model_1 = require("../../models/user.model");
let InvestorsService = class InvestorsService {
    investorModel;
    offerModel;
    messageModel;
    reviewModel;
    propertyModel;
    userModel;
    jwtService;
    mailerService;
    constructor(investorModel, offerModel, messageModel, reviewModel, propertyModel, userModel, jwtService, mailerService) {
        this.investorModel = investorModel;
        this.offerModel = offerModel;
        this.messageModel = messageModel;
        this.reviewModel = reviewModel;
        this.propertyModel = propertyModel;
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
    }
    async signup(createInvestorDto) {
        const { email, password, firstName, lastName, receiveTexts, termsAccepted, privacyAccepted, } = createInvestorDto;
        const existingInvestor = await this.investorModel.findOne({ email });
        if (existingInvestor) {
            throw new common_1.ConflictException('An investor with this email already exists');
        }
        if (!termsAccepted || !privacyAccepted) {
            throw new common_1.BadRequestException('You must accept both Terms of Service and Privacy Policy');
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const otp = this.generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const investor = new this.investorModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
            receiveTexts: receiveTexts || false,
            termsAccepted,
            privacyAccepted,
            isActive: true,
        });
        await investor.save();
        await this.sendOTPEmail(email, otp, 'Email Verification');
        return {
            message: 'Investor account created successfully. Please check your email for verification OTP.',
            email: investor.email,
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const investor = await this.investorModel.findOne({ email });
        if (!investor) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!investor.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await bcrypt.compare(password, investor.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const otp = this.generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        investor.otp = otp;
        investor.otpExpiry = otpExpiry;
        await investor.save();
        await this.sendOTPEmail(email, otp, 'Login Verification');
        return {
            message: 'OTP sent to your email for login verification',
            email: investor.email,
        };
    }
    async verifyOTP(verifyOtpDto) {
        const { email, otp } = verifyOtpDto;
        const investor = await this.investorModel.findOne({ email });
        if (!investor) {
            throw new common_1.UnauthorizedException('Investor not found');
        }
        if (investor.otp !== otp ||
            !investor.otpExpiry ||
            investor.otpExpiry < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        investor.isEmailVerified = true;
        investor.otp = null;
        investor.otpExpiry = null;
        await investor.save();
        const payload = {
            sub: investor._id,
            email: investor.email,
            role: 'investor',
            isEmailVerified: investor.isEmailVerified
        };
        const token = this.jwtService.sign(payload);
        return {
            message: 'Login successful',
            token,
            investor: {
                id: investor._id,
                email: investor.email,
                firstName: investor.firstName,
                lastName: investor.lastName,
                isEmailVerified: investor.isEmailVerified,
                isActive: investor.isActive,
            },
        };
    }
    async verifyEmail(verifyOtpDto) {
        const { email, otp } = verifyOtpDto;
        const investor = await this.investorModel.findOne({ email });
        if (!investor) {
            throw new common_1.UnauthorizedException('Investor not found');
        }
        if (investor.otp !== otp ||
            !investor.otpExpiry ||
            investor.otpExpiry < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        investor.isEmailVerified = true;
        investor.otp = null;
        investor.otpExpiry = null;
        await investor.save();
        return {
            message: 'Email verified successfully',
            investor: {
                id: investor._id,
                email: investor.email,
                firstName: investor.firstName,
                lastName: investor.lastName,
                isEmailVerified: investor.isEmailVerified,
            },
        };
    }
    async resendOTP(email) {
        const investor = await this.investorModel.findOne({ email });
        if (!investor) {
            throw new common_1.UnauthorizedException('Investor not found');
        }
        const otp = this.generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        investor.otp = otp;
        investor.otpExpiry = otpExpiry;
        await investor.save();
        await this.sendOTPEmail(email, otp, 'Email Verification');
        return {
            message: 'OTP resent to your email',
            email: investor.email,
        };
    }
    async getProfile(investorId) {
        const investor = await this.investorModel
            .findById(investorId)
            .select('-password -otp -otpExpiry');
        if (!investor) {
            throw new common_1.UnauthorizedException('Investor not found');
        }
        return investor;
    }
    async updateProfile(investorId, updateData) {
        const investor = await this.investorModel.findById(investorId);
        if (!investor) {
            throw new common_1.UnauthorizedException('Investor not found');
        }
        const { password, otp, otpExpiry, email, ...safeUpdateData } = updateData;
        const updatedInvestor = await this.investorModel
            .findByIdAndUpdate(investorId, safeUpdateData, {
            new: true,
            runValidators: true,
        })
            .select('-password -otp -otpExpiry');
        return updatedInvestor;
    }
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async sendOTPEmail(email, otp, subject) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `Your ${subject} OTP`,
                template: 'otp-email',
                context: {
                    otp,
                    email,
                    subject,
                },
            });
        }
        catch (error) {
            console.error('Failed to send email:', error);
            console.log('🔐 DEVELOPMENT MODE: OTP for', email, 'is:', otp);
            console.log('📧 In production, this would be sent via email');
        }
    }
    async makeOffer(investorId, createOfferDto) {
        const { propertyId, offerAmount, message, terms, contingencies } = createOfferDto;
        const property = await this.propertyModel.findById(propertyId);
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        const existingOffer = await this.offerModel.findOne({
            investorId,
            propertyId,
            status: { $in: ['pending', 'counter_offer'] }
        });
        if (existingOffer) {
            throw new common_1.BadRequestException('You have already made an offer on this property');
        }
        const offer = new this.offerModel({
            investorId,
            propertyId,
            wholesalerId: property.userId,
            offerAmount,
            message,
            terms,
            contingencies,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        await offer.save();
        return {
            message: 'Offer submitted successfully',
            offer: {
                id: offer._id,
                propertyId: offer.propertyId,
                offerAmount: offer.offerAmount,
                status: offer.status,
                expiresAt: offer.expiresAt,
            },
        };
    }
    async getMyOffers(investorId) {
        const offers = await this.offerModel
            .find({ investorId })
            .populate('propertyId', 'title address price images')
            .populate('wholesalerId', 'firstName lastName email')
            .sort({ createdAt: -1 });
        return offers;
    }
    async getOfferDetails(offerId, investorId) {
        const offer = await this.offerModel
            .findOne({ _id: offerId, investorId })
            .populate('propertyId')
            .populate('wholesalerId', 'firstName lastName email phone');
        if (!offer) {
            throw new common_1.NotFoundException('Offer not found');
        }
        return offer;
    }
    async sendMessage(investorId, sendMessageDto) {
        const { recipientId, subject, message, propertyId } = sendMessageDto;
        const recipient = await this.userModel.findById(recipientId);
        if (!recipient) {
            throw new common_1.NotFoundException('Recipient not found');
        }
        const newMessage = new this.messageModel({
            senderId: investorId,
            senderType: 'investor',
            recipientId,
            recipientType: 'wholesaler',
            subject,
            message,
            propertyId,
        });
        await newMessage.save();
        return {
            message: 'Message sent successfully',
            messageId: newMessage._id,
        };
    }
    async getMessages(investorId) {
        const messages = await this.messageModel
            .find({
            $or: [
                { senderId: investorId, senderType: 'investor' },
                { recipientId: investorId, recipientType: 'investor' }
            ]
        })
            .populate('senderId', 'firstName lastName email')
            .populate('recipientId', 'firstName lastName email')
            .populate('propertyId', 'title address')
            .sort({ createdAt: -1 });
        return messages;
    }
    async markMessageAsRead(messageId, investorId) {
        const message = await this.messageModel.findOne({
            _id: messageId,
            recipientId: investorId,
            recipientType: 'investor'
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        message.isRead = true;
        message.readAt = new Date();
        await message.save();
        return { message: 'Message marked as read' };
    }
    async getWholesalerReviews(wholesalerId) {
        const reviews = await this.reviewModel
            .find({ wholesalerId, isActive: true })
            .populate('reviewerId', 'firstName lastName')
            .sort({ createdAt: -1 });
        return reviews;
    }
    async getWholesalerRating(wholesalerId) {
        const reviews = await this.reviewModel.find({
            wholesalerId,
            isActive: true
        });
        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(review => {
            ratingBreakdown[review.rating]++;
        });
        return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length,
            ratingBreakdown
        };
    }
    async saveProperty(investorId, propertyId) {
        const investor = await this.investorModel.findById(investorId);
        if (!investor) {
            throw new common_1.NotFoundException('Investor not found');
        }
        if (!investor.savedProperties.includes(propertyId)) {
            investor.savedProperties.push(propertyId);
            await investor.save();
        }
        return { message: 'Property saved successfully' };
    }
    async removeSavedProperty(investorId, propertyId) {
        const investor = await this.investorModel.findById(investorId);
        if (!investor) {
            throw new common_1.NotFoundException('Investor not found');
        }
        investor.savedProperties = investor.savedProperties.filter((id) => id.toString() !== propertyId);
        await investor.save();
        return { message: 'Property removed from saved list' };
    }
    async getSavedProperties(investorId) {
        const investor = await this.investorModel.findById(investorId).populate({
            path: 'savedProperties',
            populate: {
                path: 'userId',
                select: 'firstName lastName email',
            }
        });
        if (!investor) {
            throw new common_1.NotFoundException('Investor not found');
        }
        return investor.savedProperties;
    }
    async updatePreferences(investorId, preferences) {
        const investor = await this.investorModel.findById(investorId);
        if (!investor) {
            throw new common_1.NotFoundException('Investor not found');
        }
        investor.preferences = { ...investor.preferences, ...preferences };
        await investor.save();
        return {
            message: 'Preferences updated successfully',
            preferences: investor.preferences,
        };
    }
};
exports.InvestorsService = InvestorsService;
exports.InvestorsService = InvestorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(investor_model_1.Investor.name)),
    __param(1, (0, mongoose_1.InjectModel)(offer_model_1.Offer.name)),
    __param(2, (0, mongoose_1.InjectModel)(message_model_1.Message.name)),
    __param(3, (0, mongoose_1.InjectModel)(review_model_1.Review.name)),
    __param(4, (0, mongoose_1.InjectModel)(property_model_1.Property.name)),
    __param(5, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        mailer_1.MailerService])
], InvestorsService);
//# sourceMappingURL=investors.service.js.map