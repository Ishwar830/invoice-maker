'use server';

import { savePurchaseInvoice } from '@/db/queries/purchase';
import { purchaseInvoiceSchema } from '@/lib/validations/purchase-invoice';

export async function savePurchaseInvoiceAction(data: unknown) {
    try {
        const payload = purchaseInvoiceSchema.parse(data);
        await savePurchaseInvoice(payload);
        return { success: true, message: 'Purchase Invoice saved successfully!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to save purchase invoice.' };
    }
}
