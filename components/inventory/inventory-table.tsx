import { getInventoryItems, getCategories } from '@/db/queries/inventory';
import { requireSession } from '@/lib/session';
import { InventoryTableClient } from './inventory-table-client';
import { Card, CardContent } from '@/components/ui/card';
import { PackageIcon } from 'lucide-react';

interface InventoryTableProps {
    categoryId?: string;
    page?: number;
    search?: string;
}

export async function InventoryTable({ categoryId, page = 1, search }: InventoryTableProps) {
    let items: Awaited<ReturnType<typeof getInventoryItems>> = [];
    let categories: Awaited<ReturnType<typeof getCategories>> = [];
    let errorMessage: string | null = null;

    try {
        const { shopId } = await requireSession();
        [items, categories] = await Promise.all([
            getInventoryItems(shopId, categoryId, page, search),
            getCategories(shopId),
        ]);
    } catch {
        errorMessage = 'Could not load inventory items.';
    }

    if (errorMessage) {
        return (
            <Card className="border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                <CardContent className="py-8 text-sm text-red-600 text-center">
                    {errorMessage}
                </CardContent>
            </Card>
        );
    }

    if (items.length === 0 && !categoryId && !search && page === 1) {
        return (
            <Card className="border border-dashed border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                        <PackageIcon className="size-6" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                        No items in inventory
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                        Add your first item using the button above.
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Strip items array type to be compatible with client component
    const clientItems = items.map((item) => ({
        ...item,
        grossWeight: Number(item.grossWeight),
        netWeight: Number(item.netWeight),
        createdAt: new Date(item.createdAt),
    }));

    const clientCategories = categories.map((c) => ({ id: c.id, name: c.name }));

    return <InventoryTableClient items={clientItems} categories={clientCategories} search={search} />;
}
