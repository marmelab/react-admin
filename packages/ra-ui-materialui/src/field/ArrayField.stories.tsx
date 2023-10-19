import * as React from 'react';
import { MemoryRouter } from 'react-router';
import {
    I18nContextProvider,
    RecordContextProvider,
    useListContext,
    useRecordContext,
} from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { Card, ThemeProvider, createTheme } from '@mui/material';

import { ArrayField } from './ArrayField';
import { Datagrid, SingleFieldList } from '../list';
import { ChipField } from './ChipField';
import { SimpleShowLayout } from '../detail';
import { TextField } from './TextField';
import { Pagination } from '../list/pagination';

export default { title: 'ra-ui-materialui/fields/ArrayField' };

let books = [
    { id: 1, title: 'War and Peace', author_id: 1 },
    { id: 2, title: 'Les Misérables', author_id: 2 },
    { id: 3, title: 'Anna Karenina', author_id: 1 },
    { id: 4, title: 'The Count of Monte Cristo', author_id: 3 },
    { id: 5, title: 'Resurrection', author_id: 1 },
];

export const Basic = () => (
    <MemoryRouter>
        <ArrayField record={{ id: 123, books }} source="books">
            <SingleFieldList linkType={false}>
                <ChipField source="title" />
            </SingleFieldList>
        </ArrayField>
    </MemoryRouter>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

export const PerPage = () => (
    <ThemeProvider theme={createTheme()}>
        <MemoryRouter>
            <I18nContextProvider value={i18nProvider}>
                <ArrayField
                    record={{ id: 123, books }}
                    source="books"
                    perPage={2}
                >
                    <SingleFieldList linkType={false}>
                        <ChipField source="title" />
                    </SingleFieldList>
                    <Pagination />
                </ArrayField>
            </I18nContextProvider>
        </MemoryRouter>
    </ThemeProvider>
);

export const Sort = () => (
    <MemoryRouter>
        <ArrayField
            record={{ id: 123, books }}
            source="books"
            sort={{ field: 'title', order: 'ASC' }}
        >
            <SingleFieldList linkType={false}>
                <ChipField source="title" />
            </SingleFieldList>
        </ArrayField>
    </MemoryRouter>
);

export const Filter = () => (
    <MemoryRouter>
        <ArrayField
            record={{ id: 123, books }}
            source="books"
            filter={{ title: 'Anna Karenina' }}
        >
            <SingleFieldList linkType={false}>
                <ChipField source="title" />
            </SingleFieldList>
        </ArrayField>
    </MemoryRouter>
);

const SortButton = () => {
    const { setSort } = useListContext();
    return (
        <button onClick={() => setSort({ field: 'title', order: 'ASC' })}>
            Sort by title
        </button>
    );
};

const FilterButton = () => {
    const { setFilters } = useListContext();
    return (
        <button onClick={() => setFilters({ title: 'Resurrection' }, {})}>
            Filter by title
        </button>
    );
};

const SelectedChip = () => {
    const { selectedIds, onToggleItem } = useListContext();
    const record = useRecordContext();
    return (
        <ChipField
            source="title"
            clickable
            onClick={() => {
                onToggleItem(record.id);
            }}
            color={selectedIds.includes(record.id) ? 'primary' : 'default'}
        />
    );
};

export const ListContext = () => (
    <MemoryRouter>
        <ArrayField record={{ id: 123, books }} source="books">
            <SingleFieldList sx={{ p: 2 }} linkType={false}>
                <SelectedChip />
            </SingleFieldList>
            <SortButton /> <FilterButton />
        </ArrayField>
    </MemoryRouter>
);

export const InShowLayout = () => (
    <MemoryRouter>
        <RecordContextProvider
            value={{
                id: 123,
                title: 'Lorem Ipsum Sit Amet',
                tags: [{ name: 'dolor' }, { name: 'sit' }, { name: 'amet' }],
                backlinks: [
                    {
                        uuid: '34fdf393-f449-4b04-a423-38ad02ae159e',
                        date: '2012-08-10T00:00:00.000Z',
                        url: 'http://example.com/foo/bar.html',
                    },
                    {
                        uuid: 'd907743a-253d-4ec1-8329-404d4c5e6cf1',
                        date: '2012-08-14T00:00:00.000Z',
                        url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
                    },
                ],
            }}
        >
            <Card sx={{ m: 1, p: 1 }}>
                <SimpleShowLayout>
                    <TextField source="title" />
                    <ArrayField source="tags">
                        <SingleFieldList linkType={false}>
                            <ChipField source="name" size="small" />
                        </SingleFieldList>
                    </ArrayField>
                    <ArrayField source="backlinks">
                        <Datagrid bulkActionButtons={false}>
                            <TextField source="uuid" />
                            <TextField source="date" />
                            <TextField source="url" />
                        </Datagrid>
                    </ArrayField>
                </SimpleShowLayout>
            </Card>
        </RecordContextProvider>
    </MemoryRouter>
);
