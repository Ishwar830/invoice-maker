import { type InvoiceCustomer, type SalesInvoiceSheetData, type ShopProfile } from '@/lib/types';
import { type InvoiceTotals } from '@/lib/calculations';
import { Separator } from '@/components/ui/separator';
import { InvoiceSheetLayout } from './invoice-sheet-layout';
import { SheetHeader } from './sheet-header';
import { BillingInfo, type BillingInfoData } from './billing-info';
import { ItemsTable } from './items-table';
import { Totals } from './totals';
import { Notes } from './notes';
import { BankDetails } from './bank-details';
import { Signatures } from './signatures';
import { MobileInvoiceView } from './mobile-invoice-view';

export function SalesInvoiceSheet({
    data,
    shop: propShop,
}: {
    data: SalesInvoiceSheetData;
    shop?: ShopProfile | null;
}) {
    const shop = propShop || data.shop;
    const shopBilling: BillingInfoData = {
        name: shop?.name || 'Invoice Maker',
        phone: shop?.phone || null,
        gstNumber: shop?.gstNumber || null,
        address: shop?.address || null,
    };

    const shopBank = shop
        ? {
              name: shop.bankDetails?.bankName ?? shop.bankName,
              branch: shop.bankDetails?.bankBranch ?? shop.bankBranch,
              ifscCode: shop.bankDetails?.bankIfsc ?? shop.bankIfsc,
              accountNumber: shop.bankDetails?.bankAccountNumber ?? shop.bankAccountNumber,
          }
        : null;

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
        <>
            {/* Desktop A4 sheet — hidden on mobile, always shown on print */}
            <InvoiceSheetLayout>
                <SheetHeader
                    title="Sales Invoice"
                    shopName={shop?.name}
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
                        data={shopBilling}
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

                {shopBank?.name && <BankDetails details={shopBank} />}

                <Separator className="bg-black" />

                <Signatures
                    leftLabel="Customer Signature"
                    partyName={data.customer.name}
                    shopName={shop?.name}
                />
            </InvoiceSheetLayout>

            {/* Mobile card-based view — visible only on mobile, hidden on print */}
            <MobileInvoiceView
                title="Sales Invoice"
                shopName={shop?.name || 'Invoice Maker'}
                invoiceNumber={data.invoiceNumber}
                formattedDate={formattedDate}
                billingLeft={{
                    label: 'Billed To',
                    data: data.customer as InvoiceCustomer,
                }}
                billingRight={{ label: 'From', data: shopBilling }}
                items={data.items}
                showMakingCharges
                totals={totals}
                cgstPercent={data.cgstPercent}
                sgstPercent={data.sgstPercent}
                notes={data.notes || undefined}
                bankDetails={shopBank}
                signatures={{
                    leftLabel: 'Customer Signature',
                    partyName: data.customer.name,
                    shopName: shop?.name,
                }}
            />
        </>
    );
}

