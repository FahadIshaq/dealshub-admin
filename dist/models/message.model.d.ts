import { Document, Types } from 'mongoose';
export type MessageDocument = Message & Document;
export declare class Message {
    _id: Types.ObjectId;
    senderId: Types.ObjectId;
    senderType: 'investor' | 'wholesaler';
    recipientId: Types.ObjectId;
    recipientType: 'investor' | 'wholesaler';
    subject: string;
    message: string;
    propertyId: Types.ObjectId;
    isRead: boolean;
    readAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message, any> & Message & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>, {}> & import("mongoose").FlatRecord<Message> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
