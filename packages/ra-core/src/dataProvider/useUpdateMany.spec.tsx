import * as React from 'react';
import { renderWithRedux } from 'ra-test';
import expect from 'expect';

import { DataProvider } from '../types';
import DataProviderContext from './DataProviderContext';
import useUpdateMany from './useUpdateMany';

describe('useUpdateMany', () => {
    it('returns a callback that can be used with update arguments', () => {
        const dataProvider: Partial<DataProvider> = {
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        };
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany();
            localUpdateMany = updateMany;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localUpdateMany('foo', [1, 2], { bar: 'baz' });
        expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
            ids: [1, 2],
            data: { bar: 'baz' },
        });
    });

    it('returns a callback that can be used with mutation payload', () => {
        const dataProvider: Partial<DataProvider> = {
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        };
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany();
            localUpdateMany = updateMany;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localUpdateMany({
            type: 'updateMany',
            resource: 'foo',
            payload: {
                ids: [1, 2],
                data: { bar: 'baz' },
            },
        });
        expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
            ids: [1, 2],
            data: { bar: 'baz' },
        });
    });

    it('returns a callback that can be used with no arguments', () => {
        const dataProvider: Partial<DataProvider> = {
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        };
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany('foo', [1, 2], { bar: 'baz' });
            localUpdateMany = updateMany;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localUpdateMany();
        expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
            ids: [1, 2],
            data: { bar: 'baz' },
        });
    });

    it('merges hook call time and callback call time queries', () => {
        const dataProvider: Partial<DataProvider> = {
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        };
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany('foo', [1, 2], { bar: 'baz' });
            localUpdateMany = updateMany;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localUpdateMany({ payload: { data: { foo: 456 } } });
        expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
            ids: [1, 2],
            data: { bar: 'baz', foo: 456 },
        });
    });
});
