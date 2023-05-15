import { RaRecord } from 'react-admin';

export interface Sale extends RaRecord<number> {
    first_name: string;
    last_name: string;
    email: string;
}

export interface Company extends RaRecord<number> {
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
    sales_id: number;
    created_at: string;
}

export interface Contact extends RaRecord<number> {
    first_name: string;
    last_name: string;
    title: string;
    company_id: number;
    email: string;
    avatar?: string;
    first_seen: string;
    last_seen: string;
    has_newsletter: Boolean;
    tags: number[];
    gender: string;
    sales_id: number;
    nb_notes: number;
    status: string;
    background: string;
}

export interface ContactNote extends RaRecord<number> {
    contact_id: number;
    type: string;
    text: string;
    date: string;
    sales_id: number;
    status: string;
}

export interface Deal extends RaRecord<number> {
    name: string;
    company_id: number;
    contact_ids: number[];
    type: string;
    stage: string;
    description: string;
    amount: number;
    created_at: string;
    updated_at: string;
    start_at: string;
    sales_id: number;
    index: number;
    nb_notes: number;
}

export interface Tag extends RaRecord<number> {
    name: string;
    color: string;
}
