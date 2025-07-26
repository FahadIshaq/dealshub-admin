import { Injectable } from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { UserRole } from '../../dto/create-user.dto';

@Injectable()
export class SeedService {
  constructor(private readonly usersService: UsersService) {}

  async seed() {
    try {
      console.log('🌱 Starting data seeding...');

      // Check if your user already exists
      const existingYourUser = await this.usersService.findByEmail(
        'fa20bcs017@gmail.com',
      );

      if (!existingYourUser) {
        await this.usersService.createUser({
          fullName: 'Fahad Ishaq',
          email: 'fa20bcs017@gmail.com',
          password: 'test123@',
          confirmPassword: 'test123@',
          roles: [UserRole.ADMINISTRATOR],
          isActive: true,
        });
        console.log('✅ Your user (fa20bcs017@gmail.com) created successfully');
      } else {
        console.log('ℹ️  Your user (fa20bcs017@gmail.com) already exists');
      }

      // Add delay between operations to reduce memory pressure
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Check if admin user already exists
      const existingUser = await this.usersService.findByEmail(
        'admin@investorlift.com',
      );

      if (!existingUser) {
        await this.usersService.createUser({
          fullName: 'Admin User',
          email: 'admin@investorlift.com',
          password: 'admin123',
          confirmPassword: 'admin123',
          roles: [UserRole.ADMINISTRATOR],
          isActive: true,
        });
        console.log('✅ Admin user created successfully');
      } else {
        console.log('ℹ️  Admin user already exists');
      }

      // Add delay between operations to reduce memory pressure
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Check if test user already exists
      const existingTestUser = await this.usersService.findByEmail(
        'test@investorlift.com',
      );

      if (!existingTestUser) {
        await this.usersService.createUser({
          fullName: 'Test User',
          email: 'test@investorlift.com',
          password: 'test123',
          confirmPassword: 'test123',
          roles: [UserRole.DEPOSITION_MANAGER],
          isActive: true,
        });
        console.log('✅ Test user created successfully');
      } else {
        console.log('ℹ️  Test user already exists');
      }

      console.log('🎉 Data seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error seeding data:', error);
    }
  }
} 