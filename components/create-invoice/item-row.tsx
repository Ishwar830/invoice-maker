'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Trash2Icon,
    SparklesIcon,
    ScaleIcon,
    IndianRupeeIcon,
    PercentIcon,
} from 'lucide-react';
import { calculateItemAmount } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import { useInvoice } from './invoice-context';
import { MetalType, PURITY_OPTIONS, type InvoiceFormItem } from '@/lib/types';
import { FormField } from './form-field';
import { ItemCodeSearch } from './item-code-search';
import clsx from 'clsx';

export function ItemRow({
    item,
    index,
    canRemove,
    showMakingCharges = true,
}: {
    item: InvoiceFormItem;
    index: number;
    canRemove: boolean;
    showMakingCharges?: boolean;
}) {
    const {
        actions: { updateItem, removeItem },
    } = useInvoice();
    const itemAmount = calculateItemAmount(item);

    return (
        <div className="group/item rounded-lg border border-border/40 bg-background p-4 transition-all hover:border-border/80 hover:shadow-sm">
            {/* Item header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-sm bg-[#1A1A1A] text-[10px] font-bold text-[#D4AF37]">
                        {index + 1}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Item
                    </span>
                </div>
                {canRemove && (
                    <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-red-50 hover:text-red-600 hover:cursor-pointer group-hover/item:opacity-100"
                        aria-label="Remove item"
                    >
                        <Trash2Icon className="size-3.5" />
                    </button>
                )}
            </div>

            {/* Row 1: Item Code + Description + Metal + Purity */}
            <div className="grid gap-3 sm:grid-cols-8">
                {/* Item Code Search — spans 2 cols */}
                <ItemCodeSearch item={item} />

                <div className="sm:col-span-3">
                    <FormField
                        label="Description"
                        icon={
                            <SparklesIcon className="size-3 text-muted-foreground/50" />
                        }
                    >
                        <Input
                            id={`item-desc-${item.id}`}
                            placeholder="e.g. Gold Necklace Set"
                            value={item.description}
                            onChange={(e) =>
                                updateItem(
                                    item.id,
                                    'description',
                                    e.target.value
                                )
                            }
                            className="text-sm"
                        />
                    </FormField>
                </div>
                <div className="sm:col-span-1">
                    <FormField label="Metal Type">
                        <Select
                            value={item.metalType}
                            onValueChange={(val) =>
                                updateItem(item.id, 'metalType', val)
                            }
                        >
                            <SelectTrigger
                                id={`item-metal-${item.id}`}
                                className="text-sm h-9"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gold">Gold</SelectItem>
                                <SelectItem value="silver">Silver</SelectItem>
                                <SelectItem value="platinum">
                                    Platinum
                                </SelectItem>
                                <SelectItem value="diamond">Diamond</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                </div>
                <div className="sm:col-span-2">
                    <FormField label="Purity">
                        <Select
                            value={item.metalPurity ?? undefined}
                            onValueChange={(val) =>
                                updateItem(item.id, 'metalPurity', val)
                            }
                        >
                            <SelectTrigger
                                id={`item-purity-${item.id}`}
                                className="text-sm h-9"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {(
                                    PURITY_OPTIONS[item.metalType as MetalType] ??
                                    PURITY_OPTIONS['other']
                                ).map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>
                </div>
            </div>

            {/* Row 2: Weights + Rate + Making + Amount */}
            <div
                className={clsx(
                    'mt-3 grid gap-3',
                    showMakingCharges ? "sm:grid-cols-5" : "sm:grid-cols-4"
                )}
            >
                <FormField
                    label="Gross Wt. (g)"
                    icon={
                        <ScaleIcon className="size-3 text-muted-foreground/50" />
                    }
                >
                    <Input
                        id={`item-gross-${item.id}`}
                        type="number"
                        step="0.001"
                        placeholder="0.000"
                        min={0}
                        value={item.grossWeight}
                        onChange={(e) =>
                            updateItem(item.id, 'grossWeight', e.target.value)
                        }
                        className="text-sm tabular-nums"
                    />
                </FormField>
                <FormField
                    label="Net Wt. (g)"
                    icon={
                        <ScaleIcon className="size-3 text-muted-foreground/50" />
                    }
                >
                    <Input
                        id={`item-net-${item.id}`}
                        type="number"
                        step="0.001"
                        min={0}
                        placeholder="0.000"
                        value={item.netWeight}
                        onChange={(e) =>
                            updateItem(item.id, 'netWeight', e.target.value)
                        }
                        className="text-sm tabular-nums"
                    />
                </FormField>
                <FormField
                    label="Rate / g (₹)"
                    icon={
                        <IndianRupeeIcon className="size-3 text-muted-foreground/50" />
                    }
                >
                    <Input
                        id={`item-rate-${item.id}`}
                        type="number"
                        step="1"
                        placeholder="0"
                        min={0}
                        value={item.metalRate}
                        onChange={(e) =>
                            updateItem(item.id, 'metalRate', e.target.value)
                        }
                        className="text-sm tabular-nums"
                    />
                </FormField>
                {showMakingCharges && (
                    <FormField
                        label="Making"
                        icon={
                            <PercentIcon className="size-3 text-muted-foreground/50" />
                        }
                    >
                        <Input
                            id={`item-making-${item.id}`}
                            type="number"
                            step="1"
                            placeholder="0"
                            min={0}
                            value={item.makingChargesPercent}
                            onChange={(e) =>
                                updateItem(
                                    item.id,
                                    'makingChargesPercent',
                                    e.target.value
                                )
                            }
                            className="text-sm tabular-nums"
                        />
                    </FormField>
                )}
                <div className="flex flex-col justify-end">
                    <label className="mb-1.5 text-xs font-medium text-muted-foreground">
                        Amount
                    </label>
                    <div className="flex h-9 items-center rounded-md bg-[#FFFDF5] px-2.5 text-sm font-semibold tabular-nums text-[#1A1A1A] ring-1 ring-[#D4AF37]/20">
                        {formatCurrency(itemAmount)}
                    </div>
                </div>
            </div>
        </div>
    );
}
