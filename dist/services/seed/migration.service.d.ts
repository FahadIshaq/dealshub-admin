import { Model } from 'mongoose';
import { UserDocument } from '../../models/user.model';
export declare class MigrationService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    migrateUsers(): Promise<void>;
}
