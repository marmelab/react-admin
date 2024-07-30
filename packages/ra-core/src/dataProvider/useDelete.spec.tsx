import * as React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import expect from 'expect';

import { CoreAdminContext } from '../core';
import { RaRecord } from '../types';
import { testDataProvider } from './testDataProvider';
import { useDelete } from './useDelete';
import {
    ErrorCase as ErrorCasePessimistic,
    SuccessCase as SuccessCasePessimistic,
} from './useDelete.pessimistic.stories';
import {
    ErrorCase as ErrorCaseOptimistic,
    SuccessCase as SuccessCaseOptimistic,
} from './useDelete.optimistic.stories';
import {
    ErrorCase as ErrorCaseUndoable,
    SuccessCase as SuccessCaseUndoable,
} from './useDelete.undoable.stories';
import { QueryClient } from '@tanstack/react-query';

describe('useDelete', () => {
    it('returns a callback that can be used with deleteOne arguments', async () => {
        const dataProvider = testDataProvider({
            delete: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        });
        let localDeleteOne;
        const Dummy = () => {
            const [deleteOne] = useDelete();
            localDeleteOne = deleteOne;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteOne('foo', { id: 1, previousData: { id: 1, bar: 'bar' } });
        await waitFor(() => {
            expect(dataProvider.delete).toHaveBeenCalledWith('foo', {
                id: 1,
                previousData: { id: 1, bar: 'bar' },
            });
        });
    });

    it('returns a callback that can be used with no arguments', async () => {
        const dataProvider = testDataProvider({
            delete: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        });
        let localDeleteOne;
        const Dummy = () => {
            const [deleteOne] = useDelete('foo', {
                id: 1,
                previousData: { id: 1, bar: 'bar' },
            });
            localDeleteOne = deleteOne;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteOne();
        await waitFor(() => {
            expect(dataProvider.delete).toHaveBeenCalledWith('foo', {
                id: 1,
                previousData: { id: 1, bar: 'bar' },
            });
        });
    });

    it('uses call time params over hook time params', async () => {
        const dataProvider = testDataProvider({
            delete: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        });
        let localDeleteOne;
        const Dummy = () => {
            const [deleteOne] = useDelete('foo', {
                id: 1,
                previousData: { id: 1, bar: 'bar' },
            });
            localDeleteOne = deleteOne;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteOne('foo', {
            id: 1,
            previousData: { foo: 456 },
        });
        await waitFor(() => {
            expect(dataProvider.delete).toHaveBeenCalledWith('foo', {
                id: 1,
                previousData: { foo: 456 },
            });
        });
    });

    it('accepts a meta parameter', async () => {
        const dataProvider = testDataProvider({
            delete: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        });
        let localDeleteOne;
        const Dummy = () => {
            const [deleteOne] = useDelete();
            localDeleteOne = deleteOne;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteOne('foo', {
            id: 1,
            previousData: { id: 1, bar: 'bar' },
            meta: { hello: 'world' },
        });
        await waitFor(() => {
            expect(dataProvider.delete).toHaveBeenCalledWith('foo', {
                id: 1,
                previousData: { id: 1, bar: 'bar' },
                meta: { hello: 'world' },
            });
        });
    });

    it('returns data typed based on the parametric type', async () => {
        interface Product extends RaRecord {
            sku: string;
        }
        const dataProvider = testDataProvider({
            delete: jest.fn(() =>
                Promise.resolve({ data: { id: 1, sku: 'abc' } } as any)
            ),
        });
        let localDeleteOne;
        let sku;
        const Dummy = () => {
            const [deleteOne, { data }] = useDelete<Product>();
            localDeleteOne = deleteOne;
            sku = data && data.sku;
            return <span />;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        expect(sku).toBeUndefined();
        localDeleteOne('products', {
            id: 1,
            previousData: { id: 1, sku: 'bcd' },
        });
        await waitFor(() => {
            expect(sku).toEqual('abc');
        });
    });

    it('should delete record even if id is zero', async () => {
        const dataProvider = testDataProvider({
            delete: jest.fn(() => Promise.resolve({ data: { id: 0 } } as any)),
        });
        let localDeleteOne;
        const Dummy = () => {
            const [deleteOne] = useDelete();
            localDeleteOne = deleteOne;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteOne('foo', { id: 0, previousData: { id: 0, bar: 'bar' } });
        await waitFor(() => {
            expect(dataProvider.delete).toHaveBeenCalledWith('foo', {
                id: 0,
                previousData: { id: 0, bar: 'bar' },
            });
        });
    });

    describe('mutationOptions', () => {
        it('when pessimistic, executes success side effects on success', async () => {
            const onSuccess = jest.fn();
            const dataProvider = testDataProvider({
                delete: () => Promise.resolve({ data: { id: 1 } } as any),
            });
            let localDeleteOne;
            const Dummy = () => {
                const [deleteOne] = useDelete(
                    'foo',
                    {
                        id: 1,
                        previousData: { id: 1, bar: 'bar' },
                    },
                    { onSuccess }
                );
                localDeleteOne = deleteOne;
                return <span />;
            };
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Dummy />
                </CoreAdminContext>
            );
            localDeleteOne('foo', {
                id: 1,
                previousData: { foo: 456 },
            });
            await waitFor(() => {
                expect(onSuccess).toHaveBeenCalledWith(
                    { id: 1 },
                    { id: 1, previousData: { foo: 456 }, resource: 'foo' },
                    { snapshot: [] }
                );
            });
        });
        it('when pessimistic, executes error side effects on error', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const onError = jest.fn();
            const dataProvider = testDataProvider({
                delete: () => Promise.reject(new Error('not good')),
            });
            let localDeleteOne;
            const Dummy = () => {
                const [deleteOne] = useDelete(
                    'foo',
                    {
                        id: 1,
                        previousData: { id: 1, bar: 'bar' },
                    },
                    { onError }
                );
                localDeleteOne = deleteOne;
                return <span />;
            };
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Dummy />
                </CoreAdminContext>
            );
            localDeleteOne('foo', {
                id: 1,
                previousData: { foo: 456 },
            });
            await waitFor(() => {
                expect(onError).toHaveBeenCalledWith(
                    new Error('not good'),
                    { id: 1, previousData: { foo: 456 }, resource: 'foo' },
                    { snapshot: [] }
                );
            });
        });
    });

    describe('mutationMode', () => {
        it('when pessimistic, displays result and success side effects when dataProvider promise resolves', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {});
            render(<SuccessCasePessimistic />);
            screen.getByText('Delete first post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            expect(screen.queryByText('Hello')).not.toBeNull();
            expect(screen.queryByText('World')).not.toBeNull();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            expect(screen.queryByText('Hello')).toBeNull();
            expect(screen.queryByText('World')).not.toBeNull();
        });
        it('when pessimistic, displays error and error side effects when dataProvider promise rejects', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {});
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<ErrorCasePessimistic />);
            screen.getByText('Delete first post').click();
            await waitFor(
                () => {
                    expect(screen.queryByText('success')).toBeNull();
                    expect(
                        screen.queryByText('something went wrong')
                    ).toBeNull();
                    expect(screen.queryByText('Hello')).not.toBeNull();
                    expect(screen.queryByText('World')).not.toBeNull();
                    expect(screen.queryByText('mutating')).not.toBeNull();
                },
                { timeout: 4000 }
            );
            await waitFor(
                () => {
                    expect(screen.queryByText('success')).toBeNull();
                    expect(
                        screen.queryByText('something went wrong')
                    ).not.toBeNull();
                    expect(screen.queryByText('Hello')).not.toBeNull();
                    expect(screen.queryByText('World')).not.toBeNull();
                    expect(screen.queryByText('mutating')).toBeNull();
                },
                { timeout: 4000 }
            );
        });
        it('when optimistic, displays result and success side effects right away', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {});
            render(<SuccessCaseOptimistic />);
            await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
            screen.getByText('Delete first post').click();
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
        it('when optimistic, displays error and error side effects when dataProvider promise rejects', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {});
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<ErrorCaseOptimistic />);
            await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
            screen.getByText('Delete first post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello')).toBeNull();
                expect(screen.queryByText('World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(
                    screen.queryByText('something went wrong')
                ).not.toBeNull();
                expect(screen.queryByText('Hello')).not.toBeNull();
                expect(screen.queryByText('World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
        it('when undoable, displays result and success side effects right away and fetched on confirm', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {});
            render(<SuccessCaseUndoable />);
            await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
            screen.getByText('Delete first post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello')).toBeNull();
                expect(screen.queryByText('World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            screen.getByText('Confirm').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello')).toBeNull();
                expect(screen.queryByText('World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(
                () => {
                    expect(screen.queryByText('success')).not.toBeNull();
                    expect(screen.queryByText('Hello')).toBeNull();
                    expect(screen.queryByText('World')).not.toBeNull();
                    expect(screen.queryByText('mutating')).toBeNull();
                },
                { timeout: 4000 }
            );
        });
        it('when undoable, displays result and success side effects right away and reverts on cancel', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {});
            render(<SuccessCaseUndoable />);
            await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
            screen.getByText('Delete first post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello')).toBeNull();
                expect(screen.queryByText('World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            screen.getByText('Cancel').click();
            await waitFor(() => {
                expect(screen.queryByText('Hello')).not.toBeNull();
                expect(screen.queryByText('World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
        it('when undoable, displays result and success side effects right away and reverts on error', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {});
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<ErrorCaseUndoable />);
            await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
            screen.getByText('Delete first post').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello')).toBeNull();
                expect(screen.queryByText('World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            screen.getByText('Confirm').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello')).toBeNull();
                expect(screen.queryByText('World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(
                () => {
                    expect(screen.queryByText('success')).toBeNull();
                    expect(screen.queryByText('Hello')).not.toBeNull();
                    expect(screen.queryByText('World')).not.toBeNull();
                    expect(screen.queryByText('mutating')).toBeNull();
                },
                { timeout: 4000 }
            );
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
                delete: jest.fn(() =>
                    Promise.resolve({ data: { id: 1 } } as any)
                ),
            } as any;
            let localDeleteOne;
            const Dummy = () => {
                const [deleteOne] = useDelete('foo', {
                    id: 1,
                    previousData: { id: 1, bar: 'bar' },
                });
                localDeleteOne = deleteOne;
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
            localDeleteOne('foo', {
                id: 1,
                previousData: { id: 1, bar: 'bar' },
            });
            await waitFor(() => {
                expect(dataProvider.delete).toHaveBeenCalledWith('foo', {
                    id: 1,
                    previousData: { id: 1, bar: 'bar' },
                });
            });
            await waitFor(() => {
                expect(queryClient.getQueryData(['foo', 'getList'])).toEqual({
                    data: [{ id: 2, bar: 'bar' }],
                    total: 1,
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
                delete: jest.fn(() =>
                    Promise.resolve({ data: { id: 1 } } as any)
                ),
            } as any;
            let localDeleteOne;
            const Dummy = () => {
                const [deleteOne] = useDelete('foo', {
                    id: 1,
                    previousData: { id: 1, bar: 'bar' },
                });
                localDeleteOne = deleteOne;
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
            localDeleteOne('foo', {
                id: 1,
                previousData: { id: 1, bar: 'bar' },
            });
            await waitFor(() => {
                expect(dataProvider.delete).toHaveBeenCalledWith('foo', {
                    id: 1,
                    previousData: { id: 1, bar: 'bar' },
                });
            });
            await waitFor(() => {
                expect(queryClient.getQueryData(['foo', 'getList'])).toEqual({
                    data: [{ id: 2, bar: 'bar' }],
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
                delete: jest.fn(() =>
                    Promise.resolve({ data: { id: 1 } } as any)
                ),
            } as any;
            let localDeleteOne;
            const Dummy = () => {
                const [deleteOne] = useDelete('foo', {
                    id: 1,
                    previousData: { id: 1, bar: 'bar' },
                });
                localDeleteOne = deleteOne;
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
            localDeleteOne('foo', {
                id: 1,
                previousData: { id: 1, bar: 'bar' },
            });
            await waitFor(() => {
                expect(dataProvider.delete).toHaveBeenCalledWith('foo', {
                    id: 1,
                    previousData: { id: 1, bar: 'bar' },
                });
            });
            await waitFor(() => {
                expect(
                    queryClient.getQueryData(['foo', 'getInfiniteList'])
                ).toEqual({
                    pages: [
                        {
                            data: [{ id: 2, bar: 'bar' }],
                            total: 1,
                        },
                    ],
                    pageParams: [],
                });
            });
        });
    });
});
