import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { purchaseInvoicesTable } from './purchase-invoices';
import { relations } from 'drizzle-orm';

export const purchaseSuppliersTable = table('purchase_suppliers', {
    id: t.uuid().defaultRandom().primaryKey(),
    invoiceId: t
        .uuid()
        .references(() => purchaseInvoicesTable.id, { onDelete: 'cascade' })
        .notNull(),
    name: t.varchar().notNull(),
    phone: t.varchar(),
    address: t.varchar(),
    gstNumber: t.varchar(),
});

export const purchaseSupplierRelations = relations(purchaseSuppliersTable, ({ one }) => ({
    invoice: one(purchaseInvoicesTable, {
        fields: [purchaseSuppliersTable.invoiceId],
        references: [purchaseInvoicesTable.id],
    }),
}));
