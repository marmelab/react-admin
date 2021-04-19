import * as React from 'react';
import { renderWithRedux } from 'ra-test';
import { waitFor } from '@testing-library/react';
import expect from 'expect';

import { DataProvider, Record } from '../types';
import DataProviderContext from './DataProviderContext';
import useCreate from './useCreate';

describe('useCreate', () => {
    it('returns a callback that can be used with create arguments', () => {
        const dataProvider: Partial<DataProvider> = {
            create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        };
        let localCreate;
        const Dummy = () => {
            const [create] = useCreate();
            localCreate = create;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localCreate('foo', { bar: 'baz' });
        expect(dataProvider.create).toHaveBeenCalledWith('foo', {
            data: { bar: 'baz' },
        });
    });

    it('returns a callback that can be used with mutation payload', () => {
        const dataProvider: Partial<DataProvider> = {
            create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        };
        let localCreate;
        const Dummy = () => {
            const [create] = useCreate();
            localCreate = create;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localCreate({
            type: 'update',
            resource: 'foo',
            payload: {
                data: { bar: 'baz' },
            },
        });
        expect(dataProvider.create).toHaveBeenCalledWith('foo', {
            data: { bar: 'baz' },
        });
    });

    it('returns a callback that can be used with no arguments', () => {
        const dataProvider: Partial<DataProvider> = {
            create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        };
        let localCreate;
        const Dummy = () => {
            const [create] = useCreate('foo', { bar: 'baz' });
            localCreate = create;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localCreate();
        expect(dataProvider.create).toHaveBeenCalledWith('foo', {
            data: { bar: 'baz' },
        });
    });

    it('merges hook call time and callback call time queries', () => {
        const dataProvider: Partial<DataProvider> = {
            create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
        };
        let localCreate;
        const Dummy = () => {
            const [create] = useCreate('foo', { bar: 'baz' });
            localCreate = create;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localCreate({ payload: { data: { foo: 456 } } });
        expect(dataProvider.create).toHaveBeenCalledWith('foo', {
            data: { bar: 'baz', foo: 456 },
        });
    });

    it('returns a state typed based on the parametric type', async () => {
        interface Product extends Record {
            sku: string;
        }
        const dataProvider: Partial<DataProvider> = {
            create: jest.fn(() =>
                Promise.resolve({ data: { id: 1, sku: 'abc' } } as any)
            ),
        };
        let localCreate;
        let sku;
        const Dummy = () => {
            const [create, { data }] = useCreate<Product>();
            localCreate = create;
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
        localCreate('products', { sku: 'abc' });
        await waitFor(() => {
            expect(sku).toEqual('abc');
        });
    });
});
