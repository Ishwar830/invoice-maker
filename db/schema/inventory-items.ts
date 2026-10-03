import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { inventoryCategoriesTable } from './inventory-categories';

export const inventoryItemsTable = table('inventory_items', {
    id: t.uuid().defaultRandom().primaryKey(),
    itemCode: t.varchar({ length: 10 }).notNull().unique(),
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
});

export const inventoryItemsRelations = relations(inventoryItemsTable, ({ one }) => ({
    category: one(inventoryCategoriesTable, {
        fields: [inventoryItemsTable.categoryId],
        references: [inventoryCategoriesTable.id],
    }),
}));
