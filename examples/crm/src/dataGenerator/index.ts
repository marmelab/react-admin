/* eslint-disable import/no-anonymous-default-export */
import { generateSales } from './sales';
import { generateTags } from './tags';
import { generateCompanies } from './companies';
import { generateContacts } from './contacts';
import { generateContactNotes } from './contactNotes';
import { generateTasks } from './tasks';
import { generateDeals } from './deals';
import { generateDealNotes } from './dealNotes';
import { finalize } from './finalize';
import { Db } from './types';

export default (): Db => {
    const db = {} as Db;
    db.sales = generateSales(db);
    db.tags = generateTags(db);
    db.companies = generateCompanies(db);
    db.contacts = generateContacts(db);
    db.contactNotes = generateContactNotes(db);
    db.deals = generateDeals(db);
    db.dealNotes = generateDealNotes(db);
    db.tasks = generateTasks(db);
    finalize(db);

    return db;
};
