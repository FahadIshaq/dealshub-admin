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
exports.SendMessageDto = void 0;
const class_validator_1 = require("class-validator");
class SendMessageDto {
    recipientId;
    subject;
    message;
    propertyId;
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, class_validator_1.IsMongoId)({ message: 'Recipient ID must be a valid MongoDB ID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Recipient ID is required' }),
    __metadata("design:type", String)
], SendMessageDto.prototype, "recipientId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Subject must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Subject is required' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Subject must not exceed 200 characters' }),
    __metadata("design:type", String)
], SendMessageDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Message must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Message is required' }),
    (0, class_validator_1.MaxLength)(2000, { message: 'Message must not exceed 2000 characters' }),
    __metadata("design:type", String)
], SendMessageDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)({ message: 'Property ID must be a valid MongoDB ID' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "propertyId", void 0);
//# sourceMappingURL=send-message.dto.js.map