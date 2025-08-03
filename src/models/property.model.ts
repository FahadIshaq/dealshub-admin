import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PropertyDocument = Property & Document;

@Schema({ timestamps: true })
export class Property extends Document {
  @Prop({ type: String, required: true })
  userId: string; // Reference to the wholesaler who owns this property

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    type: {
      street_address: String,
      unit: String,
      plus_code: String,
      city: String,
      county: String,
      state: String,
      zip_code: String,
    },
  })
  address: {
    street_address: string;
    unit: string;
    plus_code: string;
    city: string;
    county: string;
    state: string;
    zip_code: string;
  };

  @Prop({
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
  })
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

  @Prop({
    type: {
      timezone: String,
      latitude: Number,
      longitude: Number,
    },
  })
  location: {
    timezone: string;
    latitude: number;
    longitude: number;
  };

  @Prop({
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
  })
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

  @Prop({
    type: {
      disposition_manager: String,
      seller_name: String,
    },
  })
  manager: {
    disposition_manager: string;
    seller_name: string;
  };

  @Prop({
    type: {
      date_locked_under_contract: String, // YYYY-MM-DD format
      accepting_offers_until: String, // YYYY-MM-DD format
    },
  })
  contract: {
    date_locked_under_contract: string;
    accepting_offers_until: string;
  };

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: [String] })
  videos: string[];

  @Prop({ type: [String] })
  three_d_walkthrough_links: string[];

  @Prop({ type: [String] })
  documents: string[];

  @Prop({ type: [String] })
  notes: string[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ default: 'draft' })
  status: string; // draft, pending, active, inactive

  @Prop()
  thirdViewLink: string; // URL for 3rd party view (e.g., Google Street View, Zillow, etc.)
}

export const PropertySchema = SchemaFactory.createForClass(Property); 