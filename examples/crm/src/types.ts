import { SvgIconComponent } from '@mui/icons-material';
import { Identifier, RaRecord } from 'react-admin';
import {
    COMPANY_CREATED,
    CONTACT_CREATED,
    CONTACT_NOTE_CREATED,
    DEAL_CREATED,
    DEAL_NOTE_CREATED,
} from './consts';

export type SignUpData = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
};

export type SalesFormData = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    administrator: boolean;
    disabled: boolean;
};

export type Sale = {
    first_name: string;
    last_name: string;
    administrator: boolean;
    avatar?: RAFile;
    disabled?: boolean;
    user_id: string;

    /**
     * This is a copy of the user's email, to make it easier to handle by react admin
     * DO NOT UPDATE this field directly, it should be updated by the backend
     */
    email: string;

    /**
     * This is used by the fake rest provider to store the password
     * DO NOT USE this field in your code besides the fake rest provider
     * @deprecated
     */
    password?: string;
} & Pick<RaRecord, 'id'>;

export type Company = {
    name: string;
    logo: RAFile;
    sector: string;
    size: 1 | 10 | 50 | 250 | 500;
    linkedin_url: string;
    website: string;
    phone_number: string;
    address: string;
    zipcode: string;
    city: string;
    stateAbbr: string;
    sales_id: Identifier;
    created_at: string;
    description: string;
    revenue: string;
    tax_identifier: string;
    country: string;
    context_links?: string[];
    nb_contacts?: number;
    nb_deals?: number;
} & Pick<RaRecord, 'id'>;

export type Contact = {
    first_name: string;
    last_name: string;
    title: string;
    company_id: Identifier;
    email: string;
    avatar?: Partial<RAFile>;
    linkedin_url?: string | null;
    first_seen: string;
    last_seen: string;
    has_newsletter: Boolean;
    tags: Identifier[];
    gender: string;
    sales_id: Identifier;
    status: string;
    background: string;
    phone_1_type: 'Work' | 'Home' | 'Other';
    phone_1_number: string;
    phone_2_type: 'Work' | 'Home' | 'Other';
    phone_2_number: string;

    nb_tasks?: number;
    company_name?: string;
} & Pick<RaRecord, 'id'>;

export type ContactNote = {
    contact_id: Identifier;
    text: string;
    date: string;
    sales_id: Identifier;
    status: string;
    attachments?: AttachmentNote[];
} & Pick<RaRecord, 'id'>;

export type Deal = {
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
} & Pick<RaRecord, 'id'>;

export type DealNote = {
    deal_id: Identifier;
    text: string;
    date: string;
    sales_id: Identifier;
    attachments?: AttachmentNote[];

    // This is defined for compatibility with `ContactNote`
    status?: undefined;
} & Pick<RaRecord, 'id'>;

export type Tag = {
    name: string;
    color: string;
} & Pick<RaRecord, 'id'>;

export type Task = {
    contact_id: Identifier;
    type: string;
    text: string;
    due_date: string;
    done_date?: string | null;
    sales_id?: Identifier;
} & Pick<RaRecord, 'id'>;

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

export interface RAFile {
    src: string;
    title: string;
    path?: string;
    rawFile: File;
    type?: string;
}

export type AttachmentNote = RAFile;
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
