import { type InvoiceCustomer, type SalesInvoiceSheetData } from '@/lib/types';
import { type InvoiceTotals } from '@/lib/calculations';
import { Separator } from '@/components/ui/separator';
import { InvoiceSheetLayout } from './invoice-sheet-layout';
import { SheetHeader } from './sheet-header';
import { BillingInfo } from './billing-info';
import { ItemsTable } from './items-table';
import { Totals } from './totals';
import { Notes } from './notes';
import { BankDetails } from './bank-details';
import { Signatures } from './signatures';
import { SHOP_BILLING } from './constants';

export function SalesInvoiceSheet({ data }: { data: SalesInvoiceSheetData }) {
    const formattedDate = new Date(data.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const totals: InvoiceTotals = {
        cgstAmount: data.cgstAmount,
        sgstAmount: data.sgstAmount,
        subTotal: data.subTotal,
        grandTotal: data.grandTotal,
        discountAmount: data.discountAmount,
    };

    return (
        <InvoiceSheetLayout>
            <SheetHeader
                title="Sales Invoice"
                invoiceNumber={data.invoiceNumber}
                formattedDate={formattedDate}
            />

            <div className="grid grid-cols-2 gap-4">
                <BillingInfo
                    label="Billed To"
                    data={data.customer as InvoiceCustomer}
                />
                <BillingInfo
                    className="text-right"
                    label="From"
                    data={SHOP_BILLING}
                />
            </div>

            <div className="bg-blue-100 p-2 py-4 rounded-sm flex-1 grid grid-rows-[1fr_auto]">
                <ItemsTable items={data.items} showMakingCharges />
                
                <Totals
                    totals={totals}
                    cgstPercent={data.cgstPercent}
                    sgstPercent={data.sgstPercent}
                />
            </div>

            <Notes text={data.notes || undefined} />

            <BankDetails />

            <Separator className='bg-black'/>

            <Signatures leftLabel="Customer Signature" partyName={data.customer.name} />
        </InvoiceSheetLayout>
    );
}
