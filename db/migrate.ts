import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

async function runMigration() {
    console.log('⏳ Running migrations...');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl:
            process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : false,
    });

    const db = drizzle(pool);

    // This applies the SQL files to the database
    await migrate(db, { migrationsFolder: './drizzle' });

    console.log('✅ Migrations completed!');
    await pool.end();
}

runMigration().catch((err) => {
    console.error('❌ Migration failed', err);
    process.exit(1);
});
