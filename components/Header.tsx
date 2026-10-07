import { logout } from '@/app/actions/auth';
import { playfair } from '@/lib/fonts';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { getSession } from '@/lib/session';
import Link from 'next/link';
import { LayoutDashboardIcon, LogOutIcon, PackageIcon, SettingsIcon } from 'lucide-react';
import { MobileNav } from './mobile-nav';

export async function Header() {
    const session = await getSession();

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link href={session ? '/dashboard' : '/'} className="flex items-center gap-2">
                    <span
                        className={`text-lg font-bold tracking-widest ${playfair.className}`}
                    >
                        {session ? session.shopName : 'Invoice Maker'}
                    </span>
                </Link>

                {/* Desktop navigation — hidden on mobile */}
                <div className="hidden items-center gap-1 md:flex">
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

                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard/settings">
                                    <SettingsIcon data-icon="inline-start" />
                                    Settings
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
                </div>

                {/* Mobile navigation — hamburger + slide-out drawer */}
                {session && (
                    <MobileNav
                        shopName={session.shopName}
                        username={session.username}
                    />
                )}
            </div>
        </header>
    );
}
