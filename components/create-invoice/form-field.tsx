import type { ReactNode } from 'react';

export function FormField({
    label,
    icon,
    children,
}: {
    label: string;
    icon?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                {icon}
                {label}
            </label>
            {children}
        </div>
    );
}
