import * as React from 'react';
import { renderWithRedux } from 'ra-test';
import expect from 'expect';

import { DataProvider } from '../types';
import DataProviderContext from './DataProviderContext';
import useDeleteMany from './useDeleteMany';

describe('useDeleteMany', () => {
    it('returns a callback that can be used with update arguments', () => {
        const dataProvider: Partial<DataProvider> = {
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        };
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany();
            localDeleteMany = deleteMany;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localDeleteMany('foo', [1, 2]);
        expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
            ids: [1, 2],
        });
    });

    it('returns a callback that can be used with mutation payload', () => {
        const dataProvider: Partial<DataProvider> = {
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        };
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany();
            localDeleteMany = deleteMany;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localDeleteMany({
            type: 'deleteMany',
            resource: 'foo',
            payload: {
                ids: [1, 2],
            },
        });
        expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
            ids: [1, 2],
        });
    });

    it('returns a callback that can be used with no arguments', () => {
        const dataProvider: Partial<DataProvider> = {
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        };
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany('foo', [1, 2]);
            localDeleteMany = deleteMany;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localDeleteMany();
        expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
            ids: [1, 2],
        });
    });

    it('merges hook call time and callback call time queries', () => {
        const dataProvider: Partial<DataProvider> = {
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        };
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany('foo', [1, 2]);
            localDeleteMany = deleteMany;
            return <span />;
        };

        renderWithRedux(
            // @ts-expect-error
            <DataProviderContext.Provider value={dataProvider}>
                <Dummy />
            </DataProviderContext.Provider>
        );
        localDeleteMany({ payload: { ids: [3, 4] } });
        expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
            ids: [3, 4],
        });
    });
});
