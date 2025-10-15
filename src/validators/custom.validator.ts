import { z } from "zod";

export const CustomSchema = {
    dbOptionsSchema: z.object({
        limit: z.number().default(10),
        page: z.number().default(1),
        sortBy: z.string().default("createdAt"),
        sortOrder: z.enum(["", "asc"]).default(""),
    }),
};
