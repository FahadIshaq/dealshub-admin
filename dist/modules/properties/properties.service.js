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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PropertiesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const property_model_1 = require("../../models/property.model");
const AWS = require("aws-sdk");
let PropertiesService = PropertiesService_1 = class PropertiesService {
    propertyModel;
    s3;
    bucket = process.env.AWS_S3_BUCKET_NAME_GENERATED_IMAGES || 'dealshub';
    logger = new common_1.Logger(PropertiesService_1.name);
    constructor(propertyModel) {
        this.propertyModel = propertyModel;
        console.log('AWS_ACCESS_KEY:', process.env.AWS_ACCESS_KEY ? 'SET' : 'NOT SET');
        console.log('AWS_SECRET_KEY:', process.env.AWS_SECRET_KEY ? 'SET' : 'NOT SET');
        console.log('Bucket:', this.bucket);
        this.s3 = new AWS.S3({
            endpoint: 'https://nyc3.digitaloceanspaces.com',
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: 'nyc3',
            s3ForcePathStyle: false,
            signatureVersion: 'v4',
            httpOptions: {
                timeout: 30000,
                connectTimeout: 30000,
            },
        });
        this.testS3Connection();
    }
    async testS3Connection() {
        try {
            console.log('Testing S3 connection...');
            console.log('S3 Config:', {
                endpoint: this.s3.config.endpoint,
                region: this.s3.config.region,
                bucket: this.bucket,
                accessKeyId: this.s3.config.credentials?.accessKeyId ? 'SET' : 'NOT SET',
                secretAccessKey: this.s3.config.credentials?.secretAccessKey ? 'SET' : 'NOT SET',
            });
            const result = await this.s3.listBuckets().promise();
            console.log('S3 connection successful. Buckets:', result.Buckets?.map((b) => b.Name));
        }
        catch (error) {
            console.error('S3 connection failed:', error);
            console.error('Error details:', {
                code: error.code,
                message: error.message,
                statusCode: error.statusCode,
            });
        }
    }
    async create(createPropertyDto) {
        const createdProperty = new this.propertyModel(createPropertyDto);
        return createdProperty.save();
    }
    async findAll() {
        return this.propertyModel.find().exec();
    }
    async findAllWithFilters(filters) {
        try {
            const { status, propertyType, city, state, limit = 50, page = 1, sort = '-createdAt', search } = filters;
            const query = {};
            if (status && status !== 'all') {
                query.status = status;
            }
            if (propertyType) {
                query['property_details.property_type'] = propertyType;
            }
            if (city) {
                query['address.city'] = { $regex: city, $options: 'i' };
            }
            if (state) {
                query['address.state'] = { $regex: state, $options: 'i' };
            }
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { 'address.street_address': { $regex: search, $options: 'i' } },
                    { 'address.city': { $regex: search, $options: 'i' } },
                    { 'address.state': { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            let sortObject = {};
            if (sort) {
                const sortDirection = sort.startsWith('-') ? -1 : 1;
                const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
                sortObject[sortField] = sortDirection;
            }
            const skip = (page - 1) * limit;
            this.logger.log(`Query: ${JSON.stringify(query)}`);
            this.logger.log(`Sort: ${JSON.stringify(sortObject)}`);
            this.logger.log(`Pagination: limit=${limit}, page=${page}, skip=${skip}`);
            const properties = await this.propertyModel
                .find(query)
                .sort(sortObject)
                .skip(skip)
                .limit(limit)
                .exec();
            this.logger.log(`Found ${properties.length} properties matching criteria`);
            return properties;
        }
        catch (error) {
            this.logger.error(`Error in findAllWithFilters: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to fetch properties');
        }
    }
    async findOne(id) {
        const property = await this.propertyModel.findById(id).exec();
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        return property;
    }
    async update(id, updatePropertyDto) {
        const updatedProperty = await this.propertyModel
            .findByIdAndUpdate(id, updatePropertyDto, { new: true })
            .exec();
        if (!updatedProperty) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        return updatedProperty;
    }
    async remove(id) {
        console.log('remove service called for property ID:', id);
        const property = await this.propertyModel.findById(id).exec();
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        console.log('Property found:', {
            id: property._id,
            title: property.title,
            images: property.images?.length || 0,
            videos: property.videos?.length || 0,
            documents: property.documents?.length || 0
        });
        const filesToDelete = [
            ...(property.images || []),
            ...(property.videos || []),
            ...(property.documents || []),
        ];
        console.log('Files to delete from S3:', filesToDelete);
        console.log('Total files to delete:', filesToDelete.length);
        if (filesToDelete.length > 0) {
            console.log('Starting S3 file deletion...');
            for (const fileUrl of filesToDelete) {
                try {
                    console.log('Deleting file from S3:', fileUrl);
                    await this.deleteFileFromS3(fileUrl);
                    console.log('Successfully deleted file from S3:', fileUrl);
                }
                catch (error) {
                    console.error(`Failed to delete file ${fileUrl}:`, error);
                    this.logger.error(`Failed to delete file ${fileUrl}:`, error);
                }
            }
            console.log('S3 file deletion completed');
        }
        else {
            console.log('No files to delete from S3');
        }
        console.log('Deleting property from database...');
        await this.propertyModel.findByIdAndDelete(id).exec();
        console.log('Property deleted from database successfully');
    }
    async uploadImage(file) {
        console.log('uploadImage called with file:', {
            originalname: file?.originalname,
            mimetype: file?.mimetype,
            size: file?.size,
            buffer: file?.buffer ? 'Buffer present' : 'No buffer'
        });
        if (!file) {
            console.error('No file provided to uploadImage');
            throw new common_1.BadRequestException('No file provided');
        }
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        console.log('File mimetype:', file.mimetype);
        console.log('Allowed types:', allowedTypes);
        console.log('Is mimetype allowed:', allowedTypes.includes(file.mimetype));
        if (!allowedTypes.includes(file.mimetype)) {
            console.error('Invalid file type:', file.mimetype);
            throw new common_1.BadRequestException(`Invalid image file type: ${file.mimetype}`);
        }
        console.log('File size:', file.size, 'bytes');
        if (file.size > 10 * 1024 * 1024) {
            console.error('File too large:', file.size, 'bytes');
            throw new common_1.BadRequestException('Image file too large. Maximum size is 10MB');
        }
        const fileName = `images/${Date.now()}-${file.originalname}`;
        console.log('Uploading file as:', fileName);
        try {
            const uploadResult = await this.uploadToS3(file.buffer, fileName, file.mimetype);
            console.log('Upload successful:', uploadResult.Location);
            return { url: uploadResult.Location };
        }
        catch (error) {
            console.error('Error uploading image to S3:', error);
            throw new common_1.InternalServerErrorException('Failed to upload image');
        }
    }
    async uploadVideo(file) {
        const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid video file type');
        }
        if (file.size > 100 * 1024 * 1024) {
            throw new common_1.BadRequestException('Video file too large. Maximum size is 100MB');
        }
        const fileName = `videos/${Date.now()}-${file.originalname}`;
        try {
            const uploadResult = await this.uploadToS3(file.buffer, fileName, file.mimetype);
            return { url: uploadResult.Location };
        }
        catch (error) {
            this.logger.error('Error uploading video to S3:', error);
            throw new common_1.InternalServerErrorException('Failed to upload video');
        }
    }
    async uploadDocument(file) {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'application/rtf'
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid document file type');
        }
        if (file.size > 50 * 1024 * 1024) {
            throw new common_1.BadRequestException('Document file too large. Maximum size is 50MB');
        }
        const fileName = `documents/${Date.now()}-${file.originalname}`;
        try {
            const uploadResult = await this.uploadToS3(file.buffer, fileName, file.mimetype);
            return { url: uploadResult.Location };
        }
        catch (error) {
            this.logger.error('Error uploading document to S3:', error);
            throw new common_1.InternalServerErrorException('Failed to upload document');
        }
    }
    async deleteImage(propertyId, imageUrl) {
        console.log('deleteImage service called');
        console.log('Property ID:', propertyId);
        console.log('Image URL:', imageUrl);
        const property = await this.propertyModel.findById(propertyId).exec();
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${propertyId} not found`);
        }
        console.log('Current images in property:', property.images);
        const updatedImages = property.images.filter(img => img !== imageUrl);
        console.log('Updated images array:', updatedImages);
        await this.propertyModel.findByIdAndUpdate(propertyId, { images: updatedImages }).exec();
        console.log('Property updated in database');
        try {
            await this.deleteFileFromS3(imageUrl);
            console.log('Image file deleted from S3 successfully');
        }
        catch (error) {
            this.logger.error(`Failed to delete image ${imageUrl}:`, error);
            console.error('S3 deletion failed:', error);
        }
    }
    async deleteVideo(propertyId, videoUrl) {
        console.log('deleteVideo service called');
        console.log('Property ID:', propertyId);
        console.log('Video URL:', videoUrl);
        const property = await this.propertyModel.findById(propertyId).exec();
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${propertyId} not found`);
        }
        console.log('Current videos in property:', property.videos);
        const updatedVideos = property.videos.filter(video => video !== videoUrl);
        console.log('Updated videos array:', updatedVideos);
        await this.propertyModel.findByIdAndUpdate(propertyId, { videos: updatedVideos }).exec();
        console.log('Property updated in database');
        try {
            await this.deleteFileFromS3(videoUrl);
            console.log('Video file deleted from S3 successfully');
        }
        catch (error) {
            this.logger.error(`Failed to delete video ${videoUrl}:`, error);
            console.error('S3 deletion failed:', error);
        }
    }
    async deleteDocument(propertyId, documentUrl) {
        console.log('deleteDocument service called');
        console.log('Property ID:', propertyId);
        console.log('Document URL:', documentUrl);
        const property = await this.propertyModel.findById(propertyId).exec();
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${propertyId} not found`);
        }
        console.log('Current documents in property:', property.documents);
        const updatedDocuments = property.documents.filter(doc => doc !== documentUrl);
        console.log('Updated documents array:', updatedDocuments);
        await this.propertyModel.findByIdAndUpdate(propertyId, { documents: updatedDocuments }).exec();
        console.log('Property updated in database');
        try {
            await this.deleteFileFromS3(documentUrl);
            console.log('Document file deleted from S3 successfully');
        }
        catch (error) {
            this.logger.error(`Failed to delete document ${documentUrl}:`, error);
            console.error('S3 deletion failed:', error);
        }
    }
    async uploadToS3(buffer, key, contentType) {
        const params = {
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ACL: 'public-read',
            ContentType: contentType,
        };
        try {
            console.log('Uploading to S3:', JSON.stringify(params, null, 2));
            const data = await this.s3.upload(params).promise();
            console.log(`Successfully uploaded to S3: ${data.Location}`);
            return data;
        }
        catch (error) {
            console.error('Failed to upload to S3:', error);
            throw error;
        }
    }
    extractKeyFromUrl(fileUrl) {
        try {
            console.log('Extracting key from URL:', fileUrl);
            const url = new URL(fileUrl);
            console.log('URL pathname:', url.pathname);
            const pathParts = url.pathname.split('/').filter(part => part !== '');
            console.log('Path parts after filtering:', pathParts);
            const key = pathParts.join('/');
            console.log('Final extracted key:', key);
            return decodeURIComponent(key);
        }
        catch (error) {
            this.logger.error('Error extracting key from URL:', error);
            throw new common_1.BadRequestException('Invalid file URL');
        }
    }
    async deleteFileFromS3(fileUrl) {
        try {
            const key = this.extractKeyFromUrl(fileUrl);
            const params = {
                Bucket: this.bucket,
                Key: key,
            };
            console.log('Deleting from S3:', JSON.stringify(params, null, 2));
            await this.s3.deleteObject(params).promise();
            console.log(`Successfully deleted from S3: ${key}`);
        }
        catch (error) {
            console.error('Failed to delete from S3:', error);
            throw error;
        }
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = PropertiesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(property_model_1.Property.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map