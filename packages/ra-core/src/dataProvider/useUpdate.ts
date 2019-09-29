import { Identifier } from '../types';
import useMutation from './useMutation';

/**
 * Get a callback to call the dataProvider.update() method, the result and the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: [callback, { loading: true, loaded: false }]
 * - success: [callback, { data: [data from response], loading: false, loaded: true }]
 * - error: [callback, { error: [error from response], loading: false, loaded: true }]
 *
 * @param resource The resource name, e.g. 'posts'
 * @param id The resource identifier, e.g. 123
 * @param data The updates to merge into the record, e.g. { views: 10 }
 * @param previousData The record before the update is applied
 * @param options Options object to pass to the dataProvider. May include side effects to be executed upon success of failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as [update, { data, error, loading, loaded }].
 *
 * @example
 *
 * import { useUpdate } from 'react-admin';
 *
 * const IncreaseLikeButton = ({ record }) => {
 *     const diff = { likes: record.likes + 1 };
 *     const [update, { loading, error }] = useUpdate('likes', record.id, diff, record);
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={update}>Like</div>;
 * };
 */
const useUpdate = (
    resource: string,
    id: Identifier,
    data?: any,
    previousData?: any,
    options?: any
) =>
    useMutation(
        { type: 'update', resource, payload: { id, data, previousData } },
        options
    );

export default useUpdate;
