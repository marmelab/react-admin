import * as React from 'react';
import { QueryClient } from '@tanstack/react-query';

import { CoreAdminContext } from '../core';
import { useUpdateMany } from './useUpdateMany';
import { useGetList } from './useGetList';

export default { title: 'ra-core/dataProvider/useUpdateMany' };

export const UndefinedValues = () => {
    const data = [
        { id: 1, title: 'foo' },
        { id: 2, title: 'bar' },
    ];
    const dataProvider = {
        getList: async () => ({ data, total: 2 }),
        updateMany: () => new Promise(() => {}), // never resolve to see only optimistic update
    } as any;
    return (
        <CoreAdminContext
            queryClient={new QueryClient()}
            dataProvider={dataProvider}
        >
            <UndefinedValuesCore />
        </CoreAdminContext>
    );
};

const UndefinedValuesCore = () => {
    const { data } = useGetList('posts');
    const [updateMany, { isPending }] = useUpdateMany();
    const handleClick = () => {
        updateMany(
            'posts',
            {
                ids: [1, 2],
                data: { id: undefined, title: 'world' },
            },
            { mutationMode: 'optimistic' }
        );
    };
    return (
        <>
            <pre>{JSON.stringify(data)}</pre>
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Update title
                </button>
            </div>
        </>
    );
};
