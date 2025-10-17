import { faker } from '@faker-js/faker';

import { Db } from './types';
import { randomDate } from './utils';

export const generateDealNotes = (db: Db) => {
    return Array.from(Array(300).keys()).map(id => {
        const deal = faker.helpers.arrayElement(db.deals);
        return {
            id,
            deal_id: deal.id,
            text: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 4 })),
            date: randomDate(
                new Date(db.deals[deal.id as number].created_at)
            ).toISOString(),
            sales_id: deal.sales_id,
        };
    });
};
