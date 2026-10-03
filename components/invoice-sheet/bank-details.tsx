import { BANK_DETAILS } from './constants';

export function BankDetails() {
    return (
        <div className="bg-amber-100 font-semibold p-4 rounded-sm">
            <section className="flex flex-col gap-1 text-xs">
                <p>Bank Name: {BANK_DETAILS.name}</p>
                <p>Branch: {BANK_DETAILS.branch}</p>
                <p>IFSC Code: {BANK_DETAILS.ifscCode}</p>
                <p>Account Number: {BANK_DETAILS.accountNumber}</p>
            </section>
        </div>
    );
}
