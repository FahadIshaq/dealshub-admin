import { UserRole } from './create-user.dto';
export declare class UpdateUserDto {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    roles?: UserRole[];
    isActive?: boolean;
}
