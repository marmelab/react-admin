import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PreferencesEditorContextProvider } from 'ra-core';
import { Box } from '@mui/material';

import { DatagridConfigurable } from './DatagridConfigurable';
import { Inspector, InspectorButton } from '../../preferences';
import { TextField } from '../../field';

export default { title: 'ra-ui-materialui/list/DatagridConfigurable' };

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

const AuthorField = () => <TextField source="author" />;
AuthorField.defaultProps = { label: 'Author' };

export const Basic = () => (
    <PreferencesEditorContextProvider>
        <MemoryRouter>
            <Inspector />
            <Box display="flex" justifyContent="flex-end">
                <InspectorButton />
            </Box>
            <Box p={2}>
                <DatagridConfigurable
                    resource="books"
                    data={data}
                    sort={{ field: 'title', order: 'ASC' }}
                    bulkActionButtons={false}
                    omit={['id']}
                >
                    <TextField source="id" />
                    <TextField source="title" label="Original title" />
                    <AuthorField />
                    <TextField source="year" />
                </DatagridConfigurable>
            </Box>
        </MemoryRouter>
    </PreferencesEditorContextProvider>
);
