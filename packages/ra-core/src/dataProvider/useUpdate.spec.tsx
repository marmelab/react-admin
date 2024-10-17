import * as React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';

import { CoreAdminContext } from '../core';
import { RaRecord } from '../types';
import { useUpdate } from './useUpdate';
import {
    ErrorCase as ErrorCasePessimistic,
    SuccessCase as SuccessCasePessimistic,
    WithMiddlewaresSuccess as WithMiddlewaresSuccessPessimistic,
    WithMiddlewaresError as WithMiddlewaresErrorPessimistic,
} from './useUpdate.pessimistic.stories';
import {
    ErrorCase as ErrorCaseOptimistic,
    SuccessCase as SuccessCaseOptimistic,
    WithMiddlewaresSuccess as WithMiddlewaresSuccessOptimistic,
    WithMiddlewaresError as WithMiddlewaresErrorOptimistic,
    UndefinedValues as UndefinedValuesOptimistic,
} from './useUpdate.optimistic.stories';
import {
    ErrorCase as ErrorCaseUndoable,
    SuccessCase as SuccessCaseUndoable,
    WithMiddlewaresSuccess as WithMiddlewaresSuccessUndoable,
    WithMiddlewaresError as WithMiddlewaresErrorUndoable,
} from './useUpdate.undoable.stories';
import { QueryClient } from '@tanstack/react-query';

