import { RaRecord, Identifier, getTypedFields } from 'react-admin';

export interface Sale extends RaRecord {
    first_name: string;
    last_name: string;
    email: string;
}
export const SaleFields = getTypedFields<Sale>();

export interface Company extends RaRecord {
    name: string;
    logo: string;
    sector: string;
    size: 1 | 10 | 50 | 250 | 500;
    linkedIn: string;
    website: string;
    phone_number: string;
    address: string;
    zipcode: string;
    city: string;
    stateAbbr: string;
    nb_contacts: number;
    nb_deals: number;
    sales_id: Identifier;
    created_at: string;
}
export const CompanyFields = getTypedFields<Company>();

export interface Contact extends RaRecord {
    first_name: string;
    last_name: string;
    title: string;
    company_id: Identifier;
    email: string;
    avatar?: string;
    first_seen: string;
    last_seen: string;
    has_newsletter: Boolean;
    tags: Identifier[];
    gender: string;
    sales_id: Identifier;
    nb_notes: number;
    status: string;
    background: string;
    phone_number1: string;
    phone_number2: string;
}
export const ContactFields = getTypedFields<Contact>();

export interface ContactNote extends RaRecord {
    contact_id: Identifier;
    type: string;
    text: string;
    date: string;
    sales_id: Identifier;
    status: string;
}
export const ContactNoteFields = getTypedFields<ContactNote>();

export interface Deal extends RaRecord {
    name: string;
    company_id: Identifier;
    contact_ids: Identifier[];
    type: string;
    stage: string;
    description: string;
    amount: number;
    created_at: string;
    updated_at: string;
    start_at: string;
    sales_id: Identifier;
    index: number;
    nb_notes: number;
}

export const DealFields = getTypedFields<Deal>();

export interface DealNote extends RaRecord {
    deal_id: Identifier;
    type: string;
    text: string;
    date: string;
    sales_id: Identifier;
}

export const DealNoteFields = getTypedFields<DealNote>();

export interface Tag extends RaRecord {
    name: string;
    color: string;
}
export const TagFields = getTypedFields<Tag>();

export interface Task extends RaRecord {
    contact_id: string;
    type: string;
    text: string;
    due_date: string;
    sales_id: string;
}

export const TaskFields = getTypedFields<Task>();
