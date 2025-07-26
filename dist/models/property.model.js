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
exports.PropertySchema = exports.Property = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Property = class Property extends mongoose_2.Document {
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
};
exports.Property = Property;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Property.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Property.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            street_address: String,
            unit: String,
            plus_code: String,
            city: String,
            county: String,
            state: String,
            zip_code: String,
        },
    }),
    __metadata("design:type", Object)
], Property.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            bedrooms: Number,
            baths: Number,
            half_baths: Number,
            square_footage: Number,
            lot_size: {
                value: Number,
                unit: { type: String, enum: ['acres', 'sqft'], default: 'acres' },
            },
            parking_type: {
                type: String,
                enum: [
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
                ],
            },
            property_type: {
                type: String,
                enum: [
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
                ],
            },
            year_built: Number,
            condition: {
                type: String,
                enum: ['Turn Key', 'Full Rehab', 'Major Repair', 'Light Rehab'],
            },
        },
    }),
    __metadata("design:type", Object)
], Property.prototype, "property_details", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            timezone: String,
            latitude: Number,
            longitude: Number,
        },
    }),
    __metadata("design:type", Object)
], Property.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            starting_price: Number,
            buy_now_price: Number,
            min_emd: Number,
            purchase_price: Number,
            original_purchase_emd: Number,
            arv: Number,
            zestimate: Number,
            repair_estimate_min: Number,
            repair_estimate_max: Number,
        },
    }),
    __metadata("design:type", Object)
], Property.prototype, "pricing", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            disposition_manager: String,
            seller_name: String,
        },
    }),
    __metadata("design:type", Object)
], Property.prototype, "manager", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            date_locked_under_contract: String,
            accepting_offers_until: String,
        },
    }),
    __metadata("design:type", Object)
], Property.prototype, "contract", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Property.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Property.prototype, "videos", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Property.prototype, "three_d_walkthrough_links", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Property.prototype, "documents", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Property.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Property.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'draft' }),
    __metadata("design:type", String)
], Property.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Property.prototype, "thirdViewLink", void 0);
exports.Property = Property = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Property);
exports.PropertySchema = mongoose_1.SchemaFactory.createForClass(Property);
//# sourceMappingURL=property.model.js.map