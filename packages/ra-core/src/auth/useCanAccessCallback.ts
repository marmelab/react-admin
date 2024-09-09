import {
    UseMutateAsyncFunction,
    useMutation,
    UseMutationOptions,
} from '@tanstack/react-query';
import useAuthProvider from './useAuthProvider';

/**
 * A hook that returns a function you can call to determine whether user has access to the given resource
 *
 * @example
 *     import { useCanAccessCallback, useDataProvider } from 'react-admin';
 *
 *     const ResetViewsButton = () => {
 *         const checkAccess = useCanAccessCallback();
 *         const dataProvider = useDataProvider();
 *
 *         const resetViews = () => {
 *             try {
 *                 const canAccess = checkAccess({ resource: 'posts', action: 'read' });
 *                 if (canAccess) {
 *                     dataProvider.resetViews('users', { id: record.id });
 *                 } else {
 *                     console.log('You are not authorized to reset views');
 *                 }
 *             } catch (error) {
 *                 console.error(error);
 *             }
 *         };
 *
 *         return <button onClick={resetViews}>Reset Views</button>;
 *     };
 */
export const useCanAccessCallback = <ErrorType = Error>(
    options: Omit<
        UseMutationOptions<
            UseCanAccessCallbackResult,
            ErrorType,
            UseCanAccessCallbackOptions
        >,
        'mutationFn'
    > = {}
) => {
    const authProvider = useAuthProvider();

    const { mutateAsync } = useMutation<
        UseCanAccessCallbackResult,
        ErrorType,
        UseCanAccessCallbackOptions
    >({
        mutationFn: async (
            params: UseCanAccessCallbackOptions
        ): Promise<UseCanAccessCallbackResult> => {
            if (!authProvider || !authProvider.canAccess) {
                return true;
            }
            return authProvider.canAccess(params);
        },
        retry: false,
        ...options,
    });

    return mutateAsync;
};

export type UseCanAccessCallback<ErrorType = Error> = UseMutateAsyncFunction<
    UseCanAccessCallbackResult,
    ErrorType,
    UseCanAccessCallbackOptions,
    unknown
>;

export type UseCanAccessCallbackOptions = {
    resource: string;
    action: string;
    record?: unknown;
};

export type UseCanAccessCallbackResult = boolean;
