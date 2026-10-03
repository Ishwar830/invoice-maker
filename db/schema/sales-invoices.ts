import { relations } from 'drizzle-orm';
import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { salesCustomersTable } from './sales-customers';
import { salesInvoiceItemsTable } from './sales-invoice-items';

export const salesInvoicesTable = table('sales_invoices', {
    id: t.uuid().defaultRandom().primaryKey(),
    invoiceNumber: t.integer().notNull(),
    cgstPercent: t.decimal<'number'>().default(0).notNull(),
    cgstAmount: t.decimal<'number'>().default(0).notNull(),
    sgstPercent: t.decimal<'number'>().default(0).notNull(),
    sgstAmount: t.decimal<'number'>().default(0).notNull(),
    subTotal: t.decimal<'number'>().default(0).notNull(),
    grandTotal: t.decimal<'number'>().default(0).notNull(),
    discountAmount: t.decimal<'number'>().default(0).notNull(),
    notes: t.varchar(),
    createdAt: t.date().notNull(),
    financialYear: t.varchar().notNull()
});

export const salesInvoiceRelations = relations(salesInvoicesTable, ({ one, many }) => ({
    customer: one(salesCustomersTable),
    items: many(salesInvoiceItemsTable),
}));
