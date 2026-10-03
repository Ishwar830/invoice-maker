'use client';

import { useTransition } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { deleteInventoryItemAction } from '@/app/actions/inventory';
import { toast } from 'sonner';

interface DeleteItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: { id: string; itemCode: string } | null;
}

export function DeleteItemDialog({ open, onOpenChange, item }: DeleteItemDialogProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!item) return;
        startTransition(async () => {
            const result = await deleteInventoryItemAction(item.id);
            if (result.success) {
                toast.success(result.message);
                onOpenChange(false);
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Item</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to permanently delete item{' '}
                        <span className="font-semibold font-mono text-foreground">
                            {item?.itemCode}
                        </span>
                        ? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {isPending ? 'Deleting…' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
