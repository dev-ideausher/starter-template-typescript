import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from "mongoose";
import { PaginationOptions, PaginatedResult, PopulateParam } from "@types";

export class BaseRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    async create(data: Partial<T>): Promise<T> {
        const doc = new this.model(data);
        return await doc.save() as T;
    }

    async findOne(filter: FilterQuery<T>, populate?: PopulateParam): Promise<T | null> {
        let query = this.model.findOne(filter);
        if (populate) query = query.populate(populate as any);
        return await query;
    }

    async findById(id: string | Types.ObjectId, populate?: PopulateParam): Promise<T | null> {
        let query = this.model.findById(id);
        if (populate) query = query.populate(populate as any);
        return await query;
    }

    async findOneAndUpdate(
        filter: FilterQuery<T>,
        update: UpdateQuery<T>,
        options: QueryOptions = { new: true },
        populate?: PopulateParam,
    ): Promise<T | null> {
        let query = this.model.findOneAndUpdate(filter, update, { new: true, ...options });
        if (populate) query = query.populate(populate as any);
        return await query;
    }

    async findByIdAndUpdate(
        id: string | Types.ObjectId,
        update: UpdateQuery<T>,
        options: QueryOptions = { new: true },
        populate?: PopulateParam,
    ): Promise<T | null> {
        let query = this.model.findByIdAndUpdate(id, update, { new: true, ...options });
        if (populate) query = query.populate(populate as any);
        return await query;
    }

    async deleteOne(filter: FilterQuery<T>): Promise<{ deletedCount?: number }> {
        return await this.model.deleteOne(filter);
    }

    async find(filter: FilterQuery<T>, options: PaginationOptions = {}): Promise<T[]> {
        const { page = 1, limit = 20, sort, populate } = options;
        const safePage = Math.max(page, 1);
        const safeLimit = Math.min(Math.max(limit, 1), 100);

        let query = this.model.find(filter).skip((safePage - 1) * safeLimit).limit(safeLimit);
        if (sort) query = query.sort(sort);
        if (populate) query = query.populate(populate as any);
        return await query;
    }

    async findPaginated(filter: FilterQuery<T>, options: PaginationOptions = {}): Promise<PaginatedResult<T>> {
        const { page = 1, limit = 20, sort, populate } = options;
        const safePage = Math.max(page, 1);
        const safeLimit = Math.min(Math.max(limit, 1), 100);
        const skip = (safePage - 1) * safeLimit;

        let dataQuery = this.model.find(filter).skip(skip).limit(safeLimit);
        if (sort) dataQuery = dataQuery.sort(sort);
        if (populate) dataQuery = dataQuery.populate(populate as any);
        dataQuery.lean();

        const [data, total] = await Promise.all([
            dataQuery,
            this.model.countDocuments(filter),
        ]);

        return {
            data,
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: total === 0 ? 0 : Math.ceil(total / safeLimit),
        };
    }
}