import Joi from "joi";

export const CustomSchema = {
    dbOptionsSchema: {
        limit: Joi.number().default(10),
        page: Joi.number().default(1),
        sortBy: Joi.string().default("createdAt"),
        sortOrder: Joi.string().valid("", "asc").default(""),
    },
};
