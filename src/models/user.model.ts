import { Schema, model, Document } from "mongoose";
import { Avatar } from "../types";

export interface IUser extends Document {
    email: string;
    name?: string;
    username?: string;
    avatar?: Avatar;
    isEmailVerified: boolean;
    isProfileComplete: boolean;
    providers: {
        google?: {
            id: string;
            email: string;
        };
        apple?: {
            id: string;
            email: string;
        };
    };
    firebaseUid: string;
    firebaseSignInProvider: string;
    createdAt: Date;
    updatedAt: Date;
    __t: string;
}

export interface IClient extends IUser {
    isBlocked: boolean;
    isDeleted: boolean;
    preferences: {
        notificationEnabled: boolean;
        locationShared: boolean;
    };
}

export interface IAdmin extends IUser {
    permissions: string[];
    superAdmin: boolean;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            trim: true,
        },
        username: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        avatar: {
            id: { type: String },
            url: { type: String },
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isProfileComplete: {
            type: Boolean,
            default: false,
        },
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
        },
        firebaseSignInProvider: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const clientSchema = new Schema<IClient>(
    {
        isBlocked: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            // to soft delete user. if(isDeleted = true), then user is deleted.
            type: Boolean,
            default: false,
        },
        preferences: {
            type: {
                notificationEnabled: Boolean,
                locationShared: Boolean,
            },
            default: {
                notificationEnabled: false,
                locationShared: false,
            },
        },
    },
    { timestamps: true }
);

const adminSchema = new Schema<IAdmin>(
    {
        permissions: {
            type: [String],
            default: [],
        },
        superAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Index for username uniqueness
userSchema.index({ username: 1 }, { unique: true, sparse: true });

export const User = model<IUser>("User", userSchema);
export const Client = User.discriminator<IClient>("Client", clientSchema);
export const Admin = User.discriminator<IAdmin>("Admin", adminSchema);
