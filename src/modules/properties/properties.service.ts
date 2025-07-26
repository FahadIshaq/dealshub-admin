import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from '../../models/property.model';
import { CreatePropertyDto } from '../../dto/create-property.dto';
import { UpdatePropertyDto } from '../../dto/update-property.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class PropertiesService {
  private s3: AWS.S3;
  private readonly bucket = process.env.AWS_S3_BUCKET_NAME_GENERATED_IMAGES || 'dealshub';
  private readonly logger = new Logger(PropertiesService.name);

  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {
    // Debug: Log environment variables
    console.log(
      'AWS_ACCESS_KEY:',
      process.env.AWS_ACCESS_KEY ? 'SET' : 'NOT SET',
    );
    console.log(
      'AWS_SECRET_KEY:',
      process.env.AWS_SECRET_KEY ? 'SET' : 'NOT SET',
    );
    console.log('Bucket:', this.bucket);

    this.s3 = new AWS.S3({
      endpoint: 'https://nyc3.digitaloceanspaces.com',
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: 'nyc3',
      s3ForcePathStyle: false,
      signatureVersion: 'v4',
      // Additional settings for DigitalOcean Spaces
      httpOptions: {
        timeout: 30000,
        connectTimeout: 30000,
      },
    });

    // Test S3 connection
    this.testS3Connection();
  }

  private async testS3Connection() {
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
      console.log(
        'S3 connection successful. Buckets:',
        result.Buckets?.map((b) => b.Name),
      );
    } catch (error) {
      console.error('S3 connection failed:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      });
    }
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const createdProperty = new this.propertyModel(createPropertyDto);
    return createdProperty.save();
  }

  async findAll(): Promise<Property[]> {
    return this.propertyModel.find().exec();
  }

  async findAllWithFilters(filters: {
    status?: string;
    propertyType?: string;
    city?: string;
    state?: string;
    limit?: number;
    page?: number;
    sort?: string;
    search?: string;
  }): Promise<Property[]> {
    try {
      const {
        status,
        propertyType,
        city,
        state,
        limit = 50,
        page = 1,
        sort = '-createdAt',
        search
      } = filters;

      // Build query
      const query: any = {};

      // Status filter
      if (status && status !== 'all') {
        query.status = status;
      }

      // Property type filter
      if (propertyType) {
        query['property_details.property_type'] = propertyType;
      }

      // Location filters
      if (city) {
        query['address.city'] = { $regex: city, $options: 'i' };
      }

      if (state) {
        query['address.state'] = { $regex: state, $options: 'i' };
      }

      // Search filter (searches in title, address, and description)
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { 'address.street_address': { $regex: search, $options: 'i' } },
          { 'address.city': { $regex: search, $options: 'i' } },
          { 'address.state': { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort object
      let sortObject: any = {};
      if (sort) {
        const sortDirection = sort.startsWith('-') ? -1 : 1;
        const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
        sortObject[sortField] = sortDirection;
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      this.logger.log(`Query: ${JSON.stringify(query)}`);
      this.logger.log(`Sort: ${JSON.stringify(sortObject)}`);
      this.logger.log(`Pagination: limit=${limit}, page=${page}, skip=${skip}`);

      // Execute query with pagination and sorting
      const properties = await this.propertyModel
        .find(query)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .exec();

      this.logger.log(`Found ${properties.length} properties matching criteria`);
      return properties;
    } catch (error) {
      this.logger.error(`Error in findAllWithFilters: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch properties');
    }
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyModel.findById(id).exec();
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const updatedProperty = await this.propertyModel
      .findByIdAndUpdate(id, updatePropertyDto, { new: true })
      .exec();
    if (!updatedProperty) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return updatedProperty;
  }

  async remove(id: string): Promise<void> {
    console.log('remove service called for property ID:', id);
    
    const property = await this.propertyModel.findById(id).exec();
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    console.log('Property found:', {
      id: property._id,
      title: property.title,
      images: property.images?.length || 0,
      videos: property.videos?.length || 0,
      documents: property.documents?.length || 0
    });

    // Delete all associated files from S3
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
        } catch (error) {
          console.error(`Failed to delete file ${fileUrl}:`, error);
          this.logger.error(`Failed to delete file ${fileUrl}:`, error);
          // Continue with other files even if one fails
        }
      }
      
      console.log('S3 file deletion completed');
    } else {
      console.log('No files to delete from S3');
    }

    console.log('Deleting property from database...');
    await this.propertyModel.findByIdAndDelete(id).exec();
    console.log('Property deleted from database successfully');
  }

  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    console.log('uploadImage called with file:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      buffer: file?.buffer ? 'Buffer present' : 'No buffer'
    });

    if (!file) {
      console.error('No file provided to uploadImage');
      throw new BadRequestException('No file provided');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    console.log('File mimetype:', file.mimetype);
    console.log('Allowed types:', allowedTypes);
    console.log('Is mimetype allowed:', allowedTypes.includes(file.mimetype));

    if (!allowedTypes.includes(file.mimetype)) {
      console.error('Invalid file type:', file.mimetype);
      throw new BadRequestException(`Invalid image file type: ${file.mimetype}`);
    }

    console.log('File size:', file.size, 'bytes');
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      console.error('File too large:', file.size, 'bytes');
      throw new BadRequestException('Image file too large. Maximum size is 10MB');
    }

    const fileName = `images/${Date.now()}-${file.originalname}`;
    console.log('Uploading file as:', fileName);

    try {
      const uploadResult = await this.uploadToS3(file.buffer, fileName, file.mimetype);
      console.log('Upload successful:', uploadResult.Location);
      return { url: uploadResult.Location };
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  async uploadVideo(file: Express.Multer.File): Promise<{ url: string }> {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid video file type');
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      throw new BadRequestException('Video file too large. Maximum size is 100MB');
    }

    const fileName = `videos/${Date.now()}-${file.originalname}`;

    try {
      const uploadResult = await this.uploadToS3(file.buffer, fileName, file.mimetype);
      return { url: uploadResult.Location };
    } catch (error) {
      this.logger.error('Error uploading video to S3:', error);
      throw new InternalServerErrorException('Failed to upload video');
    }
  }

  async uploadDocument(file: Express.Multer.File): Promise<{ url: string }> {
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
      throw new BadRequestException('Invalid document file type');
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      throw new BadRequestException('Document file too large. Maximum size is 50MB');
    }

    const fileName = `documents/${Date.now()}-${file.originalname}`;

    try {
      const uploadResult = await this.uploadToS3(file.buffer, fileName, file.mimetype);
      return { url: uploadResult.Location };
    } catch (error) {
      this.logger.error('Error uploading document to S3:', error);
      throw new InternalServerErrorException('Failed to upload document');
    }
  }

  async deleteImage(propertyId: string, imageUrl: string): Promise<void> {
    console.log('deleteImage service called');
    console.log('Property ID:', propertyId);
    console.log('Image URL:', imageUrl);
    
    const property = await this.propertyModel.findById(propertyId).exec();
    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    console.log('Current images in property:', property.images);
    const updatedImages = property.images.filter(img => img !== imageUrl);
    console.log('Updated images array:', updatedImages);
    
    await this.propertyModel.findByIdAndUpdate(propertyId, { images: updatedImages }).exec();
    console.log('Property updated in database');

    try {
      await this.deleteFileFromS3(imageUrl);
      console.log('Image file deleted from S3 successfully');
    } catch (error) {
      this.logger.error(`Failed to delete image ${imageUrl}:`, error);
      console.error('S3 deletion failed:', error);
    }
  }

  async deleteVideo(propertyId: string, videoUrl: string): Promise<void> {
    console.log('deleteVideo service called');
    console.log('Property ID:', propertyId);
    console.log('Video URL:', videoUrl);
    
    const property = await this.propertyModel.findById(propertyId).exec();
    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    console.log('Current videos in property:', property.videos);
    const updatedVideos = property.videos.filter(video => video !== videoUrl);
    console.log('Updated videos array:', updatedVideos);
    
    await this.propertyModel.findByIdAndUpdate(propertyId, { videos: updatedVideos }).exec();
    console.log('Property updated in database');

    try {
      await this.deleteFileFromS3(videoUrl);
      console.log('Video file deleted from S3 successfully');
    } catch (error) {
      this.logger.error(`Failed to delete video ${videoUrl}:`, error);
      console.error('S3 deletion failed:', error);
    }
  }

  async deleteDocument(propertyId: string, documentUrl: string): Promise<void> {
    console.log('deleteDocument service called');
    console.log('Property ID:', propertyId);
    console.log('Document URL:', documentUrl);
    
    const property = await this.propertyModel.findById(propertyId).exec();
    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    console.log('Current documents in property:', property.documents);
    const updatedDocuments = property.documents.filter(doc => doc !== documentUrl);
    console.log('Updated documents array:', updatedDocuments);
    
    await this.propertyModel.findByIdAndUpdate(propertyId, { documents: updatedDocuments }).exec();
    console.log('Property updated in database');

    try {
      await this.deleteFileFromS3(documentUrl);
      console.log('Document file deleted from S3 successfully');
    } catch (error) {
      this.logger.error(`Failed to delete document ${documentUrl}:`, error);
      console.error('S3 deletion failed:', error);
    }
  }

  private async uploadToS3(buffer: Buffer, key: string, contentType: string): Promise<AWS.S3.ManagedUpload.SendData> {
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
    } catch (error) {
      console.error('Failed to upload to S3:', error);
      throw error;
    }
  }

  private extractKeyFromUrl(fileUrl: string): string {
    try {
      console.log('Extracting key from URL:', fileUrl);
      const url = new URL(fileUrl);
      console.log('URL pathname:', url.pathname);
      const pathParts = url.pathname.split('/').filter(part => part !== ''); // Remove empty parts
      console.log('Path parts after filtering:', pathParts);
      const key = pathParts.join('/'); // Keep all parts including folder prefix
      console.log('Final extracted key:', key);
      return decodeURIComponent(key);
    } catch (error) {
      this.logger.error('Error extracting key from URL:', error);
      throw new BadRequestException('Invalid file URL');
    }
  }

  private async deleteFileFromS3(fileUrl: string): Promise<void> {
    try {
      const key = this.extractKeyFromUrl(fileUrl);
      const params = {
        Bucket: this.bucket,
        Key: key,
      };

      console.log('Deleting from S3:', JSON.stringify(params, null, 2));
      await this.s3.deleteObject(params).promise();
      console.log(`Successfully deleted from S3: ${key}`);
    } catch (error) {
      console.error('Failed to delete from S3:', error);
      throw error;
    }
  }
} 