import { eq, count, desc, ilike, sql, and, inArray } from 'drizzle-orm';
import { db } from '../index';
import { inventoryCategoriesTable, inventoryItemsTable } from '../schema';
import {
    type CategoryPayload,
    type InventoryItemPayload,
} from '@/lib/validations/inventory';
import type { InventorySearchResult } from '@/lib/types';

const ITEMS_PER_PAGE = 10;

// ─── Item Code Generation ────────────────────────────────────────────────────

function generateItemCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const code = Array.from({ length: 6 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    return code;
}

async function generateUniqueItemCode(shopId: string): Promise<string> {
    for (let attempt = 0; attempt < 10; attempt++) {
        const code = generateItemCode();
        const existing = await db.query.inventoryItemsTable.findFirst({
            where: and(
                eq(inventoryItemsTable.shopId, shopId),
                eq(inventoryItemsTable.itemCode, code)
            ),
        });
        if (!existing) return code;
    }
    throw new Error('Failed to generate a unique item code after 10 attempts.');
}

// ─── Category Queries ─────────────────────────────────────────────────────────

export const getCategories = async (shopId: string) => {
    return db.query.inventoryCategoriesTable.findMany({
        where: eq(inventoryCategoriesTable.shopId, shopId),
        orderBy: (t, { asc }) => [asc(t.name)],
        with: {
            items: {
                columns: { id: true },
            },
        },
    });
};

export const getCategoriesWithStats = async (shopId: string) => {
    const rows = await db
        .select({
            id: inventoryCategoriesTable.id,
            name: inventoryCategoriesTable.name,
            createdAt: inventoryCategoriesTable.createdAt,
            itemCount: count(inventoryItemsTable.id),
            totalGrossWeight: sql<string>`coalesce(sum(${inventoryItemsTable.grossWeight}), 0)`,
            totalNetWeight: sql<string>`coalesce(sum(${inventoryItemsTable.netWeight}), 0)`,
        })
        .from(inventoryCategoriesTable)
        .leftJoin(
            inventoryItemsTable,
            and(
                eq(inventoryItemsTable.categoryId, inventoryCategoriesTable.id),
                eq(inventoryItemsTable.status, 'available')
            )
        )
        .where(eq(inventoryCategoriesTable.shopId, shopId))
        .groupBy(inventoryCategoriesTable.id, inventoryCategoriesTable.name, inventoryCategoriesTable.createdAt)
        .orderBy(inventoryCategoriesTable.name);

    return rows.map((r) => ({
        ...r,
        itemCount: Number(r.itemCount),
        totalGrossWeight: Number(r.totalGrossWeight),
        totalNetWeight: Number(r.totalNetWeight),
    }));
};

export const getCategoryById = async (id: string, shopId: string) => {
    return db.query.inventoryCategoriesTable.findFirst({
        where: and(
            eq(inventoryCategoriesTable.id, id),
            eq(inventoryCategoriesTable.shopId, shopId)
        ),
    });
};

export const saveCategory = async (data: CategoryPayload, shopId: string) => {
    const [inserted] = await db
        .insert(inventoryCategoriesTable)
        .values({ name: data.name, shopId })
        .returning();
    return inserted;
};

export const updateCategory = async (id: string, data: CategoryPayload, shopId: string) => {
    const [updated] = await db
        .update(inventoryCategoriesTable)
        .set({ name: data.name })
        .where(
            and(
                eq(inventoryCategoriesTable.id, id),
                eq(inventoryCategoriesTable.shopId, shopId)
            )
        )
        .returning();
    return updated;
};

export const deleteCategory = async (id: string, shopId: string) => {
    const itemCount = await db
        .select({ total: count() })
        .from(inventoryItemsTable)
        .where(
            and(
                eq(inventoryItemsTable.categoryId, id),
                eq(inventoryItemsTable.shopId, shopId)
            )
        );

    if ((itemCount[0]?.total ?? 0) > 0) {
        throw new Error(
            'Cannot delete this category because it still has items. Remove all items first.'
        );
    }

    const [deleted] = await db
        .delete(inventoryCategoriesTable)
        .where(
            and(
                eq(inventoryCategoriesTable.id, id),
                eq(inventoryCategoriesTable.shopId, shopId)
            )
        )
        .returning();
    return deleted;
};

// ─── Inventory Item Queries ───────────────────────────────────────────────────

export const getInventoryItemsCount = async (shopId: string, categoryId?: string, search?: string) => {
    const searchCondition = search?.trim()
        ? ilike(inventoryItemsTable.itemCode, `%${search.trim()}%`)
        : undefined;

    const result = await db
        .select({ total: count() })
        .from(inventoryItemsTable)
        .where(
            and(
                eq(inventoryItemsTable.shopId, shopId),
                eq(inventoryItemsTable.status, 'available'),
                categoryId ? eq(inventoryItemsTable.categoryId, categoryId) : undefined,
                searchCondition
            )
        );
    return result[0]?.total ?? 0;
};

export const getInventoryItemsPageCount = async (shopId: string, categoryId?: string, search?: string) => {
    const total = await getInventoryItemsCount(shopId, categoryId, search);
    return Math.ceil(total / ITEMS_PER_PAGE);
};

export const getInventoryItems = async (shopId: string, categoryId?: string, page = 1, search?: string) => {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const searchCondition = search?.trim()
        ? ilike(inventoryItemsTable.itemCode, `%${search.trim()}%`)
        : undefined;

    return db.query.inventoryItemsTable.findMany({
        where: (t, { eq, and }) =>
            and(
                eq(t.shopId, shopId),
                eq(t.status, 'available'),
                categoryId ? eq(t.categoryId, categoryId) : undefined,
                searchCondition
            ),
        orderBy: (t, { desc }) => [desc(t.createdAt)],
        limit: ITEMS_PER_PAGE,
        offset,
        with: {
            category: {
                columns: { id: true, name: true },
            },
        },
    });
};

export const saveInventoryItem = async (data: InventoryItemPayload, shopId: string) => {
    const itemCode = await generateUniqueItemCode(shopId);
    const [inserted] = await db
        .insert(inventoryItemsTable)
        .values({ ...data, itemCode, shopId })
        .returning();
    return inserted;
};

export const updateInventoryItem = async (id: string, data: InventoryItemPayload, shopId: string) => {
    const [updated] = await db
        .update(inventoryItemsTable)
        .set({
            categoryId: data.categoryId,
            metalType: data.metalType,
            metalPurity: data.metalPurity,
            grossWeight: data.grossWeight,
            netWeight: data.netWeight,
        })
        .where(
            and(
                eq(inventoryItemsTable.id, id),
                eq(inventoryItemsTable.shopId, shopId)
            )
        )
        .returning();
    return updated;
};

export const deleteInventoryItem = async (id: string, shopId: string) => {
    const [deleted] = await db
        .delete(inventoryItemsTable)
        .where(
            and(
                eq(inventoryItemsTable.id, id),
                eq(inventoryItemsTable.shopId, shopId)
            )
        )
        .returning();
    return deleted;
};

export const getInventoryStats = async (shopId: string) => {
    const [totalItems] = await db
        .select({ total: count() })
        .from(inventoryItemsTable)
        .where(eq(inventoryItemsTable.shopId, shopId));

    const [totalCategories] = await db
        .select({ total: count() })
        .from(inventoryCategoriesTable)
        .where(eq(inventoryCategoriesTable.shopId, shopId));

    const perCategory = await db
        .select({
            categoryId: inventoryItemsTable.categoryId,
            categoryName: inventoryCategoriesTable.name,
            total: count(inventoryItemsTable.id),
        })
        .from(inventoryItemsTable)
        .leftJoin(
            inventoryCategoriesTable,
            eq(inventoryItemsTable.categoryId, inventoryCategoriesTable.id)
        )
        .where(eq(inventoryItemsTable.shopId, shopId))
        .groupBy(inventoryItemsTable.categoryId, inventoryCategoriesTable.name)
        .orderBy(desc(count(inventoryItemsTable.id)));

    return {
        totalItems: totalItems?.total ?? 0,
        totalCategories: totalCategories?.total ?? 0,
        perCategory,
    };
};

// ─── Inventory Search for Invoice Linking ────────────────────────────────────
// InventorySearchResult type is defined in @/lib/types

export const searchInventoryItemsByCode = async (
    shopId: string,
    query: string,
    limit = 5
): Promise<InventorySearchResult[]> => {
    if (!query || query.trim().length === 0) return [];

    const searchTerm = `%${query.trim()}%`;
    const rows = await db
        .select({
            id: inventoryItemsTable.id,
            itemCode: inventoryItemsTable.itemCode,
            metalType: inventoryItemsTable.metalType,
            metalPurity: inventoryItemsTable.metalPurity,
            grossWeight: inventoryItemsTable.grossWeight,
            netWeight: inventoryItemsTable.netWeight,
            categoryName: inventoryCategoriesTable.name,
        })
        .from(inventoryItemsTable)
        .leftJoin(
            inventoryCategoriesTable,
            eq(inventoryItemsTable.categoryId, inventoryCategoriesTable.id)
        )
        .where(
            and(
                eq(inventoryItemsTable.shopId, shopId),
                eq(inventoryItemsTable.status, 'available'),
                ilike(inventoryItemsTable.itemCode, searchTerm)
            )
        )
        .orderBy(inventoryItemsTable.itemCode)
        .limit(limit);

    return rows.map((r) => ({
        ...r,
        categoryName: r.categoryName ?? 'Unknown',
    }));
};

export const markItemsAsSold = async (
    itemIds: string[],
    tx?: Parameters<Parameters<typeof db.transaction>[0]>[0]
): Promise<void> => {
    if (itemIds.length === 0) return;
    const executor = tx ?? db;
    await executor
        .update(inventoryItemsTable)
        .set({ status: 'sold' })
        .where(inArray(inventoryItemsTable.id, itemIds));
};

export const markItemsAsAvailable = async (
    itemIds: string[],
    tx?: Parameters<Parameters<typeof db.transaction>[0]>[0]
): Promise<void> => {
    if (itemIds.length === 0) return;
    const executor = tx ?? db;
    await executor
        .update(inventoryItemsTable)
        .set({ status: 'available' })
        .where(inArray(inventoryItemsTable.id, itemIds));
};
