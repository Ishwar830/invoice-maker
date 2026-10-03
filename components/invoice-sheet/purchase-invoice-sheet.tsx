import { type InvoiceCustomer, type PurchaseInvoiceSheetData } from '@/lib/types';
import { type InvoiceTotals } from '@/lib/calculations';
import { Separator } from '@/components/ui/separator';
import { InvoiceSheetLayout } from './invoice-sheet-layout';
import { SheetHeader } from './sheet-header';
import { BillingInfo } from './billing-info';
import { ItemsTable } from './items-table';
import { Totals } from './totals';
import { Notes } from './notes';
import { Signatures } from './signatures';
import { SHOP_BILLING } from './constants';

export function PurchaseInvoiceSheet({ data }: { data: PurchaseInvoiceSheetData }) {
    const formattedDate = new Date(data.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const totals: InvoiceTotals = {
        cgstAmount: 0,
        sgstAmount: 0,
        subTotal: data.subTotal,
        grandTotal: data.grandTotal,
        discountAmount: 0,
    };

    return (
        <InvoiceSheetLayout>
            <SheetHeader
                title="Purchase Invoice"
                invoiceNumber={data.invoiceNumber}
                formattedDate={formattedDate}
            />

            <div className="grid grid-cols-2 gap-4">
                <BillingInfo
                    label="Purchased From"
                    data={data.customer as InvoiceCustomer}
                />
                <BillingInfo
                    className="text-right"
                    label="Billed To"
                    data={SHOP_BILLING}
                />
            </div>

            <div className="bg-blue-100 p-2 py-4 rounded-sm flex-1 grid grid-rows-[1fr_auto]">
                <ItemsTable items={data.items} showMakingCharges={false} />
                
                <Totals
                    totals={totals}
                    cgstPercent={0}
                    sgstPercent={0}
                />
            </div>

            <Notes text={data.notes || undefined} />

            <Separator className='bg-black'/>

            <Signatures leftLabel="Supplier Signature" partyName={data.customer.name} />
        </InvoiceSheetLayout>
    );
}
