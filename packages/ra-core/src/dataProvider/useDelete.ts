import useMutation from './useMutation';
import { Identifier } from '../types';

/**
 * Get a callback to call the dataProvider.delete() method, the result
 * of the call (the deleted record), and the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: [callback, { loading: true, loaded: false }]
 * - success: [callback, { data: [data from response], loading: false, loaded: true }]
 * - error: [callback, { error: [error from response], loading: false, loaded: true }]
 *
 * @param resource The resource name, e.g. 'posts'
 * @param id The resource identifier, e.g. 123
 * @param previousData The record before the delete is applied
 * @param options Options object to pass to the dataProvider. May include side effects to be executed upon success of failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as [delete, { data, error, loading, loaded }].
 *
 * @example
 *
 * import { useDelete } from 'react-admin';
 *
 * const DeleteButton = ({ record }) => {
 *     const [deleteOne, { loading, error }] = useDelete('likes', record.id);
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={deleteOne}>Delete</div>;
 * };
 */
const useDelete = (
    resource: string,
    id: Identifier,
    previousData: any = {},
    options?: any
) =>
    useMutation(
        { type: 'delete', resource, payload: { id, previousData } },
        options
    );

export default useDelete;
