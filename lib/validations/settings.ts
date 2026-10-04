import { z } from 'zod';

export const shopSettingsSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Shop name is required')
        .max(200, 'Shop name must be at most 200 characters'),
    ownerName: z
        .string()
        .trim()
        .max(200, 'Owner name must be at most 200 characters')
        .optional()
        .or(z.literal('')),
    phone: z
        .string()
        .trim()
        .max(50, 'Phone must be at most 50 characters')
        .optional()
        .or(z.literal('')),
    gstNumber: z
        .string()
        .trim()
        .max(20, 'GST number must be at most 20 characters')
        .optional()
        .or(z.literal('')),
    address: z
        .string()
        .trim()
        .max(500, 'Address must be at most 500 characters')
        .optional()
        .or(z.literal('')),
});

export const bankSettingsSchema = z.object({
    bankName: z
        .string()
        .trim()
        .max(200, 'Bank name must be at most 200 characters')
        .optional()
        .or(z.literal('')),
    bankBranch: z
        .string()
        .trim()
        .max(200, 'Bank branch must be at most 200 characters')
        .optional()
        .or(z.literal('')),
    bankIfsc: z
        .string()
        .trim()
        .max(50, 'IFSC code must be at most 50 characters')
        .optional()
        .or(z.literal('')),
    bankAccountNumber: z
        .string()
        .trim()
        .max(50, 'Account number must be at most 50 characters')
        .optional()
        .or(z.literal('')),
});

export type ShopSettingsInput = z.infer<typeof shopSettingsSchema>;
export type BankSettingsInput = z.infer<typeof bankSettingsSchema>;
