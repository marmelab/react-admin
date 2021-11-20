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
                const { mutate } = useUpdate();
                localUpdate = mutate;
                return <span />;
            };

            renderWithRedux(
                <QueryClientProvider client={new QueryClient()}>
                    <DataProviderContext.Provider value={dataProvider}>
                        <Dummy />
                    </DataProviderContext.Provider>
                </QueryClientProvider>
            );
            localUpdate({
                resource: 'foo',
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
                const { mutate } = useUpdate({
                    resource: 'foo',
                    id: 1,
                    data: { bar: 'baz' },
                    previousData: { id: 1, bar: 'bar' },
                });
                localUpdate = mutate;
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
                const { mutate } = useUpdate({
                    resource: 'foo',
                    id: 1,
                    data: { bar: 'baz' },
                    previousData: { id: 1, bar: 'bar' },
                });
                localUpdate = mutate;
                return <span />;
            };

            renderWithRedux(
                <QueryClientProvider client={new QueryClient()}>
                    <DataProviderContext.Provider value={dataProvider}>
                        <Dummy />
                    </DataProviderContext.Provider>
                </QueryClientProvider>
            );
            localUpdate({ data: { foo: 456 } });
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
                const { mutate, data } = useUpdate<Product>();
                localUpdate = mutate;
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
            localUpdate({
                resource: 'products',
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
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).not.toBeNull();
                expect(screen.queryByText('Hello World')).not.toBeNull();
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
            });
            await waitFor(() => {
                expect(screen.queryByText('success')).toBeNull();
                expect(
                    screen.queryByText('something went wrong')
                ).not.toBeNull();
                expect(screen.queryByText('Hello World')).toBeNull();
            });
        });
    });
});
