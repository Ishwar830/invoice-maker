import { requireSession } from '@/lib/session';
import { getShopById } from '@/db/queries/shops';
import { SettingsClient } from '@/components/settings/settings-client';
import { playfair } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { SettingsIcon } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Settings',
    description:
        'Edit your shop details and bank account details for invoice generation.',
};

export default async function SettingsPage() {
    const { shopId } = await requireSession();
    const shop = await getShopById(shopId);

    return (
        <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
            {/* Page Header */}
            <div className="mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-sm bg-gray-200">
                            <SettingsIcon className="size-5 text-gray-600" />
                        </div>
                        <div>
                            <h1
                                className={cn(
                                    'text-2xl font-semibold tracking-tight text-[#1A1A1A]',
                                    playfair.className
                                )}
                            >
                                Settings
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage your shop profile and bank account
                                details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Client Component */}
            <SettingsClient shop={shop} />
        </div>
    );
}
