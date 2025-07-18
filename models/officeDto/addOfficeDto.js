import z from "zod/v4";

export const addOfficeDto = z.object({
    name: z.string("Name invalid type or not sent").min(3).max(100).trim(),
    office_address: z.string("Address invalid type or not sent").min(3).max(1000).trim(),
    city:z.string("City invalid type or not sent").min(3).max(100).trim(),
    phone:z.string("Phone invalid type or not sent").max(15).trim(),
}, 'Invalid Data');