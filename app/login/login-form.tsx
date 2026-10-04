'use client';

import { useActionState, useState } from 'react';
import { login, type LoginState } from '@/app/actions/auth';
import { Field, FieldLabel } from '@/components/ui/field';
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from '@/components/ui/input-group';
import {
    ArrowRightIcon,
    EyeIcon,
    EyeOffIcon,
    Loader2Icon,
    LockKeyholeIcon,
    UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function LoginForm() {
    const [state, action, isPending] = useActionState<LoginState, FormData>(
        login,
        undefined
    );

    return (
        <form action={action} className="space-y-5">
            <Field className="gap-2">
                <FieldLabel
                    htmlFor="username"
                    className="text-xs font-semibold tracking-widest uppercase text-muted-foreground"
                >
                    <UserIcon className="size-3.5 text-muted-foreground" />
                    Username
                </FieldLabel>
                <InputGroup className="h-11 rounded-lg">
                    <InputGroupInput
                        id="username"
                        name="username"
                        placeholder="Enter your shop username"
                        required
                        className="placeholder:text-muted-foreground text-sm"
                    />
                </InputGroup>
            </Field>

            <PasswordField />

            {/* Error message */}
            {state?.error && (
                <div className="flex items-center gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-600 dark:text-red-400">
                    <div className="size-2 rounded-full bg-red-500 shrink-0" />
                    <p className="text-sm font-medium">{state.error}</p>
                </div>
            )}

            {/* Submit */}
            <Button
                type="submit"
                disabled={isPending}
                className={cn(
                    'group rounded-lg flex w-full h-11 text-sm font-semibold tracking-wide uppercase transition-all shadow-sm',
                    'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                )}
            >
                {isPending ? (
                    <>
                        <Loader2Icon className="animate-spin size-4" />
                        Signing in...
                    </>
                ) : (
                    <>
                        Sign In
                        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                )}
            </Button>
        </form>
    );
}

function PasswordField() {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <Field className="gap-2">
            <FieldLabel
                htmlFor="password"
                className="text-xs font-semibold tracking-widest uppercase text-muted-foreground"
            >
                <LockKeyholeIcon className="size-3.5 text-muted-foreground" />
                Password
            </FieldLabel>
            <InputGroup className="h-11 rounded-lg">
                <InputGroupInput
                    type={isRevealed ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    className="text-sm placeholder:text-muted-foreground"
                />
                <InputGroupAddon align="inline-end">
                    <button
                        type="button"
                        onClick={() => setIsRevealed(!isRevealed)}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
                        aria-label={
                            isRevealed ? 'Hide password' : 'Show password'
                        }
                    >
                        {isRevealed ? (
                            <EyeOffIcon className="size-4" />
                        ) : (
                            <EyeIcon className="size-4" />
                        )}
                    </button>
                </InputGroupAddon>
            </InputGroup>
        </Field>
    );
}
