import { Separator } from '@/components/ui/separator';
import { type InvoiceSheetItem } from '@/lib/types';
import type { InvoiceTotals } from '@/lib/calculations';
import { type BillingInfoData } from './billing-info';
import { type BankDetailsData } from './bank-details';
import { cn, formatCurrency } from '@/lib/utils';
import { playfair } from '@/lib/fonts';

/* ───────────────────────────────────────────────────────── */
/*  Shared props for the mobile view                        */
/* ───────────────────────────────────────────────────────── */

export interface MobileInvoiceViewProps {
    /** "Sales Invoice" or "Purchase Invoice" */
    title: string;
    shopName: string;
    invoiceNumber: number;
    formattedDate: string;
    /** Left billing block */
    billingLeft: { label: string; data: BillingInfoData };
    /** Right billing block */
    billingRight: { label: string; data: BillingInfoData };
    items: InvoiceSheetItem[];
    showMakingCharges: boolean;
    totals: InvoiceTotals;
    cgstPercent: number;
    sgstPercent: number;
    notes?: string;
    bankDetails?: BankDetailsData | null;
    signatures: {
        leftLabel: string;
        partyName: string;
        shopName?: string;
    };
}

/* ───────────────────────────────────────────────────────── */
/*  Mobile Invoice View (card-based, vertical)              */
/* ───────────────────────────────────────────────────────── */

