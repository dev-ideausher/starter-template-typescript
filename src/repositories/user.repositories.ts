import { Admin, Client, IAdmin, IClient, IUser, User } from "#models";
import { FilterQuery, UpdateQuery } from "mongoose";

export class UserRepository {
    static async findOne(filter: FilterQuery<IUser>): Promise<IUser | null> {
        return User.findOne(filter);
    }

    static async findOneAndUpdate(
        filter: FilterQuery<IUser>,
        update: UpdateQuery<IUser>,
        options: { new?: boolean } = { new: true }
    ): Promise<IUser | null> {
        return User.findOneAndUpdate(filter, update, options);
    }

    static async findById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }

    static async findByIdAndUpdate(
        id: string,
        update: UpdateQuery<IUser>,
        options: { new?: boolean } = { new: true }
    ): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, update, options);
    }

    static async create(data: Partial<IUser>): Promise<IUser> {
        const user = new User(data);
        return user.save();
    }

    static async getUserByFirebaseUId(id: string): Promise<IUser | null> {
        return User.findOne({ firebaseUid: id });
    }

    static async createAdmin(user: Partial<IUser>): Promise<IAdmin> {
        return Admin.create(user);
    }

    static async createClient(user: Partial<IUser>): Promise<IClient> {
        return Client.create(user);
    }
}
