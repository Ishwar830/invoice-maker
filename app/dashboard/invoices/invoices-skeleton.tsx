import { Skeleton } from '@/components/ui/skeleton';

export function InvoicesTableSkeleton() {
    return (
        <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
            {/* Header skeleton */}
            <div className="hidden md:block">
                <div className="flex items-center gap-4 border-b bg-muted/30 px-5 py-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="ml-auto h-4 w-20" />
                </div>
            </div>
            {/* Row skeletons */}
            <div className="divide-y divide-border/40">
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
        </div>
    );
}
