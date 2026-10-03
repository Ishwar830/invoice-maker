'use client';

import { useState, useTransition } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2Icon, TriangleAlertIcon } from 'lucide-react';
import { deleteInvoiceAction } from '@/app/actions/delete-invoice';
import { toast } from 'sonner';

interface DeleteInvoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoiceId: string;
    invoiceNumber: number;
    type: 'sales' | 'purchase';
}

export function DeleteInvoiceDialog({
    open,
    onOpenChange,
    invoiceId,
    invoiceNumber,
    type,
}: DeleteInvoiceDialogProps) {
    const [inputValue, setInputValue] = useState('');
    const [isPending, startTransition] = useTransition();

    const expectedValue = String(invoiceNumber);
    const isMatch = inputValue === expectedValue;

    const handleOpenChange = (val: boolean) => {
        if (!val) setInputValue('');
        onOpenChange(val);
    };

    const handleDelete = () => {
        if (!isMatch) return;
        startTransition(async () => {
            const result = await deleteInvoiceAction(invoiceId, type);
            // Only reached if redirect didn't fire (i.e. an error occurred)
            if (result && !result.success) {
                toast.error(result.message);
                handleOpenChange(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                            <TriangleAlertIcon className="size-5" />
                        </div>
                        <DialogTitle className="text-base">Delete Invoice</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm leading-relaxed">
                        This will permanently delete{' '}
                        <span className="font-semibold text-foreground">
                            Invoice #{invoiceNumber}
                        </span>{' '}
                        and all its associated items. This action{' '}
                        <span className="font-semibold text-red-600 dark:text-red-400">
                            cannot be undone
                        </span>
                        .
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 py-2">
                    <Label htmlFor="confirm-invoice-number" className="text-sm">
                        Type{' '}
                        <span className="font-mono font-semibold text-foreground">
                            {invoiceNumber}
                        </span>{' '}
                        to confirm
                    </Label>
                    <Input
                        id="confirm-invoice-number"
                        placeholder={String(invoiceNumber)}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && isMatch) handleDelete();
                        }}
                        autoComplete="off"
                        disabled={isPending}
                        className={
                            inputValue && !isMatch
                                ? 'border-red-400 focus-visible:ring-red-400'
                                : isMatch
                                  ? 'border-green-500 focus-visible:ring-green-500'
                                  : ''
                        }
                    />
                    {inputValue && !isMatch && (
                        <p className="text-xs text-red-500">
                            Invoice number does not match.
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={!isMatch || isPending}
                        className="gap-2"
                    >
                        <Trash2Icon className="size-4" />
                        {isPending ? 'Deleting…' : 'Delete Invoice'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
