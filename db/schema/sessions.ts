import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersTable } from './users';

export const sessionsTable = table('sessions', {
    id: t.uuid().defaultRandom().primaryKey(),
    userId: t
        .uuid()
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    token: t.varchar({ length: 128 }).notNull().unique(),
    expiresAt: t.timestamp({ withTimezone: true }).notNull(),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [sessionsTable.userId],
        references: [usersTable.id],
    }),
}));
