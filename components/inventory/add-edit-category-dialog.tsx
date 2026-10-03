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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveCategoryAction, updateCategoryAction } from '@/app/actions/inventory';
import { toast } from 'sonner';

interface AddEditCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Pass an existing category to switch to edit mode */
    category?: { id: string; name: string } | null;
}

export function AddEditCategoryDialog({
    open,
    onOpenChange,
    category,
}: AddEditCategoryDialogProps) {
    const isEdit = !!category;
    const [isPending, startTransition] = useTransition();
    const [name, setName] = useState(category?.name ?? '');
    const [error, setError] = useState<string | null>(null);

    // Sync name when dialog opens with different category data
    useEffect(() => {
        if (open) {
            setName(category?.name ?? '');
            setError(null);
        }
    }, [open, category]);

    const handleOpenChange = (val: boolean) => {
        if (!val) {
            setName('');
            setError(null);
        }
        onOpenChange(val);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();

        if (!trimmed) {
            setError('Category name is required.');
            return;
        }
        if (trimmed.length > 100) {
            setError('Category name must be 100 characters or less.');
            return;
        }

        setError(null);
        startTransition(async () => {
            const result = isEdit
                ? await updateCategoryAction(category!.id, { name: trimmed })
                : await saveCategoryAction({ name: trimmed });

            if (result.success) {
                toast.success(result.message);
                handleOpenChange(false);
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Category' : 'Add Category'}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update the category name.'
                            : 'Create a new jewellery category (e.g. Necklace, Ring).'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                            id="category-name"
                            placeholder="e.g. Necklace"
                            autoFocus
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError(null);
                            }}
                            disabled={isPending}
                        />
                        {error && <p className="text-xs text-red-500">{error}</p>}
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
                            {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
