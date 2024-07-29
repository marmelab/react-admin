import { Identifier, RaRecord } from 'react-admin';
import {
    COMPANY_CREATED,
    CONTACT_CREATED,
    CONTACT_NOTE_CREATED,
    DEAL_CREATED,
    DEAL_NOTE_CREATED,
} from './consts';
import { SvgIconComponent } from '@mui/icons-material';

export interface Sale extends RaRecord {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    administrator: boolean;
    avatar?: string;
}

export interface Company extends RaRecord {
    name: string;
    logo: { title: string; src: string };
    sector: string;
    size: 1 | 10 | 50 | 250 | 500;
    linkedin_url: string;
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
    description: string;
    revenue: string;
    tax_identifier: string;
    country: string;
    context_links?: string[];
}

export interface Contact extends RaRecord {
    first_name: string;
    last_name: string;
    title: string;
    company_id: Identifier;
    company_name: string;
    email: string;
    avatar?: string | null;
    linkedin_url?: string;
    first_seen: string;
    last_seen: string;
    has_newsletter: Boolean;
    tags: Identifier[];
    gender: string;
    sales_id: Identifier;
    nb_notes: number;
    status: string;
    background: string;
    phone_number1: { number: string; type: 'Work' | 'Home' | 'Other' };
    phone_number2: { number: string; type: 'Work' | 'Home' | 'Other' };
}

export interface ContactNote extends RaRecord {
    contact_id: Identifier;
    text: string;
    date: Date;
    sales_id: Identifier;
    status: string;
    attachments?: AttachmentNote[];
}

export interface Deal extends RaRecord {
    name: string;
    company_id: Identifier;
    contact_ids: Identifier[];
    category: string;
    stage: string;
    description: string;
    amount: number;
    created_at: string;
    updated_at: string;
    archived_at?: string;
    expected_closing_date: string;
    sales_id: Identifier;
    index: number;
    nb_notes: number;
}

export interface DealNote extends RaRecord {
    deal_id: Identifier;
    text: string;
    date: Date;
    sales_id: Identifier;
    attachments?: AttachmentNote[];
}

export interface Tag extends RaRecord {
    name: string;
    color: string;
}

export interface Task extends RaRecord {
    contact_id: Identifier;
    type: string;
    text: string;
    due_date: string;
    done_date?: string | null;
}

export type ActivityCompanyCreated = {
    type: typeof COMPANY_CREATED;
    company: Company;
    sale: Sale;
};

export type ActivityContactCreated = {
    type: typeof CONTACT_CREATED;
    company: Company;
    sale: Sale;
    contact: Contact;
};

export type ActivityContactNoteCreated = {
    type: typeof CONTACT_NOTE_CREATED;
    sale: Sale;
    company: Company;
    contact: Contact;
    contactNote: ContactNote;
};

export type ActivityDealCreated = {
    type: typeof DEAL_CREATED;
    company: Company;
    sale: Sale;
    deal: Deal;
};

export type ActivityDealNoteCreated = {
    type: typeof DEAL_NOTE_CREATED;
    company: Company;
    sale: Sale;
    deal: Deal;
    dealNote: DealNote;
};

export type Activity = RaRecord & { date: string } & (
        | ActivityCompanyCreated
        | ActivityContactCreated
        | ActivityContactNoteCreated
        | ActivityDealCreated
        | ActivityDealNoteCreated
    );

export interface AttachmentNote {
    src: string;
    title: string;
    rawFile: File;
}
export interface DealStage {
    value: string;
    label: string;
}

export interface NoteStatus {
    value: string;
    label: string;
    color: string;
}

export interface ContactGender {
    value: string;
    label: string;
    icon: SvgIconComponent;
}
