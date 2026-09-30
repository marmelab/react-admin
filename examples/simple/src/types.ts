import type { Identifier, RaRecord } from 'react-admin';

export interface Post extends RaRecord {
    title: string;
    teaser: string;
    body?: string;
    views: number;
    average_note?: number;
    commentable?: boolean;
    published_at: Date;
    tags?: Identifier[];
    category?: string;
    subcategory?: string;
    backlinks?: { date: string; url: string }[];
    notifications?: Identifier[];
}

export interface User extends RaRecord {
    name: string;
    role: string;
}
