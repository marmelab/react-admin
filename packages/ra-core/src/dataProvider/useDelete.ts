import { useCallback } from 'react';
import { Identifier, Record } from '../types';
import useMutation, { MutationOptions, Mutation } from './useMutation';

/**
 * Get a callback to call the dataProvider.delete() method, the result
 * of the call (the deleted record), and the loading state.
 *
 * The return value updates according to the request state:
 *
 * - initial: [deleteOne, { loading: false, loaded: false }]
 * - start:   [deleteOne, { loading: true, loaded: false }]
 * - success: [deleteOne, { data: [data from response], loading: false, loaded: true }]
 * - error:   [deleteOne, { error: [error from response], loading: false, loaded: false }]
 *
 * @param resource The resource name, e.g. 'posts'
 * @param id The resource identifier, e.g. 123
 * @param previousData The record before the delete is applied
 * @param options Options object to pass to the dataProvider. May include side effects to be executed upon success or failure, e.g. { onSuccess: { refresh: true } }
 *
 * @returns The current request state. Destructure as [deleteOne, { data, error, loading, loaded }].
 *
 * The deleteOne() function can be called in 3 different ways:
 *  - with the same parameters as the useDelete() hook: deleteOne(resource, id, previousData, options)
 *  - with the same syntax as useMutation: deleteOne({ resource, payload: { id, previousData } }, options)
 *  - with no parameter (if they were already passed to useDelete()): deleteOne()
 *
 * @example // set params when calling the deleteOne callback
 *
 * import { useDelete } from 'react-admin';
 *
 * const DeleteButton = ({ record }) => {
 *     const [deleteOne, { loading, error }] = useDelete();
 *     const handleClick = () => {
 *         deleteOne('likes', record.id, record)
 *     }
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={handleClick}>Delete</div>;
 * };
 *
 * @example // set params when calling the hook
 *
 * import { useDelete } from 'react-admin';
 *
 * const DeleteButton = ({ record }) => {
 *     const [deleteOne, { loading, error }] = useDelete('likes', record.id, record);
 *     if (error) { return <p>ERROR</p>; }
 *     return <button disabled={loading} onClick={deleteOne}>Delete</button>;
 * };
 */
const useDelete = <RecordType extends Record = Record>(
    resource?: string,
    id?: Identifier,
    previousData: any = {},
    options?: MutationOptions
): UseDeleteHookValue<RecordType> => {
    const [mutate, state] = useMutation(
        { type: 'delete', resource, payload: { id, previousData } },
        options
    );

    const deleteOne = useCallback(
        (
            resource?: string | Partial<Mutation> | Event,
            id?: Identifier | Partial<MutationOptions>,
            previousData?: any,
            options?: MutationOptions
        ) => {
            if (typeof resource === 'string') {
                const query = {
                    type: 'delete',
                    resource,
                    payload: {
                        id: id as Identifier,
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

    return [deleteOne, state];
};

type UseDeleteHookValue<RecordType extends Record = Record> = [
    (
        resource?: string | Partial<Mutation> | Event,
        id?: Identifier | Partial<MutationOptions>,
        previousData?: RecordType,
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

export default useDelete;
