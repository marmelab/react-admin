import { useCallback } from 'react';

import { useSafeSetState } from '../util/hooks';
import useDataProvider from './useDataProvider';
import useDataProviderWithDeclarativeSideEffects from './useDataProviderWithDeclarativeSideEffects';

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
 * @returns A tuple with the mutation callback and the request state. Destructure as [mutate, { data, total, error, loading, loaded }].
 *
 * The mutate function accepts the following arguments
 * - {Object} query
 * - {string} query.type The method called on the data provider, e.g. 'update'
 * - {string} query.resource A resource name, e.g. 'posts', 'comments'
 * - {Object} query.payload The payload object, e.g. { id: 123, data: { isApproved: true } }
 * - {Object} options
 * - {string} options.action Redux action type
 * - {boolean} options.undoable Set to true to run the mutation locally before calling the dataProvider
 * - {Function} options.onSuccess Side effect function to be executed upon success of failure, e.g. { onSuccess: response => refresh() } }
 * - {Function} options.onFailure Side effect function to be executed upon failure, e.g. { onFailure: error => notify(error.message) } }
 * - {boolean} withDeclarativeSideEffectsSupport Set to true to support legacy side effects (e.g. { onSuccess: { refresh: true } })
 *
 * @example
 *
 * import { useMutation } from 'react-admin';
 *
 * const ApproveButton = ({ record }) => {
 *     const [mutate, { loading }] = useMutation()
 *     const approve = () => mutate({
 *         type: 'update',
 *         resource: 'comments',
 *         payload: { id: record.id, data: { isApproved: true } }
 *     });
 *     return <FlatButton label="Approve" onClick={approve} disabled={loading} />;
 * };
 *
 * @example
 *
 * import { useMutation, CRUD_UPDATE } from 'react-admin';
 *
 * const MarkDateButton = ({ record }) => {
 *     const [mutate, { loading }] = useMutation();
 *     const handleClick = () => mutate(
 *         {
 *              type: 'update',
 *              resource: 'posts',
 *              payload: { id: record.id, data: { updatedAt: new Date() } }
 *         },
 *         {
 *              undoable: true,
 *              action: CRUD_UPDATE
 *         }
 *     );
 *     return <FlatButton
 *          label="Mark Date"
 *          onClick={handleClick}
 *          disabled={loading}
 *     />;
 * };
 */
const useMutation = (): UseMutationValue => {
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
        (query: Mutation, options: MutationOptions): void => {
            const { type, resource, payload } = query;
            const { withDeclarativeSideEffectsSupport, ...rest } = options;
            const finalDataProvider = withDeclarativeSideEffectsSupport
                ? dataProviderWithDeclarativeSideEffects
                : dataProvider;

            setState({ loading: true });

            finalDataProvider[type](resource, payload, rest)
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
        [dataProvider, dataProviderWithDeclarativeSideEffects, setState]
    );

    return [mutate, state];
};

export interface Mutation {
    type: string;
    resource: string;
    payload: object;
}

export interface MutationOptions {
    action?: string;
    undoable?: boolean;
    onSuccess?: (response: any) => any | Object;
    onError?: (error?: any) => any | Object;
    withDeclarativeSideEffectsSupport: boolean;
}

export type UseMutationValue = [
    (query: Mutation, options?: any) => void,
    {
        data?: any;
        total?: number;
        error?: any;
        loading: boolean;
        loaded: boolean;
    }
];

export default useMutation;
