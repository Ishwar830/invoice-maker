'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { savePurchaseInvoiceAction } from '@/app/actions/purchase-invoice';
import type { PurchaseInvoiceSheetData } from '@/lib/types';

export function useSavePurchaseInvoice() {
    const [isSaving, setIsSaving] = useState(false);

    const saveInvoice = useCallback(async (data: PurchaseInvoiceSheetData) => {
        setIsSaving(true);
        try {
            const result = await savePurchaseInvoiceAction(data);

            if (result.success) {
                toast.success('Purchase Invoice saved successfully!');
            } else {
                toast.error('Failed to save purchase invoice.');
            }

            return result;
        } catch (error) {
            console.error('Save error:', error);
            toast.error('An error occurred while saving.');
            return { success: false, message: 'An error occurred while saving.' };
        } finally {
            setIsSaving(false);
        }
    }, []);

    return { saveInvoice, isSaving };
}
