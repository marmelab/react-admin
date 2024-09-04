import {
    UseMutateAsyncFunction,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';

/**
 * A hook that returns a function you can call to determine whether user has access to the given resource
 *
 * Calls the authProvider.canAccess() method using react-query.
 * If the authProvider returns a rejected promise, returns false.
 *
 * @example
 *     import { useCanAccessCallback, useDataProvider } from 'react-admin';
 *
 *     const ResetViewsButton = () => {
 *         const checkAccess = useCanAccessCallback();
 *         const dataProvider = useDataProvider();
 *
 *         const resetViews = () => {
 *             const { canAccess, error } = checkAccess({ resource: 'posts', action: 'read' });
 *             if (canAccess) {
 *                 dataProvider.resetViews('users', { id: record.id });
 *             } else {
 *                 console.log('You are not authorized to reset views');
 *             }
 *         };
 *
 *         return <button onClick={resetViews}>Reset Views</button>;
 *     };
 */
export const useCanAccessCallback = <ErrorType = Error>() => {
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
                return { canAccess: true, error: undefined };
            }

            const cachedResult = queryClient.getQueryData<
                UseCanAccessCallbackResult<ErrorType>
            >(['auth', 'canAccess', JSON.stringify(params)]);

            if (cachedResult && cachedResult.canAccess !== undefined) {
                return cachedResult;
            }
            return authProvider
                .canAccess(params)
                .then(data => ({ canAccess: data, error: undefined }))
                .catch(error => ({ canAccess: undefined, error }));
        },
        onSuccess: (data, params) => {
            queryClient.setQueryData(
                ['auth', 'canAccess', JSON.stringify(params)],
                data
            );
        },
    });

    return mutateAsync;
};

export type UseCanAccessCallback<ErrorType = Error> = UseMutateAsyncFunction<
    UseCanAccessCallbackResult<ErrorType>,
    ErrorType,
    UseCanAccessCallbackOptions,
    unknown
>;

export type UseCanAccessCallbackOptions = {
    resource: string;
    action: string;
    record?: unknown;
};

export type UseCanAccessCallbackResult<ErrorType = Error> =
    | {
          canAccess: boolean;
          error: undefined;
      }
    | {
          canAccess: undefined;
          error: ErrorType;
      };
