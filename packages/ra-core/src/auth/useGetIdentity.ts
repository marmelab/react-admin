import { useEffect, useMemo } from 'react';
import {
    useQuery,
    UseQueryOptions,
    QueryObserverResult,
} from '@tanstack/react-query';

import useAuthProvider from './useAuthProvider';
import { UserIdentity } from '../types';
import { useEvent } from '../util';

const defaultIdentity: UserIdentity = {
    id: '',
};
const defaultQueryParams = {
    staleTime: 5 * 60 * 1000,
};

/**
 * Return the current user identity by calling authProvider.getIdentity() on mount
 *
 * The return value updates according to the call state:
 *
 * - mount: { isPending: true }
 * - success: { identity, refetch: () => {}, isPending: false }
 * - error: { error: Error, isPending: false }
 *
 * The implementation is left to the authProvider.
 *
 * @returns The current user identity. Destructure as { isPending, identity, error, refetch }.
 *
 * @example
 * import { useGetIdentity, useGetOne } from 'react-admin';
 *
 * const PostDetail = ({ id }) => {
 *     const { data: post, isPending: postLoading } = useGetOne('posts', { id });
 *     const { identity, isPending: identityLoading } = useGetIdentity();
 *     if (postLoading || identityLoading) return <>Loading...</>;
 *     if (!post.lockedBy || post.lockedBy === identity.id) {
 *         // post isn't locked, or is locked by me
 *         return <PostEdit post={post} />
 *     } else {
 *         // post is locked by someone else and cannot be edited
 *         return <PostShow post={post} />
 *     }
 * }
 */
export const useGetIdentity = <ErrorType extends Error = Error>(
    options: UseGetIdentityOptions<ErrorType> = defaultQueryParams
): UseGetIdentityResult<ErrorType> => {
    const authProvider = useAuthProvider();
    const { onSuccess, onError, onSettled, ...queryOptions } = options;

    const result = useQuery({
        queryKey: ['auth', 'getIdentity'],
        queryFn: async ({ signal }) => {
            if (
                authProvider &&
                typeof authProvider.getIdentity === 'function'
            ) {
                return authProvider.getIdentity({ signal });
            } else {
                return defaultIdentity;
            }
        },
        ...queryOptions,
    });

    const onSuccessEvent = useEvent(onSuccess ?? noop);
    const onErrorEvent = useEvent(onError ?? noop);
    const onSettledEvent = useEvent(onSettled ?? noop);

    useEffect(() => {
        if (result.data === undefined || result.isFetching) return;
        onSuccessEvent(result.data);
    }, [onSuccessEvent, result.data, result.isFetching]);

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

    return useMemo(
        () => ({
            ...result,
            identity: result.data,
        }),
        [result]
    );
};

export interface UseGetIdentityOptions<ErrorType extends Error = Error>
    extends Omit<
        UseQueryOptions<UserIdentity, ErrorType>,
        'queryKey' | 'queryFn'
    > {
    onSuccess?: (data: UserIdentity) => void;
    onError?: (err: Error) => void;
    onSettled?: (data?: UserIdentity, error?: Error | null) => void;
}

export type UseGetIdentityResult<ErrorType = Error> = QueryObserverResult<
    UserIdentity,
    ErrorType
> & {
    identity: UserIdentity | undefined;
};

export default useGetIdentity;

const noop = () => {};
