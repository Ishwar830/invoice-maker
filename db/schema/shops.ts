import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersTable } from './users';
import { salesInvoicesTable } from './sales-invoices';
import { purchaseInvoicesTable } from './purchase-invoices';
import { inventoryCategoriesTable } from './inventory-categories';
import { inventoryItemsTable } from './inventory-items';

export const shopsTable = table('shops', {
    id: t.uuid().defaultRandom().primaryKey(),
    userId: t
        .uuid()
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    name: t.varchar({ length: 200 }).notNull(),
    ownerName: t.varchar({ length: 200 }),
    gstNumber: t.varchar({ length: 20 }),
    phone: t.varchar({ length: 50 }),
    address: t.varchar({ length: 500 }),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const shopsRelations = relations(shopsTable, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [shopsTable.userId],
        references: [usersTable.id],
    }),
    salesInvoices: many(salesInvoicesTable),
    purchaseInvoices: many(purchaseInvoicesTable),
    inventoryCategories: many(inventoryCategoriesTable),
    inventoryItems: many(inventoryItemsTable),
}));
