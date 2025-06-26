import z from 'zod/v4';

export const registerDto = z.object({
    name: z.string("Name is required").min(3).max(100),
    lastname: z.string("Lastname is required").min(3).max(100),
    email: z.string("Email is rquired").max(255).trim(),
    phone: z.string().max(15),
    password:z.string().min(6).max(255).trim(),
}, 'Invalid Data');