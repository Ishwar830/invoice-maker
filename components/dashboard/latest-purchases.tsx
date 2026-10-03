import { Card, CardContent } from '@/components/ui/card';
import { getRecentPurchaseInvoices } from '@/db/queries/purchase';
import { ReceiptTextIcon, CircleAlert } from 'lucide-react';
import { InvoicesTableView } from './invoices-table-view';

export async function LatestPurchasesTable() {
    let invoices: any[] = [];
    let errorMessage = null;

    try {
        invoices = await getRecentPurchaseInvoices();
    } catch (e) {
        console.error(e);
        errorMessage = 'Could not load latest purchases';
    }

    if (errorMessage) {
        return (
            <Card className="border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                <CardContent>
                    <div className="text-sm text-red-600 flex gap-2 items-center">
                        <CircleAlert className="size-5" />
                        {errorMessage}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (invoices.length === 0) {
        return (
            <Card className="border border-dashed border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                        <ReceiptTextIcon className="size-6" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                        No purchases yet
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                        Create your first purchase invoice to see it appear here.
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Normalize for InvoicesTableView
    const normalized = invoices.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        createdAt: inv.createdAt,
        customerName: inv.supplier?.name ?? 'Supplier',
        customerPhone: inv.supplier?.phone,
        grandTotal: inv.grandTotal
    }));

    return <InvoicesTableView invoices={normalized} />;
}
