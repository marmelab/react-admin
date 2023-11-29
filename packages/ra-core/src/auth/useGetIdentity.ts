import { useEffect, useMemo } from 'react';
import {
    useQuery,
    UseQueryOptions,
    QueryObserverResult,
} from '@tanstack/react-query';

import useAuthProvider from './useAuthProvider';
import { UserIdentity } from '../types';

const defaultIdentity = {
    id: '',
    fullName: null,
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
 * @returns The current user identity. Destructure as { isPending, data, error, refetch }.
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
    const { onSuccess, onError, ...queryOptions } = options;

    const result = useQuery({
        queryKey: ['auth', 'getIdentity'],
        queryFn: () => {
            return authProvider
                ? authProvider.getIdentity() ?? null
                : Promise.resolve(defaultIdentity);
        },
        enabled: typeof authProvider?.getIdentity === 'function',
        ...queryOptions,
    });

    useEffect(() => {
        if (result.data != null && onSuccess) {
            onSuccess(result.data);
        }
    }, [onSuccess, result.data]);

    useEffect(() => {
        if (result.error != null && onError) {
            onError(result.error);
        }
    }, [onError, result.error]);

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
}

export type UseGetIdentityResult<ErrorType = Error> = QueryObserverResult<
    UserIdentity,
    ErrorType
> & {
    identity: UserIdentity;
};

export default useGetIdentity;
