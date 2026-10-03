import { relations } from 'drizzle-orm';
import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { purchaseSuppliersTable } from './purchase-suppliers';
import { purchaseInvoiceItemsTable } from './purchase-invoice-items';

export const purchaseInvoicesTable = table('purchase_invoices', {
    id: t.uuid().defaultRandom().primaryKey(),
    invoiceNumber: t.integer().notNull(),
    subTotal: t.decimal<'number'>().default(0).notNull(),
    grandTotal: t.decimal<'number'>().default(0).notNull(),
    notes: t.varchar(),
    createdAt: t.date().notNull(),
    financialYear: t.varchar().notNull(),
});

export const purchaseInvoiceRelations = relations(purchaseInvoicesTable, ({ one, many }) => ({
    supplier: one(purchaseSuppliersTable),
    items: many(purchaseInvoiceItemsTable),
}));
