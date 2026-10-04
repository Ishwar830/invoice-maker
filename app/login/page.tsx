import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { playfair } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { LoginForm } from './login-form';
import { Gem } from 'lucide-react';

export default async function LoginPage() {
    const session = await getSession();
    if (session) {
        redirect('/dashboard');
    }

    return (
        <div className="h-screen w-full grid lg:grid-cols-2 bg-background overflow-hidden">
            {/* Left Side: Minimalist Information about Invoice Maker */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-zinc-950 text-zinc-100 overflow-hidden border-r border-zinc-800/70 select-none">
                {/* Subtle ambient light */}
                <div className="pointer-events-none absolute -top-28 -left-28 size-96 rounded-full bg-amber-500/10 blur-[100px]" />
                <div className="pointer-events-none absolute -bottom-28 -right-28 size-96 rounded-full bg-amber-600/5 blur-[100px]" />

                {/* Brand Header */}
                <div className="relative z-10 flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Gem className="size-4" />
                    </div>
                    <span
                        className={cn(
                            playfair.className,
                            'text-xl font-bold tracking-tight text-white'
                        )}
                    >
                        Invoice Maker
                    </span>
                </div>

                {/* Central Minimal Statement */}
                <div className="relative z-10 space-y-4 max-w-md">
                    <h1
                        className={cn(
                            playfair.className,
                            'text-3xl xl:text-4xl font-medium tracking-tight text-white leading-snug'
                        )}
                    >
                        Invoicing & inventory, crafted for fine jewellery.
                    </h1>
                    <p className="text-sm text-zinc-400 leading-relaxed font-light">
                        Fast counter billing, live weight tracking, and GST-compliant invoices
                        built specifically for jewellery retail showrooms.
                    </p>
                </div>

                {/* Bottom Minimal Footer */}
                <div className="relative z-10 text-xs text-zinc-500">
                    <span>Jewellery Shop Portal</span>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex flex-col justify-between h-full p-6 sm:p-10 lg:p-14 overflow-hidden">
                {/* Mobile Header (visible only on small screens) */}
                <div className="lg:hidden flex items-center justify-center gap-2 pt-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
                        <Gem className="size-4" />
                    </div>
                    <span
                        className={cn(
                            playfair.className,
                            'text-xl font-bold tracking-tight text-foreground'
                        )}
                    >
                        Invoice Maker
                    </span>
                </div>

                {/* Centered Form */}
                <div className="my-auto w-full max-w-sm mx-auto space-y-6">
                    <div className="space-y-1.5 text-center sm:text-left">
                        <h2
                            className={cn(
                                playfair.className,
                                'text-2xl sm:text-3xl font-bold tracking-tight text-foreground'
                            )}
                        >
                            Sign In
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Enter your shop credentials to continue.
                        </p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-card p-6 shadow-xs">
                        <LoginForm />
                    </div>
                </div>

                {/* Bottom Footer Note */}
                <div className="text-center text-xs text-muted-foreground">
                    <span>Authorized personnel only</span>
                </div>
            </div>
        </div>
    );
}
