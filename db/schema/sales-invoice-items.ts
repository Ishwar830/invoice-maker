import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { salesInvoicesTable } from './sales-invoices';
import { inventoryItemsTable } from './inventory-items';
import { relations } from 'drizzle-orm';

export const salesInvoiceItemsTable = table('sales_invoice_items', {
    id: t.uuid().defaultRandom().primaryKey(),
    invoiceId: t
        .uuid()
        .references(() => salesInvoicesTable.id)
        .notNull(),
    description: t.varchar().notNull(),
    metalType: t.varchar().notNull(),
    metalPurity: t.varchar(),
    metalRate: t.decimal<'number'>().default(0).notNull(),
    grossWeight: t.decimal<'number'>().default(0).notNull(),
    netWeight: t.decimal<'number'>().default(0).notNull(),
    makingChargesPercent: t.decimal<'number'>().default(0).notNull(),
    makingChargesAmount: t.decimal<'number'>().default(0).notNull(),
    itemTotal: t.decimal<'number'>().default(0).notNull(),
    /** FK to inventory_items — set when this line was populated from inventory */
    inventoryItemId: t
        .uuid()
        .references(() => inventoryItemsTable.id, { onDelete: 'set null' }),
});

export const salesInvoiceItemsRelations = relations(
    salesInvoiceItemsTable,
    ({ one }) => ({
        invoice: one(salesInvoicesTable, {
            fields: [salesInvoiceItemsTable.invoiceId],
            references: [salesInvoicesTable.id],
        }),
        inventoryItem: one(inventoryItemsTable, {
            fields: [salesInvoiceItemsTable.inventoryItemId],
            references: [inventoryItemsTable.id],
        }),
    })
);
