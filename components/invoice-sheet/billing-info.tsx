export interface BillingInfoData {
    name: string;
    phone: string | null;
    address: string | null;
    gstNumber: string | null;
}

export function BillingInfo({
    label,
    data,
    ...props
}: {
    label: string;
    data: BillingInfoData;
} & React.ComponentProps<'div'>) {
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
                {data.gstNumber && (
                    <div className="whitespace-pre-line text-muted-foreground">
                        GST No: <span className="uppercase">{data.gstNumber}</span>
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
