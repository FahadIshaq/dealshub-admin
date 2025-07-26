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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const user_model_1 = require("../../models/user.model");
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async createUser(createUserDto) {
        if (createUserDto.password !== createUserDto.confirmPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
        }
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email already exists');
        }
        const nameParts = createUserDto.fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = new this.userModel({
            email: createUserDto.email,
            password: hashedPassword,
            firstName,
            lastName,
            roles: createUserDto.roles,
            isActive: createUserDto.isActive ?? true,
            isVerified: false,
        });
        return user.save();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async updateUser(id, updateUserDto) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateUserDto.password || updateUserDto.confirmPassword) {
            if (!updateUserDto.password || !updateUserDto.confirmPassword) {
                throw new common_1.BadRequestException('Both password and confirmPassword must be provided when updating password');
            }
            if (updateUserDto.password.length < 6) {
                throw new common_1.BadRequestException('Password must be at least 6 characters long');
            }
            if (updateUserDto.confirmPassword.length < 6) {
                throw new common_1.BadRequestException('Confirm password must be at least 6 characters long');
            }
            if (updateUserDto.password !== updateUserDto.confirmPassword) {
                throw new common_1.BadRequestException('Passwords do not match');
            }
        }
        const updateData = {};
        if (updateUserDto.fullName) {
            const nameParts = updateUserDto.fullName.split(' ');
            updateData.firstName = nameParts[0] || '';
            updateData.lastName = nameParts.slice(1).join(' ') || '';
        }
        if (updateUserDto.email) {
            const existingUser = await this.findByEmail(updateUserDto.email);
            if (existingUser && existingUser._id?.toString() !== id) {
                throw new common_1.BadRequestException('Email already in use');
            }
            updateData.email = updateUserDto.email;
        }
        if (updateUserDto.password) {
            updateData.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        if (updateUserDto.roles) {
            updateData.roles = updateUserDto.roles;
        }
        if (updateUserDto.isActive !== undefined) {
            updateData.isActive = updateUserDto.isActive;
        }
        return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
    async deleteUser(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.userModel.findByIdAndDelete(id).exec();
    }
    async getAllUsers() {
        return this.userModel.find().select('-password').exec();
    }
    async getUsersByRole(role) {
        return this.userModel.find({ roles: role }).select('-password').exec();
    }
    async toggleUserStatus(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.userModel.findByIdAndUpdate(id, { isActive: !user.isActive }, { new: true }).select('-password').exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map