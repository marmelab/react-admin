import { add } from 'date-fns';
import { faker } from '@faker-js/faker';

import {
    defaultDealCategories,
    defaultDealStages,
} from '../../../root/defaultConfiguration';
import { Deal } from '../../../types';
import { Db } from './types';
import { randomDate } from './utils';

export const generateDeals = (db: Db): Deal[] => {
    const deals = Array.from(Array(50).keys()).map(id => {
        const company = faker.helpers.arrayElement(db.companies);
        company.nb_deals++;
        const contacts = faker.helpers.arrayElements(
            db.contacts.filter(contact => contact.company_id === company.id),
            faker.number.int({ min: 1, max: 3 })
        );
        const lowercaseName = faker.lorem.words();
        const created_at = randomDate(
            new Date(company.created_at)
        ).toISOString();

        const expected_closing_date = randomDate(
            new Date(created_at),
            add(new Date(created_at), { months: 6 })
        ).toISOString();

        return {
            id,
            name: lowercaseName[0].toUpperCase() + lowercaseName.slice(1),
            company_id: company.id,
            contact_ids: contacts.map(contact => contact.id),
            category: faker.helpers.arrayElement(defaultDealCategories),
            stage: faker.helpers.arrayElement(defaultDealStages).value,
            description: faker.lorem.paragraphs(
                faker.number.int({ min: 1, max: 4 })
            ),
            amount: faker.number.int(1000) * 100,
            created_at,
            updated_at: randomDate(new Date(created_at)).toISOString(),
            expected_closing_date,
            sales_id: company.sales_id,
            index: 0,
        };
    });
    // compute index based on stage
    defaultDealStages.forEach(stage => {
        deals
            .filter(deal => deal.stage === stage.value)
            .forEach((deal, index) => {
                deals[deal.id].index = index;
            });
    });
    return deals;
};
