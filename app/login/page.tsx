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
import { playfair } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    return (
        <div className="grid place-content-center h-full bg-gray-100">
            <Card className="p-16 rounded-sm">
                <CardHeader className="text-center">
                    <p
                        className={cn(
                            playfair.className,
                            'text-3xl tracking-tight font-semibold'
                        )}
                    >
                        Krishna Jewellers
                    </p>
                    <p className="tracking-widest uppercase text-xs mt-2">
                        Admin Portal
                    </p>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
                <CardFooter>
                    <p className="text-center w-full tracking-wider text-xs">
                        Authorized personnel only
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

function LoginForm() {
    const [state, action, isPending] = useActionState<LoginState, FormData>(
        login,
        undefined
    );

    return (
        <form action={action} className="space-y-6">
            <Field className="gap-2">
                <FieldLabel
                    htmlFor="username"
                    className="text-xs font-semibold tracking-widest uppercase text-gray-500"
                >
                    <UserIcon className="size-4 text-gray-500" />
                    Username
                </FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        id="username"
                        name="username"
                        placeholder="Enter username"
                        required
                        className="placeholder:text-gray-600"
                    />
                </InputGroup>
            </Field>

            <PasswordField />

            {/* Error message */}
            {state?.error && (
                <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-4 py-2.5">
                    <div className="size-1.5 rounded-full bg-red-500" />
                    <p className="text-sm text-red-600">{state.error}</p>
                </div>
            )}

            {/* Submit */}
            <Button
                type="submit"
                disabled={isPending}
                className={cn(
                    'group rounded-md flex w-full py-6 text-sm font-semibold tracking-wide uppercase transition-all',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
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
                className="text-xs font-semibold tracking-widest uppercase text-gray-500"
            >
                <LockKeyholeIcon className="size-4 text-gray-500" />
                Password
            </FieldLabel>
            <InputGroup>
                <InputGroupInput
                    type={isRevealed ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    className="text-sm placeholder:text-600"
                />
                <InputGroupAddon align="inline-end">
                    <button
                        type="button"
                        onClick={() => setIsRevealed(!isRevealed)}
                        className="text-gray-500 cursor-pointer"
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
