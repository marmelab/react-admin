import * as React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ListContext } from 'ra-core';

import Pagination from './Pagination';
import DeviceTestWrapper from '../layout/DeviceTestWrapper';

const theme = createMuiTheme();

describe('<Pagination />', () => {
    const defaultProps = {
        resource: 'posts',
        page: 1,
        perPage: 10,
        setPage: () => null,
    };

    afterEach(cleanup);

    describe('no results mention', () => {
        it('should display a pagination limit when there is no result', () => {
            const { queryByText } = render(
                <ThemeProvider theme={theme}>
                    <ListContext.Provider value={{ ...defaultProps, total: 0 }}>
                        <Pagination />
                    </ListContext.Provider>
                </ThemeProvider>
            );
            expect(queryByText('ra.navigation.no_results')).not.toBeNull();
        });

        it('should not display a pagination limit when there are results', () => {
            const { queryByText } = render(
                <ThemeProvider theme={theme}>
                    <ListContext.Provider value={{ ...defaultProps, total: 1 }}>
                        <Pagination />
                    </ListContext.Provider>
                </ThemeProvider>
            );
            expect(queryByText('ra.navigation.no_results')).toBeNull();
        });

        it('should not display a pagination limit on an out of bounds page', () => {
            jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            const { queryByText } = render(
                <ThemeProvider theme={theme}>
                    <ListContext.Provider
                        value={{ ...defaultProps, total: 10, page: 2 }}
                    >
                        <Pagination />
                    </ListContext.Provider>
                </ThemeProvider>
            );
            // mui TablePagination displays a warning in that case, and that's normal
            expect(queryByText('ra.navigation.no_results')).toBeNull();
        });
    });

    describe('Pagination buttons', () => {
        it('should display a next button when there are more results', () => {
            const { queryByText } = render(
                <ThemeProvider theme={theme}>
                    <ListContext.Provider
                        value={{
                            ...defaultProps,
                            perPage: 1,
                            total: 2,
                            page: 1,
                        }}
                    >
                        <Pagination rowsPerPageOptions={[1]} />
                    </ListContext.Provider>
                </ThemeProvider>
            );
            expect(queryByText('ra.navigation.next')).not.toBeNull();
        });
        it('should not display a next button when there are no more results', () => {
            const { queryByText } = render(
                <ThemeProvider theme={theme}>
                    <ListContext.Provider
                        value={{
                            ...defaultProps,
                            perPage: 1,
                            total: 2,
                            page: 2,
                        }}
                    >
                        <Pagination rowsPerPageOptions={[1]} />
                    </ListContext.Provider>
                </ThemeProvider>
            );
            expect(queryByText('ra.navigation.next')).toBeNull();
        });
        it('should display a prev button when there are previous results', () => {
            const { queryByText } = render(
                <ThemeProvider theme={theme}>
                    <ListContext.Provider
                        value={{
                            ...defaultProps,
                            perPage: 1,
                            total: 2,
                            page: 2,
                        }}
                    >
                        <Pagination rowsPerPageOptions={[1]} />
                    </ListContext.Provider>
                </ThemeProvider>
            );
            expect(queryByText('ra.navigation.prev')).not.toBeNull();
        });
        it('should not display a prev button when there are no previous results', () => {
            const { queryByText } = render(
                <ThemeProvider theme={theme}>
                    <ListContext.Provider
                        value={{
                            ...defaultProps,
                            perPage: 1,
                            total: 2,
                            page: 1,
                        }}
                    >
                        <Pagination rowsPerPageOptions={[1]} />
                    </ListContext.Provider>
                </ThemeProvider>
            );
            expect(queryByText('ra.navigation.prev')).toBeNull();
        });
    });

    describe('mobile', () => {
        it('should not render a rowsPerPage choice', () => {
            const { queryByText } = render(
                <DeviceTestWrapper width="sm">
                    <ListContext.Provider
                        value={{
                            ...defaultProps,
                            page: 2,
                            perPage: 5,
                            total: 15,
                        }}
                    >
                        <Pagination />
                    </ListContext.Provider>
                </DeviceTestWrapper>
            );
            expect(queryByText('ra.navigation.page_rows_per_page')).toBeNull();
        });
    });

    describe('desktop', () => {
        it('should render rowsPerPage choice', () => {
            const { queryByText } = render(
                <DeviceTestWrapper width="lg">
                    <ListContext.Provider
                        value={{
                            ...defaultProps,
                            page: 2,
                            perPage: 5,
                            total: 15,
                        }}
                    >
                        <Pagination width="md" />
                    </ListContext.Provider>
                </DeviceTestWrapper>
            );

            expect(
                queryByText('ra.navigation.page_rows_per_page')
            ).not.toBeNull();
        });
    });
});
