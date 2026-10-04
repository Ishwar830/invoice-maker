import 'dotenv/config';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { usersTable, shopsTable, bankDetailsTable } from '../db/schema';

// ============================================================================
// CONFIGURATION: Hardcode your values here
// ============================================================================

const USER_DATA = {
    username: 'new_user',
    password: 'Password123!', // Will be hashed with bcrypt automatically
};

const SHOP_DATA = {
    name: 'New Jewellers',
    ownerName: 'Shop Owner',
    gstNumber: '24ABCDE1234F1Z5',
    phone: '9876543210',
    address: 'Shop No. 1, Main Market, City, State - 000000',
};

const BANK_DATA = {
    bankName: 'State Bank of India',
    bankBranch: 'Main Branch',
    bankIfsc: 'SBIN0001234',
    bankAccountNumber: '123456789012',
};

// ============================================================================
// INSERTION SCRIPT
// ============================================================================

async function insertUserShopBank() {
    console.log('🚀 Starting insertion for user, shop, and bank details...\n');

    const username = USER_DATA.username.trim();
    const password = USER_DATA.password;

    if (!username || !password) {
        console.error('❌ Error: Both username and password must be provided.');
        process.exit(1);
    }

    if (!SHOP_DATA.name.trim()) {
        console.error('❌ Error: Shop name is required.');
        process.exit(1);
    }

    try {
        // Check if username already exists
        const [existingUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.username, username))
            .limit(1);

        if (existingUser) {
            console.error(
                `❌ Error: A user with username "${username}" already exists in the database.`
            );
            console.error('Please specify a different username in USER_DATA.');
            process.exit(1);
        }

        // Hash password
        console.log('🔒 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Run insertion in a transaction
        const result = await db.transaction(async (tx) => {
            console.log('👤 Inserting user into database...');
            const [user] = await tx
                .insert(usersTable)
                .values({
                    username,
                    password: hashedPassword,
                })
                .returning();

            console.log('🏪 Inserting shop details...');
            const [shop] = await tx
                .insert(shopsTable)
                .values({
                    userId: user.id,
                    name: SHOP_DATA.name.trim(),
                    ownerName: SHOP_DATA.ownerName?.trim() || null,
                    gstNumber:
                        SHOP_DATA.gstNumber?.trim().toUpperCase() || null,
                    phone: SHOP_DATA.phone?.trim() || null,
                    address: SHOP_DATA.address?.trim() || null,
                })
                .returning();

            console.log('🏦 Inserting bank details...');
            const [bankDetails] = await tx
                .insert(bankDetailsTable)
                .values({
                    userId: user.id,
                    bankName: BANK_DATA.bankName?.trim() || null,
                    bankBranch: BANK_DATA.bankBranch?.trim() || null,
                    bankIfsc: BANK_DATA.bankIfsc?.trim().toUpperCase() || null,
                    bankAccountNumber:
                        BANK_DATA.bankAccountNumber?.trim() || null,
                })
                .returning();

            return { user, shop, bankDetails };
        });

        console.log('\n======================================================');
        console.log('✅ Successfully inserted User, Shop, and Bank Details!');
        console.log('======================================================');
        console.log('\n👤 User:');
        console.log(`  ID:       ${result.user.id}`);
        console.log(`  Username: ${result.user.username}`);
        console.log('\n🏪 Shop:');
        console.log(`  ID:       ${result.shop.id}`);
        console.log(`  Name:     ${result.shop.name}`);
        console.log(`  Owner:    ${result.shop.ownerName || 'N/A'}`);
        console.log(`  GST:      ${result.shop.gstNumber || 'N/A'}`);
        console.log(`  Phone:    ${result.shop.phone || 'N/A'}`);
        console.log(`  Address:  ${result.shop.address || 'N/A'}`);
        console.log('\n🏦 Bank Details:');
        console.log(`  ID:       ${result.bankDetails.id}`);
        console.log(`  Bank:     ${result.bankDetails.bankName || 'N/A'}`);
        console.log(`  Branch:   ${result.bankDetails.bankBranch || 'N/A'}`);
        console.log(`  IFSC:     ${result.bankDetails.bankIfsc || 'N/A'}`);
        console.log(
            `  Account:  ${result.bankDetails.bankAccountNumber || 'N/A'}`
        );
        console.log('======================================================\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Insertion failed:', error);
        process.exit(1);
    }
}

insertUserShopBank();
