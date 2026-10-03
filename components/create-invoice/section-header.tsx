import type { ReactNode } from 'react';

export function SectionHeader({
    icon,
    title,
}: {
    icon: ReactNode;
    title: string;
}) {
    return (
        <div className="flex items-center gap-2.5">
            {icon}
            <h2 className="text-sm font-semibold tracking-wide text-[#1A1A1A] uppercase">
                {title}
            </h2>
        </div>
    );
}
