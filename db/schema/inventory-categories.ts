import { pgTable as table, uniqueIndex } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { shopsTable } from './shops';
import { inventoryItemsTable } from './inventory-items';

export const inventoryCategoriesTable = table(
    'inventory_categories',
    {
        id: t.uuid().defaultRandom().primaryKey(),
        shopId: t
            .uuid()
            .references(() => shopsTable.id, { onDelete: 'cascade' })
            .notNull(),
        name: t.varchar({ length: 100 }).notNull(),
        createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex('inventory_categories_shop_name_idx').on(
            table.shopId,
            table.name
        ),
    ]
);

export const inventoryCategoriesRelations = relations(
    inventoryCategoriesTable,
    ({ one, many }) => ({
        shop: one(shopsTable, {
            fields: [inventoryCategoriesTable.shopId],
            references: [shopsTable.id],
        }),
        items: many(inventoryItemsTable),
    })
);
