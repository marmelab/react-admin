import { Record } from 'react-admin';
import { Company, Contact, ContactNote, Deal, Tag } from '../types';

export interface Db {
    companies: Company[];
    contacts: Contact[];
    contactNotes: ContactNote[];
    deals: Deal[];
    dealNotes: Record[];
    sales: Record[];
    tags: Tag[];
    tasks: Record[];
}
