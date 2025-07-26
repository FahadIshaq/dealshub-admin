import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  @IsOptional()
  street_address?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  plus_code?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  county?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zip_code?: string;
}

class LotSizeDto {
  @IsNumber()
  @IsOptional()
  value?: number;

  @IsEnum(['acres', 'sqft'])
  @IsOptional()
  unit?: 'acres' | 'sqft';
}

class PropertyDetailsDto {
  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @IsNumber()
  @IsOptional()
  baths?: number;

  @IsNumber()
  @IsOptional()
  half_baths?: number;

  @IsNumber()
  @IsOptional()
  square_footage?: number;

  @ValidateNested()
  @Type(() => LotSizeDto)
  @IsOptional()
  lot_size?: LotSizeDto;

  @IsEnum([
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
  ])
  @IsOptional()
  parking_type?: string;

  @IsEnum([
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
  ])
  @IsOptional()
  property_type?: string;

  @IsNumber()
  @IsOptional()
  year_built?: number;

  @IsEnum(['Turn Key', 'Full Rehab', 'Major Repair', 'Light Rehab'])
  @IsOptional()
  condition?: string;
}

class LocationDto {
  @IsString()
  @IsOptional()
  timezone?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}

class PricingDto {
  @IsNumber()
  @IsOptional()
  starting_price?: number;

  @IsNumber()
  @IsOptional()
  buy_now_price?: number;

  @IsNumber()
  @IsOptional()
  min_emd?: number;

  @IsNumber()
  @IsOptional()
  purchase_price?: number;

  @IsNumber()
  @IsOptional()
  original_purchase_emd?: number;

  @IsNumber()
  @IsOptional()
  arv?: number;

  @IsNumber()
  @IsOptional()
  zestimate?: number;

  @IsNumber()
  @IsOptional()
  repair_estimate_min?: number;

  @IsNumber()
  @IsOptional()
  repair_estimate_max?: number;
}

class ManagerDto {
  @IsString()
  @IsOptional()
  disposition_manager?: string;

  @IsString()
  @IsOptional()
  seller_name?: string;
}

class ContractDto {
  @IsDateString()
  @IsOptional()
  date_locked_under_contract?: string;

  @IsDateString()
  @IsOptional()
  accepting_offers_until?: string;
}

export class UpdatePropertyDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @ValidateNested()
  @Type(() => PropertyDetailsDto)
  @IsOptional()
  property_details?: PropertyDetailsDto;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @ValidateNested()
  @Type(() => PricingDto)
  @IsOptional()
  pricing?: PricingDto;

  @ValidateNested()
  @Type(() => ManagerDto)
  @IsOptional()
  manager?: ManagerDto;

  @ValidateNested()
  @Type(() => ContractDto)
  @IsOptional()
  contract?: ContractDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videos?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  three_d_walkthrough_links?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documents?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  notes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  thirdViewLink?: string;
} 