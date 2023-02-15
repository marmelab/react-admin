import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ListPaginationContext } from 'ra-core';

import { Pagination } from './Pagination';
import { DeviceTestWrapper } from '../../layout';

const theme = createTheme();

describe('<Pagination />', () => {
    const defaultProps = {
        resource: 'posts',
        page: 1,
        perPage: 10,
        setPage: () => null,
        isLoading: false,
        setPerPage: () => {},
        hasNextPage: undefined,
        hasPreviousPage: undefined,
    };

    describe('Total pagination', () => {
        it('should display a next button when there are more results', () => {
            render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{
                            ...defaultProps,
                            perPage: 1,
                            total: 2,
                            page: 1,
                        }}
                    >
                        <Pagination rowsPerPageOptions={[1]} />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            const nextButton = screen.queryByLabelText(
                'Go to next page'
            ) as HTMLButtonElement;
            expect(nextButton).not.toBeNull();
            expect(nextButton.disabled).toBe(false);
        });
        it('should display a disabled next button when there are no more results', () => {
            render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{
                            ...defaultProps,
                            perPage: 1,
                            total: 2,
                            page: 2,
                        }}
                    >
                        <Pagination rowsPerPageOptions={[1]} />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            const nextButton = screen.queryByLabelText(
                'Go to next page'
            ) as HTMLButtonElement;
            expect(nextButton).not.toBeNull();
            expect(nextButton.disabled).toBe(true);
        });
        it('should display a prev button when there are previous results', () => {
            render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{
                            ...defaultProps,
                            perPage: 1,
                            total: 2,
                            page: 2,
                        }}
                    >
                        <Pagination rowsPerPageOptions={[1]} />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            const prevButton = screen.queryByLabelText(
                'Go to previous page'
            ) as HTMLButtonElement;
            expect(prevButton).not.toBeNull();
            expect(prevButton.disabled).toBe(false);
        });
        it('should display a disabled prev button when there are no previous results', () => {
            render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{
                            ...defaultProps,
                            perPage: 1,
                            total: 2,
                            page: 1,
                        }}
                    >
                        <Pagination rowsPerPageOptions={[1]} />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            const prevButton = screen.queryByLabelText(
                'Go to previous page'
            ) as HTMLButtonElement;
            expect(prevButton).not.toBeNull();
            expect(prevButton.disabled).toBe(true);
        });
    });

    describe('Partial pagination', () => {
        it('should display a next button when there are more results', () => {
            render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{
                            ...defaultProps,
                            perPage: 1,
                            total: undefined,
                            page: 1,
                            hasNextPage: true,
                        }}
                    >
                        <Pagination rowsPerPageOptions={[1]} />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            const nextButton = screen.queryByLabelText(
                'Go to next page'
            ) as HTMLButtonElement;
            expect(nextButton).not.toBeNull();
            expect(nextButton.disabled).toBe(false);
        });
        it('should display a disabled next button when there are no more results', () => {
            render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{
                            ...defaultProps,
                            perPage: 1,
                            total: undefined,
                            page: 2,
                            hasNextPage: false,
                        }}
                    >
                        <Pagination rowsPerPageOptions={[1]} />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            const nextButton = screen.queryByLabelText(
                'Go to next page'
            ) as HTMLButtonElement;
            expect(nextButton).not.toBeNull();
            expect(nextButton.disabled).toBe(true);
        });
        it('should display a prev button when there are previous results', () => {
            render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{
                            ...defaultProps,
                            perPage: 1,
                            total: undefined,
                            page: 2,
                            hasPreviousPage: true,
                        }}
                    >
                        <Pagination rowsPerPageOptions={[1]} />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            const prevButton = screen.queryByLabelText(
                'Go to previous page'
            ) as HTMLButtonElement;
            expect(prevButton).not.toBeNull();
            expect(prevButton.disabled).toBe(false);
        });
        it('should display a disabled prev button when there are no previous results', () => {
            render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{
                            ...defaultProps,
                            perPage: 1,
                            total: undefined,
                            page: 1,
                            hasPreviousPage: false,
                        }}
                    >
                        <Pagination rowsPerPageOptions={[1]} />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            const prevButton = screen.queryByLabelText(
                'Go to previous page'
            ) as HTMLButtonElement;
            expect(prevButton).not.toBeNull();
            expect(prevButton.disabled).toBe(true);
        });
    });

    describe('mobile', () => {
        it('should not render a rowsPerPage choice', () => {
            render(
                <DeviceTestWrapper width="sm">
                    <ListPaginationContext.Provider
                        value={{
                            ...defaultProps,
                            page: 2,
                            perPage: 5,
                            total: 15,
                        }}
                    >
                        <Pagination />
                    </ListPaginationContext.Provider>
                </DeviceTestWrapper>
            );
            expect(
                screen.queryByText('ra.navigation.page_rows_per_page')
            ).toBeNull();
        });
    });

    describe('desktop', () => {
        it('should render rowsPerPage choice', () => {
            render(
                <DeviceTestWrapper width="lg">
                    <ListPaginationContext.Provider
                        value={{
                            ...defaultProps,
                            page: 2,
                            perPage: 5,
                            total: 15,
                        }}
                    >
                        <Pagination />
                    </ListPaginationContext.Provider>
                </DeviceTestWrapper>
            );

            expect(
                screen.queryByText('ra.navigation.page_rows_per_page')
            ).not.toBeNull();
        });
    });

    it('should work outside of a ListContext', () => {
        render(
            <ThemeProvider theme={theme}>
                <Pagination
                    resource="posts"
                    setPage={() => null}
                    isLoading={false}
                    setPerPage={() => {}}
                    hasNextPage={undefined}
                    hasPreviousPage={undefined}
                    perPage={1}
                    total={2}
                    page={1}
                    rowsPerPageOptions={[1]}
                />
            </ThemeProvider>
        );
        const nextButton = screen.queryByLabelText(
            'Go to next page'
        ) as HTMLButtonElement;
        expect(nextButton).not.toBeNull();
        expect(nextButton.disabled).toBe(false);
        const prevButton = screen.queryByLabelText(
            'Go to previous page'
        ) as HTMLButtonElement;
        expect(prevButton).not.toBeNull();
        expect(prevButton.disabled).toBe(true);
    });
});
