import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecentSalesInvoices } from '@/db/queries/sales';
import { ReceiptTextIcon, CircleAlert } from 'lucide-react';
import { InvoicesTableView } from './invoices-table-view';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export async function LatestInvoicesTable() {
    let invoices: any[] = [];
    let errorMessage = null;

    try {
        invoices = await getRecentSalesInvoices();
    } catch {
        errorMessage = 'Could not load latest invoices';
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
                        No invoices yet
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                        Create your first invoice to see it appear here.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return <InvoicesTableView invoices={invoices} />;
}

export function LatestInvoicesSkeleton() {
    return (
        <div className="rounded-xl border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden shadow-sm">
            {/* Desktop skeleton */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="pl-6 w-[120px]"><Skeleton className="h-4 w-12" /></TableHead>
                            <TableHead className="w-[250px]"><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead className="w-[180px]"><Skeleton className="h-4 w-16" /></TableHead>
                            <TableHead className="text-right pr-6"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell className="pl-6 py-4">
                                    <Skeleton className="h-6 w-16 rounded-md" />
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>
                                <TableCell className="text-right pr-6 py-4">
                                    <Skeleton className="h-4 w-20 ml-auto" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile skeleton */}
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 md:hidden p-4 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex flex-col gap-3 py-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-16 rounded-md" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <div className="flex justify-between">
                            <div className="space-y-1.5">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
