import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export function InventoryTableSkeleton() {
    return (
        <div className="rounded-md border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden shadow-sm">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {['Item Code', 'Category', 'Metal', 'Gross Wt.', 'Net Wt.', ''].map(
                                (h, i) => (
                                    <TableHead
                                        key={i}
                                        className={i === 0 ? 'pl-6' : i === 5 ? 'pr-6' : ''}
                                    >
                                        <Skeleton className="h-4 w-16" />
                                    </TableHead>
                                )
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell className="pl-6 py-4">
                                    <Skeleton className="h-6 w-20 rounded-md" />
                                </TableCell>
                                <TableCell className="py-4">
                                    <Skeleton className="h-4 w-16" />
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-3 w-8" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Skeleton className="h-4 w-16" />
                                </TableCell>
                                <TableCell className="py-4">
                                    <Skeleton className="h-4 w-16" />
                                </TableCell>
                                <TableCell className="pr-6 py-4">
                                    <div className="flex justify-end gap-1">
                                        <Skeleton className="h-7 w-7 rounded-md" />
                                        <Skeleton className="h-7 w-7 rounded-md" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 md:hidden p-4 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                        <div className="space-y-1.5">
                            <Skeleton className="h-6 w-20 rounded-md" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-36" />
                        </div>
                        <div className="flex gap-1">
                            <Skeleton className="h-7 w-7 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
