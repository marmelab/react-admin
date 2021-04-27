import * as React from 'react';
import { renderWithRedux } from 'ra-test';
import { waitFor } from '@testing-library/react';
import expect from 'expect';

import { DataProvider, Record } from '../types';
import DataProviderContext from './DataProviderContext';
import useUpdate from './useUpdate';

describe('useUpdate', () => {
    it('returns a callback that can be used with update arguments', () => {
        const dataProvider: Partial<DataProvider> = {
            update: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        };
        let localUpdate;
        const Dummy = () => {
            const [update] = useUpdate();
            localUpdate = update;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localUpdate('foo', 1, { bar: 'baz' }, { id: 1, bar: 'bar' });
        expect(dataProvider.update).toHaveBeenCalledWith('foo', {
            id: 1,
            data: { bar: 'baz' },
            previousData: { id: 1, bar: 'bar' },
        });
    });

    it('returns a callback that can be used with mutation payload', () => {
        const dataProvider: Partial<DataProvider> = {
            update: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        };
        let localUpdate;
        const Dummy = () => {
            const [update] = useUpdate();
            localUpdate = update;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localUpdate({
            type: 'update',
            resource: 'foo',
            payload: {
                id: 1,
                data: { bar: 'baz' },
                previousData: { id: 1, bar: 'bar' },
            },
        });
        expect(dataProvider.update).toHaveBeenCalledWith('foo', {
            id: 1,
            data: { bar: 'baz' },
            previousData: { id: 1, bar: 'bar' },
        });
    });

    it('returns a callback that can be used with no arguments', () => {
        const dataProvider: Partial<DataProvider> = {
            update: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        };
        let localUpdate;
        const Dummy = () => {
            const [update] = useUpdate(
                'foo',
                1,
                { bar: 'baz' },
                { id: 1, bar: 'bar' }
            );
            localUpdate = update;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localUpdate();
        expect(dataProvider.update).toHaveBeenCalledWith('foo', {
            id: 1,
            data: { bar: 'baz' },
            previousData: { id: 1, bar: 'bar' },
        });
    });

    it('merges hook call time and callback call time queries', () => {
        const dataProvider: Partial<DataProvider> = {
            update: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        };
        let localUpdate;
        const Dummy = () => {
            const [update] = useUpdate(
                'foo',
                1,
                { bar: 'baz' },
                { id: 1, bar: 'bar' }
            );
            localUpdate = update;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localUpdate({ payload: { data: { foo: 456 } } });
        expect(dataProvider.update).toHaveBeenCalledWith('foo', {
            id: 1,
            data: { bar: 'baz', foo: 456 },
            previousData: { id: 1, bar: 'bar' },
        });
    });

    it('returns a state typed based on the parametric type', async () => {
        interface Product extends Record {
            sku: string;
        }
        const dataProvider: Partial<DataProvider> = {
            update: jest.fn(() =>
                Promise.resolve({ data: { id: 1, sku: 'abc' } } as any)
            ),
        };
        let localUpdate;
        let sku;
        const Dummy = () => {
            const [update, { data }] = useUpdate<Product>();
            localUpdate = update;
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
        localUpdate('products', 1, { sku: 'abc' }, { id: 1, sku: 'bcd' });
        await waitFor(() => {
            expect(sku).toEqual('abc');
        });
    });
});
