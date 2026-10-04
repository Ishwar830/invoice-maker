export interface BankDetailsData {
    name?: string | null;
    branch?: string | null;
    ifscCode?: string | null;
    accountNumber?: string | number | null;
}

export function BankDetails({ details }: { details?: BankDetailsData | null }) {
    if (!details || (!details.name && !details.accountNumber)) {
        return null;
    }

    return (
        <div className="bg-amber-100 font-semibold p-4 rounded-sm">
            <section className="flex flex-col gap-1 text-xs">
                {details.name && <p>Bank Name: {details.name}</p>}
                {details.branch && <p>Branch: {details.branch}</p>}
                {details.ifscCode && <p>IFSC Code: {details.ifscCode}</p>}
                {details.accountNumber && (
                    <p>Account Number: {details.accountNumber}</p>
                )}
            </section>
        </div>
    );
}
