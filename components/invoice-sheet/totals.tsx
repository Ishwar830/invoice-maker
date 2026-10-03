import { Separator } from '@/components/ui/separator';
import type { InvoiceTotals } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';

export function Totals({
    totals,
    cgstPercent,
    sgstPercent,
}: {
    totals: InvoiceTotals;
    cgstPercent: number;
    sgstPercent: number;
}) {
    return (
        <div className="pt-4 flex justify-end border-t border-black">
            <div className="w-72 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium tabular-nums">
                        {formatCurrency(totals.subTotal)}
                    </span>
                </div>
                {totals.cgstAmount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span>
                            CGST ({cgstPercent}%)
                        </span>
                        <span className="tabular-nums">
                            {formatCurrency(totals.cgstAmount)}
                        </span>
                    </div>
                )}
                {totals.sgstAmount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span>
                            SGST ({sgstPercent}%)
                        </span>
                        <span className="tabular-nums">
                            {formatCurrency(totals.sgstAmount)}
                        </span>
                    </div>
                )}
                {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span>Discount</span>
                        <span className="tabular-nums text-red-600">
                            - {formatCurrency(totals.discountAmount)}
                        </span>
                    </div>
                )}
                <Separator className="bg-[#1A1A1A]" />
                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-[#1A1A1A]">
                        Grand Total
                    </span>
                    <span className="font-bold text-[#1A1A1A] tabular-nums">
                        {formatCurrency(totals.grandTotal)}
                    </span>
                </div>
            </div>
        </div>
    );
}
