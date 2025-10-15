import { z } from "zod";

export const AuthSchema = {
    register: {
        body: z.object({
            name: z
                .string()
                .min(2, { message: "Name must be at least 2 characters long" })
                .max(50, { message: "Name must be at most 50 characters long" }),

            username: z
                .string()
                .min(3, { message: "Username must be at least 3 characters long" })
                .max(30, { message: "Username must be at most 30 characters long" })
                .regex(/^[a-zA-Z0-9_]+$/, {
                    message: "Username can only contain letters, numbers, and underscores",
                }),
        }),
    },
};
