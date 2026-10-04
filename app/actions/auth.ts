'use server';

import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { shopsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export type LoginState =
    | {
          error?: string;
      }
    | undefined;

export async function login(
    _prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
        return { error: 'Please enter both username and password.' };
    }

    const [shop] = await db
        .select()
        .from(shopsTable)
        .where(eq(shopsTable.username, username))
        .limit(1);

    if (!shop) {
        return { error: 'Invalid username or password.' };
    }

    const passwordMatch = await bcrypt.compare(password, shop.password);
    if (!passwordMatch) {
        return { error: 'Invalid username or password.' };
    }

    await createSession(shop.id);
    redirect('/dashboard');
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
