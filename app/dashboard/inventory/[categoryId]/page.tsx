import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ScaleIcon, PackageIcon } from 'lucide-react';
import { playfair } from '@/lib/fonts';
import {
    getCategoryById,
    getCategories,
    getCategoriesWithStats,
} from '@/db/queries/inventory';
import { requireSession, getSession } from '@/lib/session';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { InventoryTableSkeleton } from '@/components/inventory/inventory-table-skeleton';
import InventoryPagination from '@/components/inventory/inventory-pagination';
import { CategoryDetailClient } from './category-detail-client';

type Props = {
    params: Promise<{ categoryId: string }>;
    searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { categoryId } = await params;
    const session = await getSession();
    const category = session ? await getCategoryById(categoryId, session.shopId) : null;
    return {
        title: category
            ? `${category.name} — Inventory`
            : 'Category — Inventory',
    };
}

export default async function CategoryDetailPage({ params, searchParams }: Props) {
    const { categoryId } = await params;
    const { page: pageStr } = await searchParams;
    const page = Number(pageStr ?? '1');
    const { shopId } = await requireSession();

    // Fetch in parallel — notFound handled after
    const [category, allCategoryStats, allCategories] = await Promise.all([
        getCategoryById(categoryId, shopId),
        getCategoriesWithStats(shopId),
        getCategories(shopId),
    ]);

    if (!category) notFound();

    const stats = allCategoryStats.find((c) => c.id === categoryId);
    const clientCategories = allCategories.map((c) => ({ id: c.id, name: c.name }));

    return (
        <div className="px-4 py-6 md:px-6 md:py-10 max-w-5xl mx-auto flex flex-col gap-6 md:gap-8">
            {/* Back + Add */}
            <div className="flex items-center justify-between gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/inventory">
                        <ArrowLeftIcon className="size-4 mr-1.5" />
                        All Categories
                    </Link>
                </Button>

                <CategoryDetailClient
                    currentCategory={{ id: category.id, name: category.name }}
                    allCategories={clientCategories}
                />
            </div>

            {/* Header */}
            <div>
                <h1
                    className={`${playfair.className} text-2xl md:text-3xl font-semibold tracking-wide text-neutral-800 dark:text-neutral-100`}
                >
                    {category.name}
                </h1>

                {/* Quick stats */}
                {stats && (
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                            <PackageIcon className="size-3.5 text-amber-500" />
                            <strong className="text-neutral-700 dark:text-neutral-200">
                                {stats.itemCount}
                            </strong>{' '}
                            {stats.itemCount === 1 ? 'item' : 'items'}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                            <ScaleIcon className="size-3.5 text-amber-500" />
                            <span className="font-mono">
                                <strong className="text-neutral-700 dark:text-neutral-200">
                                    {stats.totalGrossWeight.toFixed(3)}
                                </strong>{' '}
                                g gross /{' '}
                                <strong className="text-neutral-700 dark:text-neutral-200">
                                    {stats.totalNetWeight.toFixed(3)}
                                </strong>{' '}
                                g net
                            </span>
                        </span>
                    </div>
                )}
            </div>

            {/* Items table */}
            <Suspense fallback={<InventoryTableSkeleton />}>
                <InventoryTable categoryId={categoryId} page={page} />
            </Suspense>

            {/* Pagination */}
            <Suspense fallback={null}>
                <InventoryPagination categoryId={categoryId} currentPage={page} />
            </Suspense>
        </div>
    );
}
