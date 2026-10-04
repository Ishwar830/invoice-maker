import { SalesInvoiceForm } from '@/components/create-invoice/variants/sales-invoice-form';
import { PurchaseInvoiceForm } from '@/components/create-invoice/variants/purchase-invoice-form';
import { InvoiceProvider } from '@/components/create-invoice/invoice-context';
import { getNextSalesInvoiceNumber } from '@/db/queries/sales';
import { getNextPurchaseInvoiceNumber } from '@/db/queries/purchase';
import { getShopById } from '@/db/queries/shops';
import { requireSession } from '@/lib/session';
import type { InvoiceType, InvoiceFormData } from '@/lib/types';

export const metadata = {
    title: 'Create Invoice',
    description: 'Create a new sales or purchase invoice',
};

export default async function CreateInvoicePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { shopId } = await requireSession();
    const [shop, params] = await Promise.all([
        getShopById(shopId),
        searchParams,
    ]);
    const invoiceType: InvoiceType = params.type === 'purchase' ? 'purchase' : 'sales';

    const nextInvoiceNumber = invoiceType === 'sales'
        ? await getNextSalesInvoiceNumber(shopId)
        : await getNextPurchaseInvoiceNumber(shopId);

    const initialData: InvoiceFormData = {
        invoiceNumber: nextInvoiceNumber,
        date: new Date().toISOString().split('T')[0],
        customer: { name: '', phone: '', panGstNumber: '', address: '' },
        items: [{
            id: Math.random().toString(36).substring(2, 9),
            description: '',
            metalType: 'gold',
            metalPurity: '22K',
            grossWeight: 0,
            netWeight: 0,
            metalRate: 0,
            makingChargesPercent: 0,
        }],
        cgstPercent: invoiceType === 'sales' ? 1.5 : 0,
        sgstPercent: invoiceType === 'sales' ? 1.5 : 0,
        discountAmount: 0,
        notes: '',
    };

    return (
        <InvoiceProvider initialData={initialData} shop={shop}>
            {invoiceType === 'sales' ? (
                <SalesInvoiceForm />
            ) : (
                <PurchaseInvoiceForm />
            )}
        </InvoiceProvider>
    );
}
