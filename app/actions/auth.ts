'use server';

import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
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

    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username))
        .limit(1);

    if (!user) {
        return { error: 'Invalid username or password.' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return { error: 'Invalid username or password.' };
    }

    await createSession(user.id);
    redirect('/dashboard');
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
