'use server';

import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

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

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (username !== validUsername || password !== validPassword) {
        return { error: 'Invalid username or password.' };
    }

    await createSession(username);
    redirect('/dashboard');
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
