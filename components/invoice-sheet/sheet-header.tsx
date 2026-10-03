import { playfair } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export function SheetHeader({
    invoiceNumber,
    formattedDate,
    title = 'Invoice',
}: {
    invoiceNumber: number;
    formattedDate: string;
    title?: string;
}) {
    return (
        <div className="flex items-start justify-between">
            <h1
                className={cn(
                    'flex flex-col text-5xl font-bold tracking-wide text-[#D4AF37]',
                    playfair.className
                )}
            >
                <span>Krishna</span>
                <span className='ml-6'>Jewellers</span>
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
