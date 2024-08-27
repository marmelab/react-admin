import {
    QueryObserverResult,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';

/**
 * Hook for determining if user can access given resource
 *
 * Calls the authProvider.canAccess() method using react-query.
 * If the authProvider returns a rejected promise, returns false.
 *
 * The return value updates according to the request state:
 *
 * - start: { isPending: true }
 * - success: { permissions: [any], isPending: false }
 * - error: { error: [error from provider], isPending: false }
 *
 * Useful to enable features based on user role
 *
 * @param {Object} params Any params you want to pass to the authProvider
 *
 * @returns The current auth check state. Destructure as { isAccessible, error, isPending, refetch }.
 *
 * @example
 *     import { useCanAccess } from 'react-admin';
 *
 *     const PostDetail = () => {
 *         const { isPending, permissions } = useCanAccess({
 *             resource: 'posts',
 *             action: 'read',
 *         });
 *         if (!isPending && isAccessible) {
 *             return <PostEdit />
 *         } else {
 *             return null;
 *         }
 *     };
 */
const useCanAccessCallback = <ErrorType = Error>() => {
    const authProvider = useAuthProvider();

    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation<
        UseCanAccessCallbackResult<ErrorType>,
        ErrorType,
        UseCanAccessCallbackOptions
    >({
        mutationFn: async (
            params: UseCanAccessCallbackOptions
        ): Promise<UseCanAccessCallbackResult<ErrorType>> => {
            if (!authProvider || !authProvider.canAccess) {
                return { isAccessible: true, error: undefined };
            }

            const cachedResult = queryClient.getQueryData([
                params.resource,
                params.action,
                params.record,
            ]);

            if (cachedResult) {
                return cachedResult as UseCanAccessCallbackResult<ErrorType>;
            }
            return authProvider
                .canAccess(params)
                .then(data => ({ isAccessible: data, error: undefined }))
                .catch(error => ({ isAccessible: undefined, error }));
        },
        onSuccess: (data, params) => {
            queryClient.setQueryData(
                [params.resource, params.action, params.record],
                data
            );
        },
    });

    return mutateAsync;
};

export default useCanAccessCallback;

export type UseCanAccessCallbackOptions = {
    resource: string;
    action: string;
    record?: unknown;
};

export type UseCanAccessCallbackResult<ErrorType = Error> =
    | {
          isAccessible: boolean;
          error: undefined;
      }
    | {
          isAccessible: undefined;
          error: ErrorType;
      };
