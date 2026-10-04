import { db } from '@/db';
import { shopsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getShopById = async (id: string) => {
    return db.query.shopsTable.findFirst({
        where: eq(shopsTable.id, id),
    });
};
