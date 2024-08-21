import {
    Company,
    Contact,
    ContactNote,
    Deal,
    DealNote,
    Sale,
    Tag,
    Task,
} from '../../../types';

export interface Db {
    companies: Required<Company>[];
    contacts: Required<Contact>[];
    contactNotes: ContactNote[];
    deals: Deal[];
    dealNotes: DealNote[];
    sales: Sale[];
    tags: Tag[];
    tasks: Task[];
}
