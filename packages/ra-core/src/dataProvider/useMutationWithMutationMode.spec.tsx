import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import expect from 'expect';
import { useMutationWithMutationMode } from './useMutationWithMutationMode';
import { CoreAdminContext } from '../core/CoreAdminContext';
import { useDataProvider } from './useDataProvider';
import { DataProvider } from '../types';
import { testDataProvider } from './testDataProvider';

describe('useMutationWithMutationMode', () => {
    type MyDataProvider = DataProvider & {
        updateUserProfile: ({ data }: { data: any }) => Promise<{ data: any }>;
    };

    const useUpdateUserProfile = (args?: { data?: any }) => {
        const dataProvider = useDataProvider<MyDataProvider>();
        return useMutationWithMutationMode<
            Error,
            { data: any },
            { data?: any }
        >(args, {
            mutationFn: ({ data }) => {
                if (!data) {
                    throw new Error('data is required');
                }
                return dataProvider
                    .updateUserProfile({ data })
                    .then(({ data }) => data);
            },
            updateCache: ({ data }) => {
                return data;
            },
            getSnapshot: () => {
                return [];
            },
        });
    };

    it('returns a callback that can be used with update arguments', async () => {
        const dataProvider = testDataProvider({
            updateUserProfile: jest.fn(({ data }) =>
                Promise.resolve({ data: { id: 1, ...data } } as any)
            ),
        }) as MyDataProvider;
        let localUpdate;
        const Dummy = () => {
            const [update] = useUpdateUserProfile();
            localUpdate = update;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localUpdate({
            data: { bar: 'baz' },
        });
        await waitFor(() => {
            expect(dataProvider.updateUserProfile).toHaveBeenCalledWith({
                data: { bar: 'baz' },
            });
        });
    });

    it('returns a callback that can be used with no arguments', async () => {
        const dataProvider = testDataProvider({
            updateUserProfile: jest.fn(({ data }) =>
                Promise.resolve({ data: { id: 1, ...data } } as any)
            ),
        }) as MyDataProvider;
        let localUpdate;
        const Dummy = () => {
            const [update] = useUpdateUserProfile({
                data: { bar: 'baz' },
            });
            localUpdate = update;
            return <span />;
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        localUpdate();
        await waitFor(() => {
            expect(dataProvider.updateUserProfile).toHaveBeenCalledWith({
                data: { bar: 'baz' },
            });
        });
    });
});
