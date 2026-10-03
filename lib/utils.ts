import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
}

// Re-export calculation functions so existing imports from '@/lib/utils' keep working
export {
    calculateItemAmount,
    calculateSubTotal,
    calculateInvoiceTotals,
} from './calculations';

/**
 * @deprecated Use `calculateInvoiceTotals()` from `@/lib/calculations` instead.
 * This wrapper exists only for backward compatibility.
 */
export function calculateInvoiceGrandTotal(input: {
    subtotal: number;
    cgstPercent: number;
    sgstPercent: number;
    discount: number;
}): number {
    const cgstAmount = input.subtotal * (input.cgstPercent / 100);
    const sgstAmount = input.subtotal * (input.sgstPercent / 100);
    return input.subtotal + cgstAmount + sgstAmount - input.discount;
}

