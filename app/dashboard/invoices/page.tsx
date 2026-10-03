import Search from '@/components/ui/search';
import { Suspense } from 'react';
import InvoicesTable from './invoices-table';
import InvoicesPagination from './invoices-pagination';
import { InvoicesTableSkeleton } from './invoices-skeleton';
import { playfair } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { PlusIcon, ReceiptTextIcon } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default async function Invoices(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        type?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const type = searchParams?.type === 'purchase' ? 'purchase' : 'sales';

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[#F5F3EF] border border-border/40">
                        <ReceiptTextIcon className="size-4 text-muted-foreground" />
                    </div>
                    <h1
                        className={cn(
                            'text-2xl font-bold tracking-tight text-foreground',
                            playfair.className
                        )}
                    >
                        Invoices & Purchases
                    </h1>
                </div>
                <p className="mt-2 text-sm text-muted-foreground pl-12">
                    Browse, search, and manage all your sales and purchases in one place.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-border mb-6">
                <Link
                    href={{
                        pathname: '/dashboard/invoices',
                        query: { ...searchParams, type: 'sales', page: '1' },
                    }}
                    className={cn(
                        "pb-3 px-4 text-sm font-medium border-b-2 transition-colors",
                        type === 'sales'
                            ? "border-[#D4AF37] text-[#96791B]"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    Sales Invoices
                </Link>
                <Link
                    href={{
                        pathname: '/dashboard/invoices',
                        query: { ...searchParams, type: 'purchase', page: '1' },
                    }}
                    className={cn(
                        "pb-3 px-4 text-sm font-medium border-b-2 transition-colors",
                        type === 'purchase'
                            ? "border-[#D4AF37] text-[#96791B]"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                >
                    Purchase Invoices
                </Link>
            </div>

            {/* Toolbar: Search + New Invoice */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Search placeholder={type === 'sales' ? "Search by invoice no. or customer…" : "Search by invoice no. or supplier…"} />
                <Link
                    href={type === 'sales' ? "/dashboard/create-invoice?type=sales" : "/dashboard/create-invoice?type=purchase"}
                    className={cn(
                        buttonVariants({ size: 'default' }),
                        'shrink-0'
                    )}
                >
                    <PlusIcon data-icon="inline-start" />
                    {type === 'sales' ? 'New Sales Invoice' : 'New Purchase Invoice'}
                </Link>
            </div>

            {/* Table + Pagination */}
            <Suspense
                key={query + currentPage + type}
                fallback={<InvoicesTableSkeleton />}
            >
                <InvoicesTable query={query} currentPage={currentPage} type={type} />
                <InvoicesPagination query={query} currentPage={currentPage} type={type} />
            </Suspense>
        </div>
    );
}
