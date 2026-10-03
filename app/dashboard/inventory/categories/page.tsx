import { playfair } from '@/lib/fonts';
import { getCategories } from '@/db/queries/inventory';
import { CategoryTable } from '@/components/inventory/category-table';
import { CategoriesPageClient } from './categories-page-client';

export const metadata = {
    title: 'Manage Categories — Krishna Jewellers',
    description: 'Add, edit, and remove jewellery inventory categories.',
};

export default async function CategoriesPage() {
    const categories = await getCategories();

    // Serialise Date to ISO string so it's passable to client components
    const serialised = categories.map((c) => ({
        ...c,
        createdAt: new Date(c.createdAt),
    }));

    return (
        <div className="px-6 py-10 max-w-5xl mx-auto flex flex-col gap-8">
            {/* Top bar */}
            <CategoriesPageClient />

            {/* Header */}
            <div>
                <h1
                    className={`${playfair.className} text-2xl md:text-3xl font-semibold tracking-wide text-neutral-800 dark:text-neutral-100`}
                >
                    Manage Categories
                </h1>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Create and manage jewellery categories (e.g. Necklace, Ring, Bangle).
                </p>
            </div>

            {/* Table */}
            <CategoryTable categories={serialised} />
        </div>
    );
}
