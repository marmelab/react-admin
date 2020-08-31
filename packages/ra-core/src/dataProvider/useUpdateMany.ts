import useMutation from './useMutation';
import { Identifier } from '../types';

/**
 * Get a callback to call the dataProvider.updateMany() method, the result
 * of the call (the list of updated record ids), and the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: [callback, { loading: true, loaded: false }]
 * - success: [callback, { data: [data from response], loading: false, loaded: true }]
 * - error: [callback, { error: [error from response], loading: false, loaded: true }]
 *
 * @param resource The resource name, e.g. 'posts'
 * @param ids The resource identifiers, e.g. [123, 456]
 * @param data The updates to merge into all records, e.g. { views: 10 }
 * @param options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as [update, { data, error, loading, loaded }].
 *
 * @example
 *
 * import { useUpdateMany } from 'react-admin';
 *
 * const BulkResetViewsButton = ({ selectedIds }) => {
 *     const [updateMany, { loading, error }] = useUpdateMany('posts', selectedIds, { views: 0 });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={updateMany}>Reset views</button>;
 * };
 */
const useUpdateMany = (
    resource: string,
    ids: Identifier[],
    data: any,
    options?: any
) =>
    useMutation(
        { type: 'updateMany', resource, payload: { ids, data } },
        options
    );

export default useUpdateMany;
