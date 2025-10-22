import { faker } from '@faker-js/faker';

import {
    defaultContactGender,
    defaultNoteStatuses,
} from '../../../root/defaultConfiguration';
import { Company, Contact } from '../../../types';
import { Db } from './types';
import { randomDate, weightedBoolean } from './utils';

const maxContacts = {
    1: 1,
    10: 4,
    50: 12,
    250: 25,
    500: 50,
};

export const generateContacts = (db: Db): Required<Contact>[] => {
    const nbAvailblePictures = 223;
    let numberOfContacts = 0;

    return Array.from(Array(500).keys()).map(id => {
        const has_avatar =
            weightedBoolean(25) && numberOfContacts < nbAvailblePictures;
        const gender = faker.helpers.arrayElement(defaultContactGender).value;
        const first_name = faker.person.firstName(gender as any);
        const last_name = faker.person.lastName();
        const email = faker.internet.email({
            firstName: first_name,
            lastName: last_name,
        });
        const avatar = {
            src: has_avatar
                ? 'https://marmelab.com/posters/avatar-' +
                  (223 - numberOfContacts) +
                  '.jpeg'
                : undefined,
        };
        const title = faker.company.buzzAdjective();

        if (has_avatar) {
            numberOfContacts++;
        }

        // choose company with people left to know
        let company: Required<Company>;
        do {
            company = faker.helpers.arrayElement(db.companies);
        } while (company.nb_contacts >= maxContacts[company.size]);
        company.nb_contacts++;

        const first_seen = randomDate(
            new Date(company.created_at)
        ).toISOString();
        const last_seen = first_seen;

        return {
            id,
            first_name,
            last_name,
            gender,
            title: title.charAt(0).toUpperCase() + title.substr(1),
            company_id: company.id,
            company_name: company.name,
            email,
            phone_1_number: faker.phone.number(),
            phone_1_type: faker.helpers.arrayElement(['Work', 'Home', 'Other']),
            phone_2_number: faker.phone.number(),
            phone_2_type: faker.helpers.arrayElement(['Work', 'Home', 'Other']),
            background: faker.lorem.sentence(),
            acquisition: faker.helpers.arrayElement(['inbound', 'outbound']),
            avatar,
            first_seen: first_seen,
            last_seen: last_seen,
            has_newsletter: weightedBoolean(30),
            status: faker.helpers.arrayElement(defaultNoteStatuses).value,
            tags: faker.helpers
                .arrayElements(
                    db.tags,
                    faker.helpers.arrayElement([0, 0, 0, 1, 1, 2])
                )
                .map(tag => tag.id), // finalize
            sales_id: company.sales_id,
            nb_tasks: 0,
            linkedin_url: null,
        };
    });
};
