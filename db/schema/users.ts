import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { shopsTable } from './shops';
import { bankDetailsTable } from './bank-details';
import { sessionsTable } from './sessions';

export const usersTable = table('users', {
    id: t.uuid().defaultRandom().primaryKey(),
    username: t.varchar({ length: 100 }).notNull().unique(),
    password: t.varchar({ length: 255 }).notNull(), // bcrypt hash
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(usersTable, ({ one, many }) => ({
    shop: one(shopsTable),
    bankDetails: one(bankDetailsTable),
    sessions: many(sessionsTable),
}));
