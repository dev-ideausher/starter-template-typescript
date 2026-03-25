import { Types } from "mongoose";
import { Service } from "typedi";
import { IUser, User } from "@models";
import { BaseRepository } from "./base.repository.js";

@Service()
export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(User);
    }

    async getUserByFirebaseUId(id: Types.ObjectId | string): Promise<IUser | null> {
        return this.findOne({ firebaseUid: id });
    }
}