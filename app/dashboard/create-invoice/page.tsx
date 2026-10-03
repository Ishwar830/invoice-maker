import { SalesInvoiceForm } from '@/components/create-invoice/variants/sales-invoice-form';
import { PurchaseInvoiceForm } from '@/components/create-invoice/variants/purchase-invoice-form';
import { InvoiceProvider } from '@/components/create-invoice/invoice-context';
import { getNextSalesInvoiceNumber } from '@/db/queries/sales';
import { getNextPurchaseInvoiceNumber } from '@/db/queries/purchase';
import type { InvoiceType, InvoiceFormData } from '@/lib/types';

export const metadata = {
    title: 'Create Invoice — Krishna Jewellers',
    description: 'Create a new invoice for Krishna Jewellers',
};

export default async function CreateInvoicePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const invoiceType: InvoiceType = params.type === 'purchase' ? 'purchase' : 'sales';

    const nextInvoiceNumber = invoiceType === 'sales'
        ? await getNextSalesInvoiceNumber()
        : await getNextPurchaseInvoiceNumber();

    const initialData: InvoiceFormData = {
        invoiceNumber: nextInvoiceNumber,
        date: new Date().toISOString().split('T')[0],
        customer: { name: '', phone: '', gstNumber: '', address: '' },
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
        <InvoiceProvider initialData={initialData}>
            {invoiceType === 'sales' ? (
                <SalesInvoiceForm />
            ) : (
                <PurchaseInvoiceForm />
            )}
        </InvoiceProvider>
    );
}
