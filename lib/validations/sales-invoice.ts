import { z } from 'zod';

const itemSchema = z.object({
    description: z.string().min(2, 'Description must be at least 2 characters'),
    metalType: z.string().min(1, 'Metal type is required'),
    metalPurity: z.string().optional(),
    grossWeight: z.coerce.number().min(0),
    netWeight: z.coerce.number().min(0),
    metalRate: z.coerce.number().min(0),
    makingChargesPercent: z.coerce.number().min(0),
    makingChargesAmount: z.coerce.number().min(0),
    itemTotal: z.coerce.number().min(0),
    /** ID of the linked inventory item (if this row was populated from inventory) */
    inventoryItemId: z.uuid().optional(),
});

const customerSchema = z.object({
    name: z.string().min(2, 'Customer name is required'),
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

export const salesInvoiceSchema = z.object({
    invoiceNumber: z.coerce.number(),
    cgstPercent: z.coerce.number().min(0),
    cgstAmount: z.coerce.number().min(0),
    sgstPercent: z.coerce.number().min(0),
    sgstAmount: z.coerce.number().min(0),
    subTotal: z.coerce.number().min(0),
    grandTotal: z.coerce.number().min(0),
    discountAmount: z.coerce.number().min(0),
    notes: z.string().optional(),
    createdAt: z.coerce.date(),
    customer: customerSchema,
    items: z.array(itemSchema).min(1, 'Invoice must contain at least one item'),
});

export type SalesInvoicePayload = z.infer<typeof salesInvoiceSchema>;
export type SalesInvoiceItem = z.infer<typeof itemSchema>;
