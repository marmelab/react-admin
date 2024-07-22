import { lorem, random } from 'faker/locale/en_US';

import { Task } from '../types';
import { Db } from './types';
import { randomDate } from './utils';
import { crmConfig } from '../CRM/crm.config';

export const generateTasks = (db: Db) => {
    return Array.from(Array(400).keys()).map<Task>(id => {
        const contact = random.arrayElement(db.contacts);
        contact.nb_tasks++;
        return {
            id,
            contact_id: contact.id,
            type: random.arrayElement(crmConfig.taskTypes),
            text: lorem.sentence(),
            due_date: randomDate(
                random.boolean() ? new Date() : new Date(contact.first_seen),
                new Date(Date.now() + 100 * 24 * 60 * 60 * 1000)
            ).toISOString(),
            done_date: undefined,
        };
    });
};
