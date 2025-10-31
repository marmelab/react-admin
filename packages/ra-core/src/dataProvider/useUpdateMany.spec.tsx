import * as React from 'react';
import {
    screen,
    render,
    waitFor,
    act,
    fireEvent,
} from '@testing-library/react';
import { QueryClient, useMutationState } from '@tanstack/react-query';
import expect from 'expect';

import { testDataProvider } from './testDataProvider';
import { CoreAdminContext } from '../core';
import { useUpdateMany } from './useUpdateMany';
import {
    MutationMode,
    Params,
    UndefinedValues,
    WithMiddlewares,
    InvalidateList,
} from './useUpdateMany.stories';

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

    it('uses the latest declaration time mutationMode', async () => {
        // This story uses the pessimistic mode by default
        render(<MutationMode />);
        await screen.findByText(
            '[{"id":1,"title":"foo"},{"id":2,"title":"bar"}]'
        );
        fireEvent.click(screen.getByText('Change mutation mode to optimistic'));
        fireEvent.click(screen.getByText('Update title'));
        await screen.findByText(
            '[{"id":1,"title":"world"},{"id":2,"title":"world"}]'
        ); // and not [{"title":"world"},{"title":"world"}]
    });

    it('uses the latest declaration time params', async () => {
        const data = [
            { id: 1, title: 'foo' },
            { id: 2, title: 'bar' },
        ];
        const dataProvider = {
            getList: async () => ({ data, total: 2 }),
            updateMany: jest.fn(() => new Promise(() => {})), // never resolve to see only optimistic update
        } as any;
        // This story sends no meta by default
        render(<Params dataProvider={dataProvider} />);
        await screen.findByText(
            '[{"id":1,"title":"foo"},{"id":2,"title":"bar"}]'
        );
        fireEvent.click(screen.getByText('Change params'));
        fireEvent.click(screen.getByText('Update title'));
        await screen.findByText(
            '[{"id":1,"title":"world"},{"id":2,"title":"world"}]'
        ); // and not [{"title":"world"},{"title":"world"}]
        expect(dataProvider.updateMany).toHaveBeenCalledWith('posts', {
            ids: [1, 2],
            data: { title: 'world' },
            meta: 'test',
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

    it('sets the mutationKey', async () => {
        const dataProvider = testDataProvider({
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany('foo');
            localUpdateMany = updateMany;
            return <span />;
        };
        const Observe = () => {
            const mutation = useMutationState({
                filters: {
                    mutationKey: ['foo', 'updateMany'],
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
        await screen.findByText('mutations: 1');
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

        it('invalidates getList query dataProvider resolves in undoable mode', async () => {
            render(<InvalidateList mutationMode="undoable" />);
            fireEvent.click(await screen.findByText('Update'));
            await screen.findByText('resources.posts.notifications.updated');
            fireEvent.click(screen.getByText('Close'));
            await screen.findByText('1: Hello updated');
        });
    });

    describe('middlewares', () => {
        it('when pessimistic, it accepts middlewares and displays result and success side effects when dataProvider promise resolves', async () => {
            render(<WithMiddlewares mutationMode="pessimistic" timeout={10} />);
            await screen.findByText('Hello');
            screen.getByText('Update title').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(
                    // We could expect 'Hello World from middleware' here, but
                    // updateMany's result only contains the ids, not the updated data
                    // so the cache can only be updated with the call-time params,
                    // which do not include the middleware's result.
                    // I guess it's OK for most cases though...
                    screen.queryByText('Hello World')
                ).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            screen.getByText('Refetch').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });

        it('when pessimistic, it accepts middlewares and displays error and error side effects when dataProvider promise rejects', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(
                <WithMiddlewares
                    mutationMode="pessimistic"
                    shouldError
                    timeout={10}
                />
            );
            await screen.findByText('Hello');
            screen.getByText('Update title').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(screen.queryByText('something went wrong')).toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(
                    screen.queryByText('something went wrong')
                ).not.toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });

        it('when optimistic, it accepts middlewares and displays result and success side effects right away', async () => {
            render(<WithMiddlewares mutationMode="optimistic" timeout={10} />);
            await screen.findByText('Hello');
            screen.getByText('Update title').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
        it('when optimistic, it accepts middlewares and displays error and error side effects when dataProvider promise rejects', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(
                <WithMiddlewares
                    mutationMode="optimistic"
                    shouldError
                    timeout={10}
                />
            );
            await screen.findByText('Hello');
            screen.getByText('Update title').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(
                    screen.queryByText('something went wrong')
                ).not.toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            await screen.findByText('Hello');
        });

        it('when undoable, it accepts middlewares and displays result and success side effects right away and fetched on confirm', async () => {
            render(<WithMiddlewares mutationMode="undoable" timeout={10} />);
            await screen.findByText('Hello');
            act(() => {
                screen.getByText('Update title').click();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            act(() => {
                screen.getByText('Confirm').click();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(
                () => {
                    expect(screen.queryByText('mutating')).toBeNull();
                },
                { timeout: 4000 }
            );
            expect(screen.queryByText('success')).not.toBeNull();
            expect(
                screen.queryByText('Hello World from middleware')
            ).not.toBeNull();
        });
        it('when undoable, it accepts middlewares and displays result and success side effects right away and reverts on cancel', async () => {
            render(<WithMiddlewares mutationMode="undoable" timeout={10} />);
            await screen.findByText('Hello');
            act(() => {
                screen.getByText('Update title').click();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            act(() => {
                screen.getByText('Cancel').click();
            });
            await waitFor(() => {
                expect(screen.queryByText('Hello World')).toBeNull();
            });
            expect(screen.queryByText('mutating')).toBeNull();
            await screen.findByText('Hello');
        });
        it('when undoable, it accepts middlewares and displays result and success side effects right away and reverts on error', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(
                <WithMiddlewares
                    mutationMode="undoable"
                    shouldError
                    timeout={10}
                />
            );
            await screen.findByText('Hello');
            screen.getByText('Update title').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            screen.getByText('Confirm').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await screen.findByText('Hello', undefined, { timeout: 4000 });
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(
                    screen.queryByText('Hello World from middleware')
                ).toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});
