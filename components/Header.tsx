import { logout } from '@/app/actions/auth';
import { playfair } from '@/lib/fonts';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { getSession } from '@/lib/session';
import Link from 'next/link';
import { LayoutDashboardIcon, LogOutIcon, PackageIcon } from 'lucide-react';

export async function Header() {
    const session = await getSession();

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span
                        className={`text-lg font-bold tracking-widest ${playfair.className}`}
                    >
                        Krishna Jewellers
                    </span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-1">
                    {session && (
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard">
                                    <LayoutDashboardIcon data-icon="inline-start" />
                                    Dashboard
                                </Link>
                            </Button>

                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard/inventory">
                                    <PackageIcon data-icon="inline-start" />
                                    Inventory
                                </Link>
                            </Button>

                            <Separator
                                orientation="vertical"
                                className="mx-2 h-5"
                            />

                            <span className="text-xs text-muted-foreground">
                                {session.username}
                            </span>

                            <form action={logout}>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    type="submit"
                                    aria-label="Sign out"
                                >
                                    <LogOutIcon />
                                </Button>
                            </form>
                        </>
                    )}

                    {!session && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
