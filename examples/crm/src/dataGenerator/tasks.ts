import { random, lorem } from 'faker/locale/en_US';

import { Db } from './types';
import { randomDate } from './utils';

const type = [
    'Email',
    'Email',
    'Email',
    'Email',
    'Email',
    'Email',
    'Call',
    'Call',
    'Call',
    'Call',
    'Call',
    'Call',
    'Call',
    'Call',
    'Call',
    'Call',
    'Call',
    'Demo',
    'Lunch',
    'Meeting',
    'Follow-up',
    'Follow-up',
    'Thank you',
    'Ship',
    'None',
];

export const generateTasks = (db: Db) => {
    return Array.from(Array(400).keys()).map(id => {
        const contact = random.arrayElement(db.contacts);
        return {
            id,
            contact_id: contact.id,
            type: random.arrayElement(type),
            text: lorem.sentence(),
            due_date: randomDate(new Date(contact.first_seen)),
            sales_id: contact.sales_id,
        };
    });
};
