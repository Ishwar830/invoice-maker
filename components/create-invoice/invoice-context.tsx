'use client';

import {
    createContext,
    use,
    useState,
    useCallback,
    type ReactNode,
} from 'react';
import {
    InvoiceCustomer,
    MetalType,
    PURITY_OPTIONS,
    type InvoiceFormData,
    type InvoiceFormItem,
    type InventorySearchResult,
    type ShopProfile,
} from '@/lib/types';

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function createEmptyItem(): InvoiceFormItem {
    return {
        id: generateId(),
        description: '',
        metalType: 'gold',
        metalPurity: '22K',
        grossWeight: 0,
        netWeight: 0,
        metalRate: 0,
        makingChargesPercent: 0,
    };
}

interface InvoiceState {
    invoiceData: InvoiceFormData;
    showPreview: boolean;
    shop?: ShopProfile | null;
}

interface InvoiceActions {
    updateField: <K extends keyof InvoiceFormData>(
        field: K,
        value: InvoiceFormData[K]
    ) => void;
    updateCustomer: (field: keyof InvoiceCustomer, value: string) => void;
    updateItem: (id: string, field: keyof InvoiceFormItem, value: string) => void;
    fillItemFromInventory: (id: string, inventoryItem: InventorySearchResult) => void;
    addItem: () => void;
    removeItem: (id: string) => void;
    setShowPreview: (show: boolean) => void;
}

interface InvoiceContextValue {
    state: InvoiceState;
    actions: InvoiceActions;
}

export const InvoiceContext = createContext<InvoiceContextValue | null>(null);

export function useInvoice(): InvoiceContextValue {
    const ctx = use(InvoiceContext);
    if (!ctx) {
        throw new Error('useInvoice must be used within an <InvoiceProvider>');
    }
    return ctx;
}

export function InvoiceProvider({
    children,
    initialData,
    shop = null,
}: {
    children: ReactNode;
    initialData: InvoiceFormData;
    shop?: ShopProfile | null;
}) {
    const [showPreview, setShowPreview] = useState(false);
    const [invoiceData, setInvoiceData] = useState<InvoiceFormData>(initialData);

    const updateField = useCallback(
        <K extends keyof InvoiceFormData>(
            field: K,
            value: InvoiceFormData[K]
        ) => {
            setInvoiceData((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    const updateCustomer = useCallback(
        (field: keyof InvoiceCustomer, value: string) => {
            setInvoiceData((prev) => ({
                ...prev,
                customer: {
                    ...prev.customer,
                    [field]: value,
                },
            }));
        },
        []
    );

    const updateItem = useCallback(
        (id: string, field: keyof InvoiceFormItem, value: string) => {
            setInvoiceData((prev) => ({
                ...prev,
                items: prev.items.map((item) => {
                    if (item.id !== id) return item;
                    const updated = { ...item, [field]: value };

                    // Auto-set purity when metal type changes
                    if (field === 'metalType') {
                        const metalType = value as MetalType;
                        updated.metalPurity =
                            PURITY_OPTIONS[metalType][0].value;
                    }

                    return updated;
                }),
            }));
        },
        []
    );

    const fillItemFromInventory = useCallback(
        (id: string, inventoryItem: InventorySearchResult) => {
            setInvoiceData((prev) => ({
                ...prev,
                items: prev.items.map((item) => {
                    if (item.id !== id) return item;

                    // Normalize to lowercase so it always matches PURITY_OPTIONS keys
                    const normalizedMetal = (
                        inventoryItem.metalType?.toLowerCase() ?? 'gold'
                    ) as MetalType;
                    const validMetal = PURITY_OPTIONS[normalizedMetal]
                        ? normalizedMetal
                        : 'other';

                    // Use the inventory purity if it's set, otherwise fall back to
                    // the first option for this metal type
                    const purityOptions = PURITY_OPTIONS[validMetal];
                    const metalPurity =
                        inventoryItem.metalPurity ??
                        purityOptions[0]?.value ??
                        '';

                    return {
                        ...item,
                        description: inventoryItem.categoryName,
                        metalType: validMetal,
                        metalPurity,
                        grossWeight: inventoryItem.grossWeight,
                        netWeight: inventoryItem.netWeight,
                        inventoryItemId: inventoryItem.id,
                    };
                }),
            }));
        },
        []
    );

    const addItem = useCallback(() => {
        setInvoiceData((prev) => ({
            ...prev,
            items: [...prev.items, createEmptyItem()],
        }));
    }, []);

    const removeItem = useCallback((id: string) => {
        setInvoiceData((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.id !== id),
        }));
    }, []);

    const contextValue: InvoiceContextValue = {
        state: { invoiceData, showPreview, shop },
        actions: {
            updateField,
            updateCustomer,
            updateItem,
            fillItemFromInventory,
            addItem,
            removeItem,
            setShowPreview,
        },
    };

    return <InvoiceContext value={contextValue}>{children}</InvoiceContext>;
}
