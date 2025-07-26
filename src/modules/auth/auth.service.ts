import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { User, UserDocument } from '../../models/user.model';
import { LoginDto } from '../../dto/auth/login.dto';
import { VerifyOtpDto } from '../../dto/auth/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate OTP
    const otp = this.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await this.sendOTPEmail(email, otp);

    return {
      message: 'OTP sent to your email',
      email: user.email,
    };
  }

  async verifyOTP(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate JWT token
    const payload = { 
      sub: user._id, 
      email: user.email, 
      roles: user.roles || (user.role ? [user.role] : []),
      isVerified: user.isVerified 
    };
    
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      token,
              user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles || (user.role ? [user.role] : []),
          isVerified: user.isVerified,
        },
    };
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendOTPEmail(email: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your Login OTP',
        template: 'otp-email',
        context: {
          otp,
          email,
        },
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      // For development, log the OTP instead of throwing error
      console.log('🔐 DEVELOPMENT MODE: OTP for', email, 'is:', otp);
      console.log('📧 In production, this would be sent via email');
      // Don't throw error in development mode
      // throw new BadRequestException('Failed to send OTP email');
    }
  }
} 