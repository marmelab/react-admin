import * as React from 'react';
import { PreferencesEditorContextProvider, TestMemoryRouter } from 'ra-core';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { DatagridConfigurable } from './DatagridConfigurable';
import { SelectColumnsButton } from './SelectColumnsButton';
import { TextField } from '../../field';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default { title: 'ra-ui-materialui/list/SelectColumnsButton' };

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

const theme = createTheme();

export const Basic = () => (
    <ThemeProvider theme={theme}>
        <PreferencesEditorContextProvider>
            <QueryClientProvider client={new QueryClient()}>
                <TestMemoryRouter>
                    <Box p={2}>
                        <Box textAlign="right">
                            <SelectColumnsButton resource="books" />
                        </Box>
                        <DatagridConfigurable
                            resource="books"
                            data={data}
                            sort={{ field: 'title', order: 'ASC' }}
                            bulkActionButtons={false}
                        >
                            <TextField source="id" />
                            <TextField source="title" label="Original title" />
                            <TextField source="author" />
                            <TextField source="year" />
                        </DatagridConfigurable>
                    </Box>
                </TestMemoryRouter>
            </QueryClientProvider>
        </PreferencesEditorContextProvider>
    </ThemeProvider>
);

export const WithPreferenceKey = () => (
    <ThemeProvider theme={theme}>
        <PreferencesEditorContextProvider>
            <QueryClientProvider client={new QueryClient()}>
                <TestMemoryRouter>
                    <Box p={2}>
                        <Box textAlign="right">
                            <SelectColumnsButton preferenceKey="just-a-key.to_test_with" />
                        </Box>
                        <DatagridConfigurable
                            resource="books"
                            preferenceKey="just-a-key.to_test_with"
                            data={data}
                            sort={{ field: 'title', order: 'ASC' }}
                            bulkActionButtons={false}
                        >
                            <TextField source="id" />
                            <TextField source="title" label="Original title" />
                            <TextField source="author" />
                            <TextField source="year" />
                        </DatagridConfigurable>
                    </Box>
                </TestMemoryRouter>
            </QueryClientProvider>
        </PreferencesEditorContextProvider>
    </ThemeProvider>
);
