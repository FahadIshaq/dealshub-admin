import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { UserDocument } from '../../models/user.model';
import { LoginDto } from '../../dto/auth/login.dto';
import { VerifyOtpDto } from '../../dto/auth/verify-otp.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    private mailerService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, mailerService: MailerService);
    login(loginDto: LoginDto): Promise<{
        message: string;
        email: string;
    }>;
    verifyOTP(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
        token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            firstName: string;
            lastName: string;
            roles: string[];
            isVerified: boolean;
        };
    }>;
    private generateOTP;
    private sendOTPEmail;
}
