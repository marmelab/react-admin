import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import expect from 'expect';

import { CoreAdminContext } from '../core';
import { Record } from '../types';
import { testDataProvider } from './testDataProvider';
import { useDelete } from './useDelete';

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

    it('returns data typed based on the parametric type', async () => {
        interface Product extends Record {
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

    describe('pessimistic mode', () => {
        it('should execute success side effects on success', async () => {
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
        it('should execute error side effects on error', async () => {
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
});
