/* eslint-disable import/no-anonymous-default-export */
import { Card, LinearProgress, Stack } from '@mui/material';
import jsonExport from 'jsonexport/dist';
import type { Exporter, Identifier, RaRecord } from 'react-admin';
import {
    BulkActionsToolbar,
    BulkDeleteButton,
    CreateButton,
    downloadCSV,
    ExportButton,
    ListBase,
    ListToolbar,
    Pagination,
    SortButton,
    Title,
    TopToolbar,
    useGetIdentity,
    useListContext,
} from 'react-admin';
import { Company, Contact, Sale, Tag } from '../types';
import { ContactEmpty } from './ContactEmpty';
import { ContactImportButton } from './ContactImportButton';
import { ContactListContent } from './ContactListContent';
import { ContactListFilter } from './ContactListFilter';

export const ContactList = () => {
    const { identity } = useGetIdentity();

    if (!identity) return null;

    return (
        <ListBase
            perPage={25}
            sort={{ field: 'last_seen', order: 'DESC' }}
            exporter={exporter}
        >
            <ContactListLayout />
        </ListBase>
    );
};

const ContactListLayout = () => {
    const { data, isPending, filterValues } = useListContext();
    const { identity } = useGetIdentity();

    const hasFilters = filterValues && Object.keys(filterValues).length > 0;

    if (!identity) return null;
    if (isPending) return <LinearProgress />;

    if (!data?.length && !hasFilters) return <ContactEmpty />;

    return (
        <Stack direction="row">
            <ContactListFilter />
            <Stack sx={{ width: '100%' }}>
                <Title title={'Contacts'} />
                <ListToolbar actions={<ContactListActions />} />
                <BulkActionsToolbar>
                    <BulkDeleteButton />
                </BulkActionsToolbar>
                <Card>
                    <ContactListContent />
                </Card>
                <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
            </Stack>
        </Stack>
    );
};

const ContactListActions = () => (
    <TopToolbar>
        <SortButton fields={['last_name', 'first_name', 'last_seen']} />
        <ContactImportButton />
        <ExportButton />
        <CreateButton
            variant="contained"
            label="New Contact"
            sx={{ marginLeft: 2 }}
        />
    </TopToolbar>
);

const exporter: Exporter<Contact> = async (
    records,
    fetchRelatedRecords,
    dataProvider
) => {
    const companies = await fetchRelatedRecords<Company>(
        records,
        'company_id',
        'companies'
    );
    const sales = await fetchRelatedRecords<Sale>(records, 'sales_id', 'sales');
    const tagsIds = getRelatedIds(records, 'tags');
    const tags = await dataProvider.getList<Tag>('tags', {
        filter: { 'id@in': `(${tagsIds.flat()})` },
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'name', order: 'ASC' },
    });

    const contacts = records.map(contact => ({
        ...contact,
        company: companies[contact.company_id].name,
        sales: `${sales[contact.sales_id].first_name} ${
            sales[contact.sales_id].last_name
        }`,
        tags: contact.tags
            .map(tagId => tags.data.find(tag => tag.id === tagId)?.name)
            .join(', '),
    }));
    return jsonExport(contacts, {}, (_err: any, csv: string) => {
        downloadCSV(csv, 'contacts');
    });
};

export const getRelatedIds = (
    records: RaRecord[],
    field: string
): Identifier[] =>
    Array.from(
        new Set(
            records
                .filter(record => record[field] != null)
                .map(record => record[field])
                .reduce((ids, value) => ids.concat(value), [])
        )
    );
