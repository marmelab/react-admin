import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { QueryClient } from 'react-query';

import { CoreAdminContext } from '../core';
import { Record } from '../types';
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

            render(
                <CoreAdminContext
                    dataProvider={dataProvider}
                    queryClient={new QueryClient()}
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
                <CoreAdminContext
                    dataProvider={dataProvider}
                    queryClient={new QueryClient()}
                >
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
                <CoreAdminContext
                    dataProvider={dataProvider}
                    queryClient={new QueryClient()}
                >
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
            render(
                <CoreAdminContext
                    dataProvider={dataProvider}
                    queryClient={new QueryClient()}
                >
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
            jest.spyOn(console, 'log').mockImplementation(() => {});
            render(<SuccessCasePessimistic />);
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
            render(<ErrorCasePessimistic />);
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
            render(<SuccessCaseOptimistic />);
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
            render(<ErrorCaseOptimistic />);
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
            render(<SuccessCaseUndoable />);
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
            render(<SuccessCaseUndoable />);
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
            render(<ErrorCaseUndoable />);
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
