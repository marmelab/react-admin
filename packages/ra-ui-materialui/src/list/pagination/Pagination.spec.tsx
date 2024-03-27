import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ListPaginationContext } from 'ra-core';

import { Pagination } from './Pagination';
import { DeviceTestWrapper } from '../../layout';
import { RowsPerPageOptions } from './Pagination.stories';

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
                        value={
                            {
                                ...defaultProps,
                                perPage: 1,
                                total: 2,
                                page: 2,
                            } as any
                        }
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
                        value={
                            {
                                ...defaultProps,
                                perPage: 1,
                                total: 2,
                                page: 2,
                            } as any
                        }
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
                        value={
                            {
                                ...defaultProps,
                                perPage: 1,
                                total: 2,
                                page: 1,
                            } as any
                        }
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
                        value={
                            {
                                ...defaultProps,
                                perPage: 1,
                                total: undefined,
                                page: 1,
                                hasNextPage: true,
                            } as any
                        }
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
                        value={
                            {
                                ...defaultProps,
                                perPage: 1,
                                total: undefined,
                                page: 2,
                                hasNextPage: false,
                            } as any
                        }
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
                        value={
                            {
                                ...defaultProps,
                                perPage: 1,
                                total: undefined,
                                page: 2,
                                hasPreviousPage: true,
                            } as any
                        }
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
                        value={
                            {
                                ...defaultProps,
                                perPage: 1,
                                total: undefined,
                                page: 1,
                                hasPreviousPage: false,
                            } as any
                        }
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
                        value={
                            {
                                ...defaultProps,
                                page: 2,
                                perPage: 5,
                                total: 15,
                            } as any
                        }
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
                        value={
                            {
                                ...defaultProps,
                                page: 2,
                                perPage: 5,
                                total: 15,
                            } as any
                        }
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

    describe('rowsPerPageOptions', () => {
        it('should accept an array of options with label and value', () => {
            render(<RowsPerPageOptions />);
            expect(screen.getByText('ten')).not.toBeNull();
        });
    });
});
