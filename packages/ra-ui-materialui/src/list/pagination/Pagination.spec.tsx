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

    describe('no results mention', () => {
        it('should display a pagination limit when there is no result', () => {
            render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{ ...defaultProps, total: 0 }}
                    >
                        <Pagination />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            expect(
                screen.queryByText('ra.navigation.no_results')
            ).not.toBeNull();
        });

        it('should not display a pagination limit when there are results', () => {
            render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{ ...defaultProps, total: 1 }}
                    >
                        <Pagination />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            expect(screen.queryByText('ra.navigation.no_results')).toBeNull();
        });

        it('should display a pagination limit on an out of bounds page (more than total pages)', async () => {
            jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            const setPage = jest.fn().mockReturnValue(null);
            render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{
                            ...defaultProps,
                            total: 10,
                            page: 2, // Query the page 2 but there is only 1 page
                            perPage: 10,
                            setPage,
                        }}
                    >
                        <Pagination />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            // mui TablePagination displays no more a warning in that case
            // Then useEffect fallbacks on a valid page
            expect(
                screen.queryByText('ra.navigation.no_results')
            ).not.toBeNull();
        });

        it('should display a pagination limit on an out of bounds page (less than 0)', async () => {
            jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            const setPage = jest.fn().mockReturnValue(null);
            render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{
                            ...defaultProps,
                            total: 10,
                            page: -2, // Query the page -2 😱
                            perPage: 10,
                            setPage,
                        }}
                    >
                        <Pagination />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            // mui TablePagination displays no more a warning in that case
            // Then useEffect fallbacks on a valid page
            expect(
                screen.queryByText('ra.navigation.no_results')
            ).not.toBeNull();
        });
    });

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
                'ra.navigation.next'
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
                'ra.navigation.next'
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
                'ra.navigation.previous'
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
                'ra.navigation.previous'
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
                'ra.navigation.next'
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
                'ra.navigation.next'
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
                'ra.navigation.previous'
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
                'ra.navigation.previous'
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
            'ra.navigation.next'
        ) as HTMLButtonElement;
        expect(nextButton).not.toBeNull();
        expect(nextButton.disabled).toBe(false);
        const prevButton = screen.queryByLabelText(
            'ra.navigation.previous'
        ) as HTMLButtonElement;
        expect(prevButton).not.toBeNull();
        expect(prevButton.disabled).toBe(true);
    });
});
