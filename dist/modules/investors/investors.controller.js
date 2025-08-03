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
exports.InvestorsController = void 0;
const common_1 = require("@nestjs/common");
const investors_service_1 = require("./investors.service");
const create_investor_dto_1 = require("../../dto/investor/create-investor.dto");
const investor_login_dto_1 = require("../../dto/investor/investor-login.dto");
const verify_investor_otp_dto_1 = require("../../dto/investor/verify-investor-otp.dto");
const create_offer_dto_1 = require("../../dto/investor/create-offer.dto");
const send_message_dto_1 = require("../../dto/investor/send-message.dto");
const update_investor_dto_1 = require("../../dto/investor/update-investor.dto");
const update_preferences_dto_1 = require("../../dto/investor/update-preferences.dto");
const investor_guard_1 = require("../../middleware/investor.guard");
let InvestorsController = class InvestorsController {
    investorsService;
    constructor(investorsService) {
        this.investorsService = investorsService;
    }
    async signup(createInvestorDto) {
        return this.investorsService.signup(createInvestorDto);
    }
    async login(loginDto) {
        return this.investorsService.login(loginDto);
    }
    async verifyOTP(verifyOtpDto) {
        return this.investorsService.verifyOTP(verifyOtpDto);
    }
    async verifyEmail(verifyOtpDto) {
        return this.investorsService.verifyEmail(verifyOtpDto);
    }
    async resendOTP(body) {
        return this.investorsService.resendOTP(body.email);
    }
    async getProfile(req) {
        return this.investorsService.getProfile(req.user.sub);
    }
    async updateProfile(req, updateData) {
        return this.investorsService.updateProfile(req.user.sub, updateData);
    }
    async makeOffer(req, createOfferDto) {
        return this.investorsService.makeOffer(req.user.sub, createOfferDto);
    }
    async getMyOffers(req) {
        return this.investorsService.getMyOffers(req.user.sub);
    }
    async getOfferDetails(req, offerId) {
        return this.investorsService.getOfferDetails(offerId, req.user.sub);
    }
    async sendMessage(req, sendMessageDto) {
        return this.investorsService.sendMessage(req.user.sub, sendMessageDto);
    }
    async getMessages(req) {
        return this.investorsService.getMessages(req.user.sub);
    }
    async markMessageAsRead(req, messageId) {
        return this.investorsService.markMessageAsRead(messageId, req.user.sub);
    }
    async getWholesalerReviews(wholesalerId) {
        return this.investorsService.getWholesalerReviews(wholesalerId);
    }
    async getWholesalerRating(wholesalerId) {
        return this.investorsService.getWholesalerRating(wholesalerId);
    }
    async saveProperty(req, propertyId) {
        return this.investorsService.saveProperty(req.user.sub, propertyId);
    }
    async removeSavedProperty(req, propertyId) {
        return this.investorsService.removeSavedProperty(req.user.sub, propertyId);
    }
    async getSavedProperties(req) {
        return this.investorsService.getSavedProperties(req.user.sub);
    }
    async updatePreferences(req, preferences) {
        return this.investorsService.updatePreferences(req.user.sub, preferences);
    }
};
exports.InvestorsController = InvestorsController;
__decorate([
    (0, common_1.Post)('signup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_investor_dto_1.CreateInvestorDto]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [investor_login_dto_1.InvestorLoginDto]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_investor_otp_dto_1.VerifyInvestorOtpDto]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "verifyOTP", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_investor_otp_dto_1.VerifyInvestorOtpDto]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "resendOTP", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_investor_dto_1.UpdateInvestorDto]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('offers'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_offer_dto_1.CreateOfferDto]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "makeOffer", null);
__decorate([
    (0, common_1.Get)('offers'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "getMyOffers", null);
__decorate([
    (0, common_1.Get)('offers/:id'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "getOfferDetails", null);
__decorate([
    (0, common_1.Post)('messages'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('messages'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Put)('messages/:id/read'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "markMessageAsRead", null);
__decorate([
    (0, common_1.Get)('wholesalers/:id/reviews'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "getWholesalerReviews", null);
__decorate([
    (0, common_1.Get)('wholesalers/:id/rating'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "getWholesalerRating", null);
__decorate([
    (0, common_1.Post)('properties/:id/save'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "saveProperty", null);
__decorate([
    (0, common_1.Delete)('properties/:id/save'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "removeSavedProperty", null);
__decorate([
    (0, common_1.Get)('properties/saved'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "getSavedProperties", null);
__decorate([
    (0, common_1.Put)('preferences'),
    (0, common_1.UseGuards)(investor_guard_1.InvestorGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_preferences_dto_1.UpdatePreferencesDto]),
    __metadata("design:returntype", Promise)
], InvestorsController.prototype, "updatePreferences", null);
exports.InvestorsController = InvestorsController = __decorate([
    (0, common_1.Controller)('investors'),
    __metadata("design:paramtypes", [investors_service_1.InvestorsService])
], InvestorsController);
//# sourceMappingURL=investors.controller.js.map