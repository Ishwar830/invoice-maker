import { db } from './index';
import {
    usersTable,
    shopsTable,
    bankDetailsTable,
    sessionsTable,
    inventoryCategoriesTable,
    inventoryItemsTable,
    salesInvoicesTable,
    salesCustomersTable,
    salesInvoiceItemsTable,
    purchaseInvoicesTable,
    purchaseSuppliersTable,
    purchaseInvoiceItemsTable,
} from './schema';
import {
    calculateInvoiceTotals,
    calculateItemAmount,
    calculateItemBasePrice,
} from '../lib/calculations';
import { getFinancialYearPrefix } from './queries/utils';
import bcrypt from 'bcrypt';

async function seed() {
    console.log('🌱 Starting database wipe and seed...');

    try {
        // 1. Wipe all existing data in reverse FK order
        console.log('🧹 Cleaning existing tables...');
        await db.delete(sessionsTable);
        await db.delete(salesInvoiceItemsTable);
        await db.delete(salesCustomersTable);
        await db.delete(salesInvoicesTable);
        await db.delete(purchaseInvoiceItemsTable);
        await db.delete(purchaseSuppliersTable);
        await db.delete(purchaseInvoicesTable);
        await db.delete(inventoryItemsTable);
        await db.delete(inventoryCategoriesTable);
        await db.delete(bankDetailsTable);
        await db.delete(shopsTable);
        await db.delete(usersTable);

        // 2. Define data to seed
        const defaultPassword = 'Password123!';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        console.log('👤 Inserting users...');
        const [user1, user2] = await db
            .insert(usersTable)
            .values([
                { username: 'krishna', password: hashedPassword },
                { username: 'radha', password: hashedPassword },
            ])
            .returning();

        console.log('🏪 Inserting shops...');
        const [shop1, shop2] = await db
            .insert(shopsTable)
            .values([
                {
                    userId: user1.id,
                    name: 'Krishna Jewellers',
                    ownerName: 'Ramesh Suthar',
                    gstNumber: '24ABCDE1234F1Z5',
                    phone: '9876543210',
                    address: 'Station Road, Palanpur, Gujarat - 385001',
                },
                {
                    userId: user2.id,
                    name: 'Radha Silver & Gold',
                    ownerName: 'Mohan Lal',
                    gstNumber: '24XYZAB5678C1D2',
                    phone: '9812345678',
                    address: 'MG Road, Ahmedabad, Gujarat - 380001',
                },
            ])
            .returning();

        console.log('🏦 Inserting bank details...');
        await db.insert(bankDetailsTable).values([
            {
                userId: user1.id,
                bankName: 'Kotak Mahindra Bank',
                bankBranch: 'Ambernath East',
                bankIfsc: 'KKBK0002040',
                bankAccountNumber: '9833865787',
            },
            {
                userId: user2.id,
                bankName: 'State Bank of India',
                bankBranch: 'Ashram Road, Ahmedabad',
                bankIfsc: 'SBIN0001234',
                bankAccountNumber: '38927401928',
            },
        ]);

        const shops = [
            {
                shop: shop1,
                categories: ['Gold Rings', 'Gold Chains', 'Diamond Necklaces'],
                items: [
                    { code: 'RNG-001', name: '22K Floral Gold Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 4.5, rate: 7200 },
                    { code: 'RNG-002', name: '22K Solitaire Gold Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 3.8, rate: 7200 },
                    { code: 'RNG-003', name: '22K Twisted Band Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 3.2, rate: 7200 },
                    { code: 'RNG-004', name: '22K Temple Motif Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 5.1, rate: 7200 },
                    { code: 'RNG-005', name: '22K Peacock Gold Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 4.0, rate: 7200 },
                    { code: 'RNG-006', name: '18K Rose Gold Band', catIndex: 0, metal: 'gold', purity: '18K', weight: 3.5, rate: 6100 },
                    { code: 'RNG-007', name: '22K Filigree Gold Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 4.8, rate: 7200 },
                    { code: 'RNG-008', name: '22K Kundan Cocktail Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 6.2, rate: 7200 },
                    { code: 'RNG-009', name: '22K Meenakari Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 5.5, rate: 7200 },
                    { code: 'RNG-010', name: '22K Plain Gold Band', catIndex: 0, metal: 'gold', purity: '22K', weight: 2.8, rate: 7200 },
                    { code: 'RNG-011', name: '22K Antique Finish Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 4.3, rate: 7200 },
                    { code: 'RNG-012', name: '22K Navratna Gold Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 5.8, rate: 7200 },
                    { code: 'RNG-013', name: '18K Diamond Cluster Ring', catIndex: 0, metal: 'gold', purity: '18K', weight: 3.9, rate: 6100 },
                    { code: 'RNG-014', name: '22K Leaf Pattern Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 3.6, rate: 7200 },
                    { code: 'RNG-015', name: '22K Jadau Bridal Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 7.2, rate: 7200 },
                    { code: 'RNG-016', name: '22K Geometric Gold Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 3.1, rate: 7200 },
                    { code: 'RNG-017', name: '22K Polki Statement Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 6.5, rate: 7200 },
                    { code: 'RNG-018', name: '22K Matte Finish Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 4.1, rate: 7200 },
                    { code: 'RNG-019', name: '22K Rope Twist Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 3.4, rate: 7200 },
                    { code: 'RNG-020', name: '22K Rajasthani Gold Ring', catIndex: 0, metal: 'gold', purity: '22K', weight: 5.0, rate: 7200 },
                    { code: 'CHN-001', name: '22K Rope Gold Chain', catIndex: 1, metal: 'gold', purity: '22K', weight: 12.0, rate: 7200 },
                    { code: 'NCK-001', name: '18K Diamond Choker Necklace', catIndex: 2, metal: 'gold', purity: '18K', weight: 25.5, rate: 6100 },
                ],
                customer: {
                    name: 'Rajesh Sharma',
                    phone: '9876543210',
                    address: '12, MG Road, Mumbai',
                    panGstNumber: '27AAAAA1111A1Z1',
                },
                supplier: {
                    name: 'Surat Bullion Mart',
                    phone: '9871122334',
                    address: 'Diamond Market, Surat',
                    panGstNumber: '24GGGGG5555G1Z9',
                },
            },
            {
                shop: shop2,
                categories: ['Silver Bangles', 'Silver Coins', 'Silver Utensils'],
                items: [
                    { code: 'BNG-001', name: '925 Sterling Silver Kada', catIndex: 0, metal: 'silver', purity: '92.5%', weight: 45.0, rate: 85 },
                    { code: 'BNG-002', name: 'Antique Carved Silver Bangle', catIndex: 0, metal: 'silver', purity: '92.5%', weight: 32.5, rate: 85 },
                    { code: 'COI-001', name: 'Lakshmi Ganesh Silver Coin 10g', catIndex: 1, metal: 'silver', purity: '99.9%', weight: 10.0, rate: 90 },
                    { code: 'UTN-001', name: 'Pure Silver Puja Thali', catIndex: 2, metal: 'silver', purity: '92.5%', weight: 150.0, rate: 85 },
                ],
                customer: {
                    name: 'Priya Patel',
                    phone: '9823456789',
                    address: '45, SG Highway, Ahmedabad',
                    panGstNumber: '',
                },
                supplier: {
                    name: 'Rajkot Silver Refineries',
                    phone: '9822334455',
                    address: 'Soni Bazar, Rajkot',
                    panGstNumber: '24HHHHH6666H1Z8',
                },
            },
        ];

        for (const config of shops) {
            console.log(`📦 Seeding data for shop: ${config.shop.name}...`);

            // Seed categories
            const insertedCategories = await db
                .insert(inventoryCategoriesTable)
                .values(
                    config.categories.map((name) => ({
                        shopId: config.shop.id,
                        name,
                    }))
                )
                .returning();

            // Seed inventory items
            const insertedItems = await db
                .insert(inventoryItemsTable)
                .values(
                    config.items.map((it) => ({
                        shopId: config.shop.id,
                        itemCode: it.code,
                        categoryId: insertedCategories[it.catIndex].id,
                        metalType: it.metal,
                        metalPurity: it.purity,
                        grossWeight: it.weight,
                        netWeight: it.weight,
                        status: 'available',
                    }))
                )
                .returning();

            // Seed a Sales Invoice
            const invoiceDateStr = '2026-10-01';
            const fyPrefix = getFinancialYearPrefix(new Date(invoiceDateStr));
            const soldItem = config.items[0];

            const itemData = {
                netWeight: soldItem.weight,
                metalRate: soldItem.rate,
                makingChargesPercent: 10,
            };
            const basePrice = calculateItemBasePrice(itemData);
            const makingChargesAmount = Math.round(basePrice * 0.1 * 100) / 100;
            const itemTotal = Math.round(calculateItemAmount(itemData) * 100) / 100;

            const totals = calculateInvoiceTotals({
                items: [itemData],
                cgstPercent: 1.5,
                sgstPercent: 1.5,
                discountAmount: 0,
            });

            await db.transaction(async (tx) => {
                const [salesInvoice] = await tx
                    .insert(salesInvoicesTable)
                    .values({
                        shopId: config.shop.id,
                        invoiceNumber: 1,
                        cgstPercent: 1.5,
                        cgstAmount: Math.round(totals.cgstAmount * 100) / 100,
                        sgstPercent: 1.5,
                        sgstAmount: Math.round(totals.sgstAmount * 100) / 100,
                        subTotal: Math.round(totals.subTotal * 100) / 100,
                        grandTotal: Math.round(totals.grandTotal * 100) / 100,
                        discountAmount: 0,
                        notes: 'Thank you for your purchase!',
                        createdAt: invoiceDateStr,
                        financialYear: fyPrefix,
                    })
                    .returning();

                await tx.insert(salesCustomersTable).values({
                    invoiceId: salesInvoice.id,
                    name: config.customer.name,
                    phone: config.customer.phone,
                    address: config.customer.address,
                    panGstNumber: config.customer.panGstNumber || null,
                });

                await tx.insert(salesInvoiceItemsTable).values({
                    invoiceId: salesInvoice.id,
                    description: soldItem.name,
                    metalType: soldItem.metal,
                    metalPurity: soldItem.purity,
                    metalRate: soldItem.rate,
                    grossWeight: soldItem.weight,
                    netWeight: soldItem.weight,
                    makingChargesPercent: 10,
                    makingChargesAmount,
                    itemTotal,
                    inventoryItemId: insertedItems[0].id,
                });
            });

            // Seed a Purchase Invoice
            await db.transaction(async (tx) => {
                const purchaseSubTotal = 50000;
                const [purchaseInvoice] = await tx
                    .insert(purchaseInvoicesTable)
                    .values({
                        shopId: config.shop.id,
                        invoiceNumber: 1,
                        subTotal: purchaseSubTotal,
                        grandTotal: purchaseSubTotal,
                        notes: 'Raw material procurement',
                        createdAt: invoiceDateStr,
                        financialYear: fyPrefix,
                    })
                    .returning();

                await tx.insert(purchaseSuppliersTable).values({
                    invoiceId: purchaseInvoice.id,
                    name: config.supplier.name,
                    phone: config.supplier.phone,
                    address: config.supplier.address,
                    panGstNumber: config.supplier.panGstNumber || null,
                });

                await tx.insert(purchaseInvoiceItemsTable).values({
                    invoiceId: purchaseInvoice.id,
                    description: 'Raw bullion bars',
                    metalType: config.items[0].metal,
                    metalPurity: config.items[0].purity,
                    metalRate: config.items[0].rate,
                    grossWeight: 50,
                    netWeight: 50,
                    itemTotal: purchaseSubTotal,
                });
            });
        }

        console.log('\n======================================================');
        console.log('✅ DATABASE SEEDED SUCCESSFULLY WITH 2 SHOPS');
        console.log('======================================================');
        console.log('\nShop 1:');
        console.log(`  Name:     Krishna Jewellers`);
        console.log(`  Username: krishna`);
        console.log(`  Password: ${defaultPassword}`);
        console.log('\nShop 2:');
        console.log(`  Name:     Radha Silver & Gold`);
        console.log(`  Username: radha`);
        console.log(`  Password: ${defaultPassword}`);
        console.log('======================================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
