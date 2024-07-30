import * as React from 'react';
import expect from 'expect';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import { Basic, PageInfo } from './useInfiniteGetList.stories';
import { QueryClient } from '@tanstack/react-query';
import { testDataProvider } from './testDataProvider';
import { PaginationPayload, SortPayload } from '../types';
import { useInfiniteGetList } from './useInfiniteGetList';
import { CoreAdminContext } from '..';

describe('useInfiniteGetList', () => {
    const UseInfiniteGetList = ({
        resource = 'posts',
        pagination = { page: 1, perPage: 10 },
        sort = { field: 'id', order: 'DESC' } as const,
        filter = {},
        options = {},
        meta = undefined,
        callback = null,
    }: {
        resource?: string;
        pagination?: PaginationPayload;
        sort?: SortPayload;
        filter?: any;
        options?: any;
        meta?: any;
        callback?: any;
    }) => {
        const hookValue = useInfiniteGetList(
            resource,
            { pagination, sort, filter, meta },
            options
        );
        if (callback) callback(hookValue);
        return <div>hello</div>;
    };

    it('should call dataProvider.getList() on mount', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 73, name: 'France', code: 'FR' }],
                    total: 1,
                })
            ),
        } as any;

        render(<Basic dataProvider={dataProvider} resource="heroes" />);
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
            expect(dataProvider.getList).toBeCalledWith('heroes', {
                filter: {},
                pagination: { page: 1, perPage: 20 },
                sort: { field: 'id', order: 'DESC' },
                signal: undefined,
            });
        });
    });

    it('should not call the dataProvider on update', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 73, name: 'France', code: 'FR' }],
                    total: 1,
                })
            ),
        } as any;
        const { rerender } = render(<Basic dataProvider={dataProvider} />);
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        rerender(<Basic dataProvider={dataProvider} />);
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
    });

    it('should call the dataProvider on update when the resource changes', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 73, name: 'France', code: 'FR' }],
                    total: 1,
                })
            ),
        } as any;
        const { rerender } = render(
            <Basic dataProvider={dataProvider} resource="heroes" />
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(1);
        });
        rerender(<Basic dataProvider={dataProvider} />);
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledTimes(2);
        });
    });

    it('should accept a meta parameter', async () => {
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({
                    data: [{ id: 73, name: 'France', code: 'FR' }],
                    total: 1,
                })
            ),
        } as any;
        render(
            <Basic
                dataProvider={dataProvider}
                pagination={{ page: 1, perPage: 20 }}
                meta={{ hello: 'world' }}
                resource="heroes"
            />
        );
        await waitFor(() => {
            expect(dataProvider.getList).toBeCalledWith('heroes', {
                filter: {},
                pagination: { page: 1, perPage: 20 },
                sort: { field: 'id', order: 'DESC' },
                meta: { hello: 'world' },
                signal: undefined,
            });
        });
    });

    it('should call success side effects on success', async () => {
        const onSuccess1 = jest.fn();

        const countries = [
            { id: 73, name: 'France', code: 'FR' },
            { id: 74, name: 'Italia', code: 'IT' },
        ];
        const dataProvider = {
            getList: (resource, params) => {
                return Promise.resolve({
                    data: countries.slice(
                        (params.pagination.page - 1) *
                            params.pagination.perPage,
                        (params.pagination.page - 1) *
                            params.pagination.perPage +
                            params.pagination.perPage
                    ),
                    total: countries.length,
                });
            },
        };

        render(
            <Basic
                dataProvider={dataProvider}
                pagination={{ page: 1, perPage: 1 }}
                options={{ onSuccess: onSuccess1 }}
            />
        );
        await waitFor(async () => {
            expect(onSuccess1).toBeCalledTimes(1);
            expect(screen.getByLabelText('country').innerHTML).toContain(
                'France'
            );

            screen.getByLabelText('refetch-button').click();

            await waitFor(async () => {
                expect(onSuccess1).toBeCalledTimes(2);
                expect(screen.queryAllByLabelText('country')).toHaveLength(2);
            });
        });
    });

    it('should not pre-populate getOne Query Cache if more than 100 results', async () => {
        const callback: any = jest.fn();
        const queryClient = new QueryClient();
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest.fn((_resource, { pagination: { page, perPage } }) =>
                Promise.resolve({
                    data: Array.from(Array(perPage).keys()).map(index => ({
                        id: index + 1 + (page - 1) * perPage,
                        title: `item ${index + 1 + (page - 1) * perPage}`,
                    })),
                    total: perPage * 2,
                })
            ),
        });

        render(
            <CoreAdminContext
                queryClient={queryClient}
                dataProvider={dataProvider}
            >
                <UseInfiniteGetList
                    callback={callback}
                    pagination={{ page: 1, perPage: 101 }}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        pages: expect.arrayContaining([
                            expect.objectContaining({
                                data: expect.arrayContaining([
                                    { id: 1, title: 'item 1' },
                                    { id: 101, title: 'item 101' },
                                ]),
                            }),
                        ]),
                    }),
                })
            );
        });
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '1' }])
        ).toBeUndefined();
    });

    it('should not pre-populate getOne Query Cache if more than 100 results across several pages', async () => {
        let hookValue;
        const callback: any = jest.fn(value => {
            hookValue = value;
        });
        const queryClient = new QueryClient();
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest.fn((_resource, { pagination: { page, perPage } }) =>
                Promise.resolve({
                    data: Array.from(Array(perPage).keys()).map(index => ({
                        id: index + 1 + (page - 1) * perPage,
                        title: `item ${index + 1 + (page - 1) * perPage}`,
                    })),
                    total: perPage * 2,
                })
            ),
        });

        render(
            <CoreAdminContext
                queryClient={queryClient}
                dataProvider={dataProvider}
            >
                <UseInfiniteGetList
                    callback={callback}
                    pagination={{ page: 1, perPage: 51 }}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        pages: expect.arrayContaining([
                            expect.objectContaining({
                                data: expect.arrayContaining([
                                    { id: 1, title: 'item 1' },
                                    { id: 51, title: 'item 51' },
                                ]),
                            }),
                        ]),
                    }),
                })
            );
        });
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '1' }])
        ).toBeDefined();
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '51' }])
        ).toBeDefined();
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '52' }])
        ).not.toBeDefined();
        // Fetch next page
        hookValue.fetchNextPage();
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        pages: expect.arrayContaining([
                            expect.objectContaining({
                                data: expect.arrayContaining([
                                    { id: 52, title: 'item 52' },
                                    { id: 102, title: 'item 102' },
                                ]),
                            }),
                        ]),
                    }),
                })
            );
        });
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '1' }])
        ).toBeDefined();
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '51' }])
        ).toBeDefined();
        // query data for item 52 should still be undefined
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '52' }])
        ).not.toBeDefined();
    });

    it('should only populate the getOne Query Cache with the records from the last fetched page', async () => {
        let hookValue;
        const callback: any = jest.fn(value => {
            hookValue = value;
        });
        const queryClient = new QueryClient();
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest.fn((_resource, { pagination: { page } }) =>
                Promise.resolve({
                    data: [
                        {
                            id: page,
                            title: `item ${page}`,
                        },
                    ],
                    total: 2,
                })
            ),
        });
        render(
            <CoreAdminContext
                queryClient={queryClient}
                dataProvider={dataProvider}
            >
                <UseInfiniteGetList
                    callback={callback}
                    pagination={{ page: 1, perPage: 1 }}
                />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        pages: expect.arrayContaining([
                            expect.objectContaining({
                                data: [{ id: 1, title: 'item 1' }],
                            }),
                        ]),
                    }),
                })
            );
        });
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '1' }])
        ).toEqual({ id: 1, title: 'item 1' });
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '2' }])
        ).toBeUndefined();
        // Manually change query data for item 1
        queryClient.setQueryData(['posts', 'getOne', { id: '1' }], {
            id: 1,
            title: 'changed!',
        });
        // Fetch next page
        hookValue.fetchNextPage();
        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        pages: expect.arrayContaining([
                            expect.objectContaining({
                                data: [{ id: 2, title: 'item 2' }],
                            }),
                        ]),
                    }),
                })
            );
        });
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '2' }])
        ).toEqual({ id: 2, title: 'item 2' });
        // Check that the getOne Query Cache for item 1 has not been overriden
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '1' }])
        ).toEqual({ id: 1, title: 'changed!' });
    });

    it('should abort the request if the query is canceled', async () => {
        const abort = jest.fn();
        const dataProvider = testDataProvider({
            getList: jest.fn(
                (_resource, { signal }) =>
                    new Promise(() => {
                        signal.addEventListener('abort', () => {
                            abort(signal.reason);
                        });
                    })
            ) as any,
        });
        dataProvider.supportAbortSignal = true;
        const queryClient = new QueryClient();
        render(
            <CoreAdminContext
                dataProvider={dataProvider}
                queryClient={queryClient}
            >
                <UseInfiniteGetList />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getList).toHaveBeenCalled();
        });
        queryClient.cancelQueries({
            queryKey: ['posts', 'getInfiniteList'],
        });
        await waitFor(() => {
            expect(abort).toHaveBeenCalled();
        });
    });

    describe('fetchNextPage', () => {
        it('should fetch the next page when the dataProvider uses total', async () => {
            render(<Basic />);
            const button = await screen.findByLabelText('refetch-button');
            fireEvent.click(button);
            await screen.findByText('Belgium -- BE');
        });
        it('should fetch the next page when the dataProvider uses pageInfo', async () => {
            render(<PageInfo />);
            const button = await screen.findByLabelText('refetch-button');
            fireEvent.click(button);
            await screen.findByText('Belgium -- BE');
        });
    });
});
