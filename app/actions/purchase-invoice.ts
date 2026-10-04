'use server';

import { redirect } from 'next/navigation';
import { savePurchaseInvoice } from '@/db/queries/purchase';
import { purchaseInvoiceSchema } from '@/lib/validations/purchase-invoice';
import { getSession } from '@/lib/session';

export async function savePurchaseInvoiceAction(data: unknown) {
    const session = await getSession();
    if (!session) redirect('/login');

    try {
        const payload = purchaseInvoiceSchema.parse(data);
        await savePurchaseInvoice(payload, session.shopId);
        return { success: true, message: 'Purchase Invoice saved successfully!' };
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : 'Failed to save purchase invoice.';
        return { success: false, message };
    }
}
