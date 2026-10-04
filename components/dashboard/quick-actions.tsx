import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { PlusCircleIcon, FileTextIcon, ArrowUpRightIcon, SettingsIcon } from 'lucide-react';
import { playfair } from '@/lib/fonts';

export function QuickActions() {
    return (
        <div className="space-y-4">
            <h2
                className={`${playfair.className} font-semibold text-xl tracking-wide text-neutral-800 dark:text-neutral-100`}
            >
                Quick Actions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
                {/* Create Sales Invoice Action Card */}
                <Link
                    href={{
                        pathname: '/dashboard/create-invoice',
                        query: { type: 'sales' },
                    }}
                    className="group block"
                >
                    <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/30 border-l-4 border-l-amber-500 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-0.5">
                                <CardTitle className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                                    Create Sales Invoice
                                </CardTitle>
                                <CardDescription className="text-[10px] text-neutral-400">
                                    Generate a new sales billing invoice
                                </CardDescription>
                            </div>
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-transform duration-300 group-hover:scale-110">
                                <PlusCircleIcon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-1 flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-amber-600 transition-colors">
                                New Invoice
                            </span>
                            <ArrowUpRightIcon className="h-4 w-4 text-neutral-400 dark:text-neutral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </CardContent>
                    </Card>
                </Link>

                {/* Create Purchase Invoice Action Card */}
                <Link
                    href={{
                        pathname: '/dashboard/create-invoice',
                        query: { type: 'purchase' },
                    }}
                    className="group block"
                >
                    <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/30 border-l-4 border-l-amber-500 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-0.5">
                                <CardTitle className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                                    Create Purchase Invoice
                                </CardTitle>
                                <CardDescription className="text-[10px] text-neutral-400">
                                    Generate a new purchase billing invoice
                                </CardDescription>
                            </div>
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-transform duration-300 group-hover:scale-110">
                                <PlusCircleIcon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-1 flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-amber-600 transition-colors">
                                New Invoice
                            </span>
                            <ArrowUpRightIcon className="h-4 w-4 text-neutral-400 dark:text-neutral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {/* View Sales Invoices Action Card */}
                <Link href="/dashboard/invoices" className="group block">
                    <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/30 border-l-4 border-l-neutral-500 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-0.5">
                                <CardTitle className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                                    View Invoices
                                </CardTitle>
                                <CardDescription className="text-[10px] text-neutral-400">
                                    Search, filter, and print all invoices
                                </CardDescription>
                            </div>
                            <div className="p-2 rounded-lg bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 transition-transform duration-300 group-hover:scale-110">
                                <FileTextIcon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-1 flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-amber-600 transition-colors">
                                All Invoices
                            </span>
                            <ArrowUpRightIcon className="h-4 w-4 text-neutral-400 dark:text-neutral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </CardContent>
                    </Card>
                </Link>

                {/* Shop & Bank Settings Action Card */}
                <Link href="/dashboard/settings" className="group block">
                    <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/30 border-l-4 border-l-amber-500 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-0.5">
                                <CardTitle className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                                    Shop & Bank Settings
                                </CardTitle>
                                <CardDescription className="text-[10px] text-neutral-400">
                                    Update shop details, GSTIN, and bank account
                                </CardDescription>
                            </div>
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-transform duration-300 group-hover:scale-110">
                                <SettingsIcon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-1 flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-amber-600 transition-colors">
                                Manage Profile
                            </span>
                            <ArrowUpRightIcon className="h-4 w-4 text-neutral-400 dark:text-neutral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
