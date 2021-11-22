import * as React from 'react';
import { renderWithRedux } from 'ra-test';
import { screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { QueryClientProvider, QueryClient } from 'react-query';

import { Record } from '../types';
import DataProviderContext from './DataProviderContext';
import { useUpdate } from './useUpdate';
import {
    ErrorCase as ErrorCasePessimistic,
    SuccessCase as SuccessCasePessimistic,
} from './useUpdate.pessimistic.stories';
import {
    ErrorCase as ErrorCaseOptimistic,
    SuccessCase as SuccessCaseOptimistic,
} from './useUpdate.optimistic.stories';
import {
    ErrorCase as ErrorCaseUndoable,
    SuccessCase as SuccessCaseUndoable,
} from './useUpdate.undoable.stories';

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

            renderWithRedux(
                <QueryClientProvider client={new QueryClient()}>
                    <DataProviderContext.Provider value={dataProvider}>
                        <Dummy />
                    </DataProviderContext.Provider>
                </QueryClientProvider>
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

            renderWithRedux(
                <QueryClientProvider client={new QueryClient()}>
                    <DataProviderContext.Provider value={dataProvider}>
                        <Dummy />
                    </DataProviderContext.Provider>
                </QueryClientProvider>
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

            renderWithRedux(
                <QueryClientProvider client={new QueryClient()}>
                    <DataProviderContext.Provider value={dataProvider}>
                        <Dummy />
                    </DataProviderContext.Provider>
                </QueryClientProvider>
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
    });
    describe('data', () => {
        it('returns a data typed based on the parametric type', async () => {
            interface Product extends Record {
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
            renderWithRedux(
                <QueryClientProvider client={new QueryClient()}>
                    <DataProviderContext.Provider value={dataProvider}>
                        <Dummy />
                    </DataProviderContext.Provider>
                </QueryClientProvider>
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
            jest.spyOn(console, 'log').mockImplementation(() => {});
            renderWithRedux(<SuccessCasePessimistic />);
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
            jest.spyOn(console, 'log').mockImplementation(() => {});
            jest.spyOn(console, 'error').mockImplementation(() => {});
            renderWithRedux(<ErrorCasePessimistic />);
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
            jest.spyOn(console, 'log').mockImplementation(() => {});
            renderWithRedux(<SuccessCaseOptimistic />);
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
            jest.spyOn(console, 'log').mockImplementation(() => {});
            jest.spyOn(console, 'error').mockImplementation(() => {});
            renderWithRedux(<ErrorCaseOptimistic />);
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
        });
        it('when undoable, displays result and success side effects right away and fetched on confirm', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {});
            renderWithRedux(<SuccessCaseUndoable />);
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
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
        it('when undoable, displays result and success side effects right away and reverts on cancel', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {});
            renderWithRedux(<SuccessCaseUndoable />);
            screen.getByText('Update title').click();
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
            screen.getByText('Cancel').click();
            await waitFor(() => {
                expect(screen.queryByText('Hello World')).toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
        it('when undoable,  displays result and success side effects right away and reverts on error', async () => {
            jest.spyOn(console, 'log').mockImplementation(() => {});
            jest.spyOn(console, 'error').mockImplementation(() => {});
            renderWithRedux(<ErrorCaseUndoable />);
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
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(screen.queryByText('Hello World')).toBeNull();
                expect(screen.queryByText('mutating')).toBeNull();
            });
        });
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});
