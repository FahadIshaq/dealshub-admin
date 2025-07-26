declare class AddressDto {
    street_address?: string;
    unit?: string;
    plus_code?: string;
    city?: string;
    county?: string;
    state?: string;
    zip_code?: string;
}
declare class LotSizeDto {
    value?: number;
    unit?: 'acres' | 'sqft';
}
declare class PropertyDetailsDto {
    bedrooms?: number;
    baths?: number;
    half_baths?: number;
    square_footage?: number;
    lot_size?: LotSizeDto;
    parking_type?: string;
    property_type?: string;
    year_built?: number;
    condition?: string;
}
declare class LocationDto {
    timezone?: string;
    latitude?: number;
    longitude?: number;
}
declare class PricingDto {
    starting_price?: number;
    buy_now_price?: number;
    min_emd?: number;
    purchase_price?: number;
    original_purchase_emd?: number;
    arv?: number;
    zestimate?: number;
    repair_estimate_min?: number;
    repair_estimate_max?: number;
}
declare class ManagerDto {
    disposition_manager?: string;
    seller_name?: string;
}
declare class ContractDto {
    date_locked_under_contract?: string;
    accepting_offers_until?: string;
}
export declare class CreatePropertyDto {
    title: string;
    description?: string;
    address?: AddressDto;
    property_details?: PropertyDetailsDto;
    location?: LocationDto;
    pricing?: PricingDto;
    manager?: ManagerDto;
    contract?: ContractDto;
    images?: string[];
    videos?: string[];
    three_d_walkthrough_links?: string[];
    documents?: string[];
    notes?: string[];
    tags?: string[];
    status?: string;
    thirdViewLink?: string;
}
export {};
