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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const mailer_1 = require("@nestjs-modules/mailer");
const user_model_1 = require("../../models/user.model");
let AuthService = class AuthService {
    userModel;
    jwtService;
    mailerService;
    constructor(userModel, jwtService, mailerService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const otp = this.generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        await this.sendOTPEmail(email, otp);
        return {
            message: 'OTP sent to your email',
            email: user.email,
        };
    }
    async verifyOTP(verifyOtpDto) {
        const { email, otp } = verifyOtpDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
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
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async sendOTPEmail(email, otp) {
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
        }
        catch (error) {
            console.error('Failed to send email:', error);
            console.log('🔐 DEVELOPMENT MODE: OTP for', email, 'is:', otp);
            console.log('📧 In production, this would be sent via email');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        mailer_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map