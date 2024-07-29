import { random, lorem } from 'faker/locale/en_US';

import { Db } from './types';
import { randomDate } from './utils';

export const generateDealNotes = (db: Db) => {
    return Array.from(Array(300).keys()).map(id => {
        const deal = random.arrayElement(db.deals);
        deal.nb_notes++;
        return {
            id,
            deal_id: deal.id,
            text: lorem.paragraphs(random.number({ min: 1, max: 4 })),
            date: randomDate(
                new Date(db.companies[deal.company_id as number].created_at)
            ),
            sales_id: deal.sales_id,
        };
    });
};
