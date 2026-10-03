import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings2Icon } from 'lucide-react';
import { playfair } from '@/lib/fonts';
import {
    CategoryOverview,
    CategoryOverviewSkeleton,
} from '@/components/inventory/category-overview';

export const metadata = {
    title: 'Inventory — Krishna Jewellers',
    description: 'Manage jewellery stock across categories.',
};

export default function InventoryPage() {
    return (
        <div className="px-6 py-10 max-w-5xl mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1
                        className={`${playfair.className} text-2xl md:text-3xl font-semibold tracking-wide text-neutral-800 dark:text-neutral-100`}
                    >
                        Inventory
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Select a category to view and manage its items.
                    </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/inventory/categories">
                        <Settings2Icon className="size-4 mr-1.5" />
                        Manage Categories
                    </Link>
                </Button>
            </div>

            {/* Category cards */}
            <Suspense fallback={<CategoryOverviewSkeleton />}>
                <CategoryOverview />
            </Suspense>
        </div>
    );
}
