'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { playfair } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { PrinterIcon, ReceiptTextIcon } from 'lucide-react';
import { useInvoice } from '../invoice-context';
import { PurchaseInvoicePreview } from './purchase-invoice-preview';
import { InvoiceDetails } from '../invoice-details';
import { CustomerDetails } from '../customer-details';
import { ItemsSection } from '../items-section';
import { NotesSection } from '../notes-section';
import { InvoiceSummary } from '../invoice-summary';

export function PurchaseInvoiceForm() {
    const {
        state: { invoiceData, showPreview },
        actions: { setShowPreview },
    } = useInvoice();

    if (showPreview) {
        return <PurchaseInvoicePreview />;
    }

    return (
        <div className="invoice-page min-h-screen pb-12">
            <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-10 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-sm bg-[#1A1A1A]">
                                <ReceiptTextIcon className="size-5 text-[#D4AF37]" />
                            </div>
                            <div>
                                <h1
                                    className={cn(
                                        'text-2xl font-semibold tracking-tight text-[#1A1A1A]',
                                        playfair.className
                                    )}
                                >
                                    Purchase Invoice
                                </h1>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Record a purchase from your supplier
                                </p>
                            </div>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className="border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#96791B] font-mono text-xs"
                    >
                        Invoice No. {invoiceData.invoiceNumber}
                    </Badge>
                </div>

                <div className="space-y-8">
                    {/* Invoice Details & Customer/Supplier Details */}
                    <div className="grid gap-8 md:grid-cols-2">
                        <InvoiceDetails />
                        <CustomerDetails partyLabel="Supplier" />
                    </div>

                    {/* Items */}
                    <ItemsSection showMakingCharges={false} />

                    {/* Notes & Summary */}
                    <div className="grid gap-8 md:grid-cols-5">
                        <NotesSection />
                        <InvoiceSummary showGST={false} showDiscount={false} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setShowPreview(true)}
                            className="gap-2"
                        >
                            <PrinterIcon className="size-4" />
                            Preview & Print
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
