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
exports.CreateInvestorDto = void 0;
const class_validator_1 = require("class-validator");
class CreateInvestorDto {
    firstName;
    lastName;
    email;
    password;
    receiveTexts;
    termsAccepted;
    privacyAccepted;
}
exports.CreateInvestorDto = CreateInvestorDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'First name is required' }),
    (0, class_validator_1.IsString)({ message: 'First name must be a string' }),
    (0, class_validator_1.MaxLength)(50, { message: 'First name must not exceed 50 characters' }),
    __metadata("design:type", String)
], CreateInvestorDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Last name is required' }),
    (0, class_validator_1.IsString)({ message: 'Last name must be a string' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Last name must not exceed 50 characters' }),
    __metadata("design:type", String)
], CreateInvestorDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please enter a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email address is required' }),
    __metadata("design:type", String)
], CreateInvestorDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    }),
    __metadata("design:type", String)
], CreateInvestorDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Receive texts must be a boolean value' }),
    __metadata("design:type", Boolean)
], CreateInvestorDto.prototype, "receiveTexts", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'You must accept the Terms of Service' }),
    (0, class_validator_1.IsBoolean)({ message: 'Terms acceptance must be a boolean value' }),
    __metadata("design:type", Boolean)
], CreateInvestorDto.prototype, "termsAccepted", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'You must accept the Privacy Policy' }),
    (0, class_validator_1.IsBoolean)({ message: 'Privacy acceptance must be a boolean value' }),
    __metadata("design:type", Boolean)
], CreateInvestorDto.prototype, "privacyAccepted", void 0);
//# sourceMappingURL=create-investor.dto.js.map