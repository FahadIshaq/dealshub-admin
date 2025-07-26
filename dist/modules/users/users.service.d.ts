import { Model } from 'mongoose';
import { User, UserDocument } from '../../models/user.model';
import { CreateUserDto, UserRole } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
    deleteUser(id: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    getUsersByRole(role: UserRole): Promise<User[]>;
    toggleUserStatus(id: string): Promise<User | null>;
}
