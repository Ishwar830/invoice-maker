import { relations } from 'drizzle-orm';
import { pgTable as table, uniqueIndex } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { shopsTable } from './shops';
import { purchaseSuppliersTable } from './purchase-suppliers';
import { purchaseInvoiceItemsTable } from './purchase-invoice-items';

export const purchaseInvoicesTable = table(
    'purchase_invoices',
    {
        id: t.uuid().defaultRandom().primaryKey(),
        shopId: t
            .uuid()
            .references(() => shopsTable.id, { onDelete: 'cascade' })
            .notNull(),
        invoiceNumber: t.integer().notNull(),
        subTotal: t.decimal<'number'>().default(0).notNull(),
        grandTotal: t.decimal<'number'>().default(0).notNull(),
        notes: t.varchar(),
        createdAt: t.date().notNull(),
        financialYear: t.varchar().notNull(),
    },
    (table) => [
        uniqueIndex('purchase_invoices_shop_fy_number_idx').on(
            table.shopId,
            table.financialYear,
            table.invoiceNumber
        ),
    ]
);

export const purchaseInvoiceRelations = relations(purchaseInvoicesTable, ({ one, many }) => ({
    shop: one(shopsTable, {
        fields: [purchaseInvoicesTable.shopId],
        references: [shopsTable.id],
    }),
    supplier: one(purchaseSuppliersTable),
    items: many(purchaseInvoiceItemsTable),
}));
