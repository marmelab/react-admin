import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import { ListPaginationContext } from 'ra-core';

import Pagination from './Pagination';
import DeviceTestWrapper from '../../layout/DeviceTestWrapper';

const theme = createTheme();

describe('<Pagination />', () => {
    const defaultProps = {
        resource: 'posts',
        page: 1,
        perPage: 10,
        setPage: () => null,
        loading: false,
        setPerPage: () => {},
    };

    describe('no results mention', () => {
        it('should display a pagination limit when there is no result', () => {
            const { queryByText } = render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{ ...defaultProps, total: 0 }}
                    >
                        <Pagination />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            expect(queryByText('ra.navigation.no_results')).not.toBeNull();
        });

        it('should not display a pagination limit when there are results', () => {
            const { queryByText } = render(
                <ThemeProvider theme={theme}>
                    <ListPaginationContext.Provider
                        value={{ ...defaultProps, total: 1 }}
                    >
                        <Pagination />
                    </ListPaginationContext.Provider>
                </ThemeProvider>
            );
            expect(queryByText('ra.navigation.no_results')).toBeNull();
        });

        it('should display a pagination limit on an out of bounds page (more than total pages)', async () => {
            jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            const setPage = jest.fn().mockReturnValue(null);
            const { queryByText } = render(
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
            expect(queryByText('ra.navigation.no_results')).not.toBeNull();
        });

        it('should display a pagination limit on an out of bounds page (less than 0)', async () => {
            jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            const setPage = jest.fn().mockReturnValue(null);
            const { queryByText } = render(
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
            expect(queryByText('ra.navigation.no_results')).not.toBeNull();
        });
    });

    describe('Pagination buttons', () => {
        it('should display a next button when there are more results', () => {
            const { queryByText } = render(
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
            expect(queryByText('ra.navigation.next')).not.toBeNull();
        });
        it('should not display a next button when there are no more results', () => {
            const { queryByText } = render(
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
            expect(queryByText('ra.navigation.next')).toBeNull();
        });
        it('should display a prev button when there are previous results', () => {
            const { queryByText } = render(
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
            expect(queryByText('ra.navigation.prev')).not.toBeNull();
        });
        it('should not display a prev button when there are no previous results', () => {
            const { queryByText } = render(
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
            expect(queryByText('ra.navigation.prev')).toBeNull();
        });
    });

    describe('mobile', () => {
        it('should not render a rowsPerPage choice', () => {
            const { queryByText } = render(
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
            expect(queryByText('ra.navigation.page_rows_per_page')).toBeNull();
        });
    });

    describe('desktop', () => {
        it('should render rowsPerPage choice', () => {
            const { queryByText } = render(
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
                queryByText('ra.navigation.page_rows_per_page')
            ).not.toBeNull();
        });
    });

    it('should work outside of a ListContext', () => {
        const { queryByText } = render(
            <ThemeProvider theme={theme}>
                <Pagination
                    resource="posts"
                    setPage={() => null}
                    loading={false}
                    setPerPage={() => {}}
                    perPage={1}
                    total={2}
                    page={1}
                />
            </ThemeProvider>
        );
        expect(queryByText('ra.navigation.page_rows_per_page')).not.toBeNull();
    });
});
