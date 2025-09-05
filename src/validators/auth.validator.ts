import Joi from "joi";

export const AuthSchemas = {
    emailVerification: Joi.object({
        email: Joi.string().email().required(),
        code: Joi.string().length(6).required(),
    }),

    sendVerification: Joi.object({
        email: Joi.string().email().required(),
    }),

    googleOAuth: Joi.object({
        idToken: Joi.string().required(),
    }),

    appleOAuth: Joi.object({
        idToken: Joi.string().required(),
        user: Joi.object({
            name: Joi.object({
                firstName: Joi.string(),
                lastName: Joi.string(),
            }).optional(),
        }).optional(),
    }),

    refreshTokens: Joi.object({
        refreshToken: Joi.string().required(),
    }),
};
