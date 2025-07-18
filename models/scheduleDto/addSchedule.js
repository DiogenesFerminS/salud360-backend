import z from "zod/v4";

const slotHour = z.object({
    office_id: z.string().trim().max(36),
    day: z.number().max(6),
    hour: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { message: "Formato de hora inválido (HH:MM)" })
});

export const schedule = z.array(slotHour).nonempty().max(64);