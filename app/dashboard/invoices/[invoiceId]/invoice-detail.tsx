'use client';

import { useState } from 'react';
import { SalesInvoiceSheet, PurchaseInvoiceSheet } from '@/components/invoice-sheet';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, PrinterIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DeleteInvoiceDialog } from '@/components/delete-invoice-dialog';

export function InvoiceDetail({
    invoice,
    type = 'sales',
}: {
    invoice: any;
    type?: 'sales' | 'purchase';
}) {
    const router = useRouter();
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <div className="bg-[#F5F3EF]">
            {/* Action bar — hidden on print */}
            <div className="print:hidden sticky top-0 z-10 border-b border-border/40 bg-white/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeftIcon className="size-4" />
                        Back
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.print()}
                            className="gap-2"
                        >
                            <PrinterIcon className="size-4" />
                            Print
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteOpen(true)}
                            className="gap-2 text-red-600 hover:text-red-600 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:border-red-800"
                        >
                            <Trash2Icon className="size-4" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            {type === 'sales' ? (
                <SalesInvoiceSheet data={invoice} />
            ) : (
                <PurchaseInvoiceSheet data={invoice} />
            )}

            <DeleteInvoiceDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                invoiceId={invoice.id}
                invoiceNumber={invoice.invoiceNumber}
                type={type}
            />
        </div>
    );
}
