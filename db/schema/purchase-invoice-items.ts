import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { purchaseInvoicesTable } from './purchase-invoices';
import { relations } from 'drizzle-orm';

export const purchaseInvoiceItemsTable = table('purchase_invoice_items', {
    id: t.uuid().defaultRandom().primaryKey(),
    invoiceId: t.uuid().references(() => purchaseInvoicesTable.id).notNull(),
    description: t.varchar().notNull(),
    metalType: t.varchar().notNull(),
    metalPurity: t.varchar(),
    metalRate: t.decimal<'number'>().default(0).notNull(),
    grossWeight: t.decimal<'number'>().default(0).notNull(),
    netWeight: t.decimal<'number'>().default(0).notNull(),
    itemTotal: t.decimal<'number'>().default(0).notNull(),
});

export const purchaseInvoiceItemsRelations = relations(purchaseInvoiceItemsTable, ({ one }) => ({
    invoice: one(purchaseInvoicesTable, {
        fields: [purchaseInvoiceItemsTable.invoiceId],
        references: [purchaseInvoicesTable.id],
    }),
}));
