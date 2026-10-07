import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getCategoriesWithStats } from '@/db/queries/inventory';
import { requireSession } from '@/lib/session';
import { PackageIcon, ChevronRightIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export async function CategoryOverview() {
    const { shopId } = await requireSession();
    const categories = await getCategoriesWithStats(shopId);

    if (categories.length === 0) {
        return (
            <Card className="border border-dashed border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                        <PackageIcon className="size-6" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                        No categories yet
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                        Click &quot;Manage Categories&quot; to add your first category.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="rounded-md border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden shadow-sm">
            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="pl-6 font-semibold text-neutral-500 dark:text-neutral-400">
                                Category
                            </TableHead>
                            <TableHead className="font-semibold text-neutral-500 dark:text-neutral-400">
                                Items
                            </TableHead>
                            <TableHead className="font-semibold text-neutral-500 dark:text-neutral-400">
                                Gross Weight
                            </TableHead>
                            <TableHead className="font-semibold text-neutral-500 dark:text-neutral-400">
                                Net Weight
                            </TableHead>
                            <TableHead className="pr-6" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat.id} className="group relative cursor-pointer">
                                <TableCell className="pl-6 py-4">
                                    <Link
                                        href={`/dashboard/inventory/${cat.id}`}
                                        className="before:absolute before:inset-0 font-medium text-neutral-800 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge
                                        variant="secondary"
                                        className="font-mono text-xs"
                                    >
                                        {cat.itemCount}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 font-mono text-sm text-neutral-600 dark:text-neutral-300">
                                    {cat.totalGrossWeight.toFixed(3)}
                                    <span className="text-xs text-neutral-400 ml-1">g</span>
                                </TableCell>
                                <TableCell className="py-4 font-mono text-sm text-neutral-600 dark:text-neutral-300">
                                    {cat.totalNetWeight.toFixed(3)}
                                    <span className="text-xs text-neutral-400 ml-1">g</span>
                                </TableCell>
                                <TableCell className="pr-6 py-4" />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 md:hidden">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/dashboard/inventory/${cat.id}`}
                        className="flex items-center justify-between p-4 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors active:bg-neutral-100 dark:active:bg-neutral-800/60"
                    >
                        <div className="flex flex-col gap-1.5 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-neutral-800 dark:text-neutral-100 text-sm truncate">
                                    {cat.name}
                                </span>
                                <Badge
                                    variant="secondary"
                                    className="font-mono text-xs shrink-0"
                                >
                                    {cat.itemCount} {cat.itemCount === 1 ? 'item' : 'items'}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                                <span>
                                    <span className="text-neutral-400">Gross:</span>{' '}
                                    <span className="text-neutral-700 dark:text-neutral-200">
                                        {cat.totalGrossWeight.toFixed(3)}g
                                    </span>
                                </span>
                                <span>•</span>
                                <span>
                                    <span className="text-neutral-400">Net:</span>{' '}
                                    <span className="text-neutral-700 dark:text-neutral-200">
                                        {cat.totalNetWeight.toFixed(3)}g
                                    </span>
                                </span>
                            </div>
                        </div>
                        <ChevronRightIcon className="size-4 text-neutral-400 shrink-0 ml-3" />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export function CategoryOverviewSkeleton() {
    return (
        <div className="rounded-md border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden shadow-sm">
            {/* Desktop Skeleton */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {['Category', 'Items', 'Gross Weight', 'Net Weight', ''].map((h, i) => (
                                <TableHead
                                    key={i}
                                    className={i === 0 ? 'pl-6' : i === 4 ? 'pr-6' : ''}
                                >
                                    <Skeleton className="h-4 w-16" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell className="pl-6 py-4">
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>
                                <TableCell className="py-4">
                                    <Skeleton className="h-5 w-8 rounded-md" />
                                </TableCell>
                                <TableCell className="py-4">
                                    <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell className="py-4">
                                    <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell className="pr-6 py-4 text-right">
                                    <Skeleton className="h-4 w-4 ml-auto" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Skeleton */}
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 md:hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-12 rounded-md" />
                            </div>
                            <Skeleton className="h-3 w-40" />
                        </div>
                        <Skeleton className="h-4 w-4 shrink-0 ml-3 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
