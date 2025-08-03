import { Document } from 'mongoose';
export type PropertyDocument = Property & Document;
export declare class Property extends Document {
    userId: string;
    title: string;
    description: string;
    address: {
        street_address: string;
        unit: string;
        plus_code: string;
        city: string;
        county: string;
        state: string;
        zip_code: string;
    };
    property_details: {
        bedrooms: number;
        baths: number;
        half_baths: number;
        square_footage: number;
        lot_size: {
            value: number;
            unit: 'acres' | 'sqft';
        };
        parking_type: string;
        property_type: string;
        year_built: number;
        condition: string;
    };
    location: {
        timezone: string;
        latitude: number;
        longitude: number;
    };
    pricing: {
        starting_price: number;
        buy_now_price: number;
        min_emd: number;
        purchase_price: number;
        original_purchase_emd: number;
        arv: number;
        zestimate: number;
        repair_estimate_min: number;
        repair_estimate_max: number;
    };
    manager: {
        disposition_manager: string;
        seller_name: string;
    };
    contract: {
        date_locked_under_contract: string;
        accepting_offers_until: string;
    };
    images: string[];
    videos: string[];
    three_d_walkthrough_links: string[];
    documents: string[];
    notes: string[];
    tags: string[];
    status: string;
    thirdViewLink: string;
}
export declare const PropertySchema: import("mongoose").Schema<Property, import("mongoose").Model<Property, any, any, any, Document<unknown, any, Property, any> & Property & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Property, Document<unknown, {}, import("mongoose").FlatRecord<Property>, {}> & import("mongoose").FlatRecord<Property> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
