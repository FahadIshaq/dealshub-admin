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

      const batchSize = 50; // Process users in smaller batches
      let skip = 0;
      let hasMore = true;
      let totalMigrated = 0;

      while (hasMore) {
        // Find users in batches to avoid memory issues
        const usersToMigrate = await this.userModel.find({
          role: { $exists: true },
          $or: [
            { roles: { $exists: false } },
            { roles: { $size: 0 } }
          ]
        })
        .limit(batchSize)
        .skip(skip)
        .lean(); // Use lean() to get plain objects instead of full documents

        if (usersToMigrate.length === 0) {
          hasMore = false;
          break;
        }

        console.log(`📊 Processing batch of ${usersToMigrate.length} users (skip: ${skip})`);

        // Process users in parallel with limited concurrency
        const updatePromises = usersToMigrate.map(async (user) => {
          try {
            // Create roles array from the old role field
            const roles = user.role ? [user.role] : ['deposition_manager'];
            
            // Update the user to have both fields
            await this.userModel.findByIdAndUpdate(user._id, {
              $set: { roles },
              $unset: { role: 1 } // Remove the old role field
            });

            console.log(`✅ Migrated user: ${user.email} - roles: [${roles.join(', ')}]`);
            return true;
          } catch (error) {
            console.error(`❌ Failed to migrate user ${user.email}:`, error);
            return false;
          }
        });

        const results = await Promise.all(updatePromises);
        totalMigrated += results.filter(Boolean).length;

        skip += batchSize;
        
        // Add a small delay to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`🎉 User migration completed successfully! Total migrated: ${totalMigrated}`);
    } catch (error) {
      console.error('❌ Error during migration:', error);
    }
  }
} 