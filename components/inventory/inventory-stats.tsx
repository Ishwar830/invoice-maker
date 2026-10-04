import { PackageIcon, TagIcon, LayoutGridIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInventoryStats } from '@/db/queries/inventory';
import { requireSession } from '@/lib/session';

export async function InventoryStats() {
    const { shopId } = await requireSession();
    const stats = await getInventoryStats(shopId);

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                        Total Items
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <PackageIcon className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                        {stats.totalItems}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">pieces in stock</p>
                </CardContent>
            </Card>

            <Card className="border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                        Categories
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <LayoutGridIcon className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                        {stats.totalCategories}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">active categories</p>
                </CardContent>
            </Card>

            <Card className="border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                        Top Category
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <TagIcon className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    {stats.perCategory[0] ? (
                        <>
                            <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                                {stats.perCategory[0].categoryName ?? '—'}
                            </p>
                            <p className="text-xs text-neutral-400 mt-0.5">
                                {stats.perCategory[0].total} items
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-neutral-400">No items yet</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export function InventoryStatsSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card
                    key={i}
                    className="border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 animate-pulse"
                >
                    <CardHeader className="pb-2">
                        <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-700" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-12 rounded bg-neutral-200 dark:bg-neutral-700 mb-1" />
                        <div className="h-3 w-24 rounded bg-neutral-100 dark:bg-neutral-800" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