export function MobileInvoiceView({
    title,
    shopName,
    invoiceNumber,
    formattedDate,
    billingLeft,
    billingRight,
    items,
    showMakingCharges,
    totals,
    cgstPercent,
    sgstPercent,
    notes,
    bankDetails,
    signatures,
}: MobileInvoiceViewProps) {
    return (
        <div className="flex flex-col gap-3 px-4 py-6 md:hidden print:hidden">
            {/* ── Header card ── */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                    <h2
                        className={cn(
                            'text-xl font-bold tracking-wide text-[#D4AF37]',
                            playfair.className
                        )}
                    >
                        {shopName}
                    </h2>
                    <span className="shrink-0 rounded-full bg-[#1A1A1A] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                        {title}
                    </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">#{invoiceNumber}</span>
                    <span>·</span>
                    <span>{formattedDate}</span>
                </div>
            </div>

            {/* ── Billing cards (stacked) ── */}
            <div className="rounded-lg bg-white shadow-sm">
                <MobileBillingBlock
                    label={billingLeft.label}
                    data={billingLeft.data}
                    className="border-b p-4"
                />
                <MobileBillingBlock
                    label={billingRight.label}
                    data={billingRight.data}
                    className="p-4"
                />
            </div>

            {/* ── Item cards ── */}
            <div className="flex flex-col gap-2">
                {items.map((item, index) => (
                    <MobileItemCard
                        key={item.description + index}
                        item={item}
                        index={index}
                        showMakingCharges={showMakingCharges}
                    />
                ))}
            </div>

            {/* ── Totals card ── */}
            <MobileTotalsCard
                totals={totals}
                cgstPercent={cgstPercent}
                sgstPercent={sgstPercent}
            />

            {/* ── Notes ── */}
            {notes && (
                <div className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                        Notes
                    </div>
                    <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                        {notes}
                    </p>
                </div>
            )}

            {/* ── Bank details ── */}
            {bankDetails?.name && (
                <div className="rounded-lg bg-amber-50 p-4 shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-800">
                        Bank Details
                    </div>
                    <div className="mt-2 flex flex-col gap-0.5 text-xs font-medium text-amber-900">
                        {bankDetails.name && <p>Bank: {bankDetails.name}</p>}
                        {bankDetails.branch && (
                            <p>Branch: {bankDetails.branch}</p>
                        )}
                        {bankDetails.ifscCode && (
                            <p>IFSC: {bankDetails.ifscCode}</p>
                        )}
                        {bankDetails.accountNumber && (
                            <p>A/C: {bankDetails.accountNumber}</p>
                        )}
                    </div>
                </div>
            )}

            {/* ── Signatures ── */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="mt-8 border-t border-[#1A1A1A] pt-2">
                            <div className="text-[10px] font-medium text-[#1A1A1A]">
                                {signatures.leftLabel}
                            </div>
                            <div className="mt-0.5 text-[9px] text-muted-foreground">
                                {signatures.partyName}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="mt-8 inline-block border-t border-[#1A1A1A] pt-2">
                            <div className="text-[10px] font-medium text-[#1A1A1A]">
                                Authorized Signature
                            </div>
                            <div className="mt-0.5 text-[9px] text-muted-foreground">
                                {signatures.shopName}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ───────────────────────────────────────────────────────── */
/*  Sub-components                                          */
/* ───────────────────────────────────────────────────────── */

function MobileBillingBlock({
    label,
    data,
    className,
}: {
    label: string;
    data: BillingInfoData;
    className?: string;
}) {
    const taxIdentifier = data.panGstNumber ?? data.gstNumber;
    const taxLabel = data.panGstNumber
        ? data.panGstNumber.length === 10
            ? 'PAN'
            : data.panGstNumber.length === 15
              ? 'GST'
              : 'PAN/GST'
        : 'GST';

    return (
        <div className={className}>
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                {label}
            </div>
            <div className="mt-1.5 flex flex-col gap-0.5 text-sm">
                <div className="font-semibold text-[#1A1A1A]">
                    {data.name || '—'}
                </div>
                {data.phone && (
                    <div className="text-xs text-muted-foreground">
                        {data.phone}
                    </div>
                )}
                {taxIdentifier && (
                    <div className="text-xs text-muted-foreground">
                        {taxLabel}:{' '}
                        <span className="uppercase">{taxIdentifier}</span>
                    </div>
                )}
                {data.address && (
                    <div className="text-xs text-muted-foreground">
                        {data.address}
                    </div>
                )}
            </div>
        </div>
    );
}

function MobileItemCard({
    item,
    index,
    showMakingCharges,
}: {
    item: InvoiceSheetItem;
    index: number;
    showMakingCharges: boolean;
}) {
    return (
        <div className="rounded-lg bg-white p-4 shadow-sm">
            {/* Item title row */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                        {index + 1}.
                    </span>
                    <span className="text-sm font-semibold text-[#1A1A1A]">
                        {item.description}
                    </span>
                </div>
                <span className="shrink-0 text-sm font-bold tabular-nums text-[#1A1A1A]">
                    {formatCurrency(item.itemTotal)}
                </span>
            </div>

            {/* Metal info badge */}
            <div className="mt-2 flex items-center gap-1.5">
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium capitalize text-zinc-600">
                    {item.metalType}
                </span>
                {item.metalPurity && (
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600">
                        {item.metalPurity}
                    </span>
                )}
            </div>

            {/* Key-value grid */}
            <div
                className={cn(
                    'mt-3 grid gap-x-4 gap-y-1.5 text-xs',
                    showMakingCharges ? 'grid-cols-2' : 'grid-cols-3'
                )}
            >
                <KeyValue label="Gross Wt." value={`${item.grossWeight}g`} />
                <KeyValue label="Net Wt." value={`${item.netWeight}g`} />
                <KeyValue
                    label="Rate/g"
                    value={formatCurrency(item.metalRate)}
                />
                {showMakingCharges && item.makingChargesPercent ? (
                    <KeyValue
                        label="Making"
                        value={`${item.makingChargesPercent}%`}
                    />
                ) : null}
            </div>
        </div>
    );
}

function KeyValue({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">{label}</span>
            <span className="font-medium tabular-nums text-[#1A1A1A]">
                {value}
            </span>
        </div>
    );
}

function MobileTotalsCard({
    totals,
    cgstPercent,
    sgstPercent,
}: {
    totals: InvoiceTotals;
    cgstPercent: number;
    sgstPercent: number;
}) {
    return (
        <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2">
                <TotalRow
                    label="Subtotal"
                    value={formatCurrency(totals.subTotal)}
                />
                {totals.cgstAmount > 0 && (
                    <TotalRow
                        label={`CGST (${cgstPercent}%)`}
                        value={formatCurrency(totals.cgstAmount)}
                    />
                )}
                {totals.sgstAmount > 0 && (
                    <TotalRow
                        label={`SGST (${sgstPercent}%)`}
                        value={formatCurrency(totals.sgstAmount)}
                    />
                )}
                {totals.discountAmount > 0 && (
                    <TotalRow
                        label="Discount"
                        value={`- ${formatCurrency(totals.discountAmount)}`}
                        valueClassName="text-red-600"
                    />
                )}
                <Separator className="bg-[#1A1A1A]/20" />
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1A1A1A]">
                        Grand Total
                    </span>
                    <span className="text-base font-bold tabular-nums text-[#1A1A1A]">
                        {formatCurrency(totals.grandTotal)}
                    </span>
                </div>
            </div>
        </div>
    );
}

function TotalRow({
    label,
    value,
    valueClassName,
}: {
    label: string;
    value: string;
    valueClassName?: string;
}) {
    return (
        <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className={cn('tabular-nums', valueClassName)}>{value}</span>
        </div>
    );
}
