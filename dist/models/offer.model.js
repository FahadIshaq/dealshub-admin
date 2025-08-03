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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferSchema = exports.Offer = exports.OfferStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var OfferStatus;
(function (OfferStatus) {
    OfferStatus["PENDING"] = "pending";
    OfferStatus["ACCEPTED"] = "accepted";
    OfferStatus["REJECTED"] = "rejected";
    OfferStatus["COUNTER_OFFER"] = "counter_offer";
    OfferStatus["EXPIRED"] = "expired";
})(OfferStatus || (exports.OfferStatus = OfferStatus = {}));
let Offer = class Offer {
    _id;
    investorId;
    propertyId;
    wholesalerId;
    offerAmount;
    message;
    terms;
    contingencies;
    status;
    expiresAt;
    acceptedAt;
    rejectedAt;
    rejectionReason;
    counterOfferAmount;
    counterOfferMessage;
    createdAt;
    updatedAt;
};
exports.Offer = Offer;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Investor', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Offer.prototype, "investorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Property', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Offer.prototype, "propertyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Offer.prototype, "wholesalerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Offer.prototype, "offerAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Offer.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Offer.prototype, "terms", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Offer.prototype, "contingencies", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: OfferStatus,
        default: OfferStatus.PENDING
    }),
    __metadata("design:type", String)
], Offer.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Offer.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Offer.prototype, "acceptedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Offer.prototype, "rejectedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Offer.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Offer.prototype, "counterOfferAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Offer.prototype, "counterOfferMessage", void 0);
exports.Offer = Offer = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Offer);
exports.OfferSchema = mongoose_1.SchemaFactory.createForClass(Offer);
//# sourceMappingURL=offer.model.js.map