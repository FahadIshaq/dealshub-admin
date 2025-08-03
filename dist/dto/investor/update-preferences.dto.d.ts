export declare class PriceRangeDto {
    min: number;
    max: number;
}
export declare class UpdatePreferencesDto {
    propertyTypes?: string[];
    priceRange?: PriceRangeDto;
    locations?: string[];
    bedrooms?: number;
    bathrooms?: number;
}
