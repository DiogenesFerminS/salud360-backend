import z from "zod/v4";

export const addQuoteDto = z.object({
    name: z.string().min(3).max(255).trim(),
    lastname: z.string().min(3).max(255).trim(),
    symptoms: z.string().max(500).trim(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "La fecha debe estar en formato YYYY-MM-DD"
    }),
    hour_start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 
    {
        message: "La hora debe estar en formato HH:MM:SS (24 horas)",
    }),
    hour_end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 
    {
        message: "La hora debe estar en formato HH:MM:SS (24 horas)",
    }),
    phone: z.string().max(11).trim(),
    email: z.string("Email is rquired").max(255).trim(),
}, 'Invalid data');