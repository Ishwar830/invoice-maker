'use server';

import { redirect } from 'next/navigation';
import { searchInventoryItemsByCode } from '@/db/queries/inventory';
import type { InventorySearchResult } from '@/lib/types';
import { getSession } from '@/lib/session';

export async function searchInventoryItemsAction(
    query: string
): Promise<InventorySearchResult[]> {
    const session = await getSession();
    if (!session) redirect('/login');

    try {
        return await searchInventoryItemsByCode(session.shopId, query, 5);
    } catch (error) {
        console.error('[searchInventoryItemsAction]', error);
        return [];
    }
}
