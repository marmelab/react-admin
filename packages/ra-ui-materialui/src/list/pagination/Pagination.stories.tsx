import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ListPaginationContext, I18nContextProvider } from 'ra-core';
import { defaultI18nProvider } from 'react-admin';

import { Pagination } from './Pagination';

export default {
    title: 'ra-ui-materialui/list/Pagination',
};

const theme = createTheme();

const defaultProps = {
    resource: 'posts',
    page: 1,
    perPage: 10,
    setPage: () => null,
    isLoading: false,
    hasNextPage: undefined,
    hasPreviousPage: undefined,
};

const Wrapper = ({ children, listContext }) => (
    <I18nContextProvider value={defaultI18nProvider}>
        <ThemeProvider theme={theme}>
            <ListPaginationContext.Provider value={listContext}>
                {children}
            </ListPaginationContext.Provider>
        </ThemeProvider>
    </I18nContextProvider>
);

export const Basic = () => {
    const [page, setPage] = React.useState(1);
    return (
        <Wrapper
            listContext={{
                ...defaultProps,
                setPage,
                perPage: 10,
                total: 43,
                page,
            }}
        >
            <Pagination rowsPerPageOptions={[1]} />
        </Wrapper>
    );
};

export const Loading = () => (
    <Wrapper listContext={{ ...defaultProps, isLoading: true }}>
        <Pagination rowsPerPageOptions={[1]} />
    </Wrapper>
);

export const OnePage = () => (
    <Wrapper
        listContext={{
            ...defaultProps,
            perPage: 10,
            total: 7,
            page: 1,
        }}
    >
        <Pagination rowsPerPageOptions={[1]} />
    </Wrapper>
);

export const RowsPerPageOptions = () => {
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);
    return (
        <Wrapper
            listContext={{
                ...defaultProps,
                setPage,
                setPerPage,
                perPage,
                total: 73,
                page,
            }}
        >
            <h2>Default</h2>
            <Pagination />
            <h2>Custom</h2>
            <Pagination rowsPerPageOptions={[10, 20, 100]} />
            <h2>With Labels</h2>
            <Pagination
                rowsPerPageOptions={[
                    { label: 'ten', value: 10 },
                    { label: 'twenty', value: 20 },
                    { label: 'one hundred', value: 100 },
                ]}
            />
        </Wrapper>
    );
};
