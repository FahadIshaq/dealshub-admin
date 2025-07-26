import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  Query,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from '../../dto/create-property.dto';
import { UpdatePropertyDto } from '../../dto/update-property.dto';
import { JwtAuthGuard } from '../../middleware/jwt.guard';

@Controller('properties')
export class PropertiesController {
  private readonly logger = new Logger(PropertiesController.name);

  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPropertyDto: CreatePropertyDto) {
    console.log(
      'Creating property with data:',
      JSON.stringify(createPropertyDto, null, 2),
    );
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('property_type') propertyType?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('sort') sort?: string,
    @Query('search') search?: string,
  ) {
    try {
      this.logger.log(
        `Fetching properties with filters: ${JSON.stringify({
          status,
          propertyType,
          city,
          state,
          limit,
          page,
          sort,
          search,
        })}`,
      );

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
    } catch (error: any) {
      this.logger.error(
        `Error fetching properties: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get('all')
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
    } catch (error: any) {
      this.logger.error(
        `Error fetching all properties: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      this.logger.log(`Fetching property with ID: ${id}`);
      
      const property = await this.propertiesService.findOne(id);
      
      this.logger.log(`Successfully fetched property: ${property.title}`);
      
      return {
        success: true,
        data: property,
        message: 'Property retrieved successfully',
      };
    } catch (error: any) {
      this.logger.error(
        `Error fetching property: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post('upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: undefined, // Use memory storage
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      console.log('Multer fileFilter called with:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
      cb(null, true);
    }
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
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
      throw new BadRequestException('No file uploaded');
    }
    
    try {
      return await this.propertiesService.uploadImage(file);
    } catch (error) {
      console.error('Error in uploadImage controller:', error);
      throw error;
    }
  }

  @Post('upload-video')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: undefined, // Use memory storage
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB limit for videos
    },
    fileFilter: (req, file, cb) => {
      console.log('Video upload - Multer fileFilter called with:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
      cb(null, true);
    }
  }))
  async uploadVideo(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
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
      throw new BadRequestException('No file uploaded');
    }
    
    try {
      return await this.propertiesService.uploadVideo(file);
    } catch (error) {
      console.error('Error in uploadVideo controller:', error);
      throw error;
    }
  }

  @Post('upload-document')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: undefined, // Use memory storage
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit for documents
    },
    fileFilter: (req, file, cb) => {
      console.log('Document upload - Multer fileFilter called with:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
      cb(null, true);
    }
  }))
  async uploadDocument(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
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
      throw new BadRequestException('No file uploaded');
    }
    
    try {
      return await this.propertiesService.uploadDocument(file);
    } catch (error) {
      console.error('Error in uploadDocument controller:', error);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    console.log('Updating property with data:', JSON.stringify(updatePropertyDto, null, 2));
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    console.log('DELETE /properties/:id endpoint called');
    console.log('Property ID to delete:', id);
    
    try {
      const result = this.propertiesService.remove(id);
      console.log('Property deletion initiated successfully');
      return result;
    } catch (error) {
      console.error('Error in remove controller:', error);
      throw error;
    }
  }

  @Delete(':id/images')
  @UseGuards(JwtAuthGuard)
  async deleteImage(
    @Param('id') id: string,
    @Body() body: { imageUrl: string },
  ) {
    console.log('deleteImage endpoint called');
    console.log('Property ID:', id);
    console.log('Request body:', body);
    console.log('Image URL to delete:', body.imageUrl);
    
    try {
      const result = await this.propertiesService.deleteImage(id, body.imageUrl);
      console.log('Image deletion result:', result);
      return result;
    } catch (error) {
      console.error('Error in deleteImage controller:', error);
      throw error;
    }
  }

  @Delete(':id/videos')
  @UseGuards(JwtAuthGuard)
  async deleteVideo(
    @Param('id') id: string,
    @Body() body: { videoUrl: string },
  ) {
    console.log('deleteVideo endpoint called');
    console.log('Property ID:', id);
    console.log('Request body:', body);
    console.log('Video URL to delete:', body.videoUrl);
    
    try {
      const result = await this.propertiesService.deleteVideo(id, body.videoUrl);
      console.log('Video deletion result:', result);
      return result;
    } catch (error) {
      console.error('Error in deleteVideo controller:', error);
      throw error;
    }
  }

  @Delete(':id/documents')
  @UseGuards(JwtAuthGuard)
  async deleteDocument(
    @Param('id') id: string,
    @Body() body: { documentUrl: string },
  ) {
    console.log('deleteDocument endpoint called');
    console.log('Property ID:', id);
    console.log('Request body:', body);
    console.log('Document URL to delete:', body.documentUrl);
    
    try {
      const result = await this.propertiesService.deleteDocument(id, body.documentUrl);
      console.log('Document deletion result:', result);
      return result;
    } catch (error) {
      console.error('Error in deleteDocument controller:', error);
      throw error;
    }
  }
} 