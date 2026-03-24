import { Types } from "mongoose";
import { Service } from "typedi";
import { IClient, Client } from "@models";
import { BaseRepository } from "./base.repository.js";

@Service()
export class ClientRepository extends BaseRepository<IClient> {
    constructor() {
        super(Client);
    }

    async getUserByFirebaseUId(id: Types.ObjectId | string): Promise<IClient | null> {
        return this.findOne({ firebaseUid: id });
    }
}