export function Signatures({
    partyName,
    leftLabel = 'Customer Signature',
}: {
    partyName: string;
    leftLabel?: string;
}) {
    return (
        <div className="grid grid-cols-2 gap-8">
            <div className="text-left">
                <div className="mt-12 inline-block border-t border-[#1A1A1A] pt-2">
                    <div className="text-xs font-medium text-[#1A1A1A]">
                        {leftLabel}
                    </div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">
                        {partyName}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="mt-12 inline-block border-t border-[#1A1A1A] pt-2">
                    <div className="text-xs font-medium text-[#1A1A1A]">
                        Authorized Signature
                    </div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">
                        Krishna Jewellers
                    </div>
                </div>
            </div>
        </div>
    );
}
