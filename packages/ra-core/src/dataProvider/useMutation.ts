import { useCallback } from 'react';
import merge from 'lodash/merge';

import { useSafeSetState } from '../util/hooks';
import { MutationMode, OnSuccess, OnFailure } from '../types';
import useDataProvider from './useDataProvider';
import useDataProviderWithDeclarativeSideEffects from './useDataProviderWithDeclarativeSideEffects';
import { DeclarativeSideEffect } from './useDeclarativeSideEffects';

/**
 * Get a callback to fetch the data provider through Redux, usually for mutations.
 *
 * The request starts when the callback is called.
 *
 * useMutation() parameters can be passed:
 *
 * - at definition time
 *
 *       const [mutate] = useMutation(query, options); mutate();
 *
 * - at call time
 *
 *       const [mutate] = useMutation(); mutate(query, options);
 *
 * - both, in which case the definition and call time parameters are merged
 *
 *       const [mutate] = useMutation(query1, options1); mutate(query2, options2);
 *
 * @param {Object} query
 * @param {string} query.type The method called on the data provider, e.g. 'getList', 'getOne'. Can also be a custom method if the dataProvider supports is.
 * @param {string} query.resource A resource name, e.g. 'posts', 'comments'
 * @param {Object} query.payload The payload object, e.g; { post_id: 12 }
 * @param {Object} options
 * @param {string} options.action Redux action type
 * @param {boolean} options.undoable Set to true to run the mutation locally before calling the dataProvider
 * @param {boolean} options.returnPromise Set to true to return the result promise of the mutation
 * @param {Function} options.onSuccess Side effect function to be executed upon success, e.g. () => refresh()
 * @param {Function} options.onFailure Side effect function to be executed upon failure, e.g. (error) => notify(error.message)
 * @param {boolean} options.withDeclarativeSideEffectsSupport Set to true to support legacy side effects e.g. { onSuccess: { refresh: true } }
 *
 * @returns A tuple with the mutation callback and the request state. Destructure as [mutate, { data, total, error, loading, loaded }].
 *
 * The return value updates according to the request state:
 *
 * - mount:         [mutate, { loading: false, loaded: false }]
 * - mutate called: [mutate, { loading: true, loaded: false }]
 * - success:       [mutate, { data: [data from response], total: [total from response], loading: false, loaded: true }]
 * - error:         [mutate, { error: [error from response], loading: false, loaded: false }]
 *
 * The mutate function accepts the following arguments
 * - {Object} query
 * - {string} query.type The method called on the data provider, e.g. 'update'
 * - {string} query.resource A resource name, e.g. 'posts', 'comments'
 * - {Object} query.payload The payload object, e.g. { id: 123, data: { isApproved: true } }
 * - {Object} options
 * - {string} options.action Redux action type
 * - {boolean} options.undoable Set to true to run the mutation locally before calling the dataProvider
 * - {boolean} options.returnPromise Set to true to return the result promise of the mutation
 * - {Function} options.onSuccess Side effect function to be executed upon success or failure, e.g. { onSuccess: response => refresh() }
 * - {Function} options.onFailure Side effect function to be executed upon failure, e.g. { onFailure: error => notify(error.message) }
 * - {boolean} withDeclarativeSideEffectsSupport Set to true to support legacy side effects e.g. { onSuccess: { refresh: true } }
 *
 * @example
 *
 * // pass parameters at definition time
 * // use when all parameters are determined at definition time
 * // the mutation callback can be used as an even handler
 * // because Event parameters are ignored
 * import { useMutation } from 'react-admin';
 *
 * const ApproveButton = ({ record }) => {
 *     const [approve, { loading }] = useMutation({
 *         type: 'update',
 *         resource: 'comments',
 *         payload: { id: record.id, data: { isApproved: true } }
 *     });
 *     return <Button label="Approve" onClick={approve} disabled={loading} />;
 * };
 *
 * @example
 *
 * // pass parameters at call time
 * // use when some parameters are only known at call time
 * import { useMutation } from 'react-admin';
 *
 * const ApproveButton = ({ record }) => {
 *     const [mutate, { loading }] = useMutation();
 *     const approve = event => mutate({
 *         type: 'update',
 *         resource: 'comments',
 *         payload: {
 *             id: event.target.dataset.id,
 *             data: { isApproved: true, updatedAt: new Date() }
 *         },
 *     });
 *     return <Button
 *         label="Approve"
 *         onClick={approve}
 *         disabled={loading}
 *     />;
 * };
 *
 * @example
 *
 * // use the second argument to pass options
 * import { useMutation, useNotify, CRUD_UPDATE } from 'react-admin';
 *
 * const ResetStockButton = ({ record }) => {
 *     const [mutate, { loading }] = useMutation();
 *     const notify = useNotify();
 *     const handleClick = () => mutate(
 *         {
 *              type: 'update',
 *              resource: 'items',
 *              payload: { id: record.id, data: { stock: 0 } }
 *         },
 *         {
 *              undoable: true,
 *              action: CRUD_UPDATE,
 *              onSuccess: response => notify('Success !'),
 *              onFailure: error => notify('Failure !')
 *         }
 *     );
 *     return <Button label="Reset stock" onClick={handleClick} disabled={loading} />;
 * };
 */
