import { db } from '@/db';
import { shopsTable, bankDetailsTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const getShopById = async (id: string) => {
    const shop = await db.query.shopsTable.findFirst({
        where: eq(shopsTable.id, id),
        with: {
            user: {
                with: {
                    bankDetails: true,
                },
            },
        },
    });

    if (!shop) return null;

    const bank = shop.user?.bankDetails;

    return {
        ...shop,
        bankDetails: bank || null,
        bankName: bank?.bankName || null,
        bankBranch: bank?.bankBranch || null,
        bankIfsc: bank?.bankIfsc || null,
        bankAccountNumber: bank?.bankAccountNumber || null,
    };
};

export const getShopByUserId = async (userId: string) => {
    const shop = await db.query.shopsTable.findFirst({
        where: eq(shopsTable.userId, userId),
        with: {
            user: {
                with: {
                    bankDetails: true,
                },
            },
        },
    });

    if (!shop) return null;

    const bank = shop.user?.bankDetails;

    return {
        ...shop,
        bankDetails: bank || null,
        bankName: bank?.bankName || null,
        bankBranch: bank?.bankBranch || null,
        bankIfsc: bank?.bankIfsc || null,
        bankAccountNumber: bank?.bankAccountNumber || null,
    };
};

export type UpdateShopInput = {
    name: string;
    ownerName?: string | null;
    gstNumber?: string | null;
    phone?: string | null;
    address?: string | null;
};

export type UpdateBankDetailsInput = {
    bankName?: string | null;
    bankBranch?: string | null;
    bankIfsc?: string | null;
    bankAccountNumber?: string | null;
};

export const updateShop = async (
    shopId: string,
    userId: string,
    data: UpdateShopInput
) => {
    const [updatedShop] = await db
        .update(shopsTable)
        .set({
            name: data.name.trim(),
            ownerName: data.ownerName?.trim() || null,
            gstNumber: data.gstNumber?.trim().toUpperCase() || null,
            phone: data.phone?.trim() || null,
            address: data.address?.trim() || null,
        })
        .where(and(eq(shopsTable.id, shopId), eq(shopsTable.userId, userId)))
        .returning();

    return updatedShop;
};

export const upsertBankDetails = async (
    userId: string,
    data: UpdateBankDetailsInput
) => {
    const [bank] = await db
        .insert(bankDetailsTable)
        .values({
            userId,
            bankName: data.bankName?.trim() || null,
            bankBranch: data.bankBranch?.trim() || null,
            bankIfsc: data.bankIfsc?.trim().toUpperCase() || null,
            bankAccountNumber: data.bankAccountNumber?.trim() || null,
        })
        .onConflictDoUpdate({
            target: bankDetailsTable.userId,
            set: {
                bankName: data.bankName?.trim() || null,
                bankBranch: data.bankBranch?.trim() || null,
                bankIfsc: data.bankIfsc?.trim().toUpperCase() || null,
                bankAccountNumber: data.bankAccountNumber?.trim() || null,
            },
        })
        .returning();

    return bank;
};
