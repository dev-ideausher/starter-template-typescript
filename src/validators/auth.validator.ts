import Joi from "joi";

export const AuthSchema = {
    emailVerification: {
        body: Joi.object({
            email: Joi.string().email().required(),
            code: Joi.string().length(6).required(),
        }),
    },

    sendVerification: {
        body: Joi.object({
            email: Joi.string().email().required(),
        }),
    },

    googleOAuth: {
        body: Joi.object({
            idToken: Joi.string().required(),
        }),
    },

    appleOAuth: {
        body: Joi.object({
            idToken: Joi.string().required(),
            user: Joi.object({
                name: Joi.object({
                    firstName: Joi.string(),
                    lastName: Joi.string(),
                }).optional(),
            }).optional(),
        }),
    },

    refreshTokens: {
        body: Joi.object({
            refreshToken: Joi.string().required(),
        }),
    },
};
