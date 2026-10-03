import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowUpRightIcon } from 'lucide-react';
import { playfair } from '@/lib/fonts';

import { QuickActions } from '@/components/dashboard/quick-actions';
import {
    LatestInvoicesTable,
    LatestInvoicesSkeleton,
} from '@/components/dashboard/latest-invoices';
import { LatestPurchasesTable } from '@/components/dashboard/latest-purchases';

export default function Dashboard() {
    return (
        <div className="px-6 py-10 max-w-5xl mx-auto flex flex-col gap-10">
            <QuickActions />

            <Separator className="bg-neutral-200/60 dark:bg-neutral-800" />

            <LatestInvoicesSection />

            <Separator className="bg-neutral-200/60 dark:bg-neutral-800" />

            <LatestPurchasesSection />
        </div>
    );
}

function LatestInvoicesSection() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2
                    className={`${playfair.className} text-xl md:text-2xl font-semibold tracking-wide text-neutral-800 dark:text-neutral-100`}
                >
                    Latest Invoices
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-xs text-neutral-500 hover:text-amber-600 transition-colors"
                >
                    <Link
                        href={{
                            pathname: '/dashboard/invoices',
                            query: { type: 'sales' },
                        }}
                        className="flex items-center gap-1"
                    >
                        All Invoices
                        <ArrowUpRightIcon className="size-3" />
                    </Link>
                </Button>
            </div>
            <Suspense fallback={<LatestInvoicesSkeleton />}>
                <LatestInvoicesTable />
            </Suspense>
        </div>
    );
}

function LatestPurchasesSection() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2
                    className={`${playfair.className} text-xl md:text-2xl font-semibold tracking-wide text-neutral-800 dark:text-neutral-100`}
                >
                    Latest Purchases
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-xs text-neutral-500 hover:text-amber-600 transition-colors"
                >
                    <Link
                        href={{
                            pathname: '/dashboard/invoices',
                            query: { type: 'purchase' },
                        }}
                        className="flex items-center gap-1"
                    >
                        All Purchases
                        <ArrowUpRightIcon className="size-3" />
                    </Link>
                </Button>
            </div>
            <Suspense fallback={<LatestInvoicesSkeleton />}>
                <LatestPurchasesTable />
            </Suspense>
        </div>
    );
}
