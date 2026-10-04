import type { SalesInvoicePayload } from './validations/sales-invoice';
import type { PurchaseInvoicePayload } from './validations/purchase-invoice';

export type MetalType = 'gold' | 'silver' | 'platinum' | 'diamond' | 'other';

export type PurityOption = { label: string; value: string };

export const PURITY_OPTIONS: Record<MetalType, PurityOption[]> = {
    gold: [
        { label: '24K (999)', value: '24K' },
        { label: '22K (916)', value: '22K' },
        { label: '20K (833)', value: '20K' },
        { label: '18K (750)', value: '18K' },
        { label: '14K (585)', value: '14K' },
    ],
    silver: [
        { label: '999 Fine', value: '999' },
        { label: '925 Sterling', value: '925' },
        { label: '900', value: '900' },
        { label: '50%', value: '50%' },
        { label: '70%', value: '70%' },
    ],
    platinum: [
        { label: '950 Pt', value: '950' },
        { label: '900 Pt', value: '900' },
        { label: '850 Pt', value: '850' },
    ],
    diamond: [{ label: 'N/A', value: 'N/A' }],
    other: [{ label: 'Custom', value: 'Custom' }],
};

export type InvoiceCustomer = {
    name: string;
    phone: string;
    panGstNumber: string;
    address: string;
};

export type InvoiceFormItem = {
    id: string;
    description: string;
    metalType: string;
    metalPurity: string;
    metalRate: number;
    grossWeight: number;
    netWeight: number;
    makingChargesPercent: number;
    /** ID of the inventory item this row was populated from (if any) */
    inventoryItemId?: string;
};

/** Shape of the full invoice creation form state */
export type InvoiceFormData = {
    invoiceNumber: number;
    date: string;
    customer: InvoiceCustomer;
    items: InvoiceFormItem[];
    cgstPercent: number;
    sgstPercent: number;
    discountAmount: number;
    notes?: string;
};

export const INVOICE_TYPES = ['sales', 'purchase'] as const;
export type InvoiceType = (typeof INVOICE_TYPES)[number];

export type BankDetailsProfile = {
    id?: string;
    userId?: string;
    bankName?: string | null;
    bankBranch?: string | null;
    bankIfsc?: string | null;
    bankAccountNumber?: string | null;
};

export type ShopProfile = {
    id?: string;
    userId?: string;
    name: string;
    ownerName?: string | null;
    gstNumber?: string | null;
    phone?: string | null;
    address?: string | null;
    bankDetails?: BankDetailsProfile | null;
    bankName?: string | null;
    bankBranch?: string | null;
    bankIfsc?: string | null;
    bankAccountNumber?: string | null;
};

export type SalesInvoiceSheetData = SalesInvoicePayload & {
    shop?: ShopProfile | null;
};
export type PurchaseInvoiceSheetData = PurchaseInvoicePayload & {
    shop?: ShopProfile | null;
};

export type InvoiceSheetItem = {
    description: string;
    metalType: string;
    metalPurity?: string;
    grossWeight: number;
    netWeight: number;
    metalRate: number;
    makingChargesPercent?: number;
    itemTotal: number;
};

/** Shape returned by inventory item code search */
export type InventorySearchResult = {
    id: string;
    itemCode: string;
    metalType: string;
    metalPurity: string | null;
    grossWeight: number;
    netWeight: number;
    categoryName: string;
};
