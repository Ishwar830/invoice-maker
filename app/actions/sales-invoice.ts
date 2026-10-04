'use server';

import { redirect } from 'next/navigation';
import { saveSalesInvoice } from '@/db/queries/sales';
import { salesInvoiceSchema } from '@/lib/validations/sales-invoice';
import { getSession } from '@/lib/session';

export async function saveSalesInvoiceAction(data: unknown) {
    const session = await getSession();
    if (!session) redirect('/login');

    try {
        const payload = salesInvoiceSchema.parse(data);
        await saveSalesInvoice(payload, session.shopId);
        return { success: true, message: 'Sales Invoice saved successfully!' };
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : 'Failed to save sales invoice.';
        return { success: false, message };
    }
}
