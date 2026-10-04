import { playfair } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export function SheetHeader({
    invoiceNumber,
    formattedDate,
    title = 'Invoice',
    shopName = 'Invoice Maker',
}: {
    invoiceNumber: number;
    formattedDate: string;
    title?: string;
    shopName?: string;
}) {
    const nameParts = shopName.trim().split(/\s+/);

    return (
        <div className="flex items-start justify-between">
            <h1
                className={cn(
                    'flex flex-col text-4xl sm:text-5xl font-bold tracking-wide text-[#D4AF37] leading-tight',
                    playfair.className
                )}
            >
                {nameParts.length > 1 ? (
                    <>
                        <span>{nameParts[0]}</span>
                        <span className="ml-4 sm:ml-6">{nameParts.slice(1).join(' ')}</span>
                    </>
                ) : (
                    <span>{shopName}</span>
                )}
            </h1>
            <div className="text-right">
                <div
                    className={cn(
                        'text-lg font-semibold uppercase tracking-widest',
                        playfair.className
                    )}
                >
                    {title}
                </div>
                <div className="mt-1 font-mono text-xs text-muted-foreground">
                    #{invoiceNumber}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                    {formattedDate}
                </div>
            </div>
        </div>
    );
}
