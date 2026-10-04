import { z } from 'zod';

export const categorySchema = z.object({
    name: z
        .string()
        .min(1, 'Category name is required')
        .max(100, 'Category name must be 100 characters or less')
        .trim(),
});

export const inventoryItemSchema = z.object({
    categoryId: z.uuid('Please select a valid category'),
    metalType: z.string().min(1, 'Metal type is required').trim(),
    metalPurity: z.string().trim().optional(),
    grossWeight: z.coerce.number().min(0, 'Gross weight cannot be negative'),
    netWeight: z.coerce.number().min(0, 'Net weight cannot be negative'),
});

export type CategoryPayload = z.infer<typeof categorySchema>;
export type InventoryItemPayload = z.infer<typeof inventoryItemSchema>;
