import * as React from 'react';
import { waitFor, render } from '@testing-library/react';
import expect from 'expect';

import { CoreAdminContext } from '../core';
import { testDataProvider } from './testDataProvider';
import { useDeleteMany } from './useDeleteMany';

describe('useDeleteMany', () => {
    it('returns a callback that can be used with update arguments', async () => {
        const dataProvider = testDataProvider({
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany();
            localDeleteMany = deleteMany;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteMany('foo', { ids: [1, 2] });
        await waitFor(() => {
            expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
            });
        });
    });

    it('returns a callback that can be used with no arguments', async () => {
        const dataProvider = testDataProvider({
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany('foo', { ids: [1, 2] });
            localDeleteMany = deleteMany;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteMany();
        await waitFor(() => {
            expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
            });
        });
    });

    it('uses call time params over hook time params', async () => {
        const dataProvider = testDataProvider({
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany('foo', { ids: [1, 2] });
            localDeleteMany = deleteMany;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteMany('foo', { ids: [3, 4] });
        await waitFor(() => {
            expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                ids: [3, 4],
            });
        });
    });

    it('accepts a meta parameter', async () => {
        const dataProvider = testDataProvider({
            deleteMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localDeleteMany;
        const Dummy = () => {
            const [deleteMany] = useDeleteMany();
            localDeleteMany = deleteMany;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localDeleteMany('foo', { ids: [1, 2], meta: { hello: 'world' } });
        await waitFor(() => {
            expect(dataProvider.deleteMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
                meta: { hello: 'world' },
            });
        });
    });
});
