import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/Header';
import { inter } from '@/lib/fonts';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
    title: 'Krishna Jewellers — Gold and Silver Jewellery',
    description:
        'Discover BIS hallmarked gold and silver jewellery at Krishna Jewellers.',
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
            <body className="min-h-full grid grid-rows-[auto_1fr]">
                <Header />
                <main>{children}</main>
                <Toaster richColors position='top-center'/>
            </body>
        </html>
    );
}
