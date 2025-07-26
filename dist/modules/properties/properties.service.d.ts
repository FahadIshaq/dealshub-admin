import { Model } from 'mongoose';
import { Property } from '../../models/property.model';
import { CreatePropertyDto } from '../../dto/create-property.dto';
import { UpdatePropertyDto } from '../../dto/update-property.dto';
export declare class PropertiesService {
    private propertyModel;
    private s3;
    private readonly bucket;
    private readonly logger;
    constructor(propertyModel: Model<Property>);
    private testS3Connection;
    create(createPropertyDto: CreatePropertyDto): Promise<Property>;
    findAll(): Promise<Property[]>;
    findAllWithFilters(filters: {
        status?: string;
        propertyType?: string;
        city?: string;
        state?: string;
        limit?: number;
        page?: number;
        sort?: string;
        search?: string;
    }): Promise<Property[]>;
    findOne(id: string): Promise<Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property>;
    remove(id: string): Promise<void>;
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadVideo(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadDocument(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    deleteImage(propertyId: string, imageUrl: string): Promise<void>;
    deleteVideo(propertyId: string, videoUrl: string): Promise<void>;
    deleteDocument(propertyId: string, documentUrl: string): Promise<void>;
    private uploadToS3;
    private extractKeyFromUrl;
    private deleteFileFromS3;
}
