import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { inventoryItemsTable } from './inventory-items';

export const inventoryCategoriesTable = table('inventory_categories', {
    id: t.uuid().defaultRandom().primaryKey(),
    name: t.varchar({ length: 100 }).notNull().unique(),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const inventoryCategoriesRelations = relations(
    inventoryCategoriesTable,
    ({ many }) => ({
        items: many(inventoryItemsTable),
    })
);
