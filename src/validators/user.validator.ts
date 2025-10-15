import { z } from "zod";

export const UserSchema = {
    editProfile: {
        body: z.object({
            name: z.string().min(2).max(50).optional(),
            username: z
                .string()
                .min(3)
                .max(30)
                .regex(/^[a-zA-Z0-9_]+$/, {
                    message: "Username can only contain letters, numbers, and underscores",
                })
                .optional(),
        }),
    },

    checkUsername: {
        params: z.object({
            username: z
                .string()
                .min(3)
                .max(30)
                .regex(/^[a-zA-Z0-9_]+$/, {
                    message: "Username can only contain letters, numbers, and underscores",
                }),
        }),
    },
};
