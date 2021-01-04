import useMutation from './useMutation';

/**
 * Get a callback to call the dataProvider.create() method, the result and the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: [callback, { loading: true, loaded: false }]
 * - success: [callback, { data: [data from response], loading: false, loaded: true }]
 * - error: [callback, { error: [error from response], loading: false, loaded: true }]
 *
 * @param resource The resource name, e.g. 'posts'
 * @param data The data to initialize the new record with, e.g. { title: 'hello, world' }
 * @param options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as [create, { data, error, loading, loaded }].
 *
 * @example
 *
 * import { useCreate } from 'react-admin';
 *
 * const LikeButton = ({ record }) => {
 *     const like = { postId: record.id };
 *     const [create, { loading, error }] = useCreate('likes', like);
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={create}>Like</button>;
 * };
 */
const useCreate = (resource: string, data: any = {}, options?: any) =>
    useMutation({ type: 'create', resource, payload: { data } }, options);

export default useCreate;
