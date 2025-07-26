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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("../../dto/create-user.dto");
const update_user_dto_1 = require("../../dto/update-user.dto");
const jwt_guard_1 = require("../../middleware/jwt.guard");
const roles_guard_1 = require("../../middleware/roles.guard");
const roles_decorator_1 = require("../../middleware/roles.decorator");
const helpers_1 = require("../../utils/helpers");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createUser(createUserDto) {
        const user = await this.usersService.createUser(createUserDto);
        return {
            message: 'User created successfully. Verification email sent.',
            user: {
                id: user._id,
                email: user.email,
                fullName: `${user.firstName} ${user.lastName}`,
                roles: user.roles,
                isActive: user.isActive,
                isVerified: user.isVerified,
                createdAt: (0, helpers_1.formatDateForAPI)(user.createdAt),
            },
        };
    }
    async getAllUsers() {
        const users = await this.usersService.getAllUsers();
        return {
            users: users.map(user => ({
                id: user._id,
                email: user.email,
                fullName: `${user.firstName} ${user.lastName}`,
                roles: user.roles,
                isActive: user.isActive,
                isVerified: user.isVerified,
                createdAt: (0, helpers_1.formatDateForAPI)(user.createdAt),
            })),
        };
    }
    async getUsersByRole(role) {
        const users = await this.usersService.getUsersByRole(role);
        return {
            users: users.map(user => ({
                id: user._id,
                email: user.email,
                fullName: `${user.firstName} ${user.lastName}`,
                roles: user.roles,
                isActive: user.isActive,
                isVerified: user.isVerified,
                createdAt: (0, helpers_1.formatDateForAPI)(user.createdAt),
            })),
        };
    }
    async getUserById(id) {
        const user = await this.usersService.findById(id);
        if (!user) {
            return { message: 'User not found' };
        }
        return {
            user: {
                id: user._id,
                email: user.email,
                fullName: `${user.firstName} ${user.lastName}`,
                roles: user.roles,
                isActive: user.isActive,
                isVerified: user.isVerified,
                createdAt: (0, helpers_1.formatDateForAPI)(user.createdAt),
            },
        };
    }
    async updateUser(id, updateUserDto) {
        const user = await this.usersService.updateUser(id, updateUserDto);
        if (!user) {
            return { message: 'User not found' };
        }
        return {
            message: 'User updated successfully',
            user: {
                id: user._id,
                email: user.email,
                fullName: `${user.firstName} ${user.lastName}`,
                roles: user.roles,
                isActive: user.isActive,
                isVerified: user.isVerified,
                updatedAt: (0, helpers_1.formatDateForAPI)(user.updatedAt),
            },
        };
    }
    async deleteUser(id) {
        await this.usersService.deleteUser(id);
        return { message: 'User deleted successfully' };
    }
    async toggleUserStatus(id) {
        const user = await this.usersService.toggleUserStatus(id);
        if (!user) {
            return { message: 'User not found' };
        }
        return {
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            user: {
                id: user._id,
                email: user.email,
                fullName: `${user.firstName} ${user.lastName}`,
                roles: user.roles,
                isActive: user.isActive,
                isVerified: user.isVerified,
                updatedAt: (0, helpers_1.formatDateForAPI)(user.updatedAt),
            },
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('administrator'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('administrator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('role/:role'),
    (0, roles_decorator_1.Roles)('administrator'),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsersByRole", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('administrator'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('administrator'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('administrator'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Put)(':id/toggle-status'),
    (0, roles_decorator_1.Roles)('administrator'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "toggleUserStatus", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map