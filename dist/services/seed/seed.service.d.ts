import { UsersService } from '../../modules/users/users.service';
export declare class SeedService {
    private readonly usersService;
    constructor(usersService: UsersService);
    seed(): Promise<void>;
}
