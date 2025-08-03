"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const investors_controller_1 = require("./investors.controller");
const investors_service_1 = require("./investors.service");
const investor_model_1 = require("../../models/investor.model");
const offer_model_1 = require("../../models/offer.model");
const message_model_1 = require("../../models/message.model");
const review_model_1 = require("../../models/review.model");
const property_model_1 = require("../../models/property.model");
const user_model_1 = require("../../models/user.model");
let InvestorsModule = class InvestorsModule {
};
exports.InvestorsModule = InvestorsModule;
exports.InvestorsModule = InvestorsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: investor_model_1.Investor.name, schema: investor_model_1.InvestorSchema },
                { name: offer_model_1.Offer.name, schema: offer_model_1.OfferSchema },
                { name: message_model_1.Message.name, schema: message_model_1.MessageSchema },
                { name: review_model_1.Review.name, schema: review_model_1.ReviewSchema },
                { name: property_model_1.Property.name, schema: property_model_1.PropertySchema },
                { name: user_model_1.User.name, schema: user_model_1.UserSchema }
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '24h' },
            }),
            mailer_1.MailerModule,
        ],
        controllers: [investors_controller_1.InvestorsController],
        providers: [investors_service_1.InvestorsService],
        exports: [investors_service_1.InvestorsService],
    })
], InvestorsModule);
//# sourceMappingURL=investors.module.js.map