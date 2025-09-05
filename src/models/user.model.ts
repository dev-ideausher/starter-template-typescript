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
    createdAt: Date;
    updatedAt: Date;
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
        providers: {
            google: {
                id: String,
                email: String,
            },
            apple: {
                id: String,
                email: String,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Index for username uniqueness
userSchema.index({ username: 1 }, { unique: true, sparse: true });

export const User = model<IUser>("User", userSchema);
