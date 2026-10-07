'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboardIcon,
    LogOutIcon,
    MenuIcon,
    PackageIcon,
    SettingsIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from './ui/sheet';
import { Separator } from './ui/separator';
import { playfair } from '@/lib/fonts';
import { logout } from '@/app/actions/auth';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
    { href: '/dashboard/inventory', label: 'Inventory', icon: PackageIcon },
    { href: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
] as const;

export function MobileNav({
    shopName,
    username,
}: {
    shopName: string;
    username: string;
}) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="md:hidden">
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setOpen(true)}
                aria-label="Open navigation menu"
            >
                <MenuIcon />
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="w-72 p-0">
                    <SheetHeader className="border-b px-5 py-4">
                        <SheetTitle
                            className={`text-lg font-bold tracking-widest ${playfair.className}`}
                        >
                            {shopName}
                        </SheetTitle>
                    </SheetHeader>

                    <nav className="flex flex-col gap-1 px-3 py-4">
                        {navLinks.map(({ href, label, icon: Icon }) => {
                            const isActive =
                                pathname === href ||
                                (href !== '/dashboard' &&
                                    pathname.startsWith(href));

                            return (
                                <SheetClose key={href} asChild>
                                    <Link
                                        href={href}
                                        className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                                            isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                    >
                                        <Icon className="size-4" />
                                        {label}
                                    </Link>
                                </SheetClose>
                            );
                        })}
                    </nav>

                    <div className="mt-auto border-t px-5 py-4">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase text-muted-foreground">
                                {username.charAt(0)}
                            </div>
                            <span className="text-sm font-medium">
                                {username}
                            </span>
                        </div>
                        <Separator className="mb-3" />
                        <form action={logout}>
                            <Button
                                variant="ghost"
                                size="sm"
                                type="submit"
                                className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                            >
                                <LogOutIcon className="size-4" />
                                Sign out
                            </Button>
                        </form>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
