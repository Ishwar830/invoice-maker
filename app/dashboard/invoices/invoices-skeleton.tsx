import { Skeleton } from '@/components/ui/skeleton';

export function InvoicesTableSkeleton() {
    return (
        <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
            {/* Desktop header skeleton */}
            <div className="hidden md:block">
                <div className="flex items-center gap-4 border-b bg-muted/30 px-5 py-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="ml-auto h-4 w-20" />
                </div>
            </div>
            {/* Desktop row skeletons */}
            <div className="hidden md:block divide-y divide-border/40">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 px-5 py-4"
                    >
                        <Skeleton className="size-10 shrink-0 rounded-lg" />
                        <div className="min-w-0 flex-1 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-20 shrink-0" />
                    </div>
                ))}
            </div>
            {/* Mobile card skeletons */}
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 md:hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2 px-5 py-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-16 rounded-md" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex flex-col gap-1.5 min-w-0">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-4 w-16 shrink-0" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
