import { relations } from 'drizzle-orm';
import { pgTable as table, uniqueIndex } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { shopsTable } from './shops';
import { salesCustomersTable } from './sales-customers';
import { salesInvoiceItemsTable } from './sales-invoice-items';

export const salesInvoicesTable = table(
    'sales_invoices',
    {
        id: t.uuid().defaultRandom().primaryKey(),
        shopId: t
            .uuid()
            .references(() => shopsTable.id, { onDelete: 'cascade' })
            .notNull(),
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
        financialYear: t.varchar().notNull(),
    },
    (table) => [
        uniqueIndex('sales_invoices_shop_fy_number_idx').on(
            table.shopId,
            table.financialYear,
            table.invoiceNumber
        ),
    ]
);

export const salesInvoiceRelations = relations(salesInvoicesTable, ({ one, many }) => ({
    shop: one(shopsTable, {
        fields: [salesInvoicesTable.shopId],
        references: [shopsTable.id],
    }),
    customer: one(salesCustomersTable),
    items: many(salesInvoiceItemsTable),
}));
