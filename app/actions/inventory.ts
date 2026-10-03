'use server';

import { revalidatePath } from 'next/cache';
import {
    saveCategory,
    updateCategory,
    deleteCategory,
    saveInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
} from '@/db/queries/inventory';
import { categorySchema, inventoryItemSchema } from '@/lib/validations/inventory';

// ─── Category Actions ─────────────────────────────────────────────────────────

export async function saveCategoryAction(data: unknown) {
    try {
        const payload = categorySchema.parse(data);
        await saveCategory(payload);
        revalidatePath('/dashboard/inventory');
        revalidatePath('/dashboard/inventory/categories');
        return { success: true, message: 'Category created successfully!' };
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : 'Failed to create category.';
        return { success: false, message };
    }
}

export async function updateCategoryAction(id: string, data: unknown) {
    try {
        const payload = categorySchema.parse(data);
        await updateCategory(id, payload);
        revalidatePath('/dashboard/inventory');
        revalidatePath('/dashboard/inventory/categories');
        return { success: true, message: 'Category updated successfully!' };
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : 'Failed to update category.';
        return { success: false, message };
    }
}

export async function deleteCategoryAction(id: string) {
    try {
        await deleteCategory(id);
        revalidatePath('/dashboard/inventory');
        revalidatePath('/dashboard/inventory/categories');
        return { success: true, message: 'Category deleted successfully!' };
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : 'Failed to delete category.';
        return { success: false, message };
    }
}

// ─── Inventory Item Actions ───────────────────────────────────────────────────

export async function saveInventoryItemAction(data: unknown) {
    try {
        const payload = inventoryItemSchema.parse(data);
        const item = await saveInventoryItem(payload);
        revalidatePath('/dashboard/inventory');
        return { success: true, message: `Item ${item.itemCode} added to inventory!` };
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : 'Failed to add inventory item.';
        return { success: false, message };
    }
}

export async function updateInventoryItemAction(id: string, data: unknown) {
    try {
        const payload = inventoryItemSchema.parse(data);
        await updateInventoryItem(id, payload);
        revalidatePath('/dashboard/inventory');
        return { success: true, message: 'Item updated successfully!' };
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : 'Failed to update item.';
        return { success: false, message };
    }
}

export async function deleteInventoryItemAction(id: string) {
    try {
        await deleteInventoryItem(id);
        revalidatePath('/dashboard/inventory');
        return { success: true, message: 'Item deleted successfully!' };
    } catch (error) {
        console.error(error);
        const message =
            error instanceof Error ? error.message : 'Failed to delete item.';
        return { success: false, message };
    }
}
