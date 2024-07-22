import { RaRecord } from 'react-admin';
import {
    Activity,
    Company,
    Contact,
    ContactNote,
    Deal,
    Sale,
    Tag,
    Task,
} from '../types';

export interface Db {
    companies: Company[];
    contacts: Contact[];
    contactNotes: ContactNote[];
    deals: Deal[];
    dealNotes: RaRecord[];
    sales: Sale[];
    tags: Tag[];
    tasks: Task[];
    activityLogs: Activity[];
}
