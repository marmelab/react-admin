import { useRef } from 'react';
import {
    useMutation,
    UseMutationOptions,
    UseMutationResult,
    useQueryClient,
    MutateOptions,
} from 'react-query';

import { useDataProvider } from './useDataProvider';
import { Record, CreateParams } from '../types';

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
 * The create() function must be called with a resource and a parameter object: create(resource, { data }, options)
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
export const useCreate = <RecordType extends Record = Record>(
    resource?: string,
    params: Partial<CreateParams> = {},
    options: UseCreateOptions<RecordType> = {}
): UseCreateResult<RecordType> => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const paramsRef = useRef<Partial<CreateParams<RecordType>>>(params);

    const mutation = useMutation<
        RecordType,
        unknown,
        Partial<UseCreateMutateParams<RecordType>>
    >(
        ({
            resource: callTimeResource = resource,
            data: callTimeData = paramsRef.current.data,
        } = {}) =>
            dataProvider
                .create<RecordType>(callTimeResource, {
                    data: callTimeData,
                })
                .then(({ data }) => data),
        {
            onSuccess: (
                data: RecordType,
                variables: Partial<UseCreateMutateParams<RecordType>> = {}
            ) => {
                const { resource: callTimeResource = resource } = variables;
                queryClient.setQueryData(
                    [callTimeResource, 'getOne', { id: String(data.id) }],
                    data
                );
            },
            ...options,
        }
    );

    const create = (
        callTimeResource: string = resource,
        callTimeParams: Partial<CreateParams<RecordType>> = {},
        createOptions?: MutateOptions<
            RecordType,
            unknown,
            Partial<UseCreateMutateParams<RecordType>>,
            unknown
        >
    ) =>
        mutation.mutate(
            { resource: callTimeResource, ...callTimeParams },
            createOptions
        );

    return [create, mutation];
};

export interface UseCreateMutateParams<RecordType extends Record = Record> {
    resource?: string;
    data?: Partial<RecordType>;
}

export type UseCreateOptions<
    RecordType extends Record = Record
> = UseMutationOptions<
    RecordType,
    unknown,
    Partial<UseCreateMutateParams<RecordType>>
>;

export type UseCreateResult<RecordType extends Record = Record> = [
    (
        resource?: string,
        params?: Partial<CreateParams<Partial<RecordType>>>,
        options?: MutateOptions<
            RecordType,
            unknown,
            Partial<UseCreateMutateParams<RecordType>>,
            unknown
        >
    ) => void,
    UseMutationResult<
        RecordType,
        unknown,
        Partial<UseCreateMutateParams<RecordType>>,
        unknown
    >
];
