import { eq, ilike, or, count, desc, max, sql, gte, and } from 'drizzle-orm';
import { db } from '../index';
import {
    salesInvoicesTable,
    salesInvoiceItemsTable,
    salesCustomersTable,
} from '../schema';
import { type SalesInvoicePayload } from '@/lib/validations/sales-invoice';
import { getFinancialYearPrefix } from './utils';
import { markItemsAsSold, markItemsAsAvailable } from './inventory';

const ITEMS_PER_PAGE = 10;

export const getNextSalesInvoiceNumber = async () => {
    const date = new Date();
    const fyPrefix = getFinancialYearPrefix(date);

    const result = await db
        .select({ maxNum: max(salesInvoicesTable.invoiceNumber) })
        .from(salesInvoicesTable)
        .where(eq(salesInvoicesTable.financialYear, fyPrefix));

    return (result[0]?.maxNum ?? 0) + 1;
};

export const getSalesInvoiceById = async (id: string) => {
    const invoice = await db.query.salesInvoicesTable.findFirst({
        where: eq(salesInvoicesTable.id, id),
    });

    return invoice;
};

export const getSalesInvoiceWithCustomerAndItems = async (id: string) => {
    const invoice = await db.query.salesInvoicesTable.findFirst({
        where: eq(salesInvoicesTable.id, id),
        with: {
            customer: true,
            items: true,
        },
    });

    return invoice;
};

const buildSalesSearchCondition = (query: string) => {
    const searchTerm = `%${query}%`;
    return query
        ? or(
              sql`${salesInvoicesTable.invoiceNumber}::text ILIKE ${searchTerm}`,
              ilike(salesCustomersTable.name, searchTerm)
          )
        : undefined;
};

export const getFilteredSalesInvoicesCount = async (query: string) => {
    let qb = db.select({ total: count() }).from(salesInvoicesTable).$dynamic();
    if (query) {
        qb = qb
            .leftJoin(
                salesCustomersTable,
                eq(salesCustomersTable.invoiceId, salesInvoicesTable.id)
            )
            .where(buildSalesSearchCondition(query));
    }

    const result = await qb;
    return result[0]?.total ?? 0;
};

export const getFilteredSalesInvoices = async (query: string, page: number) => {
    const offset = (page - 1) * ITEMS_PER_PAGE;

    const invoices = await db
        .select({
            id: salesInvoicesTable.id,
            invoiceNumber: salesInvoicesTable.invoiceNumber,
            createdAt: salesInvoicesTable.createdAt,
            customerName: salesCustomersTable.name,
            customerPhone: salesCustomersTable.phone,
            grandTotal: salesInvoicesTable.grandTotal,
        })
        .from(salesInvoicesTable)
        .leftJoin(
            salesCustomersTable,
            eq(salesCustomersTable.invoiceId, salesInvoicesTable.id)
        )
        .where(buildSalesSearchCondition(query))
        .orderBy(desc(salesInvoicesTable.createdAt))
        .limit(ITEMS_PER_PAGE)
        .offset(offset);

    return invoices;
};

export const getSalesInvoicesPageCount = async (query: string) => {
    const total = await getFilteredSalesInvoicesCount(query);
    return Math.ceil(total / ITEMS_PER_PAGE);
};

export const saveSalesInvoice = async (data: SalesInvoicePayload) => {
    const invoiceDate = data.createdAt;
    const fyPrefix = getFinancialYearPrefix(invoiceDate);

    const existingInvoice = await db.query.salesInvoicesTable.findFirst({
        where: and(
            eq(salesInvoicesTable.financialYear, fyPrefix),
            eq(salesInvoicesTable.invoiceNumber, data.invoiceNumber)
        ),
    });

    if (existingInvoice) {
        throw new Error('Invoice Number already exists');
    }

    // Collect inventory item IDs from the items themselves
    const inventoryItemIds = data.items
        .map((item) => item.inventoryItemId)
        .filter((id): id is string => Boolean(id));

    return await db.transaction(async (tx) => {
        const [inserted] = await tx
            .insert(salesInvoicesTable)
            .values({
                ...data,
                createdAt: data.createdAt.toISOString(),
                financialYear: fyPrefix,
            })
            .returning({ invoiceId: salesInvoicesTable.id });

        const invoiceId = inserted.invoiceId;

        await tx.insert(salesCustomersTable).values({
            invoiceId,
            ...data.customer,
        });

        const itemsToInsert = data.items.map((item) => ({
            ...item,
            invoiceId,
            // Persist the inventory link per row (null if not linked)
            inventoryItemId: item.inventoryItemId ?? null,
        }));

        await tx.insert(salesInvoiceItemsTable).values(itemsToInsert);

        // Atomically mark linked inventory items as sold
        await markItemsAsSold(inventoryItemIds, tx);

        return invoiceId;
    });
};

export const getRecentSalesInvoicesCount = async (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const dateString = cutoffDate.toISOString().split('T')[0];

    const result = await db
        .select({ total: count() })
        .from(salesInvoicesTable)
        .where(gte(salesInvoicesTable.createdAt, dateString));

    return result[0]?.total ?? 0;
};

export const getRecentSalesInvoices = async () => {
    const invoices = db.query.salesInvoicesTable.findMany({
        orderBy: (salesInvoicesTable, { desc }) => [desc(salesInvoicesTable.createdAt)],
        limit: 5,
        with: {
            customer: true,
        },
    });

    return invoices;
};

export const deleteSalesInvoice = async (id: string) => {
    return await db.transaction(async (tx) => {
        // Collect linked inventory item IDs before deleting rows
        const linkedItems = await tx
            .select({ inventoryItemId: salesInvoiceItemsTable.inventoryItemId })
            .from(salesInvoiceItemsTable)
            .where(eq(salesInvoiceItemsTable.invoiceId, id));

        const inventoryItemIds = linkedItems
            .map((r) => r.inventoryItemId)
            .filter((id): id is string => Boolean(id));

        await tx
            .delete(salesInvoiceItemsTable)
            .where(eq(salesInvoiceItemsTable.invoiceId, id));

        await tx
            .delete(salesCustomersTable)
            .where(eq(salesCustomersTable.invoiceId, id));

        const [deleted] = await tx
            .delete(salesInvoicesTable)
            .where(eq(salesInvoicesTable.id, id))
            .returning({ invoiceNumber: salesInvoicesTable.invoiceNumber });

        // Revert linked inventory items back to available
        await markItemsAsAvailable(inventoryItemIds, tx);

        return deleted;
    });
};

