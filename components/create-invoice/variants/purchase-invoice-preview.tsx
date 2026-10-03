'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, PrinterIcon, Loader2Icon } from 'lucide-react';
import { useInvoice } from '../invoice-context';
import { useSavePurchaseInvoice } from '../hooks/use-save-purchase-invoice';
import { PurchaseInvoiceSheetData } from '@/lib/types';
import { PurchaseInvoiceSheet } from '@/components/invoice-sheet/purchase-invoice-sheet';
import {
    calculateInvoiceTotals,
    calculateItemBasePrice,
} from '@/lib/calculations';
import { useEffect } from 'react';

export function PurchaseInvoicePreview() {
    const {
        state: { invoiceData: data },
        actions: { setShowPreview },
    } = useInvoice();

    const { subTotal, grandTotal } =
        calculateInvoiceTotals({
            items: data.items,
            cgstPercent: 0,
            sgstPercent: 0,
            discountAmount: 0,
        });

    const sheetData: PurchaseInvoiceSheetData = {
        invoiceNumber: data.invoiceNumber,
        createdAt: new Date(data.date),
        customer: data.customer,
        items: data.items.map((item) => {
            const itemTotal = calculateItemBasePrice(item); // No making charges for purchases

            return {
                description: item.description,
                metalType: item.metalType,
                metalPurity: item.metalPurity,
                grossWeight: item.grossWeight,
                netWeight: item.netWeight,
                metalRate: item.metalRate,
                itemTotal,
            };
        }),
        notes: data.notes || undefined,
        subTotal,
        grandTotal,
    };

    const { saveInvoice, isSaving } = useSavePurchaseInvoice();

    const handleSave = () => saveInvoice(sheetData);

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#F5F3EF]">
            {/* Action bar — hidden on print */}
            <div className="print:hidden sticky top-0 z-10 border-b border-border/40 bg-white/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPreview(false)}
                        className="gap-2"
                    >
                        <ArrowLeftIcon className="size-4" />
                        Back to Editor
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && (
                                <Loader2Icon className="mr-2 size-4 animate-spin" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Invoice'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="gap-2"
                        >
                            <PrinterIcon className="size-4" />
                            Print
                        </Button>
                    </div>
                </div>
            </div>

            <PurchaseInvoiceSheet data={sheetData} />
        </div>
    );
}