const useMutation = (
    query?: Mutation,
    options?: MutationOptions
): UseMutationValue => {
    const [state, setState] = useSafeSetState({
        data: null,
        error: null,
        total: null,
        loading: false,
        loaded: false,
    });

    const dataProvider = useDataProvider();
    const dataProviderWithDeclarativeSideEffects = useDataProviderWithDeclarativeSideEffects();

    /* eslint-disable react-hooks/exhaustive-deps */
    const mutate = useCallback(
        (
            callTimeQuery?: Partial<Mutation> | Event,
            callTimeOptions?: MutationOptions
        ): void | Promise<any> => {
            const finalDataProvider = hasDeclarativeSideEffectsSupport(
                options,
                callTimeOptions
            )
                ? dataProviderWithDeclarativeSideEffects
                : dataProvider;
            const params = mergeDefinitionAndCallTimeParameters(
                query,
                callTimeQuery,
                options,
                callTimeOptions
            );

            setState(prevState => ({ ...prevState, loading: true }));

            const returnPromise = params.options.returnPromise;

            const promise = finalDataProvider[params.type]
                .apply(
                    finalDataProvider,
                    typeof params.resource !== 'undefined'
                        ? [params.resource, params.payload, params.options]
                        : [params.payload, params.options]
                )
                .then(response => {
                    const { data, total } = response;
                    setState({
                        data,
                        error: null,
                        loaded: true,
                        loading: false,
                        total,
                    });
                    if (returnPromise) {
                        return response;
                    }
                })
                .catch(errorFromResponse => {
                    setState({
                        data: null,
                        error: errorFromResponse,
                        loaded: false,
                        loading: false,
                        total: null,
                    });
                    if (returnPromise) {
                        throw errorFromResponse;
                    }
                });

            if (returnPromise) {
                return promise;
            }
        },
        [
            // deep equality, see https://github.com/facebook/react/issues/14476#issuecomment-471199055
            JSON.stringify({ query, options }),
            dataProvider,
            dataProviderWithDeclarativeSideEffects,
            setState,
        ]
        /* eslint-enable react-hooks/exhaustive-deps */
    );

    return [mutate, state];
};

export interface Mutation {
    type: string;
    resource?: string;
    payload?: object;
}

export interface MutationOptions {
    action?: string;
    returnPromise?: boolean;
    onSuccess?: OnSuccess | DeclarativeSideEffect;
    onFailure?: OnFailure | DeclarativeSideEffect;
    withDeclarativeSideEffectsSupport?: boolean;
    /** @deprecated use mutationMode: undoable instead */
    undoable?: boolean;
    mutationMode?: MutationMode;
}

export type UseMutationValue = [
    (
        query?: Partial<Mutation> | Event,
        options?: Partial<MutationOptions>
    ) => void | Promise<any>,
    {
        data?: any;
        total?: number;
        error?: any;
        loading: boolean;
        loaded: boolean;
    }
];

/**
 * Utility function for merging parameters
 *
 * useMutation() parameters can be passed:
 * - at definition time (e.g. useMutation({ type: 'update', resource: 'posts', payload: { id: 1, data: { title: '' } } }) )
 * - at call time (e.g. [mutate] = useMutation(); mutate({ type: 'update', resource: 'posts', payload: { id: 1, data: { title: '' } } }))
 * - both
 *
 * This function merges the definition time and call time parameters.
 *
 * This is useful because useMutation() is used by higher-level hooks like
 * useCreate() or useUpdate(), and these hooks can be called both ways.
 * So it makes sense to make useMutation() capable of handling both call types
 * as it avoids repetition higher in the hook chain.
 *
 * Also, the call time query may be a DOM Event if the callback is used
 * as an event listener, as in:
 *
 * const UpdateButton = () => {
 *     const mutate = useMutation({ type: 'update', resource: 'posts', payload: { id: 1, data: { title: '' } } });
 *     return <button onclick={mutate}>Click me</button>
 * };
 *
 * This usage is accepted, and therefore this function checks if the call time
 * query is an Event, and discards it in that case.
 *
 * @param query {Mutation}
 * @param callTimeQuery {Mutation}
 * @param options {Object}
 * @param callTimeOptions {Object}
 *
 * @return { type, resource, payload, options } The merged parameters
 */
const mergeDefinitionAndCallTimeParameters = (
    query?: Mutation,
    callTimeQuery?: Partial<Mutation> | Event,
    options?: MutationOptions,
    callTimeOptions?: MutationOptions
): {
    type: string;
    resource: string;
    payload?: object;
    options: MutationOptions;
} => {
    if (!query && (!callTimeQuery || callTimeQuery instanceof Event)) {
        throw new Error('Missing query either at definition or at call time');
    }
    if (callTimeQuery instanceof Event)
        return {
            type: query.type,
            resource: query.resource,
            payload: query.payload,
            options: sanitizeOptions(options),
        };
    if (query)
        return {
            type: query.type || callTimeQuery.type,
            resource: query.resource || callTimeQuery.resource,
            payload: callTimeQuery
                ? merge({}, query.payload, callTimeQuery.payload)
                : query.payload,
            options: callTimeOptions
                ? merge(
                      {},
                      sanitizeOptions(options),
                      sanitizeOptions(callTimeOptions)
                  )
                : sanitizeOptions(options),
        };
    return {
        type: callTimeQuery.type,
        resource: callTimeQuery.resource,
        payload: callTimeQuery.payload,
        options: sanitizeOptions(callTimeOptions),
    };
};

const hasDeclarativeSideEffectsSupport = (
    options?: MutationOptions,
    callTimeOptions?: MutationOptions
) => {
    if (!options && !callTimeOptions) return false;
    if (callTimeOptions && callTimeOptions.withDeclarativeSideEffectsSupport)
        return true;
    return options && options.withDeclarativeSideEffectsSupport;
};

const sanitizeOptions = (args?: MutationOptions) => {
    if (!args) return { onSuccess: undefined };
    const { withDeclarativeSideEffectsSupport, ...options } = args;
    return { onSuccess: undefined, ...options };
};

export default useMutation;
