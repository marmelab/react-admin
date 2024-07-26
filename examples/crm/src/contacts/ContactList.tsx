/* eslint-disable import/no-anonymous-default-export */
import * as React from 'react';
import {
    CreateButton,
    downloadCSV,
    ExportButton,
    List as RaList,
    Pagination,
    SortButton,
    TopToolbar,
    useGetIdentity,
} from 'react-admin';
import type { Exporter } from 'react-admin';
import jsonExport from 'jsonexport/dist';

import { ContactListFilter } from './ContactListFilter';
import { ContactListContent } from './ContactListContent';
import { Contact, Company, Sale, Tag } from '../types';

export const ContactList = () => {
    const { identity } = useGetIdentity();
    if (!identity) return null;
    return (
        <RaList<Contact>
            actions={<ContactListActions />}
            aside={<ContactListFilter />}
            perPage={25}
            pagination={<Pagination rowsPerPageOptions={[10, 25, 50, 100]} />}
            filterDefaultValues={{ sales_id: identity?.id }}
            sort={{ field: 'last_seen', order: 'DESC' }}
            exporter={exporter}
        >
            <ContactListContent />
        </RaList>
    );
};

const ContactListActions = () => (
    <TopToolbar>
        <SortButton fields={['last_name', 'first_name', 'last_seen']} />
        <ExportButton />
        <CreateButton
            variant="contained"
            label="New Contact"
            sx={{ marginLeft: 2 }}
        />
    </TopToolbar>
);

const exporter: Exporter<Contact> = async (records, fetchRelatedRecords) => {
    const companies = await fetchRelatedRecords<Company>(
        records,
        'company_id',
        'companies'
    );
    const sales = await fetchRelatedRecords<Sale>(records, 'sales_id', 'sales');
    const tags = await fetchRelatedRecords<Tag>(records, 'tags', 'tags');

    const contacts = records.map(contact => ({
        ...contact,
        company: companies[contact.company_id].name,
        sales: `${sales[contact.sales_id].first_name} ${
            sales[contact.sales_id].last_name
        }`,
        tags: contact.tags.map(tagId => tags[tagId].name).join(', '),
    }));
    return jsonExport(contacts, {}, (_err: any, csv: string) => {
        downloadCSV(csv, 'contacts');
    });
};
