'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { saveSalesInvoiceAction } from '@/app/actions/sales-invoice';
import type { SalesInvoiceSheetData } from '@/lib/types';

export function useSaveSalesInvoice() {
    const [isSaving, setIsSaving] = useState(false);

    const saveInvoice = useCallback(async (data: SalesInvoiceSheetData) => {
        setIsSaving(true);
        try {
            const result = await saveSalesInvoiceAction(data);

            if (result.success) {
                toast.success('Sales Invoice saved successfully!');
            } else {
                toast.error('Failed to save sales invoice.');
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
