'use client';

import { useState, useTransition, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveInventoryItemAction, updateInventoryItemAction } from '@/app/actions/inventory';
import { toast } from 'sonner';
import { PURITY_OPTIONS, type MetalType } from '@/lib/types';

interface Category {
    id: string;
    name: string;
}

interface ExistingItem {
    id: string;
    categoryId: string;
    metalType: string;
    metalPurity?: string | null;
    grossWeight: number;
    netWeight: number;
}

interface AddEditItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: Category[];
    item?: ExistingItem | null;
    /** Pre-select a category when opening for add (ignored in edit mode) */
    defaultCategoryId?: string;
}

interface FormState {
    categoryId: string;
    metalType: MetalType | '';
    metalPurity: string;
    grossWeight: string;
    netWeight: string;
}

interface FormErrors {
    categoryId?: string;
    metalType?: string;
    grossWeight?: string;
    netWeight?: string;
}

// Metal type options — values are lowercase to match PURITY_OPTIONS keys
const METAL_TYPE_OPTIONS: { label: string; value: MetalType }[] = [
    { label: 'Gold', value: 'gold' },
    { label: 'Silver', value: 'silver' },
    { label: 'Platinum', value: 'platinum' },
    { label: 'Diamond', value: 'diamond' },
    { label: 'Other', value: 'other' },
];

/** Normalize a stored metalType string to a valid MetalType key */
function normalizeMetalType(raw: string | undefined | null): MetalType | '' {
    if (!raw) return '';
    const lower = raw.toLowerCase() as MetalType;
    return PURITY_OPTIONS[lower] ? lower : 'other';
}

/** Return the first purity option for a metal, or '' if none */
function defaultPurity(metal: MetalType | ''): string {
    if (!metal) return '';
    return PURITY_OPTIONS[metal]?.[0]?.value ?? '';
}

function getDefaults(item?: ExistingItem | null, defaultCategoryId?: string): FormState {
    const metalType = normalizeMetalType(item?.metalType);
    return {
        categoryId: item?.categoryId ?? defaultCategoryId ?? '',
        metalType,
        metalPurity: item?.metalPurity ?? defaultPurity(metalType),
        grossWeight: item ? String(item.grossWeight) : '',
        netWeight: item ? String(item.netWeight) : '',
    };
}

function validate(form: FormState): FormErrors {
    const errors: FormErrors = {};
    if (!form.categoryId) errors.categoryId = 'Please select a category.';
    if (!form.metalType) errors.metalType = 'Please select a metal type.';
    const gw = Number(form.grossWeight);
    if (form.grossWeight === '' || isNaN(gw) || gw < 0)
        errors.grossWeight = 'Gross weight must be 0 or more.';
    const nw = Number(form.netWeight);
    if (form.netWeight === '' || isNaN(nw) || nw < 0)
        errors.netWeight = 'Net weight must be 0 or more.';
    return errors;
}

export function AddEditItemDialog({
    open,
    onOpenChange,
    categories,
    item,
    defaultCategoryId,
}: AddEditItemDialogProps) {
    const isEdit = !!item;
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState<FormState>(getDefaults(item));
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (open) {
            setForm(getDefaults(item, defaultCategoryId));
            setErrors({});
        }
    }, [open, item, defaultCategoryId]);

    const set = (key: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key as keyof FormErrors])
            setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    /** When metal type changes, also reset purity to the first option */
    const handleMetalTypeChange = (val: string) => {
        const metal = val as MetalType;
        setForm((prev) => ({
            ...prev,
            metalType: metal,
            metalPurity: defaultPurity(metal),
        }));
        if (errors.metalType) setErrors((prev) => ({ ...prev, metalType: undefined }));
    };

    const handleOpenChange = (val: boolean) => {
        if (!val) {
            setForm(getDefaults(undefined, defaultCategoryId));
            setErrors({});
        }
        onOpenChange(val);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        const payload = {
            categoryId: form.categoryId,
            metalType: form.metalType as MetalType,
            metalPurity: form.metalPurity || undefined,
            grossWeight: Number(form.grossWeight),
            netWeight: Number(form.netWeight),
        };

        startTransition(async () => {
            const result = isEdit
                ? await updateInventoryItemAction(item!.id, payload)
                : await saveInventoryItemAction(payload);

            if (result.success) {
                toast.success(result.message);
                handleOpenChange(false);
            } else {
                toast.error(result.message);
            }
        });
    };

    const purityOptions = form.metalType ? PURITY_OPTIONS[form.metalType] : [];

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Item' : 'Add Inventory Item'}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update the item details.'
                            : 'Add a new jewellery item. A unique item code (KJ-XXXX) will be generated automatically.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Category */}
                    <div className="space-y-1.5">
                        <Label htmlFor="item-category">Category</Label>
                        <Select
                            value={form.categoryId}
                            onValueChange={(val) => set('categoryId', val)}
                            disabled={isPending}
                        >
                            <SelectTrigger id="item-category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && (
                            <p className="text-xs text-red-500">{errors.categoryId}</p>
                        )}
                    </div>

                    {/* Metal Type + Purity side-by-side */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="item-metal-type">Metal Type</Label>
                            <Select
                                value={form.metalType}
                                onValueChange={handleMetalTypeChange}
                                disabled={isPending}
                            >
                                <SelectTrigger id="item-metal-type">
                                    <SelectValue placeholder="Select metal type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {METAL_TYPE_OPTIONS.map((m) => (
                                        <SelectItem key={m.value} value={m.value}>
                                            {m.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.metalType && (
                                <p className="text-xs text-red-500">{errors.metalType}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="item-metal-purity">Purity</Label>
                            <Select
                                value={form.metalPurity}
                                onValueChange={(val) => set('metalPurity', val)}
                                disabled={isPending || !form.metalType}
                            >
                                <SelectTrigger id="item-metal-purity">
                                    <SelectValue
                                        placeholder={
                                            form.metalType ? 'Select purity' : 'Select metal first'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {purityOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Weights */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="item-gross-weight">Gross Weight (g)</Label>
                            <Input
                                id="item-gross-weight"
                                type="number"
                                step="0.001"
                                min="0"
                                placeholder="0.000"
                                value={form.grossWeight}
                                onChange={(e) => set('grossWeight', e.target.value)}
                                disabled={isPending}
                            />
                            {errors.grossWeight && (
                                <p className="text-xs text-red-500">{errors.grossWeight}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="item-net-weight">Net Weight (g)</Label>
                            <Input
                                id="item-net-weight"
                                type="number"
                                step="0.001"
                                min="0"
                                placeholder="0.000"
                                value={form.netWeight}
                                onChange={(e) => set('netWeight', e.target.value)}
                                disabled={isPending}
                            />
                            {errors.netWeight && (
                                <p className="text-xs text-red-500">{errors.netWeight}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
