// ─── Item-Level Calculations ─────────────────────────────────────────────────

interface Item {
    netWeight: number;
    metalRate: number;
    makingChargesPercent: number;
}

/** Base price for an item: netWeight × rate */
export function calculateItemBasePrice(item: Item): number {
    return item.netWeight * item.metalRate;
}

/** Total amount for a single line item including making charges */
export function calculateItemAmount(item: Item): number {
    const base = calculateItemBasePrice(item);
    return base + (item.makingChargesPercent / 100) * base;
}

// ─── Invoice-Level Calculations ──────────────────────────────────────────────

/** Input shape for invoice totals — works with both form data and sheet data */
export interface InvoiceTotalsInput {
    items: Item[];
    cgstPercent: number;
    sgstPercent: number;
    discountAmount: number;
}

/** All derived monetary values for an invoice, calculated in one place */
export interface InvoiceTotals {
    subTotal: number;
    cgstAmount: number;
    sgstAmount: number;
    discountAmount: number;
    grandTotal: number;
}

/** Sum of all item amounts */
export function calculateSubTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
}

/**
 * Single function to compute every derived monetary value for an invoice.
 * This is the **only** place where business calculation logic lives.
 */
export function calculateInvoiceTotals(
    input: InvoiceTotalsInput
): InvoiceTotals {
    const subTotal = calculateSubTotal(input.items);
    const cgstAmount = subTotal * (input.cgstPercent / 100);
    const sgstAmount = subTotal * (input.sgstPercent / 100);
    const grandTotal =
        subTotal + cgstAmount + sgstAmount - input.discountAmount;

    return {
        subTotal,
        cgstAmount,
        sgstAmount,
        discountAmount: input.discountAmount,
        grandTotal,
    };
}
