import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
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
export const useCanAccessCallback = <ErrorType = Error>() => {
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
