export interface BillingInfoData {
    name: string;
    phone: string | null;
    address: string | null;
    gstNumber?: string | null;
    panGstNumber?: string | null;
}

export function BillingInfo({
    label,
    data,
    ...props
}: {
    label: string;
    data: BillingInfoData;
} & React.ComponentProps<'div'>) {
    const taxIdentifier = data.panGstNumber ?? data.gstNumber;
    const taxLabel = data.panGstNumber
        ? data.panGstNumber.length === 10
            ? 'PAN No'
            : data.panGstNumber.length === 15
            ? 'GST No'
            : 'PAN/GST No'
        : 'GST No';

    return (
        <div {...props}>
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                {label}
            </div>
            <div className="mt-2 flex flex-col gap-0.5 text-sm">
                <div className="font-semibold text-[#1A1A1A]">
                    {data.name || '—'}
                </div>
                {data.phone && (
                    <div className="text-muted-foreground">{data.phone}</div>
                )}
                {taxIdentifier && (
                    <div className="whitespace-pre-line text-muted-foreground">
                        {taxLabel}: <span className="uppercase">{taxIdentifier}</span>
                    </div>
                )}
                {data.address && (
                    <div className="text-muted-foreground">
                        {data.address}
                    </div>
                )}
            </div>
        </div>
    );
}
