'use client';

import { Input } from '@/components/ui/input';
import { HashIcon, CalendarIcon, FileTextIcon } from 'lucide-react';
import { useInvoice } from './invoice-context';
import { SectionHeader } from './section-header';
import { FormField } from './form-field';

export function InvoiceDetails() {
    const {
        state: { invoiceData },
        actions: { updateField },
    } = useInvoice();

    return (
        <section className="invoice-section rounded-lg border border-border/60 bg-card p-6 shadow-sm">
            <SectionHeader
                icon={<FileTextIcon className="size-4 text-[#D4AF37]" />}
                title="Invoice Details"
            />
            <div className="mt-5 space-y-4">
                <FormField
                    label="Invoice No."
                    icon={
                        <HashIcon className="size-3.5 text-muted-foreground" />
                    }
                >
                    <Input
                        id="invoice-number"
                        value={invoiceData.invoiceNumber}
                        onChange={(e) => {
                            let invNumber = parseInt(e.target.value.trim());
                            if(isNaN(invNumber)) invNumber = 0;
                            updateField(
                                'invoiceNumber',
                                invNumber
                            );
                        }
                        }
                        className="font-mono text-sm"
                    />
                </FormField>
                <FormField
                    label="Date"
                    icon={
                        <CalendarIcon className="size-3.5 text-muted-foreground" />
                    }
                >
                    <Input
                        id="invoice-date"
                        type="date"
                        value={invoiceData.date}
                        onChange={(e) => updateField('date', e.target.value)}
                        className="text-sm"
                    />
                </FormField>
            </div>
        </section>
    );
}
