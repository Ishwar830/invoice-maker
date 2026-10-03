'use server';

import { searchInventoryItemsByCode } from '@/db/queries/inventory';
import type { InventorySearchResult } from '@/lib/types';

// export type { InventorySearchResult };

export async function searchInventoryItemsAction(
    query: string
): Promise<InventorySearchResult[]> {
    try {
        return await searchInventoryItemsByCode(query, 5);
    } catch (error) {
        console.error('[searchInventoryItemsAction]', error);
        return [];
    }
}
