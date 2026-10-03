import { type ReactNode } from 'react';

/** Pure layout shell — no business logic, just styling */
export function InvoiceSheetLayout({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto py-8 max-w-4xl aspect-[1/1.4142] print:mt-0 print:max-w-none print:p-0">
            <div
                className="invoice-sheet p-2 bg-white shadow-xl print:mx-0 print:shadow-none h-full"
                style={{ fontFamily: 'system-ui, sans-serif' }}
            >
                <div className="flex flex-col gap-8 p-4 h-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
