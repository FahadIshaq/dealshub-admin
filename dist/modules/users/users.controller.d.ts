import { UsersService } from './users.service';
import { CreateUserDto, UserRole } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            roles: string[];
            isActive: boolean;
            isVerified: boolean;
            createdAt: string | null;
        };
    }>;
    getAllUsers(): Promise<{
        users: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            roles: string[];
            isActive: boolean;
            isVerified: boolean;
            createdAt: string | null;
        }[];
    }>;
    getUsersByRole(role: UserRole): Promise<{
        users: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            roles: string[];
            isActive: boolean;
            isVerified: boolean;
            createdAt: string | null;
        }[];
    }>;
    getUserById(id: string): Promise<{
        message: string;
        user?: undefined;
    } | {
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            roles: string[];
            isActive: boolean;
            isVerified: boolean;
            createdAt: string | null;
        };
        message?: undefined;
    }>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            roles: string[];
            isActive: boolean;
            isVerified: boolean;
            updatedAt: string | null;
        };
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    toggleUserStatus(id: string): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            roles: string[];
            isActive: boolean;
            isVerified: boolean;
            updatedAt: string | null;
        };
    }>;
}
