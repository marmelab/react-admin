import * as React from 'react';
import {
    ResourceContextProvider,
    ListContextProvider,
    CoreAdminContext,
    testDataProvider,
    useRecordContext,
} from 'ra-core';

import { TextField } from '../../field';
import { Datagrid } from './Datagrid';

export default { title: 'ra-ui-materialui/list/datagrid/Datagrid' };

const data = [
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
];

const Wrapper = ({ children }) => (
    <CoreAdminContext
        dataProvider={testDataProvider()}
        initialState={{
            admin: { resources: { books: { list: { expanded: [] } } } },
        }}
    >
        <ResourceContextProvider value="books">
            <ListContextProvider
                value={{
                    data,
                    total: 4,
                    isLoading: false,
                    currentSort: { field: 'id', order: 'ASC' },
                }}
            >
                {children}
            </ListContextProvider>
        </ResourceContextProvider>
    </CoreAdminContext>
);

export const Basic = () => (
    <Wrapper>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

const ExpandPanel = () => {
    const book = useRecordContext();
    return (
        <div>
            <i>{book.title}</i>, by {book.author} ({book.year})
        </div>
    );
};

export const Expand = () => (
    <Wrapper>
        <Datagrid expand={<ExpandPanel />}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

export const Hover = () => (
    <Wrapper>
        <Datagrid hover={false}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);

export const RowStyle = () => (
    <Wrapper>
        <Datagrid
            rowStyle={(record: any) => ({
                backgroundColor: record.id % 2 ? 'white' : '#eee',
            })}
        >
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </Wrapper>
);
