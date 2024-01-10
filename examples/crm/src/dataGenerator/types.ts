import { RaRecord } from 'react-admin';
import { Company, Contact, ContactNote, Deal, Sale, Tag } from '../types';

export interface Db {
    companies: Company[];
    contacts: Contact[];
    contactNotes: ContactNote[];
    deals: Deal[];
    dealNotes: RaRecord[];
    sales: Sale[];
    tags: Tag[];
    tasks: RaRecord[];
}
