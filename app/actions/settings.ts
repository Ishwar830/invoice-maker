'use server';

import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/session';
import { updateShop, upsertBankDetails } from '@/db/queries/shops';
import {
    shopSettingsSchema,
    bankSettingsSchema,
    type ShopSettingsInput,
    type BankSettingsInput,
} from '@/lib/validations/settings';

export type ActionResult<T = unknown> = {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
};

export async function updateShopDetailsAction(
    data: unknown
): Promise<ActionResult<ShopSettingsInput>> {
    const { shopId, userId } = await requireSession();

    try {
        const parsed = shopSettingsSchema.safeParse(data);
        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            const firstErrorMessage =
                Object.values(fieldErrors).flat()[0] || 'Invalid shop details.';
            return {
                success: false,
                message: firstErrorMessage,
                errors: fieldErrors,
            };
        }

        await updateShop(shopId, userId, parsed.data);

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/settings');
        revalidatePath('/dashboard/create-invoice');
        revalidatePath('/dashboard/invoices');

        return {
            success: true,
            message: 'Shop details saved successfully!',
            data: parsed.data,
        };
    } catch (error) {
        console.error('Failed to update shop details:', error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Failed to update shop details.',
        };
    }
}

export async function updateBankDetailsAction(
    data: unknown
): Promise<ActionResult<BankSettingsInput>> {
    const { userId } = await requireSession();

    try {
        const parsed = bankSettingsSchema.safeParse(data);
        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            const firstErrorMessage =
                Object.values(fieldErrors).flat()[0] || 'Invalid bank details.';
            return {
                success: false,
                message: firstErrorMessage,
                errors: fieldErrors,
            };
        }

        await upsertBankDetails(userId, parsed.data);

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/settings');
        revalidatePath('/dashboard/create-invoice');
        revalidatePath('/dashboard/invoices');

        return {
            success: true,
            message: 'Bank details saved successfully!',
            data: parsed.data,
        };
    } catch (error) {
        console.error('Failed to update bank details:', error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Failed to update bank details.',
        };
    }
}

export async function updateAllSettingsAction(data: {
    shop: unknown;
    bank: unknown;
}): Promise<ActionResult> {
    const { shopId, userId } = await requireSession();

    try {
        const parsedShop = shopSettingsSchema.safeParse(data.shop);
        if (!parsedShop.success) {
            const fieldErrors = parsedShop.error.flatten().fieldErrors;
            return {
                success: false,
                message: Object.values(fieldErrors).flat()[0] || 'Invalid shop details.',
                errors: fieldErrors,
            };
        }

        const parsedBank = bankSettingsSchema.safeParse(data.bank);
        if (!parsedBank.success) {
            const fieldErrors = parsedBank.error.flatten().fieldErrors;
            return {
                success: false,
                message: Object.values(fieldErrors).flat()[0] || 'Invalid bank details.',
                errors: fieldErrors,
            };
        }

        await Promise.all([
            updateShop(shopId, userId, parsedShop.data),
            upsertBankDetails(userId, parsedBank.data),
        ]);

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/settings');
        revalidatePath('/dashboard/create-invoice');
        revalidatePath('/dashboard/invoices');

        return {
            success: true,
            message: 'All settings updated successfully!',
        };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Failed to update settings.',
        };
    }
}
