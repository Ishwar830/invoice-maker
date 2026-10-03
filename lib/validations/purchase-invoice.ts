import { z } from 'zod';

const purchaseItemSchema = z.object({
    description: z.string().min(2, 'Description must be at least 2 characters'),
    metalType: z.string().min(1, 'Metal type is required'),
    metalPurity: z.string().optional(),
    grossWeight: z.coerce.number().min(0),
    netWeight: z.coerce.number().min(0),
    metalRate: z.coerce.number().min(0),
    itemTotal: z.coerce.number().min(0)
});

const supplierSchema = z.object({
    name: z.string().min(2, 'Supplier name is required'),
    phone: z
        .string()
        .regex(/^\d{10}$/, 'Phone must be 10 digits')
        .optional()
        .or(z.literal('')),
    address: z.string().optional(),
    gstNumber: z
        .string()
        .regex(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            'Invalid GST format'
        )
        .optional()
        .or(z.literal('')),
});

export const purchaseInvoiceSchema = z.object({
    invoiceNumber: z.coerce.number(),
    subTotal: z.coerce.number().min(0),
    grandTotal: z.coerce.number().min(0),
    notes: z.string().optional(),
    createdAt: z.coerce.date(),
    customer: supplierSchema, // Keyed as 'customer' in form state for simplicity
    items: z.array(purchaseItemSchema).min(1, 'Invoice must contain at least one item'),
});

export type PurchaseInvoicePayload = z.infer<typeof purchaseInvoiceSchema>;
export type PurchaseInvoiceItem = z.infer<typeof purchaseItemSchema>;
