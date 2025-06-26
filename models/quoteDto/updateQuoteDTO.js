import z from "zod/v4";

export const updateQuoteDTO = z.object({
    name: z.string().min(3).max(255).trim().optional(),
    lastname: z.string().min(3).max(255).trim().optional(),
    symptoms: z.string().max(500).trim().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "La fecha debe estar en formato YYYY-MM-DD"
    }).optional(),
    hour_start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 
    {
        message: "La hora debe estar en formato HH:MM:SS (24 horas)",
    }).optional(),
    hour_end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 
    {
        message: "La hora debe estar en formato HH:MM:SS (24 horas)",
    }).optional(),
    phone: z.string().max(11).trim().optional(),
    email: z.string("Email is rquired").max(255).trim().optional(),
}, 'Invalid data');