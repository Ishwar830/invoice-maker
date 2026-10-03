import { eq, ilike, or, count, desc, max, sql, and } from 'drizzle-orm';
import { db } from '../index';
import {
    purchaseInvoicesTable,
    purchaseInvoiceItemsTable,
    purchaseSuppliersTable,
} from '../schema';
import { type PurchaseInvoicePayload } from '@/lib/validations/purchase-invoice';
import { getFinancialYearPrefix } from './utils';

const ITEMS_PER_PAGE = 10;

export const getNextPurchaseInvoiceNumber = async () => {
    const date = new Date();
    const fyPrefix = getFinancialYearPrefix(date);

    const result = await db
        .select({ maxNum: max(purchaseInvoicesTable.invoiceNumber) })
        .from(purchaseInvoicesTable)
        .where(eq(purchaseInvoicesTable.financialYear, fyPrefix));

    return (result[0]?.maxNum ?? 0) + 1;
};

export const getPurchaseInvoiceById = async (id: string) => {
    const invoice = await db.query.purchaseInvoicesTable.findFirst({
        where: eq(purchaseInvoicesTable.id, id),
    });

    return invoice;
};

export const getPurchaseInvoiceWithSupplierAndItems = async (id: string) => {
    const invoice = await db.query.purchaseInvoicesTable.findFirst({
        where: eq(purchaseInvoicesTable.id, id),
        with: {
            supplier: true,
            items: true,
        },
    });

    return invoice;
};

export const savePurchaseInvoice = async (data: PurchaseInvoicePayload) => {
    const invoiceDate = data.createdAt;
    const fyPrefix = getFinancialYearPrefix(invoiceDate);

    const existingInvoice = await db.query.purchaseInvoicesTable.findFirst({
        where: and(
            eq(purchaseInvoicesTable.financialYear, fyPrefix),
            eq(purchaseInvoicesTable.invoiceNumber, data.invoiceNumber)
        ),
    });

    if (existingInvoice) {
        throw new Error('Invoice Number already exists');
    }

    return await db.transaction(async (tx) => {
        const [inserted] = await tx
            .insert(purchaseInvoicesTable)
            .values({
                ...data,
                createdAt: data.createdAt.toISOString(),
                financialYear: fyPrefix,
            })
            .returning({ invoiceId: purchaseInvoicesTable.id });

        const invoiceId = inserted.invoiceId;

        await tx.insert(purchaseSuppliersTable).values({
            invoiceId,
            ...data.customer,
        });

        const itemsToInsert = data.items.map((item) => ({
            ...item,
            invoiceId,
        }));

        await tx.insert(purchaseInvoiceItemsTable).values(itemsToInsert);

        return invoiceId;
    });
};

export const getRecentPurchaseInvoices = async () => {
    const invoices = db.query.purchaseInvoicesTable.findMany({
        orderBy: (purchaseInvoicesTable, { desc }) => [desc(purchaseInvoicesTable.createdAt)],
        limit: 5,
        with: {
            supplier: true,
        },
    });

    return invoices;
};

const buildPurchaseSearchCondition = (query: string) => {
    const searchTerm = `%${query}%`;
    return query
        ? or(
              sql`${purchaseInvoicesTable.invoiceNumber}::text ILIKE ${searchTerm}`,
              ilike(purchaseSuppliersTable.name, searchTerm)
          )
        : undefined;
};

export const getFilteredPurchaseInvoicesCount = async (query: string) => {
    let qb = db.select({ total: count() }).from(purchaseInvoicesTable).$dynamic();
    if (query) {
        qb = qb
            .leftJoin(
                purchaseSuppliersTable,
                eq(purchaseSuppliersTable.invoiceId, purchaseInvoicesTable.id)
            )
            .where(buildPurchaseSearchCondition(query));
    }

    const result = await qb;
    return result[0]?.total ?? 0;
};

export const getFilteredPurchaseInvoices = async (query: string, page: number) => {
    const offset = (page - 1) * ITEMS_PER_PAGE;

    const invoices = await db
        .select({
            id: purchaseInvoicesTable.id,
            invoiceNumber: purchaseInvoicesTable.invoiceNumber,
            createdAt: purchaseInvoicesTable.createdAt,
            customerName: purchaseSuppliersTable.name,
            customerPhone: purchaseSuppliersTable.phone,
            grandTotal: purchaseInvoicesTable.grandTotal,
        })
        .from(purchaseInvoicesTable)
        .leftJoin(
            purchaseSuppliersTable,
            eq(purchaseSuppliersTable.invoiceId, purchaseInvoicesTable.id)
        )
        .where(buildPurchaseSearchCondition(query))
        .orderBy(desc(purchaseInvoicesTable.createdAt))
        .limit(ITEMS_PER_PAGE)
        .offset(offset);

    return invoices;
};

export const getPurchaseInvoicesPageCount = async (query: string) => {
    const total = await getFilteredPurchaseInvoicesCount(query);
    return Math.ceil(total / ITEMS_PER_PAGE);
};

export const deletePurchaseInvoice = async (id: string) => {
    return await db.transaction(async (tx) => {
        await tx
            .delete(purchaseInvoiceItemsTable)
            .where(eq(purchaseInvoiceItemsTable.invoiceId, id));

        await tx
            .delete(purchaseSuppliersTable)
            .where(eq(purchaseSuppliersTable.invoiceId, id));

        const [deleted] = await tx
            .delete(purchaseInvoicesTable)
            .where(eq(purchaseInvoicesTable.id, id))
            .returning({ invoiceNumber: purchaseInvoicesTable.invoiceNumber });

        return deleted;
    });
};

