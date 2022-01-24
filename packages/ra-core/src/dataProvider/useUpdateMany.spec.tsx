import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import expect from 'expect';

import { testDataProvider } from './testDataProvider';
import { CoreAdminContext } from '../core';
import { useUpdateMany } from './useUpdateMany';

describe('useUpdateMany', () => {
    it('returns a callback that can be used with update arguments', async () => {
        const dataProvider = testDataProvider({
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany();
            localUpdateMany = updateMany;
            return <span />;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localUpdateMany('foo', { ids: [1, 2], data: { bar: 'baz' } });
        await waitFor(() => {
            expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
                data: { bar: 'baz' },
            });
        });
    });

    it('returns a callback that can be used with no arguments', async () => {
        const dataProvider = testDataProvider({
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany('foo', {
                ids: [1, 2],
                data: { bar: 'baz' },
            });
            localUpdateMany = updateMany;
            return <span />;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localUpdateMany();
        await waitFor(() => {
            expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
                data: { bar: 'baz' },
            });
        });
    });

    it('uses callback call time params rather than hook call time params', async () => {
        const dataProvider = testDataProvider({
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany('foo', {
                ids: [1, 2],
                data: { bar: 'baz' },
            });
            localUpdateMany = updateMany;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localUpdateMany('foo', { data: { foo: 456 } });
        await waitFor(() => {
            expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
                data: { foo: 456 },
            });
        });
    });

    it('accepts a meta parameter', async () => {
        const dataProvider = testDataProvider({
            updateMany: jest.fn(() => Promise.resolve({ data: [1, 2] } as any)),
        });
        let localUpdateMany;
        const Dummy = () => {
            const [updateMany] = useUpdateMany();
            localUpdateMany = updateMany;
            return <span />;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localUpdateMany('foo', {
            ids: [1, 2],
            data: { bar: 'baz' },
            meta: { hello: 'world' },
        });
        await waitFor(() => {
            expect(dataProvider.updateMany).toHaveBeenCalledWith('foo', {
                ids: [1, 2],
                data: { bar: 'baz' },
                meta: { hello: 'world' },
            });
        });
    });
});
