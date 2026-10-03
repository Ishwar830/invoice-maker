import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { InvoiceSheetItem } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';

export function ItemsTable({
    items,
    showMakingCharges = false,
}: {
    items: InvoiceSheetItem[];
    showMakingCharges?: boolean;
}) {
    const columns = [
        { label: '#', align: 'left' as const },
        { label: 'Description', align: 'left' as const },
        { label: 'Metal', align: 'center' as const },
        { label: 'Purity', align: 'center' as const },
        { label: 'Gross Wt.', align: 'right' as const },
        { label: 'Net Wt.', align: 'right' as const },
        { label: 'Rate/g', align: 'right' as const },
        ...(showMakingCharges
            ? [{ label: 'Making %', align: 'right' as const }]
            : []),
        { label: 'Amount', align: 'right' as const },
    ];

    return (
        <Table>
            <TableHeader>
                <TableRow className="border-b-2 border-[#1A1A1A] hover:bg-transparent">
                    {columns.map((col) => (
                        <TableHead
                            key={col.label}
                            className={cn(
                                'h-auto pb-2 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]',
                                col.align === 'center' && 'text-center',
                                col.align === 'right' && 'text-right',
                                col.align === 'left' && 'text-left'
                            )}
                        >
                            {col.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item, index) => (
                    <TableRow
                        key={item.description + index}
                        className="border-b border-border/30 hover:bg-transparent"
                    >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                            {item.description || ''}
                        </TableCell>
                        <TableCell className="text-center capitalize">
                            {item.metalType}
                        </TableCell>
                        <TableCell className="text-center">
                            {item.metalPurity || ''}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                            {item.grossWeight ? `${item.grossWeight}g` : ''}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                            {item.netWeight ? `${item.netWeight}g` : ''}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                            {item.metalRate
                                ? formatCurrency(item.metalRate)
                                : ''}
                        </TableCell>
                        {showMakingCharges && (
                            <TableCell className="text-right tabular-nums">
                                {item.makingChargesPercent
                                    ? item.makingChargesPercent + ' %'
                                    : ''}
                            </TableCell>
                        )}
                        <TableCell className="text-right font-semibold tabular-nums">
                            {formatCurrency(item.itemTotal)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
