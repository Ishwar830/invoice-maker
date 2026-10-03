'use client';

import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { IndianRupeeIcon } from 'lucide-react';
import { calculateInvoiceTotals } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import { useInvoice } from './invoice-context';
import { SectionHeader } from './section-header';

function SummaryRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium tabular-nums">
                {formatCurrency(value)}
            </span>
        </div>
    );
}

export function InvoiceSummary({
    showGST = true,
    showDiscount = true,
}: {
    showGST?: boolean;
    showDiscount?: boolean;
}) {
    const {
        state: { invoiceData },
        actions: { updateField },
    } = useInvoice();

    const totals = calculateInvoiceTotals(invoiceData);

    return (
        <section className="md:col-span-2 rounded-lg border border-[#D4AF37]/20 bg-linear-to-br from-[#FFFDF5] to-[#FFF9E6] p-6 shadow-sm">
            <SectionHeader
                icon={<IndianRupeeIcon className="size-4 text-[#D4AF37]" />}
                title="Summary"
            />
            <div className='grid gap-2 py-2'>
                <SummaryRow label="Subtotal" value={totals.subTotal} />

                {(showGST || showDiscount) && (
                    <div className="space-y-2">
                        {showGST && (
                            <>
                                <div className="flex items-center gap-2">
                                    <label
                                        htmlFor="cgst-percent"
                                        className="min-w-20 text-xs font-medium text-muted-foreground"
                                    >
                                        CGST %
                                    </label>
                                    <Input
                                        id="cgst-percent"
                                        type="number"
                                        step="0.1"
                                        value={invoiceData.cgstPercent}
                                        onChange={(e) =>
                                            updateField(
                                                'cgstPercent',
                                                Number(e.target.value)
                                            )
                                        }
                                        className="h-7 w-20 text-xs"
                                    />
                                    <span className="ml-auto text-sm font-medium tabular-nums">
                                        {formatCurrency(totals.cgstAmount)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label
                                        htmlFor="sgst-percent"
                                        className="min-w-20 text-xs font-medium text-muted-foreground"
                                    >
                                        SGST %
                                    </label>
                                    <Input
                                        id="sgst-percent"
                                        type="number"
                                        step="0.1"
                                        value={invoiceData.sgstPercent}
                                        onChange={(e) =>
                                            updateField(
                                                'sgstPercent',
                                                Number(e.target.value)
                                            )
                                        }
                                        className="h-7 w-20 text-xs"
                                    />
                                    <span className="ml-auto text-sm font-medium tabular-nums">
                                        {formatCurrency(totals.sgstAmount)}
                                    </span>
                                </div>
                            </>
                        )}

                        {showDiscount && (
                            <div className="flex items-center gap-2">
                                <label
                                    htmlFor="discount"
                                    className="min-w-20 text-xs font-medium text-muted-foreground"
                                >
                                    Discount ₹
                                </label>
                                <Input
                                    id="discount"
                                    type="number"
                                    min={0}
                                    step="1"
                                    value={invoiceData.discountAmount}
                                    onChange={(e) =>
                                        updateField(
                                            'discountAmount',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="h-7 w-20 text-xs"
                                />
                                <span className="ml-auto text-sm font-medium tabular-nums text-red-600">
                                    {invoiceData.discountAmount > 0
                                        ? `- ${formatCurrency(invoiceData.discountAmount)}`
                                        : formatCurrency(0)}
                                </span>
                            </div>
                        )}

                        <Separator className="my-2" />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-[#1A1A1A]">
                        Grand Total
                    </span>
                    <span className="text-xl font-bold text-[#1A1A1A] tabular-nums">
                        {formatCurrency(totals.grandTotal)}
                    </span>
                </div>
            </div>
        </section>
    );
}
