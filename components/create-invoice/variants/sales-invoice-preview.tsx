'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, PrinterIcon, Loader2Icon } from 'lucide-react';
import { useInvoice } from '../invoice-context';
import { useSaveSalesInvoice } from '../hooks/use-save-sales-invoice';
import { SalesInvoiceSheetData } from '@/lib/types';
import { SalesInvoiceSheet } from '@/components/invoice-sheet/sales-invoice-sheet';
import {
    calculateInvoiceTotals,
    calculateItemAmount,
    calculateItemBasePrice,
} from '@/lib/calculations';
import { useEffect } from 'react';

export function SalesInvoicePreview() {
    const {
        state: { invoiceData: data, shop },
        actions: { setShowPreview },
    } = useInvoice();

    const { subTotal, grandTotal, cgstAmount, sgstAmount } =
        calculateInvoiceTotals({
            items: data.items,
            cgstPercent: data.cgstPercent,
            sgstPercent: data.sgstPercent,
            discountAmount: data.discountAmount,
        });

    const sheetData: SalesInvoiceSheetData = {
        invoiceNumber: data.invoiceNumber,
        createdAt: new Date(data.date),
        customer: data.customer,
        items: data.items.map((item) => {
            const baseAmount = calculateItemBasePrice(item);
            const makingChargesAmount =
                baseAmount * (item.makingChargesPercent / 100);
            const itemTotal = calculateItemAmount(item);

            return {
                ...item,
                makingChargesAmount,
                itemTotal,
            };
        }),
        cgstPercent: data.cgstPercent,
        sgstPercent: data.sgstPercent,
        notes: data.notes || undefined,
        discountAmount: data.discountAmount,
        subTotal,
        cgstAmount,
        sgstAmount,
        grandTotal,
    };

    const { saveInvoice, isSaving } = useSaveSalesInvoice();

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

            <SalesInvoiceSheet data={sheetData} shop={shop} />
        </div>
    );
}
