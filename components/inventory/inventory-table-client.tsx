'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { AddEditItemDialog } from './add-edit-item-dialog';
import { DeleteItemDialog } from './delete-item-dialog';

interface InventoryItem {
    id: string;
    itemCode: string;
    categoryId: string;
    metalType: string;
    metalPurity: string | null;
    grossWeight: number;
    netWeight: number;
    createdAt: Date;
    category: { id: string; name: string } | null;
}

interface Category {
    id: string;
    name: string;
}

interface InventoryTableClientProps {
    items: InventoryItem[];
    categories: Category[];
}

export function InventoryTableClient({ items, categories }: InventoryTableClientProps) {
    const [editTarget, setEditTarget] = useState<InventoryItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{
        id: string;
        itemCode: string;
    } | null>(null);

    return (
        <>
            <div className="rounded-md border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden shadow-sm">
                {/* Desktop Table */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="pl-6 font-semibold text-neutral-500 dark:text-neutral-400">
                                    Item Code
                                </TableHead>
                                <TableHead className="font-semibold text-neutral-500 dark:text-neutral-400">
                                    Category
                                </TableHead>
                                <TableHead className="font-semibold text-neutral-500 dark:text-neutral-400">
                                    Metal
                                </TableHead>
                                <TableHead className="font-semibold text-neutral-500 dark:text-neutral-400">
                                    Gross Wt.
                                </TableHead>
                                <TableHead className="font-semibold text-neutral-500 dark:text-neutral-400">
                                    Net Wt.
                                </TableHead>
                                <TableHead className="text-right pr-6 font-semibold text-neutral-500 dark:text-neutral-400">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="pl-6 py-10 text-sm text-neutral-400 text-center"
                                    >
                                        No items found. Add your first item!
                                    </TableCell>
                                </TableRow>
                            )}
                            {items.map((item) => (
                                <TableRow key={item.id} className="group">
                                    <TableCell className="pl-6 py-4">
                                        <Badge
                                            variant="outline"
                                            className="font-mono text-xs tracking-wider border-neutral-200 dark:border-neutral-700"
                                        >
                                            {item.itemCode}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4 text-sm text-neutral-600 dark:text-neutral-300">
                                        {item.category?.name ?? '—'}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                                                {item.metalType}
                                            </span>
                                            {item.metalPurity && (
                                                <span className="text-xs text-neutral-400 mt-0.5">
                                                    {item.metalPurity}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-sm font-mono text-neutral-600 dark:text-neutral-300">
                                        {Number(item.grossWeight).toFixed(3)} g
                                    </TableCell>
                                    <TableCell className="py-4 text-sm font-mono text-neutral-600 dark:text-neutral-300">
                                        {Number(item.netWeight).toFixed(3)} g
                                    </TableCell>
                                    <TableCell className="py-4 pr-6">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                aria-label={`Edit ${item.itemCode}`}
                                                onClick={() => setEditTarget(item)}
                                            >
                                                <PencilIcon className="size-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                aria-label={`Delete ${item.itemCode}`}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() =>
                                                    setDeleteTarget({
                                                        id: item.id,
                                                        itemCode: item.itemCode,
                                                    })
                                                }
                                            >
                                                <Trash2Icon className="size-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Cards */}
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 md:hidden">
                    {items.length === 0 && (
                        <p className="py-8 px-5 text-sm text-neutral-400 text-center">
                            No items found.
                        </p>
                    )}
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="font-mono text-xs tracking-wider shrink-0"
                                    >
                                        {item.itemCode}
                                    </Badge>
                                    <span className="text-xs text-neutral-400 truncate">
                                        {item.category?.name}
                                    </span>
                                </div>
                                <span className="text-sm text-neutral-700 dark:text-neutral-200">
                                    {item.metalType}
                                    {item.metalPurity ? ` · ${item.metalPurity}` : ''}
                                </span>
                                <span className="text-xs font-mono text-neutral-400">
                                    {Number(item.grossWeight).toFixed(3)} g gross /{' '}
                                    {Number(item.netWeight).toFixed(3)} g net
                                </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-3">
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Edit ${item.itemCode}`}
                                    onClick={() => setEditTarget(item)}
                                >
                                    <PencilIcon className="size-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Delete ${item.itemCode}`}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={() =>
                                        setDeleteTarget({
                                            id: item.id,
                                            itemCode: item.itemCode,
                                        })
                                    }
                                >
                                    <Trash2Icon className="size-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AddEditItemDialog
                open={!!editTarget}
                onOpenChange={(val) => !val && setEditTarget(null)}
                categories={categories}
                item={editTarget}
            />

            <DeleteItemDialog
                open={!!deleteTarget}
                onOpenChange={(val) => !val && setDeleteTarget(null)}
                item={deleteTarget}
            />
        </>
    );
}
