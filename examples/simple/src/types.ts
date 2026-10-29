import type { Identifier, RaRecord } from 'react-admin';

export interface Post extends RaRecord {
    title: string;
    teaser: string;
    body?: string;
    views: number;
    average_note?: number;
    commentable?: boolean;
    published_at: Date | string;
    tags?: Identifier[];
    category?: string;
    subcategory?: string;
    backlinks?: { date: string; url: string }[];
    notifications?: Identifier[];
    pictures?: Picture[];
}

export interface Picture {
    rawFile?: File;
    src?: string;
    title?: string;
}

export interface Tag extends RaRecord {
    name: { en: string };
    parent_id?: Identifier;
    published?: boolean;
}

export interface User extends RaRecord {
    name: string;
    role: string;
}
