import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { getInventoryItemsPageCount } from '@/db/queries/inventory';
import { requireSession } from '@/lib/session';

interface InventoryPaginationProps {
    categoryId: string;
    currentPage: number;
}

export default async function InventoryPagination({
    categoryId,
    currentPage,
}: InventoryPaginationProps) {
    const { shopId } = await requireSession();
    const totalPages = await getInventoryItemsPageCount(shopId, categoryId);

    if (totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams();
        if (page > 1) params.set('page', String(page));
        const qs = params.toString();
        return qs ? `?${qs}` : '?';
    };

    // Generate page numbers with ellipsis logic
    const generatePages = (): (number | 'ellipsis')[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | 'ellipsis')[] = [1];

        if (currentPage > 3) {
            pages.push('ellipsis');
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('ellipsis');
        }

        pages.push(totalPages);
        return pages;
    };

    const pages = generatePages();

    return (
        <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
                Page{' '}
                <span className="font-medium text-foreground">
                    {currentPage}
                </span>{' '}
                of{' '}
                <span className="font-medium text-foreground">
                    {totalPages}
                </span>
            </p>
            <Pagination className="mx-0 w-auto">
                <PaginationContent>
                    {currentPage > 1 && (
                        <PaginationItem>
                            <PaginationPrevious
                                href={createPageUrl(currentPage - 1)}
                            />
                        </PaginationItem>
                    )}
                    {pages.map((page, index) => (
                        <PaginationItem key={`${page}-${index}`}>
                            {page === 'ellipsis' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href={createPageUrl(page)}
                                    isActive={page === currentPage}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                    {currentPage < totalPages && (
                        <PaginationItem>
                            <PaginationNext
                                href={createPageUrl(currentPage + 1)}
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
}

