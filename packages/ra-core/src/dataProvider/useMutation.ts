import { useCallback } from 'react';

import { useSafeSetState } from '../util/hooks';
import useDataProvider from './useDataProvider';
import useDataProviderWithDeclarativeSideEffects from './useDataProviderWithDeclarativeSideEffects';

export interface Mutation {
    type: string;
    resource: string;
    payload: object;
}

export interface MutationOptions {
    meta?: any;
    action?: string;
    undoable?: boolean;
    withDeclarativeSideEffectsSupport?: boolean;
}

/**
 * Get a callback to fetch the data provider through Redux, usually for mutations
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
 * @param {Object} query
 * @param {string} query.type The verb passed to th data provider, e.g. 'UPDATE'
 * @param {string} query.resource A resource name, e.g. 'posts', 'comments'
 * @param {Object} query.payload The payload object, e.g. { id: 123, data: { isApproved: true } }
 * @param {Object} options
 * @param {string} options.action Redux action type
 * @param {Object} options.meta Redux action metas, including side effects to be executed upon success of failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns A tuple with the mutation callback and the request state. Destructure as [mutate, { data, total, error, loading, loaded }].
 *
 * @example
 *
 * import { useMutation, UPDATE } from 'react-admin';
 *
 * const ApproveButton = ({ record }) => {
 *     const [approve, { loading }] = useMutation({
 *         type: UPDATE,
 *         resource: 'comments',
 *         payload: { id: record.id, data: { isApproved: true } }
 *     });
 *     return <FlatButton label="Approve" onClick={approve} disabled={loading} />;
 * };
 *
 * @example
 *
 * import { useMutation, UPDATE } from 'react-admin';
 *
 * const MarkDateButton = ({ record }) => {
 *     // the mutation data can be passed at call time
 *     const [approve, { loading }] = useMutation({
 *         type: UPDATE,
 *         resource: 'posts',
 *         payload: { id: record.id } // no data
 *     });
 *     // the mutation callback expects call time payload as second parameter
 *     // and merges it with the initial payload when called
 *     return <FlatButton
 *          label="Mark Date"
 *          onClick={() => approve(null, {
 *              data: { updatedAt: new Date() } // data defined here
 *          })}
 *          disabled={loading}
 *     />;
 * };
 */
const useMutation = (
    {
        withDeclarativeSideEffectsSupport = false,
    }: {
        withDeclarativeSideEffectsSupport?: boolean;
    } = {
        withDeclarativeSideEffectsSupport: false,
    }
): [
    (query: Mutation, options?: any) => void,
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
    const dataProviderWithDeclarativeSideEffects = useDataProviderWithDeclarativeSideEffects();

    const mutate = useCallback(
        (query: Mutation, options): void => {
            const { type, resource, payload } = query;

            const dataProviderWithSideEffects = withDeclarativeSideEffectsSupport
                ? dataProviderWithDeclarativeSideEffects
                : dataProvider;

            setState({ loading: true });

            dataProviderWithSideEffects[type](resource, payload, options)
                .then(({ data, total }) => {
                    setState({
                        data,
                        total,
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
        },
        [dataProvider] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return [mutate, state];
};

export default useMutation;
