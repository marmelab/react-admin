import { lorem, random } from 'faker/locale/en_US';

import { defaultNoteStatuses } from '../../../root/defaultConfiguration';
import { ContactNote } from '../../../types';
import { Db } from './types';
import { randomDate } from './utils';

export const generateContactNotes = (db: Db): ContactNote[] => {
    return Array.from(Array(1200).keys()).map(id => {
        const contact = random.arrayElement(db.contacts);
        const date = randomDate(new Date(contact.first_seen));
        contact.last_seen =
            date > new Date(contact.last_seen)
                ? date.toISOString()
                : contact.last_seen;
        return {
            id,
            contact_id: contact.id,
            text: lorem.paragraphs(random.number({ min: 1, max: 4 })),
            date: date.toISOString(),
            sales_id: contact.sales_id,
            status: random.arrayElement(defaultNoteStatuses).value,
        };
    });
};
