import type { QueryClient } from '@tanstack/react-query';

export type PopulateQueryCacheOptions = {
    data: Record<string, any[]>;
    queryClient: QueryClient;
    staleTime?: number;
};

/**
 * Populate react-query's query cache with a data dictionary
 *
 * @example
 * const data = {
 *    posts: [{ id: 1, title: 'Hello, world' }, { id: 2, title: 'FooBar' }],
 *    comments: [{ id: 1, post_id: 1, body: 'Nice post!' }],
 * };
 * populateQueryCache({ data, queryClient });
 * // setQueryData(['posts', 'getOne', { id: '1' }], { id: 1, title: 'Hello, world' });
 * // setQueryData(['posts', 'getOne', { id: '2' }], { id: 2, title: 'FooBar' });
 * // setQueryData(['posts', 'getMany', { ids: ['1', '2'] }], [{ id: 1, title: 'Hello, world' }, { id: 2, title: 'FooBar' }]);
 * // setQueryData(['comments', 'getOne', { id: '1' }], { id: 1, post_id: 1, body: 'Nice post!' });
 * // setQueryData(['comments', 'getMany', { ids: ['1'] }], [{ id: 1, post_id: 1, body: 'Nice post!' });
 */
export const populateQueryCache = ({
    data,
    queryClient,
    staleTime = 1000, // ms
}: PopulateQueryCacheOptions) => {
    // setQueryData doesn't accept a stale time option
    // So we set an updatedAt in the future to make sure the data isn't considered stale
    const updatedAt = Date.now() + staleTime;
    Object.keys(data).forEach(resource => {
        data[resource].forEach(record => {
            if (!record || record.id == null) return;
            queryClient.setQueryData(
                [resource, 'getOne', { id: String(record.id) }],
                record,
                { updatedAt }
            );
        });
        const recordIds = data[resource].map(record => String(record.id));
        queryClient.setQueryData(
            [resource, 'getMany', { ids: recordIds }],
            data[resource],
            { updatedAt }
        );
    });
};
