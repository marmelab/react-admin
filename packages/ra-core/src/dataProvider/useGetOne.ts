import { RaRecord, GetOneParams, GetOneResult } from '../types';
import {
    useQuery,
    UseQueryOptions,
    UseQueryResult,
} from '@tanstack/react-query';
import { useDataProvider } from './useDataProvider';
import { useEffect } from 'react';
import { useEvent } from '../util';

/**
 * Call the dataProvider.getOne() method and return the resolved value
 * as well as the loading state.
 *
 * The return value updates according to the request state:
 *
 * - start: { isPending: true, isFetching: true, refetch }
 * - success: { data: [data from response], isPending: false, refetch }
 * - error: { error: [error from response], isPending: false, refetch }
 *
 * This hook will return the cached result when called a second time
 * with the same parameters, until the response arrives.
 *
 * @param resource The resource name, e.g. 'posts'
 * @param {Params} params The getOne parameters { id, meta }, e.g. { id: 123 }
 * @param {Options} options Options object to pass to the react-query queryClient.
 *
 * @typedef Params
 * @prop id a resource identifier, e.g. 123
 *
 * @typedef Options
 * @prop enabled Flag to conditionally run the query. If it's false, the query will not run
 * @prop onSuccess Side effect function to be executed upon success, e.g. { onSuccess: { refresh: true } }
 * @prop onError Side effect function to be executed upon failure, e.g. { onError: error => notify(error.message) }
 *
 * @returns The current request state. Destructure as { data, error, isPending, refetch }.
 *
 * @example
 *
 * import { useGetOne, useRecordContext } from 'react-admin';
 *
 * const UserProfile = () => {
 *     const record = useRecordContext();
 *     const { data, isPending, error } = useGetOne('users', { id: record.id });
 *     if (isPending) { return <Loading />; }
 *     if (error) { return <p>ERROR</p>; }
 *     return <div>User {data.username}</div>;
 * };
 */
export const useGetOne = <RecordType extends RaRecord = any>(
    resource: string,
    { id, meta }: Partial<GetOneParams<RecordType>>,
    options: UseGetOneOptions<RecordType> = {}
): UseGetOneHookValue<RecordType> => {
    const dataProvider = useDataProvider();
    const {
        onError = noop,
        onSuccess = noop,
        onSettled = noop,
        enabled,
        ...queryOptions
    } = options;
    const onSuccessEvent = useEvent(onSuccess);
    const onErrorEvent = useEvent(onError);
    const onSettledEvent = useEvent(onSettled);

    const result = useQuery<RecordType>({
        // Sometimes the id comes as a string (e.g. when read from the URL in a Show view).
        // Sometimes the id comes as a number (e.g. when read from a Record in useGetList response).
        // As the react-query cache is type-sensitive, we always stringify the identifier to get a match
        queryKey: [resource, 'getOne', { id: String(id), meta }],
        queryFn: queryParams =>
            id == null
                ? new Promise(() => {})
                : dataProvider
                      .getOne<RecordType>(resource, {
                          id,
                          meta,
                          signal:
                              dataProvider.supportAbortSignal === true
                                  ? queryParams.signal
                                  : undefined,
                      })
                      .then(({ data }) => data),
        enabled: enabled ?? id != null,
        ...queryOptions,
    });

    useEffect(() => {
        if (
            result.data === undefined ||
            result.error != null ||
            result.isFetching
        )
            return;
        onSuccessEvent(result.data);
    }, [onSuccessEvent, result.data, result.error, result.isFetching]);

    useEffect(() => {
        if (result.error == null || result.isFetching) return;
        onErrorEvent(result.error);
    }, [onErrorEvent, result.error, result.isFetching]);

    useEffect(() => {
        if (result.status === 'pending' || result.isFetching) return;
        onSettledEvent(result.data, result.error);
    }, [
        onSettledEvent,
        result.data,
        result.error,
        result.status,
        result.isFetching,
    ]);

    return result;
};

const noop = () => undefined;

export type UseGetOneOptions<RecordType extends RaRecord = any> = Omit<
    UseQueryOptions<GetOneResult<RecordType>['data']>,
    'queryKey' | 'queryFn'
> & {
    onSuccess?: (data: GetOneResult<RecordType>['data']) => void;
    onError?: (error: Error) => void;
    onSettled?: (
        data?: GetOneResult<RecordType>['data'],
        error?: Error | null
    ) => void;
};

export type UseGetOneHookValue<RecordType extends RaRecord = any> =
    UseQueryResult<GetOneResult<RecordType>['data']>;
