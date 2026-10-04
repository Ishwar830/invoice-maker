import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersTable } from './users';

export const bankDetailsTable = table('bank_details', {
    id: t.uuid().defaultRandom().primaryKey(),
    userId: t
        .uuid()
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull()
        .unique(),
    bankName: t.varchar({ length: 200 }),
    bankBranch: t.varchar({ length: 200 }),
    bankIfsc: t.varchar({ length: 50 }),
    bankAccountNumber: t.varchar({ length: 50 }),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const bankDetailsRelations = relations(bankDetailsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [bankDetailsTable.userId],
        references: [usersTable.id],
    }),
}));
