import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { sessionsTable, shopsTable } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { randomBytes } from 'crypto';

const SESSION_COOKIE = 'session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type SessionPayload = {
    shopId: string;
    shopName: string;
    username: string;
};

function generateToken(): string {
    return randomBytes(64).toString('hex'); // 128-char hex string
}

export async function createSession(shopId: string): Promise<void> {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    await db.insert(sessionsTable).values({ shopId, token, expiresAt });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const now = new Date();

    const [row] = await db
        .select({
            shopId: sessionsTable.shopId,
            shopName: shopsTable.name,
            username: shopsTable.username,
        })
        .from(sessionsTable)
        .innerJoin(shopsTable, eq(sessionsTable.shopId, shopsTable.id))
        .where(
            and(
                eq(sessionsTable.token, token),
                gt(sessionsTable.expiresAt, now)
            )
        )
        .limit(1);

    if (!row) return null;

    return {
        shopId: row.shopId,
        shopName: row.shopName,
        username: row.username,
    };
}

export async function requireSession(): Promise<SessionPayload> {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }
    return session;
}

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (token) {
        await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
    }

    cookieStore.delete(SESSION_COOKIE);
}
