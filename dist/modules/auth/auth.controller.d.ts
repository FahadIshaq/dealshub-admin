import { AuthService } from './auth.service';
import { LoginDto } from '../../dto/auth/login.dto';
import { VerifyOtpDto } from '../../dto/auth/verify-otp.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
