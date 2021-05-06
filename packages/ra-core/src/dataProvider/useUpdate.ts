import { useCallback } from 'react';
import { Identifier, Record } from '../types';
import useMutation, { MutationOptions, Mutation } from './useMutation';

/**
 * Get a callback to call the dataProvider.update() method, the result and the loading state.
 *
 * The return value updates according to the request state:
 *
 * - initial: [update, { loading: false, loaded: false }]
 * - start:   [update, { loading: true, loaded: false }]
 * - success: [update, { data: [data from response], loading: false, loaded: true }]
 * - error:   [update, { error: [error from response], loading: false, loaded: false }]
 *
 * @param resource The resource name, e.g. 'posts'
 * @param id The resource identifier, e.g. 123
 * @param data The updates to merge into the record, e.g. { views: 10 }
 * @param previousData The record before the update is applied
 * @param options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as [update, { data, error, loading, loaded }].
 *
 * The update() function can be called in 3 different ways:
 *  - with the same parameters as the useUpdate() hook: update(resource, id, data, previousData, options)
 *  - with the same syntax as useMutation: update({ resource, payload: { id, data, previousData } }, options)
 *  - with no parameter (if they were already passed to useUpdate()): update()
 *
 * @example // set params when calling the update callback
 *
 * import { useUpdate } from 'react-admin';
 *
 * const IncreaseLikeButton = ({ record }) => {
 *     const diff = { likes: record.likes + 1 };
 *     const [update, { loading, error }] = useUpdate();
 *     const handleClick = () => {
 *         update('likes', record.id, diff, record)
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={handleClick}>Like</div>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useUpdate } from 'react-admin';
 *
 * const IncreaseLikeButton = ({ record }) => {
 *     const diff = { likes: record.likes + 1 };
 *     const [update, { loading, error }] = useUpdate('likes', record.id, diff, record);
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={update}>Like</button>;
 * };
 *
 * @example // TypeScript
 * const [update, { data }] = useUpdate<Product>('products', id, changes, product);
 *                    \-- data is Product
 */
const useUpdate = <RecordType extends Record = Record>(
    resource?: string,
    id?: Identifier,
    data?: Partial<RecordType>,
    previousData?: any,
    options?: MutationOptions
): UseUpdateHookValue<RecordType> => {
    const [mutate, state] = useMutation(
        { type: 'update', resource, payload: { id, data, previousData } },
        options
    );

    const update = useCallback(
        (
            resource?: string | Partial<Mutation> | Event,
            id?: Identifier | Partial<MutationOptions>,
            data?: Partial<RecordType>,
            previousData?: any,
            options?: MutationOptions
        ) => {
            if (typeof resource === 'string') {
                const query = {
                    type: 'update',
                    resource,
                    payload: {
                        id: id as Identifier,
                        data,
                        previousData,
                    },
                };
                return mutate(query, options);
            } else {
                return mutate(
                    resource as Mutation | Event,
                    id as MutationOptions
                );
            }
        },
        [mutate] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return [update, state];
};

type UseUpdateHookValue<RecordType extends Record = Record> = [
    (
        resource?: string | Partial<Mutation> | Event,
        id?: Identifier | Partial<MutationOptions>,
        data?: Partial<RecordType>,
        previousData?: any,
        options?: MutationOptions
    ) => void | Promise<any>,
    {
        data?: RecordType;
        total?: number;
        error?: any;
        loading: boolean;
        loaded: boolean;
    }
];

export default useUpdate;
