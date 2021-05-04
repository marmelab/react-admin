import { Record } from 'react-admin';
import { Company, Contact, ContactNote, Deal } from '../types';

export interface Db {
    companies: Company[];
    contacts: Contact[];
    contactNotes: ContactNote[];
    deals: Deal[];
    dealNotes: Record[];
    sales: Record[];
    tags: Record[];
    tasks: Record[];
}
