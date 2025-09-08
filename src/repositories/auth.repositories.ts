import { IUser, User } from "../models";
import { FilterQuery, UpdateQuery } from "mongoose";

export class UserRepository {
    // Find a single user
    static async findOne(filter: FilterQuery<IUser>): Promise<IUser | null> {
        return User.findOne(filter);
    }

    // Find and update a single user
    static async findOneAndUpdate(
        filter: FilterQuery<IUser>,
        update: UpdateQuery<IUser>,
        options: { new?: boolean } = { new: true }
    ): Promise<IUser | null> {
        return User.findOneAndUpdate(filter, update, options);
    }

    // Create a new user
    static async create(data: Partial<IUser>): Promise<IUser> {
        const user = new User(data);
        return user.save();
    }

    // Save an existing user instance
    static async save(user: IUser): Promise<IUser> {
        return user.save();
    }
}
