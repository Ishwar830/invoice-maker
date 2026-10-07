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
import { AddEditCategoryDialog } from './add-edit-category-dialog';
import { DeleteCategoryDialog } from './delete-category-dialog';

interface Category {
    id: string;
    name: string;
    items: { id: string }[];
    createdAt: Date;
}

interface CategoryTableProps {
    categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
    const [editTarget, setEditTarget] = useState<{ id: string; name: string } | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(
        null
    );

    return (
        <>
            <div className="rounded-md border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden shadow-sm">
                {/* Desktop Table */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="pl-6 font-semibold text-neutral-500 dark:text-neutral-400">
                                    Category Name
                                </TableHead>
                                <TableHead className="font-semibold text-neutral-500 dark:text-neutral-400">
                                    Items
                                </TableHead>
                                <TableHead className="font-semibold text-neutral-500 dark:text-neutral-400">
                                    Created
                                </TableHead>
                                <TableHead className="text-right pr-6 font-semibold text-neutral-500 dark:text-neutral-400">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="pl-6 py-8 text-sm text-neutral-400 text-center"
                                    >
                                        No categories yet. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                            {categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="pl-6 py-4 font-medium text-neutral-800 dark:text-neutral-100">
                                        {cat.name}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge
                                            variant="secondary"
                                            className="font-mono text-xs"
                                        >
                                            {cat.items.length}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                                        {new Date(cat.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell className="py-4 pr-6">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                aria-label={`Edit ${cat.name}`}
                                                onClick={() =>
                                                    setEditTarget({ id: cat.id, name: cat.name })
                                                }
                                            >
                                                <PencilIcon className="size-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                aria-label={`Delete ${cat.name}`}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() =>
                                                    setDeleteTarget({ id: cat.id, name: cat.name })
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
                    {categories.length === 0 && (
                        <p className="py-8 px-5 text-sm text-neutral-400 text-center">
                            No categories yet. Create one to get started.
                        </p>
                    )}
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex items-center justify-between p-4"
                        >
                            <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-neutral-800 dark:text-neutral-100 truncate">
                                        {cat.name}
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="font-mono text-xs shrink-0"
                                    >
                                        {cat.items.length} {cat.items.length === 1 ? 'item' : 'items'}
                                    </Badge>
                                </div>
                                <span className="text-xs text-neutral-400">
                                    Created{' '}
                                    {new Date(cat.createdAt).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-3">
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Edit ${cat.name}`}
                                    onClick={() =>
                                        setEditTarget({ id: cat.id, name: cat.name })
                                    }
                                >
                                    <PencilIcon className="size-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Delete ${cat.name}`}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={() =>
                                        setDeleteTarget({ id: cat.id, name: cat.name })
                                    }
                                >
                                    <Trash2Icon className="size-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AddEditCategoryDialog
                open={!!editTarget}
                onOpenChange={(val) => !val && setEditTarget(null)}
                category={editTarget}
            />

            <DeleteCategoryDialog
                open={!!deleteTarget}
                onOpenChange={(val) => !val && setDeleteTarget(null)}
                category={deleteTarget}
            />
        </>
    );
}
