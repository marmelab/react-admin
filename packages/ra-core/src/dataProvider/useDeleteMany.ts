import { useCallback } from 'react';
import { Identifier } from '../types';
import useMutation, { MutationOptions, Mutation } from './useMutation';

/**
 * Get a callback to call the dataProvider.deleteMany() method, the result
 * of the call (the list of deleted record ids), and the loading state.
 *
 * The return value updates according to the request state:
 *
 * - initial: [deleteMany, { loading: false, loaded: false }]
 * - start:   [deleteMany, { loading: true, loaded: false }]
 * - success: [deleteMany, { data: [data from response], loading: false, loaded: true }]
 * - error:   [deleteMany, { error: [error from response], loading: false, loaded: false }]
 *
 * @param resource The resource name, e.g. 'posts'
 * @param ids The resource identifiers, e.g. [123, 456]
 * @param options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as [deleteMany, { data, error, loading, loaded }].
 *
 * The deleteMany() function can be called in 3 different ways:
 *  - with the same parameters as the useDeleteMany() hook: deleteMany(resource, ids, options)
 *  - with the same syntax as useMutation: deleteMany({ resource, payload: { ids } }, options)
 *  - with no parameter (if they were already passed to useDeleteMany()): deleteMany()
 *
 * @example // set params when calling the deleteMany callback
 *
 * import { useDeleteMany } from 'react-admin';
 *
 * const BulkDeletePostsButton = ({ selectedIds }) => {
 *     const [deleteMany, { loading, error }] = useDeleteMany();
 *     const handleClick = () => {
 *         deleteMany('posts', selectedIds)
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={deleteMany}>Delete selected posts</button>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useDeleteMany } from 'react-admin';
 *
 * const BulkDeletePostsButton = ({ selectedIds }) => {
 *     const [deleteMany, { loading, error }] = useDeleteMany('posts', selectedIds);
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={deleteMany}>Delete selected posts</button>;
 * };
 */
const useDeleteMany = (
    resource?: string,
    ids?: Identifier[],
    options?: MutationOptions
): UseDeleteManyHookValue => {
    const [mutate, state] = useMutation(
        { type: 'deleteMany', resource, payload: { ids } },
        options
    );

    const deleteMany = useCallback(
        (
            resource?: string | Partial<Mutation> | Event,
            ids?: Identifier[] | Partial<MutationOptions>,
            options?: MutationOptions
        ) => {
            if (typeof resource === 'string') {
                const query = {
                    type: 'deleteMany',
                    resource,
                    payload: {
                        ids: ids as Identifier[],
                    },
                };
                return mutate(query, options);
            } else {
                return mutate(
                    resource as Mutation | Event,
                    ids as MutationOptions
                );
            }
        },
        [mutate] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return [deleteMany, state];
};

type UseDeleteManyHookValue = [
    (
        resource?: string | Partial<Mutation> | Event,
        ids?: Identifier[] | Partial<MutationOptions>,
        options?: MutationOptions
    ) => void | Promise<any>,
    {
        data?: Identifier[];
        total?: number;
        error?: any;
        loading: boolean;
        loaded: boolean;
    }
];
export default useDeleteMany;
