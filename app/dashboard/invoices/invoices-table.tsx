import { getFilteredSalesInvoices } from '@/db/queries/sales';
import { getFilteredPurchaseInvoices } from '@/db/queries/purchase';
import { ReceiptTextIcon } from 'lucide-react';
import { InvoicesTableView } from '@/components/dashboard/invoices-table-view';

export default async function InvoicesTable({
    query,
    currentPage,
    type = 'sales',
}: {
    query: string;
    currentPage: number;
    type?: string;
}) {
    const invoices = type === 'sales'
        ? await getFilteredSalesInvoices(query, currentPage)
        : await getFilteredPurchaseInvoices(query, currentPage);

    if (invoices.length === 0) {
        return <EmptyState query={query} type={type} />;
    }

    return <InvoicesTableView invoices={invoices} />;
}

function EmptyState({ query, type }: { query: string; type: string }) {
    const hasSearchQuery = query.length > 0;
    const isSales = type === 'sales';
    return (
        <div className="rounded-xl border border-dashed border-border/60 bg-card">
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted/50">
                    <ReceiptTextIcon className="size-7 text-muted-foreground/50" />
                </div>
                <p className="mt-5 text-sm font-medium text-muted-foreground">
                    {hasSearchQuery
                        ? isSales ? 'No sales invoices match your search' : 'No purchase invoices match your search'
                        : isSales ? 'No sales invoices yet' : 'No purchase invoices yet'}
                </p>
                <p className="mt-1 max-w-xs text-xs text-muted-foreground/70">
                    {hasSearchQuery
                        ? `We couldn't find any results matching "${query}". Try adjusting your search.`
                        : isSales ? 'Create your first sales invoice to see it appear here.' : 'Create your first purchase invoice to see it appear here.'}
                </p>
            </div>
        </div>
    );
}
