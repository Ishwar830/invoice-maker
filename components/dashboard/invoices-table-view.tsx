import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { CalendarIcon, PhoneIcon } from 'lucide-react';

interface InvoicesTableViewProps {
    invoices: any[];
}

export function InvoicesTableView({ invoices }: InvoicesTableViewProps) {
    const normalizedInvoices = invoices.map((invoice) => {
        const customerName = invoice.customerName ?? invoice.customer?.name ?? 'Walk-in Customer';
        const customerPhone = invoice.customerPhone ?? invoice.customer?.phone;
        return {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            createdAt: invoice.createdAt,
            customerName,
            customerPhone,
            grandTotal: invoice.grandTotal,
        };
    });

    return (
        <div className="rounded-md py-2 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden shadow-sm">
            {/* Desktop Table View */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="pl-6 font-semibold text-neutral-500 dark:text-neutral-400">
                                Invoice
                            </TableHead>
                            <TableHead className="font-semibold text-neutral-500 dark:text-neutral-400">
                                Customer
                            </TableHead>
                            <TableHead className="font-semibold text-neutral-500 dark:text-neutral-400">
                                Date
                            </TableHead>
                            <TableHead className="text-right pr-6 font-semibold text-neutral-500 dark:text-neutral-400">
                                Amount
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {normalizedInvoices.map((invoice) => (
                            <TableRow key={invoice.id} className="group relative">
                                <TableCell className="pl-6 py-4">
                                    <Link
                                        href={`/dashboard/invoices/${invoice.id}`}
                                        className="before:absolute before:inset-0 font-mono"
                                    >
                                        <Badge
                                            variant="outline"
                                            className="font-mono text-xs tracking-wider border-neutral-200 hover:border-amber-500/50 group-hover:border-amber-500 transition-colors"
                                        >
                                            #{invoice.invoiceNumber}
                                        </Badge>
                                    </Link>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                                            {invoice.customerName}
                                        </span>
                                        {invoice.customerPhone && (
                                            <span className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
                                                <PhoneIcon className="size-3" />
                                                {invoice.customerPhone}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                                        <CalendarIcon className="size-3.5 text-neutral-400" />
                                        {new Date(invoice.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right pr-6 py-4 font-semibold text-neutral-800 dark:text-neutral-100">
                                    {invoice.grandTotal !== undefined && invoice.grandTotal !== null
                                        ? formatCurrency(Number(invoice.grandTotal))
                                        : '—'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards List View */}
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 md:hidden">
                {normalizedInvoices.map((invoice) => (
                    <Link
                        key={invoice.id}
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="flex flex-col gap-2 px-5 py-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <Badge
                                variant="outline"
                                className="font-mono text-xs tracking-wider"
                            >
                                #{invoice.invoiceNumber}
                            </Badge>
                            <span className="text-xs text-neutral-400 flex items-center gap-1">
                                <CalendarIcon className="size-3" />
                                {new Date(invoice.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium truncate text-neutral-700 dark:text-neutral-200">
                                    {invoice.customerName}
                                </span>
                                {invoice.customerPhone && (
                                    <span className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                                        <PhoneIcon className="size-3" />
                                        {invoice.customerPhone}
                                    </span>
                                )}
                            </div>
                            <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-100 shrink-0">
                                {invoice.grandTotal !== undefined && invoice.grandTotal !== null
                                    ? formatCurrency(Number(invoice.grandTotal))
                                    : '—'}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
