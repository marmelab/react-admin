import * as React from 'react';
import { waitFor, render, screen, fireEvent } from '@testing-library/react';
import expect from 'expect';
import { QueryClient, useMutationState } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { testDataProvider } from './testDataProvider';
import { useDeleteMany } from './useDeleteMany';
import { MutationMode, Params, InvalidateList } from './useDeleteMany.stories';

describe('useDeleteMany', () => {
    it('returns a callback that can be used with update arguments', async () => {
        const dataProvider = testDataProvider({
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany();
            localDeleteMany = deleteMany;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteMany('foo', { ids: [1, 2] });
        await waitFor(() => {
            expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
            });
        });
    });

    it('returns a callback that can be used with no arguments', async () => {
        const dataProvider = testDataProvider({
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany('foo', { ids: [1, 2] });
            localDeleteMany = deleteMany;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteMany();
        await waitFor(() => {
            expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
            });
        });
    });

    it('uses the latest declaration time mutationMode', async () => {
        // This story uses the pessimistic mode by default
        render(<MutationMode />);
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
        fireEvent.click(screen.getByText('Change mutation mode to optimistic'));
        fireEvent.click(screen.getByText('Delete posts'));
        // Should display the optimistic result right away if the change was handled
        await waitFor(() => {
            expect(screen.queryByText('success')).not.toBeNull();
            expect(screen.queryByText('Hello')).toBeNull();
            expect(screen.queryByText('World')).not.toBeNull();
            expect(screen.queryByText('mutating')).not.toBeNull();
        });
        await waitFor(() => {
            expect(screen.queryByText('success')).not.toBeNull();
            expect(screen.queryByText('Hello')).toBeNull();
            expect(screen.queryByText('World')).not.toBeNull();
            expect(screen.queryByText('mutating')).toBeNull();
        });
    });

    it('uses the latest declaration time params', async () => {
        let posts = [
            { id: 1, title: 'Hello' },
            { id: 2, title: 'World' },
        ];
        const dataProvider = {
            getList: () => {
                return Promise.resolve({
                    data: posts,
                    total: posts.length,
                });
            },
            deleteMany: jest.fn((_, params) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        posts = posts.filter(
                            post => !params.ids.includes(post.id)
                        );
                        resolve({ data: params.previousData });
                    }, 1000);
                });
            }),
        } as any;
        // This story has no meta by default
        render(<Params dataProvider={dataProvider} />);
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
        fireEvent.click(screen.getByText('Change params'));
        fireEvent.click(screen.getByText('Delete posts'));
        // Should display the optimistic result right away if the change was handled
        await waitFor(() => {
            expect(screen.queryByText('success')).not.toBeNull();
            expect(screen.queryByText('Hello')).toBeNull();
            expect(screen.queryByText('World')).not.toBeNull();
            expect(screen.queryByText('mutating')).not.toBeNull();
        });
        await screen.findByText('success');
        await screen.findByText('World');
        expect(screen.queryByText('Hello')).toBeNull();
        await waitFor(() => expect(screen.queryByText('mutating')).toBeNull());

        expect(dataProvider.deleteMany).toHaveBeenCalledWith('posts', {
            ids: [1],
            meta: 'test',
        });
    });

    it('uses call time params over hook time params', async () => {
        const dataProvider = testDataProvider({
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany('foo', { ids: [1, 2] });
            localDeleteMany = deleteMany;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteMany('foo', { ids: [3, 4] });
        await waitFor(() => {
            expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                ids: [3, 4],
            });
        });
    });

    it('accepts a meta parameter', async () => {
        const dataProvider = testDataProvider({
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany();
            localDeleteMany = deleteMany;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteMany('foo', { ids: [1, 2], meta: { hello: 'world' } });
        await waitFor(() => {
            expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
                meta: { hello: 'world' },
            });
        });
    });
    it('sets the mutationKey', async () => {
        const dataProvider = testDataProvider({
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany('foo');
            localDeleteMany = deleteMany;
            return <span />;
        };
        const Observe = () => {
            const mutation = useMutationState({
                filters: {
                    mutationKey: ['foo', 'deleteMany'],
                },
            });

            return <span>mutations: {mutation.length}</span>;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
                <Observe />
            </CoreAdminContext>
        );
        localDeleteMany('foo', { ids: [1, 2] });
        await waitFor(() => {
            expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
            });
        });
        await screen.findByText('mutations: 1');
    });
    it('accepts a meta parameter', async () => {
        const dataProvider = testDataProvider({
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany();
            localDeleteMany = deleteMany;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteMany('foo', { ids: [1, 2], meta: { hello: 'world' } });
        await waitFor(() => {
            expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
                meta: { hello: 'world' },
            });
        });
    });

    describe('query cache', () => {
        it('updates getList query cache when dataProvider promise resolves', async () => {
            const queryClient = new QueryClient();
            queryClient.setQueryData(['foo', 'getList'], {
                data: [
                    { id: 1, bar: 'bar' },
                    { id: 2, bar: 'bar' },
                    { id: 3, bar: 'bar' },
                    { id: 4, bar: 'bar' },
                ],
                total: 4,
            });
            const dataProvider = {
                deleteMany: jest.fn(() =>
                    Promise.resolve({ data: [1, 2] } as any)
                ),
            } as any;
            let localDeleteMany;
            const Dummy = () => {
                const [deleteMany] = useDeleteMany();
                localDeleteMany = deleteMany;
                return <span />;
            };
            render(
                <CoreAdminContext
                    dataProvider={dataProvider}
                    queryClient={queryClient}
                >
                    <Dummy />
                </CoreAdminContext>
            );
            localDeleteMany('foo', { ids: [1, 2] });
            await waitFor(() => {
                expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                    ids: [1, 2],
                });
            });
            await waitFor(() => {
                expect(queryClient.getQueryData(['foo', 'getList'])).toEqual({
                    data: [
                        { id: 3, bar: 'bar' },
                        { id: 4, bar: 'bar' },
                    ],
                    total: 2,
                });
            });
        });
        it('updates getList query cache with pageInfo when dataProvider promise resolves', async () => {
            const queryClient = new QueryClient();
            queryClient.setQueryData(['foo', 'getList'], {
                data: [
                    { id: 1, bar: 'bar' },
                    { id: 2, bar: 'bar' },
                    { id: 3, bar: 'bar' },
                    { id: 4, bar: 'bar' },
                ],
                pageInfo: {
                    hasPreviousPage: false,
                    hasNextPage: true,
                },
            });
            const dataProvider = {
                deleteMany: jest.fn(() =>
                    Promise.resolve({ data: [1, 2] } as any)
                ),
            } as any;
            let localDeleteMany;
            const Dummy = () => {
                const [deleteMany] = useDeleteMany();
                localDeleteMany = deleteMany;
                return <span />;
            };
            render(
                <CoreAdminContext
                    dataProvider={dataProvider}
                    queryClient={queryClient}
                >
                    <Dummy />
                </CoreAdminContext>
            );
            localDeleteMany('foo', { ids: [1, 2] });
            await waitFor(() => {
                expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                    ids: [1, 2],
                });
            });
            await waitFor(() => {
                expect(queryClient.getQueryData(['foo', 'getList'])).toEqual({
                    data: [
                        { id: 3, bar: 'bar' },
                        { id: 4, bar: 'bar' },
                    ],
                    pageInfo: {
                        hasPreviousPage: false,
                        hasNextPage: true,
                    },
                });
            });
        });
        it('updates getInfiniteList query cache when dataProvider promise resolves', async () => {
            const queryClient = new QueryClient();
            queryClient.setQueryData(['foo', 'getInfiniteList'], {
                pages: [
                    {
                        data: [
                            { id: 1, bar: 'bar' },
                            { id: 2, bar: 'bar' },
                            { id: 3, bar: 'bar' },
                            { id: 4, bar: 'bar' },
                        ],
                        total: 4,
                    },
                ],
                pageParams: [],
            });
            const dataProvider = {
                deleteMany: jest.fn(() =>
                    Promise.resolve({ data: [1, 2] } as any)
                ),
            } as any;
            let localDeleteMany;
            const Dummy = () => {
                const [deleteMany] = useDeleteMany();
                localDeleteMany = deleteMany;
                return <span />;
            };
            render(
                <CoreAdminContext
                    dataProvider={dataProvider}
                    queryClient={queryClient}
                >
                    <Dummy />
                </CoreAdminContext>
            );
            localDeleteMany('foo', { ids: [1, 2] });
            await waitFor(() => {
                expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                    ids: [1, 2],
                });
            });
            await waitFor(() => {
                expect(
                    queryClient.getQueryData(['foo', 'getInfiniteList'])
                ).toEqual({
                    pages: [
                        {
                            data: [
                                { id: 3, bar: 'bar' },
                                { id: 4, bar: 'bar' },
                            ],
                            total: 2,
                        },
                    ],
                    pageParams: [],
                });
            });
        });

        it('invalidates getList query when dataProvider resolves in undoable mode', async () => {
            render(<InvalidateList mutationMode="undoable" />);
            fireEvent.click(await screen.findByText('Delete'));
            await screen.findByText('resources.posts.notifications.deleted');
            fireEvent.click(screen.getByText('Close'));
            await waitFor(() => {
                expect(screen.queryByText('1: Hello')).toBeNull();
            });
        });
    });
});
