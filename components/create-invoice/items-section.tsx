'use client';

import { Badge } from '@/components/ui/badge';
import { PlusIcon, PackageIcon } from 'lucide-react';
import { useInvoice } from './invoice-context';
import { SectionHeader } from './section-header';
import { ItemRow } from './item-row';

export function ItemsSection({ showMakingCharges = true }: { showMakingCharges?: boolean }) {
    const {
        state: { invoiceData },
        actions: { addItem },
    } = useInvoice();

    return (
        <section className="invoice-section rounded-lg border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <SectionHeader
                    icon={<PackageIcon className="size-4 text-[#D4AF37]" />}
                    title="Items"
                />
                <Badge variant="secondary" className="text-xs font-normal">
                    {invoiceData.items.length}{' '}
                    {invoiceData.items.length === 1 ? 'item' : 'items'}
                </Badge>
            </div>

            <div className="mt-6 space-y-5">
                {invoiceData.items.map((item, index) => (
                    <ItemRow
                        key={item.id}
                        item={item}
                        index={index}
                        canRemove={invoiceData.items.length > 1}
                        showMakingCharges={showMakingCharges}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={addItem}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-border/80 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 hover:text-[#96791B] hover:cursor-pointer"
            >
                <PlusIcon className="size-4" />
                Add Item
            </button>
        </section>
    );
}
