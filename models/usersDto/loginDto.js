import z from "zod/v4"

export const loginDto = z.object({
    email: z.string().max(255).trim(),
    password: z.string().max(255).trim(),
}, 'Invalid Data');