describe('useUpdate', () => {
    describe('mutate', () => {
        it('returns a callback that can be used with update arguments', async () => {
            const dataProvider = {
                update: jest.fn(() =>
                    Promise.resolve({ data: { id: 1 } } as any)
                ),
            } as any;
            let localUpdate;
            const Dummy = () => {
                const [update] = useUpdate();
                localUpdate = update;
                return <span />;
            };

            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Dummy />
                </CoreAdminContext>
            );
            localUpdate('foo', {
                id: 1,
                data: { bar: 'baz' },
                previousData: { id: 1, bar: 'bar' },
            });
            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith('foo', {
                    id: 1,
                    data: { bar: 'baz' },
                    previousData: { id: 1, bar: 'bar' },
                });
            });
        });

        it('returns a callback that can be used with no arguments', async () => {
            const dataProvider = {
                update: jest.fn(() =>
                    Promise.resolve({ data: { id: 1 } } as any)
                ),
            } as any;
            let localUpdate;
            const Dummy = () => {
                const [update] = useUpdate('foo', {
                    id: 1,
                    data: { bar: 'baz' },
                    previousData: { id: 1, bar: 'bar' },
                });
                localUpdate = update;
                return <span />;
            };

            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Dummy />
                </CoreAdminContext>
            );
            localUpdate();
            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith('foo', {
                    id: 1,
                    data: { bar: 'baz' },
                    previousData: { id: 1, bar: 'bar' },
                });
            });
        });

        it('accepts falsy value that are not null nor undefined as the record id', async () => {
            const dataProvider = {
                update: jest.fn(() =>
                    Promise.resolve({ data: { id: 1 } } as any)
                ),
            } as any;
            let localUpdate;
            const Dummy = () => {
                const [update] = useUpdate('foo', {
                    id: 0,
                    data: { bar: 'baz' },
                    previousData: { id: 0, bar: 'bar' },
                });
                localUpdate = update;
                return <span />;
            };

            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Dummy />
                </CoreAdminContext>
            );
            localUpdate();
            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith('foo', {
                    id: 0,
                    data: { bar: 'baz' },
                    previousData: { id: 0, bar: 'bar' },
                });
            });
        });

        it('replaces hook call time params by and callback time params', async () => {
            const dataProvider = {
                update: jest.fn(() =>
                    Promise.resolve({ data: { id: 1 } } as any)
                ),
            } as any;
            let localUpdate;
            const Dummy = () => {
                const [update] = useUpdate('foo', {
                    id: 1,
                    data: { bar: 'baz' },
                    previousData: { id: 1, bar: 'bar' },
                });
                localUpdate = update;
                return <span />;
            };

            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Dummy />
                </CoreAdminContext>
            );
            localUpdate(undefined, { data: { foo: 456 } });
            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith('foo', {
                    id: 1,
                    data: { foo: 456 },
                    previousData: { id: 1, bar: 'bar' },
                });
            });
        });

        it('accepts a meta parameter', async () => {
            const dataProvider = {
                update: jest.fn(() =>
                    Promise.resolve({ data: { id: 1 } } as any)
                ),
            } as any;
            let localUpdate;
            const Dummy = () => {
                const [update] = useUpdate();
                localUpdate = update;
                return <span />;
            };

            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Dummy />
                </CoreAdminContext>
            );
            localUpdate('foo', {
                id: 1,
                data: { bar: 'baz' },
                previousData: { id: 1, bar: 'bar' },
                meta: { hello: 'world' },
            });
            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith('foo', {
                    id: 1,
                    data: { bar: 'baz' },
                    previousData: { id: 1, bar: 'bar' },
                    meta: { hello: 'world' },
                });
            });
        });
    });
    describe('data', () => {
        it('returns a data typed based on the parametric type', async () => {
            interface Product extends RaRecord {
                sku: string;
            }
            const dataProvider = {
                update: jest.fn(() =>
                    Promise.resolve({ data: { id: 1, sku: 'abc' } } as any)
                ),
            } as any;
            let localUpdate;
            let sku;
            const Dummy = () => {
                const [update, { data }] = useUpdate<Product>();
                localUpdate = update;
                sku = data && data.sku;
                return <span />;
            };
            render(
                <CoreAdminContext dataProvider={dataProvider}>
                    <Dummy />
                </CoreAdminContext>
            );
            expect(sku).toBeUndefined();
            localUpdate('products', {
                id: 1,
                data: { sku: 'abc' },
                previousData: { id: 1, sku: 'bcd' },
            });
            await waitFor(() => {
                expect(sku).toEqual('abc');
            });
        });
    });

    describe('mutationMode', () => {
        it('when pessimistic, displays result and success side effects when dataProvider promise resolves', async () => {
            render(<SuccessCasePessimistic timeout={10} />);
            screen.getByText('Update title').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(screen.queryByText('Hello World')).toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
        it('when pessimistic, displays error and error side effects when dataProvider promise rejects', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<ErrorCasePessimistic timeout={10} />);
            screen.getByText('Update title').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(screen.queryByText('something went wrong')).toBeNull();
                expect(screen.queryByText('Hello World')).toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(
                    screen.queryByText('something went wrong')
                ).not.toBeNull();
                expect(screen.queryByText('Hello World')).toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
        it('when optimistic, displays result and success side effects right away', async () => {
            render(<SuccessCaseOptimistic timeout={10} />);
            screen.getByText('Update title').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).not.toBeNull();
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
        it('when optimistic, displays error and error side effects when dataProvider promise rejects', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<ErrorCaseOptimistic timeout={10} />);
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
                expect(screen.queryByText('Hello World')).toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            await screen.findByText('Hello');
        });
        it('when optimistic, does not erase values if the payload contains undefined values', async () => {
            render(<UndefinedValuesOptimistic />);
            await screen.findByText('{"id":1,"title":"Hello"}');
            screen.getByText('Update title').click();
            await screen.findByText('{"id":1,"title":"world"}'); // and not just {"title":"world"}
        });
        it('when undoable, displays result and success side effects right away and fetched on confirm', async () => {
            render(<SuccessCaseUndoable timeout={10} />);
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
            expect(screen.queryByText('Hello World')).not.toBeNull();
        });
        it('when undoable, displays result and success side effects right away and reverts on cancel', async () => {
            render(<SuccessCaseUndoable timeout={10} />);
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
        it('when undoable, displays result and success side effects right away and reverts on error', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<ErrorCaseUndoable />);
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
                expect(screen.queryByText('Hello World')).toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
    });
    describe('query cache', () => {
        it('updates getList query cache when dataProvider promise resolves', async () => {
            const queryClient = new QueryClient();
            queryClient.setQueryData(['foo', 'getList'], {
                data: [{ id: 1, bar: 'bar' }],
                total: 1,
            });
            const dataProvider = {
                update: jest.fn(() =>
                    Promise.resolve({ data: { id: 1, bar: 'baz' } } as any)
                ),
            } as any;
            let localUpdate;
            const Dummy = () => {
                const [update] = useUpdate();
                localUpdate = update;
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
            localUpdate('foo', {
                id: 1,
                data: { bar: 'baz' },
                previousData: { id: 1, bar: 'bar' },
            });
            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith('foo', {
                    id: 1,
                    data: { bar: 'baz' },
                    previousData: { id: 1, bar: 'bar' },
                });
            });
            await waitFor(() => {
                expect(queryClient.getQueryData(['foo', 'getList'])).toEqual({
                    data: [{ id: 1, bar: 'baz' }],
                    total: 1,
                });
            });
        });
        it('updates getList query cache with pageInfo when dataProvider promise resolves', async () => {
            const queryClient = new QueryClient();
            queryClient.setQueryData(['foo', 'getList'], {
                data: [{ id: 1, bar: 'bar' }],
                pageInfo: {
                    hasPreviousPage: false,
                    hasNextPage: true,
                },
            });
            const dataProvider = {
                update: jest.fn(() =>
                    Promise.resolve({ data: { id: 1, bar: 'baz' } } as any)
                ),
            } as any;
            let localUpdate;
            const Dummy = () => {
                const [update] = useUpdate();
                localUpdate = update;
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
            localUpdate('foo', {
                id: 1,
                data: { bar: 'baz' },
                previousData: { id: 1, bar: 'bar' },
            });
            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith('foo', {
                    id: 1,
                    data: { bar: 'baz' },
                    previousData: { id: 1, bar: 'bar' },
                });
            });
            await waitFor(() => {
                expect(queryClient.getQueryData(['foo', 'getList'])).toEqual({
                    data: [{ id: 1, bar: 'baz' }],
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
                pages: [{ data: [{ id: 1, bar: 'bar' }], total: 1 }],
                pageParams: [],
            });
            const dataProvider = {
                update: jest.fn(() =>
                    Promise.resolve({ data: { id: 1, bar: 'baz' } } as any)
                ),
            } as any;
            let localUpdate;
            const Dummy = () => {
                const [update] = useUpdate();
                localUpdate = update;
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
            localUpdate('foo', {
                id: 1,
                data: { bar: 'baz' },
                previousData: { id: 1, bar: 'bar' },
            });
            await waitFor(() => {
                expect(dataProvider.update).toHaveBeenCalledWith('foo', {
                    id: 1,
                    data: { bar: 'baz' },
                    previousData: { id: 1, bar: 'bar' },
                });
            });
            await waitFor(() => {
                expect(
                    queryClient.getQueryData(['foo', 'getInfiniteList'])
                ).toEqual({
                    pages: [{ data: [{ id: 1, bar: 'baz' }], total: 1 }],
                    pageParams: [],
                });
            });
        });
    });
    describe('middlewares', () => {
        it('when pessimistic, it accepts middlewares and displays result and success side effects when dataProvider promise resolves', async () => {
            render(<WithMiddlewaresSuccessPessimistic timeout={10} />);
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
                    screen.queryByText('Hello World from middleware')
                ).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });

        it('when pessimistic, it accepts middlewares and displays error and error side effects when dataProvider promise rejects', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            render(<WithMiddlewaresErrorPessimistic timeout={10} />);
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
            render(<WithMiddlewaresSuccessOptimistic timeout={10} />);
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
            render(<WithMiddlewaresErrorOptimistic timeout={10} />);
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
            render(<WithMiddlewaresSuccessUndoable timeout={10} />);
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
            render(<WithMiddlewaresSuccessUndoable timeout={10} />);
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
            render(<WithMiddlewaresErrorUndoable />);
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
