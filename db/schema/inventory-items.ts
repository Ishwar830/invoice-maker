import { pgTable as table, uniqueIndex } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { shopsTable } from './shops';
import { inventoryCategoriesTable } from './inventory-categories';

export const inventoryItemsTable = table(
    'inventory_items',
    {
        id: t.uuid().defaultRandom().primaryKey(),
        shopId: t
            .uuid()
            .references(() => shopsTable.id, { onDelete: 'cascade' })
            .notNull(),
        itemCode: t.varchar({ length: 10 }).notNull(),
        categoryId: t
            .uuid()
            .references(() => inventoryCategoriesTable.id)
            .notNull(),
        metalType: t.varchar({ length: 50 }).notNull(),
        metalPurity: t.varchar({ length: 20 }),
        grossWeight: t.decimal<'number'>({ precision: 10, scale: 3 }).default(0).notNull(),
        netWeight: t.decimal<'number'>({ precision: 10, scale: 3 }).default(0).notNull(),
        status: t.varchar({ length: 20 }).notNull().default('available'),
        createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
        // itemCode unique per shop, not globally
        uniqueIndex('inventory_items_shop_item_code_idx').on(table.shopId, table.itemCode),
    ]
);

export const inventoryItemsRelations = relations(inventoryItemsTable, ({ one }) => ({
    shop: one(shopsTable, {
        fields: [inventoryItemsTable.shopId],
        references: [shopsTable.id],
    }),
    category: one(inventoryCategoriesTable, {
        fields: [inventoryItemsTable.categoryId],
        references: [inventoryCategoriesTable.id],
    }),
}));
