'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { AddEditItemDialog } from '@/components/inventory/add-edit-item-dialog';

interface Category {
    id: string;
    name: string;
}

interface CategoryDetailClientProps {
    /** Pre-select the current category in the add dialog */
    currentCategory: Category;
    allCategories: Category[];
}

export function CategoryDetailClient({
    currentCategory,
    allCategories,
}: CategoryDetailClientProps) {
    const [addOpen, setAddOpen] = useState(false);

    return (
        <>
            <Button size="sm" onClick={() => setAddOpen(true)}>
                <PlusIcon className="size-4 mr-1.5" />
                Add Item
            </Button>

            <AddEditItemDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                categories={allCategories}
                /* Pre-select the current category */
                defaultCategoryId={currentCategory.id}
            />
        </>
    );
}
