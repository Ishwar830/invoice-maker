import { getSalesInvoiceWithCustomerAndItems } from '@/db/queries/sales';
import { getPurchaseInvoiceWithSupplierAndItems } from '@/db/queries/purchase';
import { notFound } from 'next/navigation';
import { InvoiceDetail } from './invoice-detail';
import { getSession, requireSession } from '@/lib/session';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ invoiceId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { invoiceId } = await params;
    const session = await getSession();
    if (!session) return { title: 'Invoice' };

    let invoice: any = await getSalesInvoiceWithCustomerAndItems(invoiceId, session.shopId);
    if (!invoice) {
        invoice = await getPurchaseInvoiceWithSupplierAndItems(invoiceId, session.shopId);
    }

    return {
        title: invoice ? `Invoice #${invoice.invoiceNumber} — ${session.shopName}` : 'Invoice',
    };
}

export default async function InvoiceDetailPage({ params }: Props) {
    const { invoiceId } = await params;
    const { shopId } = await requireSession();

    let invoice: any = await getSalesInvoiceWithCustomerAndItems(invoiceId, shopId);
    let type: 'sales' | 'purchase' = 'sales';

    if (!invoice) {
        invoice = await getPurchaseInvoiceWithSupplierAndItems(invoiceId, shopId);
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
        shop: invoice.shop ?? undefined,
    };

    return <InvoiceDetail invoice={formattedInvoice} type={type} />;
}
