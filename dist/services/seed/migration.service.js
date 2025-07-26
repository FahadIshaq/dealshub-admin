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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_model_1 = require("../../models/user.model");
let MigrationService = class MigrationService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async migrateUsers() {
        try {
            console.log('🔄 Starting user migration...');
            const batchSize = 50;
            let skip = 0;
            let hasMore = true;
            let totalMigrated = 0;
            while (hasMore) {
                const usersToMigrate = await this.userModel.find({
                    role: { $exists: true },
                    $or: [
                        { roles: { $exists: false } },
                        { roles: { $size: 0 } }
                    ]
                })
                    .limit(batchSize)
                    .skip(skip)
                    .lean();
                if (usersToMigrate.length === 0) {
                    hasMore = false;
                    break;
                }
                console.log(`📊 Processing batch of ${usersToMigrate.length} users (skip: ${skip})`);
                const updatePromises = usersToMigrate.map(async (user) => {
                    try {
                        const roles = user.role ? [user.role] : ['deposition_manager'];
                        await this.userModel.findByIdAndUpdate(user._id, {
                            $set: { roles },
                            $unset: { role: 1 }
                        });
                        console.log(`✅ Migrated user: ${user.email} - roles: [${roles.join(', ')}]`);
                        return true;
                    }
                    catch (error) {
                        console.error(`❌ Failed to migrate user ${user.email}:`, error);
                        return false;
                    }
                });
                const results = await Promise.all(updatePromises);
                totalMigrated += results.filter(Boolean).length;
                skip += batchSize;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            console.log(`🎉 User migration completed successfully! Total migrated: ${totalMigrated}`);
        }
        catch (error) {
            console.error('❌ Error during migration:', error);
        }
    }
};
exports.MigrationService = MigrationService;
exports.MigrationService = MigrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MigrationService);
//# sourceMappingURL=migration.service.js.map