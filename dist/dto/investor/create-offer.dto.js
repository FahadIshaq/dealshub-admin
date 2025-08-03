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
exports.CreateOfferDto = void 0;
const class_validator_1 = require("class-validator");
class CreateOfferDto {
    propertyId;
    offerAmount;
    message;
    terms;
    contingencies;
}
exports.CreateOfferDto = CreateOfferDto;
__decorate([
    (0, class_validator_1.IsMongoId)({ message: 'Property ID must be a valid MongoDB ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Property ID is required' }),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Offer amount must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Offer amount must be greater than 0' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Offer amount is required' }),
    __metadata("design:type", Number)
], CreateOfferDto.prototype, "offerAmount", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Message must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Terms must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "terms", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Contingencies must be a number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateOfferDto.prototype, "contingencies", void 0);
//# sourceMappingURL=create-offer.dto.js.map