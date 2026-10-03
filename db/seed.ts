import { db } from './index';
import {
    salesCustomersTable,
    salesInvoiceItemsTable,
    salesInvoicesTable,
    purchaseInvoicesTable,
    purchaseInvoiceItemsTable,
    purchaseSuppliersTable,
} from './schema';
import {
    calculateInvoiceTotals,
    calculateItemAmount,
    calculateItemBasePrice,
} from '../lib/calculations';
import { getFinancialYearPrefix } from './queries/utils';

const customersPool = [
    {
        name: 'Rajesh Sharma',
        phone: '9876543210',
        address: '12, MG Road, Mumbai',
        gstNumber: '27AAAAA1111A1Z1',
    },
    {
        name: 'Priya Patel',
        phone: '9823456789',
        address: '45, SG Highway, Ahmedabad',
        gstNumber: '',
    },
    {
        name: 'Amit Verma',
        phone: '9812345678',
        address: '78, Ring Road, Delhi',
        gstNumber: '07BBBBB2222B2Z2',
    },
    {
        name: 'Sunita Gupta',
        phone: '9988776655',
        address: '101, Park Street, Kolkata',
        gstNumber: '',
    },
    {
        name: 'Vikram Singh',
        phone: '9765432109',
        address: '22, M.I. Road, Jaipur',
        gstNumber: '08CCCCC3333C3Z3',
    },
    {
        name: 'Anjali Joshi',
        phone: '9654321098',
        address: '55, FC Road, Pune',
        gstNumber: '',
    },
    {
        name: 'Sanjay Mehta',
        phone: '9543210987',
        address: '88, CG Road, Ahmedabad',
        gstNumber: '24DDDDD4444D4Z4',
    },
    {
        name: 'Deepika Rao',
        phone: '9432109876',
        address: '14, Residency Road, Bangalore',
        gstNumber: '',
    },
    {
        name: 'Sandeep Reddy',
        phone: '9321098765',
        address: '67, Jubilee Hills, Hyderabad',
        gstNumber: '36EEEEE5555E5Z5',
    },
    {
        name: 'Neha Kapoor',
        phone: '9210987654',
        address: '30, Linking Road, Mumbai',
        gstNumber: '',
    },
    {
        name: 'Arun Kumar',
        phone: '9109876543',
        address: '11, Mount Road, Chennai',
        gstNumber: '',
    },
    {
        name: 'Kiran Deshmukh',
        phone: '9098765432',
        address: '40, Shivaji Nagar, Pune',
        gstNumber: '27FFFFF6666F6Z6',
    },
    {
        name: 'Manish Pandey',
        phone: '8987654321',
        address: '5, Hazratganj, Lucknow',
        gstNumber: '',
    },
    {
        name: 'Pooja Choudhary',
        phone: '8876543210',
        address: '16, Tonk Road, Jaipur',
        gstNumber: '',
    },
    {
        name: 'Rohan Shah',
        phone: '8765432109',
        address: '3, Ghod Dod Road, Surat',
        gstNumber: '24GGGGG7777G7Z7',
    },
];

