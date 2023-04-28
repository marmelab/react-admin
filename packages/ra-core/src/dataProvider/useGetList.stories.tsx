import * as React from 'react';

import { CoreAdminContext } from '../core';
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
            dataProvider={{
                getList: async () => ({
                    data: [{ id: 1, title: 'foo' }],
                    total: 1,
                }),
            }}
        >
            <UseGetList />
        </CoreAdminContext>
    );
};
