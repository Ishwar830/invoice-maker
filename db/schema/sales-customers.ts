import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { salesInvoicesTable } from './sales-invoices';
import { relations } from 'drizzle-orm';

export const salesCustomersTable = table('sales_customers', {
    id: t.uuid().defaultRandom().primaryKey(),
    invoiceId: t
        .uuid()
        .references(() => salesInvoicesTable.id)
        .notNull(),
    name: t.varchar().notNull(),
    phone: t.varchar(),
    address: t.varchar(),
    gstNumber: t.varchar(),
});

export const salesCustomerRelations = relations(salesCustomersTable, ({ one }) => ({
    invoice: one(salesInvoicesTable, {
        fields: [salesCustomersTable.invoiceId],
        references: [salesInvoicesTable.id],
    }),
}));
