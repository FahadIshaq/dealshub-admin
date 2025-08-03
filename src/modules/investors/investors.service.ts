import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
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
import { Property, PropertyDocument } from '../../models/property.model';
import { User, UserDocument } from '../../models/user.model';

@Injectable()
export class InvestorsService {
  constructor(
    @InjectModel(Investor.name) private investorModel: Model<InvestorDocument>,
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signup(createInvestorDto: CreateInvestorDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      receiveTexts,
      termsAccepted,
      privacyAccepted,
    } = createInvestorDto;

    // Check if investor already exists
    const existingInvestor = await this.investorModel.findOne({ email });
    if (existingInvestor) {
      throw new ConflictException('An investor with this email already exists');
    }

    // Validate terms and privacy acceptance
    if (!termsAccepted || !privacyAccepted) {
      throw new BadRequestException(
        'You must accept both Terms of Service and Privacy Policy',
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate OTP for email verification
    const otp = this.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new investor
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

    // Send OTP email
    await this.sendOTPEmail(email, otp, 'Email Verification');

    return {
      message: 'Investor account created successfully. Please check your email for verification OTP.',
      email: investor.email,
    };
  }

  async login(loginDto: InvestorLoginDto) {
    const { email, password } = loginDto;

    // Find investor by email
    const investor = await this.investorModel.findOne({ email });
    if (!investor) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if investor is active
    if (!investor.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, investor.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate OTP for login verification
    const otp = this.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to investor
    investor.otp = otp;
    investor.otpExpiry = otpExpiry;
    await investor.save();

    // Send OTP email
    await this.sendOTPEmail(email, otp, 'Login Verification');

    return {
      message: 'OTP sent to your email for login verification',
      email: investor.email,
    };
  }

  async verifyOTP(verifyOtpDto: VerifyInvestorOtpDto) {
    const { email, otp } = verifyOtpDto;

    const investor = await this.investorModel.findOne({ email });
    if (!investor) {
      throw new UnauthorizedException('Investor not found');
    }

    // Check if OTP is valid and not expired
    if (
      investor.otp !== otp ||
      !investor.otpExpiry ||
      investor.otpExpiry < new Date()
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark investor as email verified and clear OTP
    investor.isEmailVerified = true;
    investor.otp = null;
    investor.otpExpiry = null;
    await investor.save();

    // Generate JWT token
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

  async verifyEmail(verifyOtpDto: VerifyInvestorOtpDto) {
    const { email, otp } = verifyOtpDto;

    const investor = await this.investorModel.findOne({ email });
    if (!investor) {
      throw new UnauthorizedException('Investor not found');
    }

    // Check if OTP is valid and not expired
    if (
      investor.otp !== otp ||
      !investor.otpExpiry ||
      investor.otpExpiry < new Date()
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark investor as email verified and clear OTP
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

  async resendOTP(email: string) {
    const investor = await this.investorModel.findOne({ email });
    if (!investor) {
      throw new UnauthorizedException('Investor not found');
    }

    // Generate new OTP
    const otp = this.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to investor
    investor.otp = otp;
    investor.otpExpiry = otpExpiry;
    await investor.save();

    // Send OTP email
    await this.sendOTPEmail(email, otp, 'Email Verification');

    return {
      message: 'OTP resent to your email',
      email: investor.email,
    };
  }

  async getProfile(investorId: string) {
    const investor = await this.investorModel
      .findById(investorId)
      .select('-password -otp -otpExpiry');
    if (!investor) {
      throw new UnauthorizedException('Investor not found');
    }

    return investor;
  }

  async updateProfile(investorId: string, updateData: Partial<Investor>) {
    const investor = await this.investorModel.findById(investorId);
    if (!investor) {
      throw new UnauthorizedException('Investor not found');
    }

    // Remove sensitive fields from update data
    const { password, otp, otpExpiry, email, ...safeUpdateData } = updateData;

    const updatedInvestor = await this.investorModel
      .findByIdAndUpdate(investorId, safeUpdateData, {
        new: true,
        runValidators: true,
      })
      .select('-password -otp -otpExpiry');

    return updatedInvestor;
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendOTPEmail(email: string, otp: string, subject: string) {
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
    } catch (error) {
      console.error('Failed to send email:', error);
      // For development, log the OTP instead of throwing error
      console.log('🔐 DEVELOPMENT MODE: OTP for', email, 'is:', otp);
      console.log('📧 In production, this would be sent via email');
      // Don't throw error in development mode
    }
  }

  // Property and Offer related methods
  async makeOffer(investorId: string, createOfferDto: CreateOfferDto) {
    const { propertyId, offerAmount, message, terms, contingencies } = createOfferDto;

    // Check if property exists
    const property = await this.propertyModel.findById(propertyId);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Check if investor has already made an offer on this property
    const existingOffer = await this.offerModel.findOne({
      investorId,
      propertyId,
      status: { $in: ['pending', 'counter_offer'] }
    });

    if (existingOffer) {
      throw new BadRequestException(
        'You have already made an offer on this property',
      );
    }

    // Create new offer
    const offer = new this.offerModel({
      investorId,
      propertyId,
      wholesalerId: property.userId,
      offerAmount,
      message,
      terms,
      contingencies,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
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

  async getMyOffers(investorId: string) {
    const offers = await this.offerModel
      .find({ investorId })
      .populate('propertyId', 'title address price images')
      .populate('wholesalerId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return offers;
  }

  async getOfferDetails(offerId: string, investorId: string) {
    const offer = await this.offerModel
      .findOne({ _id: offerId, investorId })
      .populate('propertyId')
      .populate('wholesalerId', 'firstName lastName email phone');

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return offer;
  }

  // Messaging functionality
  async sendMessage(investorId: string, sendMessageDto: SendMessageDto) {
    const { recipientId, subject, message, propertyId } = sendMessageDto;

    // Check if recipient exists
    const recipient = await this.userModel.findById(recipientId);
    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    // Create message
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

  async getMessages(investorId: string) {
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

  async markMessageAsRead(messageId: string, investorId: string) {
    const message = await this.messageModel.findOne({
      _id: messageId,
      recipientId: investorId,
      recipientType: 'investor'
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    return { message: 'Message marked as read' };
  }

  // Reviews functionality
  async getWholesalerReviews(wholesalerId: string) {
    const reviews = await this.reviewModel
      .find({ wholesalerId, isActive: true })
      .populate('reviewerId', 'firstName lastName')
      .sort({ createdAt: -1 });

    return reviews;
  }

  async getWholesalerRating(wholesalerId: string) {
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

  // Property preferences and favorites
  async saveProperty(investorId: string, propertyId: string) {
    const investor = await this.investorModel.findById(investorId);
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }

    if (!investor.savedProperties.includes(propertyId)) {
      investor.savedProperties.push(propertyId);
      await investor.save();
    }

    return { message: 'Property saved successfully' };
  }

  async removeSavedProperty(investorId: string, propertyId: string) {
    const investor = await this.investorModel.findById(investorId);
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }

    investor.savedProperties = investor.savedProperties.filter(
      (id) => id.toString() !== propertyId,
    );
    await investor.save();

    return { message: 'Property removed from saved list' };
  }

  async getSavedProperties(investorId: string) {
    const investor = await this.investorModel.findById(investorId).populate({
        path: 'savedProperties',
      populate: {
          path: 'userId',
        select: 'firstName lastName email',
        }
      });

    if (!investor) {
      throw new NotFoundException('Investor not found');
    }

    return investor.savedProperties;
  }

  async updatePreferences(
    investorId: string,
    preferences: Partial<Investor['preferences']>,
  ) {
    const investor = await this.investorModel.findById(investorId);
    if (!investor) {
      throw new NotFoundException('Investor not found');
    }

    investor.preferences = { ...investor.preferences, ...preferences };
    await investor.save();

    return {
      message: 'Preferences updated successfully',
      preferences: investor.preferences,
    };
  }
} 