import { random, lorem } from 'faker/locale/en_US';

import { Db } from './types';
import { randomDate } from './utils';

export const generateDealNotes = (db: Db) => {
    return Array.from(Array(300).keys()).map(id => {
        const deal = random.arrayElement(db.deals);
        return {
            id,
            deal_id: deal.id,
            text: lorem.paragraphs(random.number({ min: 1, max: 4 })),
            date: randomDate(
                new Date(db.deals[deal.id as number].created_at)
            ).toISOString(),
            sales_id: deal.sales_id,
        };
    });
};
