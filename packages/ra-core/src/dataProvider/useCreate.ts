import { useRef } from 'react';
import {
    useMutation,
    UseMutationOptions,
    UseMutationResult,
    useQueryClient,
    MutateOptions,
} from 'react-query';

import { useDataProvider } from './useDataProvider';
import { RaRecord, CreateParams } from '../types';

/**
 * Get a callback to call the dataProvider.create() method, the result and the loading state.
 *
 * @param {string} resource
 * @param {Params} params The create parameters { data }
 * @param {Object} options Options object to pass to the queryClient.
 * May include side effects to be executed upon success or failure, e.g. { onSuccess: () => { refresh(); } }
 *
 * @typedef Params
 * @prop params.data The record to create, e.g. { title: 'hello, world' }
 *
 * @returns The current mutation state. Destructure as [create, { data, error, isLoading }].
 *
 * The return value updates according to the request state:
 *
 * - initial: [create, { isLoading: false, isIdle: true }]
 * - start:   [create, { isLoading: true }]
 * - success: [create, { data: [data from response], isLoading: false, isSuccess: true }]
 * - error:   [create, { error: [error from response], isLoading: false, isError: true }]
 *
 * The create() function must be called with a resource and a parameter object: create(resource, { data, meta }, options)
 *
 * This hook uses react-query useMutation under the hood.
 * This means the state object contains mutate, isIdle, reset and other react-query methods.
 *
 * @see https://react-query.tanstack.com/reference/useMutation
 *
 * @example // set params when calling the create callback
 *
 * import { useCreate } from 'react-admin';
 *
 * const LikeButton = ({ record }) => {
 *     const like = { postId: record.id };
 *     const [create, { isLoading, error }] = useCreate();
 *     const handleClick = () => {
 *         create('likes', { data: like })
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={handleClick}>Like</button>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useCreate } from 'react-admin';
 *
 * const LikeButton = ({ record }) => {
 *     const like = { postId: record.id };
 *     const [create, { isLoading, error }] = useCreate('likes', { data: like });
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={isLoading} onClick={() => create()}>Like</button>;
 * };
 *
 * @example // TypeScript
 * const [create, { data }] = useCreate<Product>('products', { data: product });
 *                    \-- data is Product
 */
export const useCreate = <
    RecordType extends RaRecord = any,
    MutationError = unknown
>(
    resource?: string,
    params: Partial<CreateParams<Partial<RecordType>>> = {},
    options: UseCreateOptions<RecordType, MutationError> = {}
): UseCreateResult<RecordType, boolean, MutationError> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const paramsRef = useRef<Partial<CreateParams<Partial<RecordType>>>>(
        params
    );

    const mutation = useMutation<
        RecordType,
        MutationError,
        Partial<UseCreateMutateParams<RecordType>>
    >(
        ({
            resource: callTimeResource = resource,
            data: callTimeData = paramsRef.current.data,
            meta: callTimeMeta = paramsRef.current.meta,
        } = {}) =>
            dataProvider
                .create<RecordType>(callTimeResource, {
                    data: callTimeData,
                    meta: callTimeMeta,
                })
                .then(({ data }) => data),
        {
            ...options,
            onSuccess: (
                data: RecordType,
                variables: Partial<UseCreateMutateParams<RecordType>> = {},
                context: unknown
            ) => {
                const { resource: callTimeResource = resource } = variables;
                queryClient.setQueryData(
                    [callTimeResource, 'getOne', { id: String(data.id) }],
                    data
                );

                if (options.onSuccess) {
                    options.onSuccess(data, variables, context);
                }
                // call-time success callback is executed by react-query
            },
        }
    );

    const create = (
        callTimeResource: string = resource,
        callTimeParams: Partial<CreateParams<RecordType>> = {},
        createOptions: MutateOptions<
            RecordType,
            MutationError,
            Partial<UseCreateMutateParams<RecordType>>,
            unknown
        > & { returnPromise?: boolean } = {}
    ) => {
        const { returnPromise, ...reactCreateOptions } = createOptions;
        if (returnPromise) {
            return mutation.mutateAsync(
                { resource: callTimeResource, ...callTimeParams },
                createOptions
            );
        }
        mutation.mutate(
            { resource: callTimeResource, ...callTimeParams },
            reactCreateOptions
        );
    };

    return [create, mutation];
};

export interface UseCreateMutateParams<RecordType extends RaRecord = any> {
    resource?: string;
    data?: Partial<RecordType>;
    meta?: any;
}

export type UseCreateOptions<
    RecordType extends RaRecord = any,
    MutationError = unknown
> = UseMutationOptions<
    RecordType,
    MutationError,
    Partial<UseCreateMutateParams<RecordType>>
>;

export type UseCreateResult<
    RecordType extends RaRecord = any,
    TReturnPromise extends boolean = boolean,
    MutationError = unknown
> = [
    (
        resource?: string,
        params?: Partial<CreateParams<Partial<RecordType>>>,
        options?: MutateOptions<
            RecordType,
            MutationError,
            Partial<UseCreateMutateParams<RecordType>>,
            unknown
        > & { returnPromise?: TReturnPromise }
    ) => Promise<TReturnPromise extends true ? RecordType : void>,
    UseMutationResult<
        RecordType,
        MutationError,
        Partial<UseCreateMutateParams<RecordType>>,
        unknown
    >
];
