import * as React from 'react';
import { QueryClient } from 'react-query';
import { useInfiniteGetList } from '..';

import { CoreAdminContext } from '../core';

export default { title: 'ra-core/dataProvider/useInfiniteGetList' };

export const UseInfiniteListCore = () => {
    const posts = [
        { id: 1, title: 'Hello' },
        { id: 2, title: 'World' },
        { id: 3, title: 'How' },
        { id: 4, title: 'are' },
        { id: 5, title: 'you' },
        { id: 6, title: 'today' },
        { id: 7, title: '?' },
    ];
    const dataProvider = {
        getList: (resource, params) => {
            return Promise.resolve({
                data: posts.slice(
                    (params.pagination.page - 1) * params.pagination.perPage,
                    (params.pagination.page - 1) * params.pagination.perPage +
                        params.pagination.perPage
                ),
                total: posts.length,
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={new QueryClient()}
            dataProvider={dataProvider}
        >
            <UseInfiniteComponent />
        </CoreAdminContext>
    );
};

export const UseInfiniteComponent = ({
    resource = 'posts',
    pagination = { page: 1, perPage: 1 },
    sort = { field: 'id', order: 'DESC' },
    filter = {},
    options = {},
    meta = undefined,
    callback = null,
    ...rest
}) => {
    const { data, fetchNextPage, hasNextPage } = useInfiniteGetList(
        resource,
        { pagination, sort, filter, meta },
        options
    );

    return (
        <>
            <ul>
                {data?.pages.map(page => {
                    return page.data.map(post => (
                        <li key={post.id}>{post.title}</li>
                    ));
                })}
            </ul>
            <div>
                <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
                    Refetch
                </button>
            </div>
        </>
    );
};
