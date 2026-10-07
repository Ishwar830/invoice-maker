import { type InvoiceCustomer, type PurchaseInvoiceSheetData, type ShopProfile } from '@/lib/types';
import { type InvoiceTotals } from '@/lib/calculations';
import { Separator } from '@/components/ui/separator';
import { InvoiceSheetLayout } from './invoice-sheet-layout';
import { SheetHeader } from './sheet-header';
import { BillingInfo, type BillingInfoData } from './billing-info';
import { ItemsTable } from './items-table';
import { Totals } from './totals';
import { Notes } from './notes';
import { Signatures } from './signatures';
import { MobileInvoiceView } from './mobile-invoice-view';

export function PurchaseInvoiceSheet({
    data,
    shop: propShop,
}: {
    data: PurchaseInvoiceSheetData;
    shop?: ShopProfile | null;
}) {
    const shop = propShop || data.shop;
    const shopBilling: BillingInfoData = {
        name: shop?.name || 'Invoice Maker',
        phone: shop?.phone || null,
        gstNumber: shop?.gstNumber || null,
        address: shop?.address || null,
    };

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
        <>
            {/* Desktop A4 sheet — hidden on mobile, always shown on print */}
            <InvoiceSheetLayout>
                <SheetHeader
                    title="Purchase Invoice"
                    shopName={shop?.name}
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
                        data={shopBilling}
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

                <Separator className="bg-black" />

                <Signatures
                    leftLabel="Supplier Signature"
                    partyName={data.customer.name}
                    shopName={shop?.name}
                />
            </InvoiceSheetLayout>

            {/* Mobile card-based view — visible only on mobile, hidden on print */}
            <MobileInvoiceView
                title="Purchase Invoice"
                shopName={shop?.name || 'Invoice Maker'}
                invoiceNumber={data.invoiceNumber}
                formattedDate={formattedDate}
                billingLeft={{
                    label: 'Purchased From',
                    data: data.customer as InvoiceCustomer,
                }}
                billingRight={{ label: 'Billed To', data: shopBilling }}
                items={data.items}
                showMakingCharges={false}
                totals={totals}
                cgstPercent={0}
                sgstPercent={0}
                notes={data.notes || undefined}
                bankDetails={null}
                signatures={{
                    leftLabel: 'Supplier Signature',
                    partyName: data.customer.name,
                    shopName: shop?.name,
                }}
            />
        </>
    );
}

