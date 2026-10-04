import { requireSession } from '@/lib/session';
import { Header } from '@/components/Header';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireSession();
    return (
        <div className="min-h-full flex-1 grid grid-rows-[auto_1fr]">
            <Header />
            <div>{children}</div>
        </div>
    );
}
