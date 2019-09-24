import { useCallback } from 'react';
import merge from 'lodash/merge';

import { CRUD_DELETE_MANY } from '../actions/dataActions/crudDeleteMany';
import useMutation from './useMutation';
import { Identifier } from '../types';

/**
 * Get a callback to call the dataProvider.deleteMany() method, the result
 * of the call (the list of deleted record ids), and the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: [callback, { loading: true, loaded: false }]
 * - success: [callback, { data: [data from response], loading: false, loaded: true }]
 * - error: [callback, { error: [error from response], loading: false, loaded: true }]
 *
 * @param resource The resource name, e.g. 'posts'
 * @param ids The resource identifiers, e.g. [123, 456]
 * @param options Options object to pass to the dataProvider. May include side effects to be executed upon success of failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as [delete, { data, error, loading, loaded }].
 *
 * @example
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
    resource: string,
    ids: [Identifier],
    options?: any
): [
    (event: any, callTimePayload?: any, callTimeOptions?: any) => void,
    {
        data?: any;
        error?: any;
        loading: boolean;
        loaded: boolean;
    }
] => {
    const [mutate, state] = useMutation();

    const deleteCallback = useCallback(
        (event: any, callTimeData?: any, callTimeOptions?: any) =>
            mutate(
                {
                    resource,
                    payload: merge({}, { ids }, callTimeData),
                    type: 'deleteMany',
                },
                {
                    action: CRUD_DELETE_MANY,
                    ...merge({}, options, callTimeOptions),
                }
            ),
        [ids, mutate, resource, JSON.stringify(options)] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return [deleteCallback, state];
};

export default useDeleteMany;
