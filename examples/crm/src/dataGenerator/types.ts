import {
    Activity,
    Company,
    Contact,
    ContactNote,
    Deal,
    DealNote,
    Sale,
    Tag,
    Task,
} from '../types';

export interface Db {
    companies: Company[];
    contacts: Contact[];
    contactNotes: ContactNote[];
    deals: Deal[];
    dealNotes: DealNote[];
    sales: Sale[];
    tags: Tag[];
    tasks: Task[];
    activityLogs: Activity[];
}
