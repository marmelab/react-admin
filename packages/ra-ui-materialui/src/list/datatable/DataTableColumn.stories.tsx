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
import { DataTable } from './DataTable';

export default { title: 'ra-ui-materialui/list/DataTable.Col' };

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
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const LabelString = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id" label="ID" />
            <DataTable.Col source="title" label="TITLE" />
            <DataTable.Col source="author" label="AUTHOR" />
            <DataTable.Col source="year" label="YEAR" />
        </DataTable>
    </Wrapper>
);

export const LabelElement = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id" label={<del>Id</del>} />
            <DataTable.Col source="title" label={<em>Title</em>} />
            <DataTable.Col source="author" label={<code>Author</code>} />
            <DataTable.Col source="year" label={<small>Year</small>} />
        </DataTable>
    </Wrapper>
);

export const LabelFalse = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" label={false} />
            <DataTable.Col source="author" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const Align = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author" align="left" />
            <DataTable.Col source="year" align="right" />
        </DataTable>
    </Wrapper>
);

export const DisableSort = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" disableSort />
            <DataTable.Col source="author" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const SortByOrder = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" sortByOrder="DESC" />
            <DataTable.Col source="author" sortByOrder="ASC" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

const UpperCaseField = ({ source }) => {
    const record = useRecordContext();
    if (!record) return null;
    return <span>{record[source].toUpperCase()}</span>;
};

export const Field = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id" field={NumberField} />
            <DataTable.Col source="title" />
            <DataTable.Col source="author" field={UpperCaseField} />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const Render = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col
                source="id"
                render={record => String(record.id).padStart(5, '0')}
            />
            <DataTable.Col
                label="Title"
                render={record => record.title.substr(0, 10) + '...'}
            />
            <DataTable.Col source="author" />
            <DataTable.Col
                source="year"
                render={record => record.year + ' A.D.'}
            />
        </DataTable>
    </Wrapper>
);

export const Children = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id">
                <span style={{ color: 'red' }}>
                    <NumberField source="id" />
                </span>
            </DataTable.Col>
            <DataTable.Col source="title">
                <em>
                    <TextField source="title" />
                </em>
            </DataTable.Col>
            <DataTable.Col source="author">
                <UpperCaseField source="author" />
            </DataTable.Col>
            <DataTable.Col source="year">
                <NumberField source="year" /> <small>A.D.</small>
            </DataTable.Col>
        </DataTable>
    </Wrapper>
);

export const TableCellProps = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" padding="none" />
            <DataTable.Col source="author" size="medium" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const Width = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id" sx={{ width: 50 }} />
            <DataTable.Col source="title" sx={{ width: 500 }} />
            <DataTable.Col source="author" />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

const TitleCol = () => <DataTable.Col source="title" label="Book Title" />;
const AuthorCol = () => <DataTable.Col source="author" />;

export const Wrapped = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id" />
            <TitleCol />
            <AuthorCol />
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const WithCanAccess = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <CanAccess resource="books.author" action="read">
                <DataTable.Col source="author" />
            </CanAccess>
            <DataTable.Col source="year" />
        </DataTable>
    </Wrapper>
);

export const ClassName = () => (
    <Wrapper>
        <DataTable sx={{ '& .title': { color: 'red' } }}>
            <DataTable.Col source="id" className="id" />
            <DataTable.Col source="title" className="title" />
            <DataTable.Col source="author" className="author" />
            <DataTable.Col source="year" className="year" />
        </DataTable>
    </Wrapper>
);

export const HeaderClassName = () => (
    <Wrapper>
        <DataTable sx={{ '& .title': { color: 'red' } }}>
            <DataTable.Col source="id" headerClassName="id" />
            <DataTable.Col source="title" headerClassName="title" />
            <DataTable.Col source="author" headerClassName="author" />
            <DataTable.Col source="year" headerClassName="year" />
        </DataTable>
    </Wrapper>
);

export const CellClassName = () => (
    <Wrapper>
        <DataTable sx={{ '& .title': { color: 'red' } }}>
            <DataTable.Col source="id" cellClassName="id" />
            <DataTable.Col source="title" cellClassName="title" />
            <DataTable.Col source="author" cellClassName="author" />
            <DataTable.Col source="year" cellClassName="year" />
        </DataTable>
    </Wrapper>
);

export const CellSx = () => (
    <Wrapper>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="author" />
            <DataTable.Col
                source="year"
                cellSx={record => ({
                    color:
                        record.year < 1850
                            ? 'lightgrey'
                            : record.year < 1900
                              ? 'grey'
                              : record.year < 1950
                                ? 'dimgrey'
                                : 'black',
                })}
            />
        </DataTable>
    </Wrapper>
);
