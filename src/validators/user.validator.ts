import Joi from "joi";

export const UserSchema = {
    editProfile: {
        body: Joi.object({
            name: Joi.string().min(2).max(50),
            username: Joi.string()
                .min(3)
                .max(30)
                .pattern(/^[a-zA-Z0-9_]+$/)
                .messages({
                    "string.pattern.base":
                        "Username can only contain letters, numbers, and underscores",
                }),
        }),
    },
    checkUsername: {
        params: Joi.object({
            username: Joi.string()
                .required()
                .min(3)
                .max(30)
                .pattern(/^[a-zA-Z0-9_]+$/)
                .messages({
                    "string.pattern.base":
                        "Username can only contain letters, numbers, and underscores",
                }),
        }),
    },
};
