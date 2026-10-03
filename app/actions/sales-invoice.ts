'use server';

import { saveSalesInvoice } from '@/db/queries/sales';
import { salesInvoiceSchema } from '@/lib/validations/sales-invoice';

export async function saveSalesInvoiceAction(data: unknown) {
    try {
        const payload = salesInvoiceSchema.parse(data);
        await saveSalesInvoice(payload);
        return { success: true, message: 'Sales Invoice saved successfully!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to save sales invoice.' };
    }
}
