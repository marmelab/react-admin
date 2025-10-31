import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import {
    useMutationWithMutationMode,
    UseMutationWithMutationModeOptions,
} from './useMutationWithMutationMode';
import { CoreAdminContext } from '../core/CoreAdminContext';
import { useDataProvider } from './useDataProvider';
import { DataProvider } from '../types';
import { testDataProvider } from './testDataProvider';

describe('useMutationWithMutationMode', () => {
    type MyDataProvider = DataProvider & {
        updateUserProfile: ({ data }: { data: any }) => Promise<{ data: any }>;
    };

    const useUpdateUserProfile = (
        args?: { data?: any },
        options?: Pick<
            UseMutationWithMutationModeOptions<
                Error,
                { data: any },
                { data?: any }
            >,
            'mutationMode'
        >
    ) => {
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
            getQueryKeys: () => {
                return [];
            },
            ...options,
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

    it('uses the latest params at execution time in optimistic mode', async () => {
        const dataProvider = testDataProvider({
            updateUserProfile: jest.fn(({ data }) =>
                Promise.resolve({ data: { id: 1, ...data } } as any)
            ),
        }) as MyDataProvider;
        const Dummy = () => {
            const [data, setData] = React.useState({ value: 'value1' });
            const [update] = useUpdateUserProfile(
                {
                    data,
                },
                { mutationMode: 'optimistic' }
            );
            return (
                <>
                    <p>{data.value}</p>
                    <button onClick={() => setData({ value: 'value2' })}>
                        Update data
                    </button>
                    <button onClick={() => update()}>Update</button>
                </>
            );
        };

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Dummy />
            </CoreAdminContext>
        );
        fireEvent.click(screen.getByText('Update'));
        // In case of undoable, clicking the _Update data_ button would trigger the mutation
        fireEvent.click(screen.getByText('Update data'));
        await screen.findByText('value2');
        fireEvent.click(screen.getByText('Update'));
        await waitFor(() => {
            expect(dataProvider.updateUserProfile).toHaveBeenCalledWith({
                data: { value: 'value1' },
            });
        });

        // Ensure the next call uses the latest data
        await waitFor(() => {
            expect(dataProvider.updateUserProfile).toHaveBeenCalledWith({
                data: { value: 'value2' },
            });
        });
    });
});
