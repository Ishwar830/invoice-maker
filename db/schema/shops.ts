import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sessionsTable } from './sessions';

export const shopsTable = table('shops', {
    id: t.uuid().defaultRandom().primaryKey(),
    username: t.varchar({ length: 100 }).notNull().unique(),
    password: t.varchar({ length: 255 }).notNull(), // bcrypt hash
    name: t.varchar({ length: 200 }).notNull(),
    ownerName: t.varchar({ length: 200 }),
    gstNumber: t.varchar({ length: 20 }),
    phone: t.varchar({ length: 50 }),
    address: t.varchar({ length: 500 }),
    bankName: t.varchar({ length: 200 }),
    bankBranch: t.varchar({ length: 200 }),
    bankIfsc: t.varchar({ length: 50 }),
    bankAccountNumber: t.varchar({ length: 50 }),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const shopsRelations = relations(shopsTable, ({ many }) => ({
    sessions: many(sessionsTable),
}));
