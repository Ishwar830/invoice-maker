import { getSalesInvoiceWithCustomerAndItems } from '@/db/queries/sales';
import { getPurchaseInvoiceWithSupplierAndItems } from '@/db/queries/purchase';
import { notFound } from 'next/navigation';
import { InvoiceDetail } from './invoice-detail';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ invoiceId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { invoiceId } = await params;

    let invoice: any = await getSalesInvoiceWithCustomerAndItems(invoiceId);
    if (!invoice) {
        invoice = await getPurchaseInvoiceWithSupplierAndItems(invoiceId);
    }

    return {
        title: `Invoice#${invoice?.invoiceNumber ?? ""} — Krishna Jewellers`,
    };
}

export default async function InvoiceDetailPage({ params }: Props) {
    const { invoiceId } = await params;

    let invoice: any = await getSalesInvoiceWithCustomerAndItems(invoiceId);
    let type: 'sales' | 'purchase' = 'sales';

    if (!invoice) {
        invoice = await getPurchaseInvoiceWithSupplierAndItems(invoiceId);
        type = 'purchase';
    }

    if (!invoice) {
        notFound();
    }

    const formattedInvoice = {
        ...invoice,
        createdAt: new Date(invoice.createdAt),
        customer: type === 'sales' ? {
            name: invoice.customer?.name ?? '',
            phone: invoice.customer?.phone ?? undefined,
            address: invoice.customer?.address ?? undefined,
            gstNumber: invoice.customer?.gstNumber ?? undefined,
        } : {
            name: invoice.supplier?.name ?? '',
            phone: invoice.supplier?.phone ?? undefined,
            address: invoice.supplier?.address ?? undefined,
            gstNumber: invoice.supplier?.gstNumber ?? undefined,
        },
        items: invoice.items.map((item: any) => ({
            ...item,
            metalPurity: item.metalPurity ?? undefined,
        })),
        notes: invoice.notes ?? undefined,
    };

    return <InvoiceDetail invoice={formattedInvoice} type={type} />;
}
