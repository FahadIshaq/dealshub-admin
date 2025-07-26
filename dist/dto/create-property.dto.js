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
exports.CreatePropertyDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AddressDto {
    street_address;
    unit;
    plus_code;
    city;
    county;
    state;
    zip_code;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "street_address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "plus_code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "county", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "zip_code", void 0);
class LotSizeDto {
    value;
    unit;
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], LotSizeDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['acres', 'sqft']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LotSizeDto.prototype, "unit", void 0);
class PropertyDetailsDto {
    bedrooms;
    baths;
    half_baths;
    square_footage;
    lot_size;
    parking_type;
    property_type;
    year_built;
    condition;
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PropertyDetailsDto.prototype, "bedrooms", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PropertyDetailsDto.prototype, "baths", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PropertyDetailsDto.prototype, "half_baths", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PropertyDetailsDto.prototype, "square_footage", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LotSizeDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", LotSizeDto)
], PropertyDetailsDto.prototype, "lot_size", void 0);
__decorate([
    (0, class_validator_1.IsEnum)([
        'Assigned',
        'Attached Garage',
        'Carport',
        'Detached Garage',
        'Driveway',
        'Garage',
        'Off street',
        'On street',
        'Street',
        'Unassigned',
    ]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PropertyDetailsDto.prototype, "parking_type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)([
        'Attached',
        'Commercial',
        'Condo',
        'Detached',
        'Development',
        'Industrial',
        'Land',
        'Manufactured',
        'Mobile Home',
        'Multifamily',
        'Office',
        'Recreational',
        'Semi-detached',
        'Single-Family',
        'Storage',
        'Townhouse',
    ]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PropertyDetailsDto.prototype, "property_type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PropertyDetailsDto.prototype, "year_built", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['Turn Key', 'Full Rehab', 'Major Repair', 'Light Rehab']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PropertyDetailsDto.prototype, "condition", void 0);
class LocationDto {
    timezone;
    latitude;
    longitude;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LocationDto.prototype, "timezone", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], LocationDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], LocationDto.prototype, "longitude", void 0);
class PricingDto {
    starting_price;
    buy_now_price;
    min_emd;
    purchase_price;
    original_purchase_emd;
    arv;
    zestimate;
    repair_estimate_min;
    repair_estimate_max;
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PricingDto.prototype, "starting_price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PricingDto.prototype, "buy_now_price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PricingDto.prototype, "min_emd", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PricingDto.prototype, "purchase_price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PricingDto.prototype, "original_purchase_emd", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PricingDto.prototype, "arv", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PricingDto.prototype, "zestimate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PricingDto.prototype, "repair_estimate_min", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PricingDto.prototype, "repair_estimate_max", void 0);
class ManagerDto {
    disposition_manager;
    seller_name;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ManagerDto.prototype, "disposition_manager", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ManagerDto.prototype, "seller_name", void 0);
class ContractDto {
    date_locked_under_contract;
    accepting_offers_until;
}
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ContractDto.prototype, "date_locked_under_contract", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ContractDto.prototype, "accepting_offers_until", void 0);
class CreatePropertyDto {
    title;
    description;
    address;
    property_details;
    location;
    pricing;
    manager;
    contract;
    images;
    videos;
    three_d_walkthrough_links;
    documents;
    notes;
    tags;
    status;
    thirdViewLink;
}
exports.CreatePropertyDto = CreatePropertyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AddressDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", AddressDto)
], CreatePropertyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PropertyDetailsDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PropertyDetailsDto)
], CreatePropertyDto.prototype, "property_details", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LocationDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", LocationDto)
], CreatePropertyDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PricingDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PricingDto)
], CreatePropertyDto.prototype, "pricing", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ManagerDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", ManagerDto)
], CreatePropertyDto.prototype, "manager", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ContractDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", ContractDto)
], CreatePropertyDto.prototype, "contract", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePropertyDto.prototype, "images", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePropertyDto.prototype, "videos", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePropertyDto.prototype, "three_d_walkthrough_links", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePropertyDto.prototype, "documents", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePropertyDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePropertyDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePropertyDto.prototype, "thirdViewLink", void 0);
//# sourceMappingURL=create-property.dto.js.map