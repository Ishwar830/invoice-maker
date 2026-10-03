import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    getFilteredSalesInvoicesCount,
    getRecentSalesInvoicesCount,
} from '@/db/queries/sales';
import {
    CircleAlert,
    FileTextIcon,
    ClockIcon,
} from 'lucide-react';

export async function TotalInvoicesCard() {
    let totalInvoices = 0;
    let errorMessage = null;

    try {
        totalInvoices = await getFilteredSalesInvoicesCount('');
    } catch {
        errorMessage = 'Could not load total invoices';
    }

    if (errorMessage) {
        return (
            <Card className="border-l-4 border-l-neutral-500 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Invoices
                    </CardTitle>
                    <FileTextIcon className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-red-600 flex gap-2 items-center">
                        <CircleAlert className="size-4" />
                        {errorMessage}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/30 border-l-4 border-l-neutral-500 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-0.5">
                    <CardTitle className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                        Total Invoices
                    </CardTitle>
                    <CardDescription className="text-[10px] text-neutral-400">
                        All-time count
                    </CardDescription>
                </div>
                <div className="p-2 rounded-lg bg-neutral-500/10 text-neutral-600 dark:text-neutral-400">
                    <FileTextIcon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent className="pt-1">
                <div className="text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
                    {totalInvoices}
                </div>
            </CardContent>
        </Card>
    );
}

export async function RecentInvoicesCard() {
    let recentInvoices = 0;
    let errorMessage = null;

    try {
        recentInvoices = await getRecentSalesInvoicesCount(7);
    } catch {
        errorMessage = 'Could not load recent invoices';
    }

    if (errorMessage) {
        return (
            <Card className="border-l-4 border-l-stone-500 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Recent Invoices
                    </CardTitle>
                    <ClockIcon className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-red-600 flex gap-2 items-center">
                        <CircleAlert className="size-4" />
                        {errorMessage}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/30 border-l-4 border-l-stone-500 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-0.5">
                    <CardTitle className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                        Recent Invoices
                    </CardTitle>
                    <CardDescription className="text-[10px] text-neutral-400">
                        Past 7 days count
                    </CardDescription>
                </div>
                <div className="p-2 rounded-lg bg-stone-500/10 text-stone-600 dark:text-stone-400">
                    <ClockIcon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent className="pt-1">
                <div className="text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
                    {recentInvoices}
                </div>
            </CardContent>
        </Card>
    );
}

export function MetricCardSkeleton({ borderLeftColor }: { borderLeftColor: string }) {
    return (
        <Card
            className={`relative overflow-hidden border-l-4 ${borderLeftColor} border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50`}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-2 w-3/4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-32" />
                </div>
                <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent className="pt-1">
                <Skeleton className="h-8 w-24" />
            </CardContent>
        </Card>
    );
}
