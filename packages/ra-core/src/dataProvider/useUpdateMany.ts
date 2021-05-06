import { useCallback } from 'react';
import { Identifier, Record } from '../types';
import useMutation, { MutationOptions, Mutation } from './useMutation';

/**
 * Get a callback to call the dataProvider.updateMany() method, the result
 * of the call (the list of updated record ids), and the loading state.
 *
 * The return value updates according to the request state:
 *
 * - initial: [updateMany, { loading: false, loaded: false }]
 * - start:   [updateMany, { loading: true, loaded: false }]
 * - success: [updateMany, { data: [data from response], loading: false, loaded: true }]
 * - error:   [updateMany, { error: [error from response], loading: false, loaded: false }]
 *
 * @param resource The resource name, e.g. 'posts'
 * @param ids The resource identifiers, e.g. [123, 456]
 * @param data The updates to merge into all records, e.g. { views: 10 }
 * @param options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as [updateMany, { data, error, loading, loaded }].
 *
 * The updateMany() function can be called in 3 different ways:
 *  - with the same parameters as the useUpdateMany() hook: update(resource, ids, data, options)
 *  - with the same syntax as useMutation: update({ resource, payload: { ids, data } }, options)
 *  - with no parameter (if they were already passed to useUpdateMany()): updateMany()
 *
 * @example // set params when calling the updateMany callback
 *
 * import { useUpdateMany } from 'react-admin';
 *
 * const BulkResetViewsButton = ({ selectedIds }) => {
 *     const [updateMany, { loading, error }] = useUpdateMany();
 *     const handleClick = () => {
 *         updateMany('posts', selectedIds, { views: 0 });
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={handleClick}>Reset views</button>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useUpdateMany } from 'react-admin';
 *
 * const BulkResetViewsButton = ({ selectedIds }) => {
 *     const [updateMany, { loading, error }] = useUpdateMany('posts', selectedIds, { views: 0 });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={updateMany}>Reset views</button>;
 * };
 */
const useUpdateMany = <RecordType extends Record = Record>(
    resource?: string,
    ids?: Identifier[],
    data?: Partial<RecordType>,
    options?: MutationOptions
): UseUpdateManyHookValue<RecordType> => {
    const [mutate, state] = useMutation(
        { type: 'updateMany', resource, payload: { ids, data } },
        options
    );

    const updateMany = useCallback(
        (
            resource?: string | Partial<Mutation> | Event,
            ids?: Identifier[] | Partial<MutationOptions>,
            data?: Partial<RecordType>,
            options?: MutationOptions
        ) => {
            if (typeof resource === 'string') {
                const query = {
                    type: 'updateMany',
                    resource,
                    payload: {
                        ids: ids as Identifier[],
                        data,
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

    return [updateMany, state];
};

type UseUpdateManyHookValue<RecordType extends Record = Record> = [
    (
        resource?: string | Partial<Mutation> | Event,
        ids?: Identifier[] | Partial<MutationOptions>,
        data?: Partial<RecordType>,
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

export default useUpdateMany;