const itemsPool = [
    {
        description: 'Gold Ring',
        metalType: 'Gold',
        metalPurity: '22K',
        baseRate: 7200,
        baseWeight: 6,
    },
    {
        description: 'Gold Chain',
        metalType: 'Gold',
        metalPurity: '22K',
        baseRate: 7200,
        baseWeight: 15,
    },
    {
        description: 'Gold Bangle',
        metalType: 'Gold',
        metalPurity: '22K',
        baseRate: 7200,
        baseWeight: 22,
    },
    {
        description: 'Gold Necklace',
        metalType: 'Gold',
        metalPurity: '22K',
        baseRate: 7200,
        baseWeight: 45,
    },
    {
        description: 'Gold Earrings',
        metalType: 'Gold',
        metalPurity: '22K',
        baseRate: 7200,
        baseWeight: 8,
    },
    {
        description: 'Gold Bracelet',
        metalType: 'Gold',
        metalPurity: '22K',
        baseRate: 7200,
        baseWeight: 18,
    },
    {
        description: 'Gold Kada',
        metalType: 'Gold',
        metalPurity: '22K',
        baseRate: 7200,
        baseWeight: 28,
    },
    {
        description: 'Gold Mangalsutra',
        metalType: 'Gold',
        metalPurity: '22K',
        baseRate: 7200,
        baseWeight: 20,
    },
    {
        description: 'Diamond Ring',
        metalType: 'Gold',
        metalPurity: '18K',
        baseRate: 7200,
        baseWeight: 4,
    },
    {
        description: 'Diamond Nose Pin',
        metalType: 'Gold',
        metalPurity: '18K',
        baseRate: 7200,
        baseWeight: 1.5,
    },
    {
        description: 'Silver Anklet',
        metalType: 'Silver',
        metalPurity: '92.5 Sterling',
        baseRate: 85,
        baseWeight: 35,
    },
    {
        description: 'Silver Chain',
        metalType: 'Silver',
        metalPurity: '92.5 Sterling',
        baseRate: 85,
        baseWeight: 20,
    },
    {
        description: 'Silver Bracelet',
        metalType: 'Silver',
        metalPurity: '92.5 Sterling',
        baseRate: 85,
        baseWeight: 15,
    },
    {
        description: 'Platinum Ring',
        metalType: 'Platinum',
        metalPurity: '950 Platinum',
        baseRate: 3200,
        baseWeight: 8,
    },
];

const notesPool = [
    'Thank you for shopping with Krishna Jewellers!',
    'Goods once sold will not be taken back.',
    'Certified gold jewellery.',
    'Special discount applied.',
    'Making charges promotional offer.',
    '',
];

