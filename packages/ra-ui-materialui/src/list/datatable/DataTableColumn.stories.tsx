import * as React from 'react';
import { createTheme } from '@mui/material';
import {
    CanAccess,
    Resource,
    TestMemoryRouter,
    useRecordContext,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import defaultMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { List } from '../List';
import { AdminContext } from '../../AdminContext';
import { TextField, NumberField } from '../../field';
import { DataTableColumn } from './DataTableColumn';
import { DataTable } from './DataTable';

export default { title: 'ra-ui-materialui/list/DataTableColumn' };

const data = {
    books: [
        {
            id: 1,
            title: 'War and Peace',
            author: 'Leo Tolstoy',
            year: 1869,
        },
        {
            id: 2,
            title: 'Pride and Predjudice',
            author: 'Jane Austen',
            year: 1813,
        },
        {
            id: 3,
            title: 'The Picture of Dorian Gray',
            author: 'Oscar Wilde',
            year: 1890,
        },
        {
            id: 4,
            title: 'Le Petit Prince',
            author: 'Antoine de Saint-Exupéry',
            year: 1943,
        },
        {
            id: 5,
            title: 'The Alchemist',
            author: 'Paulo Coelho',
            year: 1988,
        },
        {
            id: 6,
            title: 'Madame Bovary',
            author: 'Gustave Flaubert',
            year: 1857,
        },
        {
            id: 7,
            title: 'The Lord of the Rings',
            author: 'J. R. R. Tolkien',
            year: 1954,
        },
    ],
};

const dataProvider = fakeRestDataProvider(data);

const theme = createTheme();

const Wrapper = ({ children }) => (
    <TestMemoryRouter initialEntries={['/books']}>
        <AdminContext
            dataProvider={dataProvider}
            i18nProvider={polyglotI18nProvider(() => defaultMessages, 'en')}
            theme={theme}
        >
            <Resource
                name="books"
                list={() => (
                    <List sx={{ p: 4 }} actions={false} pagination={false}>
                        {children}
                    </List>
                )}
            />
        </AdminContext>
    </TestMemoryRouter>
);

export const LabelDefault = () => (
    <Wrapper>
        <DataTable>
            <DataTableColumn source="id" />
            <DataTableColumn source="title" />
            <DataTableColumn source="author" />
            <DataTableColumn source="year" />
        </DataTable>
    </Wrapper>
);

export const LabelString = () => (
    <Wrapper>
        <DataTable>
            <DataTableColumn source="id" label="ID" />
            <DataTableColumn source="title" label="TITLE" />
            <DataTableColumn source="author" label="AUTHOR" />
            <DataTableColumn source="year" label="YEAR" />
        </DataTable>
    </Wrapper>
);

export const LabelElement = () => (
    <Wrapper>
        <DataTable>
            <DataTableColumn source="id" label={<del>Id</del>} />
            <DataTableColumn source="title" label={<em>Title</em>} />
            <DataTableColumn source="author" label={<code>Author</code>} />
            <DataTableColumn source="year" label={<small>Year</small>} />
        </DataTable>
    </Wrapper>
);

export const LabelFalse = () => (
    <Wrapper>
        <DataTable>
            <DataTableColumn source="id" />
            <DataTableColumn source="title" label={false} />
            <DataTableColumn source="author" />
            <DataTableColumn source="year" />
        </DataTable>
    </Wrapper>
);

export const Sortable = () => (
    <Wrapper>
        <DataTable>
            <DataTableColumn source="id" />
            <DataTableColumn source="title" sortable={false} />
            <DataTableColumn source="author" />
            <DataTableColumn source="year" />
        </DataTable>
    </Wrapper>
);

export const SortByOrder = () => (
    <Wrapper>
        <DataTable>
            <DataTableColumn source="id" />
            <DataTableColumn source="title" sortByOrder="DESC" />
            <DataTableColumn source="author" sortByOrder="ASC" />
            <DataTableColumn source="year" />
        </DataTable>
    </Wrapper>
);

const UpperCaseField = ({ source }) => {
    const record = useRecordContext();
    return <span>{record[source].toUpperCase()}</span>;
};

export const Field = () => (
    <Wrapper>
        <DataTable>
            <DataTableColumn source="id" field={NumberField} />
            <DataTableColumn source="title" />
            <DataTableColumn source="author" field={UpperCaseField} />
            <DataTableColumn source="year" />
        </DataTable>
    </Wrapper>
);

export const Render = () => (
    <Wrapper>
        <DataTable>
            <DataTableColumn
                source="id"
                render={record => String(record.id).padStart(5, '0')}
            />
            <DataTableColumn
                label="Title"
                render={record => record.title.substr(0, 10) + '...'}
            />
            <DataTableColumn label="Author" render={record => record.author} />
            <DataTableColumn
                source="year"
                render={record => record.year + ' A.D.'}
            />
        </DataTable>
    </Wrapper>
);

export const Children = () => (
    <Wrapper>
        <DataTable>
            <DataTableColumn source="id">
                <span style={{ color: 'red' }}>
                    <NumberField source="id" />
                </span>
            </DataTableColumn>
            <DataTableColumn source="title">
                <em>
                    <TextField source="title" />
                </em>
            </DataTableColumn>
            <DataTableColumn source="author">
                <UpperCaseField source="author" />
            </DataTableColumn>
            <DataTableColumn source="year">
                <NumberField source="year" /> <small>A.D.</small>
            </DataTableColumn>
        </DataTable>
    </Wrapper>
);

const TitleCol = () => <DataTableColumn source="title" label="Book Title" />;
const AuthorCol = () => <DataTableColumn source="author" />;

export const Wrapped = () => (
    <Wrapper>
        <DataTable>
            <DataTableColumn source="id" />
            <TitleCol />
            <AuthorCol />
            <DataTableColumn source="year" />
        </DataTable>
    </Wrapper>
);

export const WithCanAccess = () => (
    <Wrapper>
        <DataTable>
            <DataTableColumn source="id" />
            <DataTableColumn source="title" />
            <CanAccess resource="books.author" action="read">
                <DataTableColumn source="author" />
            </CanAccess>
            <DataTableColumn source="year" />
        </DataTable>
    </Wrapper>
);

export const ClassName = () => (
    <Wrapper>
        <DataTable sx={{ '& .title': { color: 'red' } }}>
            <DataTableColumn source="id" className="id" />
            <DataTableColumn source="title" className="title" />
            <DataTableColumn source="author" className="author" />
            <DataTableColumn source="year" className="year" />
        </DataTable>
    </Wrapper>
);

export const HeaderClassName = () => (
    <Wrapper>
        <DataTable sx={{ '& .title': { color: 'red' } }}>
            <DataTableColumn source="id" headerClassName="id" />
            <DataTableColumn source="title" headerClassName="title" />
            <DataTableColumn source="author" headerClassName="author" />
            <DataTableColumn source="year" headerClassName="year" />
        </DataTable>
    </Wrapper>
);

export const CellClassName = () => (
    <Wrapper>
        <DataTable sx={{ '& .title': { color: 'red' } }}>
            <DataTableColumn source="id" cellClassName="id" />
            <DataTableColumn source="title" cellClassName="title" />
            <DataTableColumn source="author" cellClassName="author" />
            <DataTableColumn source="year" cellClassName="year" />
        </DataTable>
    </Wrapper>
);
