import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getSession } from '@/lib/session';
import { playfair } from '@/lib/fonts';

export default async function Home() {
    const session = await getSession();

    return (
        <div className="flex flex-col items-center justify-center px-6 py-24">
            <div className="max-w-lg text-center flex flex-col gap-6">
                <h1
                    className={`text-4xl font-bold tracking-tight ${playfair.className}`}
                >
                    Krishna Jewellers
                </h1>
                <p className="text-muted-foreground text-lg">
                    Gold &amp; Silver Jewellery — BIS Hallmarked
                </p>

                <Separator />

                <p className="text-sm text-muted-foreground">
                    Manage invoices, track inventory, and run your jewellery
                    business from one place.
                </p>

                <div className="flex justify-center gap-3">
                    {session ? (
                        <Button asChild>
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
