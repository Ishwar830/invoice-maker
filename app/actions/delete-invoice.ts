'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { deleteSalesInvoice } from '@/db/queries/sales';
import { deletePurchaseInvoice } from '@/db/queries/purchase';

export async function deleteInvoiceAction(
    id: string,
    type: 'sales' | 'purchase'
) {
    try {
        if (type === 'sales') {
            await deleteSalesInvoice(id);
        } else {
            await deletePurchaseInvoice(id);
        }
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : 'Failed to delete invoice.';
        return { success: false, message };
    }

    revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard');
    redirect('/dashboard/invoices');
}
