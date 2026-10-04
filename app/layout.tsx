import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { inter } from '@/lib/fonts';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
    title: {
        template: '%s — Invoice Maker',
        default: 'Invoice Maker',
    },
    description:
        'Jewellery shop invoice and inventory management system.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn('h-full', 'antialiased', inter.variable)}
            data-scroll-behaviour="smooth"
        >
            <body className="min-h-full flex flex-col">
                <main className="flex-1 flex flex-col">{children}</main>
                <Toaster richColors position='top-center'/>
            </body>
        </html>
    );
}
