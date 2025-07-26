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
var PropertiesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const properties_service_1 = require("./properties.service");
const create_property_dto_1 = require("../../dto/create-property.dto");
const update_property_dto_1 = require("../../dto/update-property.dto");
const jwt_guard_1 = require("../../middleware/jwt.guard");
let PropertiesController = PropertiesController_1 = class PropertiesController {
    propertiesService;
    logger = new common_1.Logger(PropertiesController_1.name);
    constructor(propertiesService) {
        this.propertiesService = propertiesService;
    }
    create(createPropertyDto) {
        console.log('Creating property with data:', JSON.stringify(createPropertyDto, null, 2));
        return this.propertiesService.create(createPropertyDto);
    }
    async findAll(status, propertyType, city, state, limit, page, sort, search) {
        try {
            this.logger.log(`Fetching properties with filters: ${JSON.stringify({
                status,
                propertyType,
                city,
                state,
                limit,
                page,
                sort,
                search,
            })}`);
            const properties = await this.propertiesService.findAllWithFilters({
                status,
                propertyType,
                city,
                state,
                limit: limit ? parseInt(limit) : undefined,
                page: page ? parseInt(page) : undefined,
                sort,
                search,
            });
            this.logger.log(`Successfully fetched ${properties.length} properties`);
            return {
                success: true,
                data: properties,
                count: properties.length,
                message: 'Properties retrieved successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error fetching properties: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getAllProperties() {
        try {
            this.logger.log('Fetching all properties without filters');
            const properties = await this.propertiesService.findAll();
            this.logger.log(`Successfully fetched ${properties.length} properties`);
            return {
                success: true,
                data: properties,
                count: properties.length,
                message: 'All properties retrieved successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error fetching all properties: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(id) {
        try {
            this.logger.log(`Fetching property with ID: ${id}`);
            const property = await this.propertiesService.findOne(id);
            this.logger.log(`Successfully fetched property: ${property.title}`);
            return {
                success: true,
                data: property,
                message: 'Property retrieved successfully',
            };
        }
        catch (error) {
            this.logger.error(`Error fetching property: ${error.message}`, error.stack);
            throw error;
        }
    }
    async uploadImage(file, body) {
        console.log('uploadImage endpoint called');
        console.log('Request body keys:', Object.keys(body || {}));
        console.log('File received:', {
            originalname: file?.originalname,
            mimetype: file?.mimetype,
            size: file?.size
        });
        if (!file) {
            console.error('No file received in controller');
            console.error('Request body:', body);
            throw new common_1.BadRequestException('No file uploaded');
        }
        try {
            return await this.propertiesService.uploadImage(file);
        }
        catch (error) {
            console.error('Error in uploadImage controller:', error);
            throw error;
        }
    }
    async uploadVideo(file, body) {
        console.log('uploadVideo endpoint called');
        console.log('Request body keys:', Object.keys(body || {}));
        console.log('File received:', {
            originalname: file?.originalname,
            mimetype: file?.mimetype,
            size: file?.size
        });
        if (!file) {
            console.error('No file received in video upload controller');
            console.error('Request body:', body);
            throw new common_1.BadRequestException('No file uploaded');
        }
        try {
            return await this.propertiesService.uploadVideo(file);
        }
        catch (error) {
            console.error('Error in uploadVideo controller:', error);
            throw error;
        }
    }
    async uploadDocument(file, body) {
        console.log('uploadDocument endpoint called');
        console.log('Request body keys:', Object.keys(body || {}));
        console.log('File received:', {
            originalname: file?.originalname,
            mimetype: file?.mimetype,
            size: file?.size
        });
        if (!file) {
            console.error('No file received in document upload controller');
            console.error('Request body:', body);
            throw new common_1.BadRequestException('No file uploaded');
        }
        try {
            return await this.propertiesService.uploadDocument(file);
        }
        catch (error) {
            console.error('Error in uploadDocument controller:', error);
            throw error;
        }
    }
    update(id, updatePropertyDto) {
        console.log('Updating property with data:', JSON.stringify(updatePropertyDto, null, 2));
        return this.propertiesService.update(id, updatePropertyDto);
    }
    remove(id) {
        console.log('DELETE /properties/:id endpoint called');
        console.log('Property ID to delete:', id);
        try {
            const result = this.propertiesService.remove(id);
            console.log('Property deletion initiated successfully');
            return result;
        }
        catch (error) {
            console.error('Error in remove controller:', error);
            throw error;
        }
    }
    async deleteImage(id, body) {
        console.log('deleteImage endpoint called');
        console.log('Property ID:', id);
        console.log('Request body:', body);
        console.log('Image URL to delete:', body.imageUrl);
        try {
            const result = await this.propertiesService.deleteImage(id, body.imageUrl);
            console.log('Image deletion result:', result);
            return result;
        }
        catch (error) {
            console.error('Error in deleteImage controller:', error);
            throw error;
        }
    }
    async deleteVideo(id, body) {
        console.log('deleteVideo endpoint called');
        console.log('Property ID:', id);
        console.log('Request body:', body);
        console.log('Video URL to delete:', body.videoUrl);
        try {
            const result = await this.propertiesService.deleteVideo(id, body.videoUrl);
            console.log('Video deletion result:', result);
            return result;
        }
        catch (error) {
            console.error('Error in deleteVideo controller:', error);
            throw error;
        }
    }
    async deleteDocument(id, body) {
        console.log('deleteDocument endpoint called');
        console.log('Property ID:', id);
        console.log('Request body:', body);
        console.log('Document URL to delete:', body.documentUrl);
        try {
            const result = await this.propertiesService.deleteDocument(id, body.documentUrl);
            console.log('Document deletion result:', result);
            return result;
        }
        catch (error) {
            console.error('Error in deleteDocument controller:', error);
            throw error;
        }
    }
};
exports.PropertiesController = PropertiesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_dto_1.CreatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('property_type')),
    __param(2, (0, common_1.Query)('city')),
    __param(3, (0, common_1.Query)('state')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('sort')),
    __param(7, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getAllProperties", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('upload-image'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: undefined,
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            console.log('Multer fileFilter called with:', {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            });
            cb(null, true);
        }
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('upload-video'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: undefined,
        limits: {
            fileSize: 100 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            console.log('Video upload - Multer fileFilter called with:', {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            });
            cb(null, true);
        }
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Post)('upload-document'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: undefined,
        limits: {
            fileSize: 50 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            console.log('Document upload - Multer fileFilter called with:', {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            });
            cb(null, true);
        }
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_dto_1.UpdatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(':id/images'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Delete)(':id/videos'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "deleteVideo", null);
__decorate([
    (0, common_1.Delete)(':id/documents'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "deleteDocument", null);
exports.PropertiesController = PropertiesController = PropertiesController_1 = __decorate([
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [properties_service_1.PropertiesService])
], PropertiesController);
//# sourceMappingURL=properties.controller.js.map