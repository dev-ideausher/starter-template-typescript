import { Types } from "mongoose";
import { Service } from "typedi";
import { IAdmin, Admin } from "@models";
import { BaseRepository } from "./base.repository.js";

@Service()
export class AdminRepository extends BaseRepository<IAdmin> {
    constructor() {
        super(Admin);
    }

    async getUserByFirebaseUId(id: Types.ObjectId | string): Promise<IAdmin | null> {
        return this.findOne({ firebaseUid: id });
    }
}