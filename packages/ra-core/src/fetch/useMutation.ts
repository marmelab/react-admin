import { useCallback, useEffect } from 'react';
import { useSafeSetState } from './hooks';
import useDataProvider from './useDataProvider';

/**
 * Returns a callback to fetch the data provider through Redux, usually for mutations
 *
 * The request starts when the callback is called.
 *
 * The return value updates according to the request state:
 *
 * - mount: { loading: false, loaded: false }
 * - mutate called: { loading: true, loaded: false }
 * - success: { data: [data from response], total: [total from response], loading: false, loaded: true }
 * - error: { error: [error from response], loading: false, loaded: true }
 *
 * @param type The verb passed to th data provider, e.g. 'UPDATE'
 * @param resource A resource name, e.g. 'posts', 'comments'
 * @param payload The payload object, e.g; { id: 123, data: { isApproved: true } }
 * @param meta Redux action metas, including side effects to be executed upon success of failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns A tuple with the mutation callback and the request state]. Destructure as [mutate,  { data, total, error, loading, loaded }].
 *
 * @example
 *
 * import { useMutation } from 'react-admin';
 *
 * const ApproveButton = ({ record }) => {
 *     const [approve, { loading }] = useMutation(
 *         'UPDATE',
 *         'comments',
 *          { id: record.id, data: { isApproved: true } }
 *     );
 *     return <FlatButton label="Approve" onClick={approve} disabled={loading} />;
 * };
 */
const useMutation = (
    type: string,
    resource: string,
    payload?: any,
    meta?: any
): [
    () => void,
    {
        data?: any;
        total?: number;
        error?: any;
        loading: boolean;
        loaded: boolean;
    }
] => {
    const [state, setState] = useSafeSetState({
        data: null,
        error: null,
        total: null,
        loading: false,
        loaded: false,
    });
    const dataProvider = useDataProvider();
    const mutate = useCallback(() => {
        setState({ loading: true });
        dataProvider(type, resource, payload, meta)
            .then(({ data: dataFromResponse, total: totalFromResponse }) => {
                setState({
                    data: dataFromResponse,
                    total: totalFromResponse,
                    loading: false,
                    loaded: true,
                });
            })
            .catch(errorFromResponse => {
                setState({
                    error: errorFromResponse,
                    loading: false,
                    loaded: false,
                });
            });
    }, [JSON.stringify({ type, resource, payload, meta })]); // deep equality, see https://github.com/facebook/react/issues/14476#issuecomment-471199055

    return [mutate, state];
};

export default useMutation;