async function seed() {
    console.log('🌱 Starting database seeding...');

    try {
        // 1. Clean existing data in correct dependency order
        console.log('🧹 Clearing old data...');
        await db.delete(purchaseInvoiceItemsTable);
        await db.delete(purchaseSuppliersTable);
        await db.delete(purchaseInvoicesTable);
        await db.delete(salesInvoiceItemsTable);
        await db.delete(salesCustomersTable);
        await db.delete(salesInvoicesTable);
        console.log('✨ Database cleared.');

        // 2. Generate and Insert 50 Invoices
        const count = 50;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 180); // 180 days ago

        console.log(`🚀 Seeding ${count} sales invoices...`);

        for (let i = 0; i < count; i++) {
            const invoiceNumber = 1001 + i;

            // Generate invoice date
            const invoiceDate = new Date(startDate);
            const daysToAdd =
                Math.floor((180 / count) * i) + (Math.random() > 0.5 ? 1 : 0);
            invoiceDate.setDate(startDate.getDate() + daysToAdd);
            const createdAtString = invoiceDate.toISOString().split('T')[0];

            // Pick a customer
            const customerSource =
                customersPool[Math.floor(Math.random() * customersPool.length)];

            interface SeedItem {
                description: string;
                metalType: string;
                metalPurity: string;
                metalRate: number;
                grossWeight: number;
                netWeight: number;
                makingChargesPercent: number;
                makingChargesAmount: number;
                itemTotal: number;
            }
            // Select number of items (1 to 3)
            const numItems = Math.floor(Math.random() * 3) + 1;
            const items: SeedItem[] = [];

            for (let j = 0; j < numItems; j++) {
                const itemTemplate =
                    itemsPool[Math.floor(Math.random() * itemsPool.length)];

                // Add random variation to weight and rate
                const weightVariation =
                    (Math.random() * 0.2 - 0.1) * itemTemplate.baseWeight; // +/- 10%
                const grossWeight = Math.max(
                    0.5,
                    Math.round(
                        (itemTemplate.baseWeight + weightVariation) * 100
                    ) / 100
                );

                // Net weight is gross weight minus small stone weight or zero
                const stoneWeight =
                    Math.random() > 0.6
                        ? Math.round(Math.random() * 0.5 * 100) / 100
                        : 0;
                const netWeight = Math.max(
                    0.5,
                    Math.round((grossWeight - stoneWeight) * 100) / 100
                );

                const rateVariation = Math.round(
                    (Math.random() * 0.04 - 0.02) * itemTemplate.baseRate
                ); // +/- 2%
                const metalRate = itemTemplate.baseRate + rateVariation;

                const makingChargesPercent = Math.floor(Math.random() * 8) + 8; // 8% to 15%

                const itemData = {
                    netWeight,
                    metalRate,
                    makingChargesPercent,
                };

                const basePrice = calculateItemBasePrice(itemData);
                const makingChargesAmount =
                    Math.round(basePrice * (makingChargesPercent / 100) * 100) /
                    100;
                const itemTotal =
                    Math.round(calculateItemAmount(itemData) * 100) / 100;

                items.push({
                    description: itemTemplate.description,
                    metalType: itemTemplate.metalType,
                    metalPurity: itemTemplate.metalPurity,
                    metalRate,
                    grossWeight,
                    netWeight,
                    makingChargesPercent,
                    makingChargesAmount,
                    itemTotal,
                });
            }

            // Calculate Invoice Totals
            const cgstPercent = 1.5;
            const sgstPercent = 1.5;

            // Temporary items payload matching calculations interface
            const calculationItems = items.map((it) => ({
                netWeight: it.netWeight,
                metalRate: it.metalRate,
                makingChargesPercent: it.makingChargesPercent,
            }));

            const { subTotal } = calculateInvoiceTotals({
                items: calculationItems,
                cgstPercent,
                sgstPercent,
                discountAmount: 0,
            });

            // Random discount
            let discountAmount = 0;
            if (subTotal > 50000 && Math.random() > 0.4) {
                const discounts = [250, 500, 1000, 1500, 2000];
                discountAmount =
                    discounts[Math.floor(Math.random() * discounts.length)];
            } else if (subTotal > 10000 && Math.random() > 0.5) {
                discountAmount = 100;
            }

            const { cgstAmount, sgstAmount, grandTotal } =
                calculateInvoiceTotals({
                    items: calculationItems,
                    cgstPercent,
                    sgstPercent,
                    discountAmount,
                });

            const notes =
                notesPool[Math.floor(Math.random() * notesPool.length)];

            // Insert using a transaction
            const fyPrefix = getFinancialYearPrefix(new Date(createdAtString));

            await db.transaction(async (tx) => {
                const [insertedInvoice] = await tx
                    .insert(salesInvoicesTable)
                    .values({
                        invoiceNumber,
                        cgstPercent,
                        cgstAmount: Math.round(cgstAmount * 100) / 100,
                        sgstPercent,
                        sgstAmount: Math.round(sgstAmount * 100) / 100,
                        subTotal: Math.round(subTotal * 100) / 100,
                        grandTotal: Math.round(grandTotal * 100) / 100,
                        discountAmount: Math.round(discountAmount * 100) / 100,
                        notes: notes || null,
                        createdAt: createdAtString,
                        financialYear: fyPrefix,
                    })
                    .returning({ id: salesInvoicesTable.id });

                const invoiceId = insertedInvoice.id;

                await tx.insert(salesCustomersTable).values({
                    invoiceId,
                    name: customerSource.name,
                    phone: customerSource.phone || null,
                    address: customerSource.address || null,
                    gstNumber: customerSource.gstNumber || null,
                });

                const itemsToInsert = items.map((item) => ({
                    invoiceId,
                    ...item,
                }));

                await tx.insert(salesInvoiceItemsTable).values(itemsToInsert);
            });
        }

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
