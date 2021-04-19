import * as React from 'react';
import { renderWithRedux } from 'ra-test';
import { waitFor } from '@testing-library/react';
import expect from 'expect';

import { DataProvider, Record } from '../types';
import DataProviderContext from './DataProviderContext';
import useDelete from './useDelete';

describe('useDelete', () => {
    it('returns a callback that can be used with deleteOne arguments', () => {
        const dataProvider: Partial<DataProvider> = {
            delete: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        };
        let localDeleteOne;
        const Dummy = () => {
            const [deleteOne] = useDelete();
            localDeleteOne = deleteOne;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localDeleteOne('foo', 1, { id: 1, bar: 'bar' });
        expect(dataProvider.delete).toHaveBeenCalledWith('foo', {
            id: 1,
            previousData: { id: 1, bar: 'bar' },
        });
    });

    it('returns a callback that can be used with mutation payload', () => {
        const dataProvider: Partial<DataProvider> = {
            delete: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        };
        let localDeleteOne;
        const Dummy = () => {
            const [deleteOne] = useDelete();
            localDeleteOne = deleteOne;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localDeleteOne({
            type: 'delete',
            resource: 'foo',
            payload: {
                id: 1,
                previousData: { id: 1, bar: 'bar' },
            },
        });
        expect(dataProvider.delete).toHaveBeenCalledWith('foo', {
            id: 1,
            previousData: { id: 1, bar: 'bar' },
        });
    });

    it('returns a callback that can be used with no arguments', () => {
        const dataProvider: Partial<DataProvider> = {
            delete: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        };
        let localDeleteOne;
        const Dummy = () => {
            const [deleteOne] = useDelete('foo', 1, { id: 1, bar: 'bar' });
            localDeleteOne = deleteOne;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localDeleteOne();
        expect(dataProvider.delete).toHaveBeenCalledWith('foo', {
            id: 1,
            previousData: { id: 1, bar: 'bar' },
        });
    });

    it('merges hook call time and callback call time queries', () => {
        const dataProvider: Partial<DataProvider> = {
            delete: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        };
        let localDeleteOne;
        const Dummy = () => {
            const [deleteOne] = useDelete('foo', 1, { id: 1, bar: 'bar' });
            localDeleteOne = deleteOne;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localDeleteOne({ payload: { previousData: { foo: 456 } } });
        expect(dataProvider.delete).toHaveBeenCalledWith('foo', {
            id: 1,
            previousData: { id: 1, bar: 'bar', foo: 456 },
        });
    });

    it('returns a state typed based on the parametric type', async () => {
        interface Product extends Record {
            sku: string;
        }
        const dataProvider: Partial<DataProvider> = {
            delete: jest.fn(() =>
                Promise.resolve({ data: { id: 1, sku: 'abc' } } as any)
            ),
        };
        let localDeleteOne;
        let sku;
        const Dummy = () => {
            const [deleteOne, { data }] = useDelete<Product>();
            localDeleteOne = deleteOne;
            sku = data && data.sku;
            return <span />;
        };
        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        expect(sku).toBeNull();
        localDeleteOne('products', 1, { id: 1, sku: 'bcd' });
        await waitFor(() => {
            expect(sku).toEqual('abc');
        });
    });
});
