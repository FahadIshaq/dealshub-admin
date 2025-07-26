import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../models/user.model';

@Injectable()
export class MigrationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async migrateUsers() {
    try {
      console.log('🔄 Starting user migration...');

      // Find all users that have the old 'role' field but no 'roles' field
      const usersToMigrate = await this.userModel.find({
        role: { $exists: true },
        $or: [
          { roles: { $exists: false } },
          { roles: { $size: 0 } }
        ]
      });

      console.log(`📊 Found ${usersToMigrate.length} users to migrate`);

      for (const user of usersToMigrate) {
        // Create roles array from the old role field
        const roles = user.role ? [user.role] : ['deposition_manager'];
        
        // Update the user to have both fields
        await this.userModel.findByIdAndUpdate(user._id, {
          $set: { roles },
          $unset: { role: 1 } // Remove the old role field
        });

        console.log(`✅ Migrated user: ${user.email} - roles: [${roles.join(', ')}]`);
      }

      console.log('🎉 User migration completed successfully!');
    } catch (error) {
      console.error('❌ Error during migration:', error);
    }
  }
} 