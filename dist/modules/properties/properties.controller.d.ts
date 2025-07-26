import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from '../../dto/create-property.dto';
import { UpdatePropertyDto } from '../../dto/update-property.dto';
export declare class PropertiesController {
    private readonly propertiesService;
    private readonly logger;
    constructor(propertiesService: PropertiesService);
    create(createPropertyDto: CreatePropertyDto): Promise<import("../../models/property.model").Property>;
    findAll(status?: string, propertyType?: string, city?: string, state?: string, limit?: string, page?: string, sort?: string, search?: string): Promise<{
        success: boolean;
        data: import("../../models/property.model").Property[];
        count: number;
        message: string;
    }>;
    getAllProperties(): Promise<{
        success: boolean;
        data: import("../../models/property.model").Property[];
        count: number;
        message: string;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("../../models/property.model").Property;
        message: string;
    }>;
    uploadImage(file: Express.Multer.File, body: any): Promise<{
        url: string;
    }>;
    uploadVideo(file: Express.Multer.File, body: any): Promise<{
        url: string;
    }>;
    uploadDocument(file: Express.Multer.File, body: any): Promise<{
        url: string;
    }>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<import("../../models/property.model").Property>;
    remove(id: string): Promise<void>;
    deleteImage(id: string, body: {
        imageUrl: string;
    }): Promise<void>;
    deleteVideo(id: string, body: {
        videoUrl: string;
    }): Promise<void>;
    deleteDocument(id: string, body: {
        documentUrl: string;
    }): Promise<void>;
}
