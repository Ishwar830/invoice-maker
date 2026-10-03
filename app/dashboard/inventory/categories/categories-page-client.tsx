'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';
import { AddEditCategoryDialog } from '@/components/inventory/add-edit-category-dialog';

export function CategoriesPageClient() {
    const [addOpen, setAddOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/inventory">
                        <ArrowLeftIcon className="size-4 mr-1.5" />
                        Back to Inventory
                    </Link>
                </Button>
                <Button size="sm" onClick={() => setAddOpen(true)}>
                    <PlusIcon className="size-4 mr-1.5" />
                    Add Category
                </Button>
            </div>

            <AddEditCategoryDialog open={addOpen} onOpenChange={setAddOpen} />
        </>
    );
}
