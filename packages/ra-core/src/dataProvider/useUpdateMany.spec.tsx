import * as React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import expect from 'expect';

import { testDataProvider } from './testDataProvider';
import { CoreAdminContext } from '../core';
import { useUpdateMany } from './useUpdateMany';
import { UndefinedValues } from './useUpdateMany.stories';

describe('useUpdateMany', () => {
    it('returns a callback that can be used with update arguments', async () => {
        const dataProvider = testDataProvider({
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany();
            localUpdateMany = updateMany;
            return <span />;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localUpdateMany('foo', { ids: [1, 2], data: { bar: 'baz' } });
        await waitFor(() => {
            expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
                data: { bar: 'baz' },
            });
        });
    });

    it('returns a callback that can be used with no arguments', async () => {
        const dataProvider = testDataProvider({
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany('foo', {
                ids: [1, 2],
                data: { bar: 'baz' },
            });
            localUpdateMany = updateMany;
            return <span />;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localUpdateMany();
        await waitFor(() => {
            expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
                data: { bar: 'baz' },
            });
        });
    });

    it('uses callback call time params rather than hook call time params', async () => {
        const dataProvider = testDataProvider({
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany('foo', {
                ids: [1, 2],
                data: { bar: 'baz' },
            });
            localUpdateMany = updateMany;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localUpdateMany('foo', { data: { foo: 456 } });
        await waitFor(() => {
            expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
                data: { foo: 456 },
            });
        });
    });

    it('accepts a meta parameter', async () => {
        const dataProvider = testDataProvider({
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany();
            localUpdateMany = updateMany;
            return <span />;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localUpdateMany('foo', {
            ids: [1, 2],
            data: { bar: 'baz' },
            meta: { hello: 'world' },
        });
        await waitFor(() => {
            expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
                data: { bar: 'baz' },
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
                ],
                total: 2,
            });
            const dataProvider = {
                updateMany: jest.fn(() =>
                    Promise.resolve({ data: [1, 2] } as any)
                ),
            } as any;
            let localUpdateMany;
            const Dummy = () => {
                const [updateMany] = useUpdateMany();
                localUpdateMany = updateMany;
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
            localUpdateMany('foo', { ids: [1, 2], data: { bar: 'baz' } });
            await waitFor(() => {
                expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                    ids: [1, 2],
                    data: { bar: 'baz' },
                });
            });
            await waitFor(() => {
                expect(queryClient.getQueryData(['foo', 'getList'])).toEqual({
                    data: [
                        { id: 1, bar: 'baz' },
                        { id: 2, bar: 'baz' },
                    ],
                    total: 2,
                });
            });
        });
        it('updates getList query cache when dataProvider promise resolves in optimistic mode', async () => {
            const queryClient = new QueryClient();
            queryClient.setQueryData(['foo', 'getList'], {
                data: [
                    { id: 1, bar: 'bar' },
                    { id: 2, bar: 'bar' },
                ],
                total: 2,
            });
            const dataProvider = {
                updateMany: jest.fn(() =>
                    Promise.resolve({ data: [1, 2] } as any)
                ),
            } as any;
            let localUpdateMany;
            const Dummy = () => {
                const [updateMany] = useUpdateMany(undefined, undefined, {
                    mutationMode: 'optimistic',
                });
                localUpdateMany = updateMany;
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
            localUpdateMany('foo', { ids: [1, 2], data: { bar: 'baz' } });
            await waitFor(() => {
                expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                    ids: [1, 2],
                    data: { bar: 'baz' },
                });
            });
            await waitFor(() => {
                expect(queryClient.getQueryData(['foo', 'getList'])).toEqual({
                    data: [
                        { id: 1, bar: 'baz' },
                        { id: 2, bar: 'baz' },
                    ],
                    total: 2,
                });
            });
        });
        it('updates getList query cache when dataProvider promise resolves and using no call-time params', async () => {
            const queryClient = new QueryClient();
            queryClient.setQueryData(['foo', 'getList'], {
                data: [
                    { id: 1, bar: 'bar' },
                    { id: 2, bar: 'bar' },
                ],
                total: 2,
            });
            const dataProvider = {
                updateMany: jest.fn(() =>
                    Promise.resolve({ data: [1, 2] } as any)
                ),
            } as any;
            let localUpdateMany;
            const Dummy = () => {
                const [updateMany] = useUpdateMany('foo', {
                    ids: [1, 2],
                    data: { bar: 'baz' },
                });
                localUpdateMany = updateMany;
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
            localUpdateMany();
            await waitFor(() => {
                expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                    ids: [1, 2],
                    data: { bar: 'baz' },
                });
            });
            await waitFor(() => {
                expect(queryClient.getQueryData(['foo', 'getList'])).toEqual({
                    data: [
                        { id: 1, bar: 'baz' },
                        { id: 2, bar: 'baz' },
                    ],
                    total: 2,
                });
            });
        });
        it('updates getList query cache when dataProvider promise resolves in optimistic mode with no call-time params', async () => {
            const queryClient = new QueryClient();
            queryClient.setQueryData(['foo', 'getList'], {
                data: [
                    { id: 1, bar: 'bar' },
                    { id: 2, bar: 'bar' },
                ],
                total: 2,
            });
            const dataProvider = {
                updateMany: jest.fn(() =>
                    Promise.resolve({ data: [1, 2] } as any)
                ),
            } as any;
            let localUpdateMany;
            const Dummy = () => {
                const [updateMany] = useUpdateMany(
                    'foo',
                    {
                        ids: [1, 2],
                        data: { bar: 'baz' },
                    },
                    { mutationMode: 'optimistic' }
                );
                localUpdateMany = updateMany;
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
            localUpdateMany();
            await waitFor(() => {
                expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                    ids: [1, 2],
                    data: { bar: 'baz' },
                });
            });
            await waitFor(() => {
                expect(queryClient.getQueryData(['foo', 'getList'])).toEqual({
                    data: [
                        { id: 1, bar: 'baz' },
                        { id: 2, bar: 'baz' },
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
                ],
                pageInfo: {
                    hasPreviousPage: false,
                    hasNextPage: true,
                },
            });
            const dataProvider = {
                updateMany: jest.fn(() =>
                    Promise.resolve({ data: [1, 2] } as any)
                ),
            } as any;
            let localUpdateMany;
            const Dummy = () => {
                const [updateMany] = useUpdateMany('foo', {
                    ids: [1, 2],
                    data: { bar: 'baz' },
                });
                localUpdateMany = updateMany;
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
            localUpdateMany('foo', { ids: [1, 2], data: { bar: 'baz' } });
            await waitFor(() => {
                expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                    ids: [1, 2],
                    data: { bar: 'baz' },
                });
            });
            await waitFor(() => {
                expect(queryClient.getQueryData(['foo', 'getList'])).toEqual({
                    data: [
                        { id: 1, bar: 'baz' },
                        { id: 2, bar: 'baz' },
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
                        ],
                        total: 2,
                    },
                ],
                pageParams: [],
            });
            const dataProvider = {
                updateMany: jest.fn(() =>
                    Promise.resolve({ data: [1, 2] } as any)
                ),
            } as any;
            let localUpdateMany;
            const Dummy = () => {
                const [updateMany] = useUpdateMany('foo', {
                    ids: [1, 2],
                    data: { bar: 'baz' },
                });
                localUpdateMany = updateMany;
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
            localUpdateMany('foo', { ids: [1, 2], data: { bar: 'baz' } });
            await waitFor(() => {
                expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                    ids: [1, 2],
                    data: { bar: 'baz' },
                });
            });
            await waitFor(() => {
                expect(
                    queryClient.getQueryData(['foo', 'getInfiniteList'])
                ).toEqual({
                    pages: [
                        {
                            data: [
                                { id: 1, bar: 'baz' },
                                { id: 2, bar: 'baz' },
                            ],
                            total: 2,
                        },
                    ],
                    pageParams: [],
                });
            });
        });
        it('when optimistic, does not erase values if the payload contains undefined values', async () => {
            render(<UndefinedValues />);
            await screen.findByText(
                '[{"id":1,"title":"foo"},{"id":2,"title":"bar"}]'
            );
            screen.getByText('Update title').click();
            await screen.findByText(
                '[{"id":1,"title":"world"},{"id":2,"title":"world"}]'
            ); // and not [{"title":"world"},{"title":"world"}]
        });
    });
});
