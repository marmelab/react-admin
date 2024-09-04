import * as React from 'react';

import { CoreAdminContext } from '../core';
import { testDataProvider } from './testDataProvider';
import { useGetList } from './useGetList';

export default {
    title: 'ra-core/dataProvider/useGetList',
};

const UseGetList = () => {
    const hookValue = useGetList('posts');
    return <pre>{JSON.stringify(hookValue, undefined, '  ')}</pre>;
};

export const NoArgs = () => {
    return (
        <CoreAdminContext
            dataProvider={testDataProvider({
                getList: async () => ({
                    data: [{ id: 1, title: 'foo' } as any],
                    total: 1,
                }),
            })}
        >
            <UseGetList />
        </CoreAdminContext>
    );
};

export const WithResponseMetadata = () => {
    return (
        <CoreAdminContext
            dataProvider={testDataProvider({
                getList: async () => ({
                    data: [{ id: 1, title: 'foo' } as any],
                    total: 1,
                    meta: { facets: { tags: [{ value: 'bar', count: 2 }] } },
                }),
            })}
        >
            <UseGetList />
        </CoreAdminContext>
    );
};
