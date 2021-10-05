import { company, internet, address, phone, random } from 'faker/locale/en_US';
import { randomDate } from './utils';

import { Db } from './types';
import { Company } from '../types';

const sectors = [
    'Communication Services',
    'Consumer Discretionary',
    'Consumer Staples',
    'Energy',
    'Financials',
    'Health Care',
    'Industrials',
    'Information Technology',
    'Materials',
    'Real Estate',
    'Utilities',
];

const sizes = [1, 10, 50, 250, 500];

const regex = /\W+/;

export const generateCompanies = (db: Db): Company[] => {
    return Array.from(Array(55).keys()).map(id => {
        const name = company.companyName();
        return {
            id,
            name: name,
            logo: `/logos/${id}.png`,
            sector: random.arrayElement(sectors),
            size: random.arrayElement(sizes) as 1 | 10 | 50 | 250 | 500,
            linkedIn: `https://www.linkedin.com/company/${name
                .toLowerCase()
                .replace(regex, '_')}`,
            website: internet.url(),
            phone_number: phone.phoneNumber(),
            address: address.streetAddress(),
            zipcode: address.zipCode(),
            city: address.city(),
            stateAbbr: address.stateAbbr(),
            nb_contacts: 0,
            nb_deals: 0,
            // at least 1/3rd of companies for Jane Doe
            sales_id:
                random.number(2) === 0 ? 0 : random.arrayElement(db.sales).id,
            created_at: randomDate().toISOString(),
        };
    });
};
