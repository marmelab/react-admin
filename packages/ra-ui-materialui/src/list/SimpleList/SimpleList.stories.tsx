import { Box } from '@mui/material';
import {
    CoreAdminContext,
    ListContextProvider,
    ResourceContextProvider,
} from 'ra-core';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { SimpleList } from './SimpleList';

export default { title: 'ra-ui-materialui/list/SimpleList' };

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

const Wrapper = ({ children }) => (
    <MemoryRouter>
        <ThemeProvider theme={theme}>
            <CoreAdminContext>
                <ResourceContextProvider value="books">
                    {children}
                </ResourceContextProvider>
            </CoreAdminContext>
        </ThemeProvider>
    </MemoryRouter>
);

export const Basic = () => (
    <Wrapper>
        <SimpleList
            data={data}
            primaryText={record => record.title}
            secondaryText={record => record.author}
            tertiaryText={record => record.year}
        />
    </Wrapper>
);

const CustomEmpty = () => <div>No books found</div>;

export const Empty = () => (
    <Wrapper>
        <Box sx={{ px: 4 }}>
            <h1>Default</h1>
            <ListContextProvider
                value={{
                    data: [],
                    total: 0,
                    isLoading: false,
                    sort: { field: 'id', order: 'ASC' },
                    filterValues: {},
                }}
            >
                <SimpleList />
            </ListContextProvider>
            <h1>Custom</h1>
            <ListContextProvider
                value={{
                    data: [],
                    total: 0,
                    isLoading: false,
                    sort: { field: 'id', order: 'ASC' },
                    filterValues: {},
                }}
            >
                <SimpleList empty={<CustomEmpty />} />
            </ListContextProvider>
        </Box>
    </Wrapper>
);
