export function Notes({ text }: { text?: string }) {
    if (!text) return null;

    return (
        <div className="rounded-sm border p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                Notes
            </div>
            <p className="mt-1 whitespace-pre-line text-xs leading-relaxed">
                {text}
            </p>
        </div>
    );
}
