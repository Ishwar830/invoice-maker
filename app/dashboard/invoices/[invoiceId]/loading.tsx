import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDetailLoading() {
    return (
        <div className="bg-[#F5F3EF]">
            {/* Action bar — back button is real, print is skeleton */}
            <div className="sticky top-0 z-10 border-b border-border/40 bg-white/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/invoices">
                            <ArrowLeftIcon data-icon="inline-start" />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 sm:w-20" />
                        <Skeleton className="h-8 w-8 sm:w-20" />
                    </div>
                </div>
            </div>

            {/* Invoice sheet skeleton */}
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
                <div className="rounded-lg bg-background p-5 sm:p-8 shadow-sm flex flex-col gap-6 sm:gap-8">
                    {/* Header — stacks vertically on mobile */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-6 w-40 sm:w-48" />
                            <Skeleton className="h-4 w-28 sm:w-32" />
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                            <Skeleton className="h-5 w-32 sm:w-36" />
                            <Skeleton className="h-4 w-24 sm:w-28" />
                        </div>
                    </div>

                    <Separator />

                    {/* Customer info */}
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-36 sm:w-40" />
                        <Skeleton className="h-4 w-24 sm:w-28" />
                        <Skeleton className="h-4 w-44 sm:w-52" />
                    </div>

                    <Separator />

                    {/* Items — 4 columns on desktop, 2 columns on mobile */}
                    <div className="flex flex-col gap-3">
                        {/* Table header */}
                        <div className="flex gap-4">
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="hidden sm:block h-4 w-20" />
                            <Skeleton className="h-4 w-16 sm:w-20" />
                            <Skeleton className="h-4 w-16 sm:w-20" />
                        </div>
                        {/* Table rows */}
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-5 flex-1" />
                                <Skeleton className="hidden sm:block h-5 w-20" />
                                <Skeleton className="h-5 w-16 sm:w-20" />
                                <Skeleton className="h-5 w-16 sm:w-20" />
                            </div>
                        ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="flex flex-col items-end gap-2">
                        <Skeleton className="h-4 w-32 sm:w-40" />
                        <Skeleton className="h-4 w-28 sm:w-36" />
                        <Skeleton className="h-4 w-28 sm:w-36" />
                        <Skeleton className="h-5 w-36 sm:w-44" />
                    </div>
                </div>
            </div>
        </div>
    );
}
