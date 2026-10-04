import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { shopsTable } from './shops';

export const sessionsTable = table('sessions', {
    id: t.uuid().defaultRandom().primaryKey(),
    shopId: t
        .uuid()
        .references(() => shopsTable.id, { onDelete: 'cascade' })
        .notNull(),
    token: t.varchar({ length: 128 }).notNull().unique(),
    expiresAt: t.timestamp({ withTimezone: true }).notNull(),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
    shop: one(shopsTable, {
        fields: [sessionsTable.shopId],
        references: [shopsTable.id],
    }),
}));
