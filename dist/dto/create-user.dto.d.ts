export declare enum UserRole {
    DEPOSITION_MANAGER = "deposition_manager",
    ACQUISITION_MANAGER = "acquisition_manager",
    ADMINISTRATOR = "administrator"
}
export declare class CreateUserDto {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    roles: UserRole[];
    isActive?: boolean;
}
