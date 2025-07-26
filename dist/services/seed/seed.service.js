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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../modules/users/users.service");
const create_user_dto_1 = require("../../dto/create-user.dto");
let SeedService = class SeedService {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async seed() {
        try {
            console.log('🌱 Starting data seeding...');
            const existingYourUser = await this.usersService.findByEmail('fa20bcs017@gmail.com');
            if (!existingYourUser) {
                await this.usersService.createUser({
                    fullName: 'Fahad Ishaq',
                    email: 'fa20bcs017@gmail.com',
                    password: 'test123@',
                    confirmPassword: 'test123@',
                    roles: [create_user_dto_1.UserRole.ADMINISTRATOR],
                    isActive: true,
                });
                console.log('✅ Your user (fa20bcs017@gmail.com) created successfully');
            }
            else {
                console.log('ℹ️  Your user (fa20bcs017@gmail.com) already exists');
            }
            await new Promise((resolve) => setTimeout(resolve, 200));
            const existingUser = await this.usersService.findByEmail('admin@investorlift.com');
            if (!existingUser) {
                await this.usersService.createUser({
                    fullName: 'Admin User',
                    email: 'admin@investorlift.com',
                    password: 'admin123',
                    confirmPassword: 'admin123',
                    roles: [create_user_dto_1.UserRole.ADMINISTRATOR],
                    isActive: true,
                });
                console.log('✅ Admin user created successfully');
            }
            else {
                console.log('ℹ️  Admin user already exists');
            }
            await new Promise((resolve) => setTimeout(resolve, 200));
            const existingTestUser = await this.usersService.findByEmail('test@investorlift.com');
            if (!existingTestUser) {
                await this.usersService.createUser({
                    fullName: 'Test User',
                    email: 'test@investorlift.com',
                    password: 'test123',
                    confirmPassword: 'test123',
                    roles: [create_user_dto_1.UserRole.DEPOSITION_MANAGER],
                    isActive: true,
                });
                console.log('✅ Test user created successfully');
            }
            else {
                console.log('ℹ️  Test user already exists');
            }
            console.log('🎉 Data seeding completed successfully!');
        }
        catch (error) {
            console.error('❌ Error seeding data:', error);
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], SeedService);
//# sourceMappingURL=seed.service.js.map