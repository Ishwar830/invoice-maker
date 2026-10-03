'use client';

import { Textarea } from '@/components/ui/textarea';
import { FileTextIcon } from 'lucide-react';
import { useInvoice } from './invoice-context';
import { SectionHeader } from './section-header';

export function NotesSection() {
    const {
        state: { invoiceData },
        actions: { updateField },
    } = useInvoice();

    return (
        <section className="invoice-section md:col-span-3 rounded-lg border border-border/60 bg-card p-6 shadow-sm">
            <SectionHeader
                icon={<FileTextIcon className="size-4 text-[#D4AF37]" />}
                title="Notes"
            />
            <div className="mt-5">
                <Textarea
                    id="invoice-notes"
                    placeholder="Any additional notes for this invoice..."
                    value={invoiceData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    className="min-h-25 text-sm"
                    rows={4}
                />
            </div>
        </section>
    );
}
