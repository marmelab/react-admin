import { useEffect } from 'react';
import { Middleware } from './useMutationMiddlewares';
import { useSaveContext } from './useSaveContext';

/**
 * Internal hook that registers a middleware for the save function in the current SaveContext.
 * @param callback The middleware function.
 */
export const useRegisterMutationMiddleware = <
    MutateFunc extends (...args: any[]) => any = (...args: any[]) => any,
>(
    callback: Middleware<MutateFunc>
) => {
    const { registerMutationMiddleware, unregisterMutationMiddleware } =
        useSaveContext();

    useEffect(() => {
        if (!registerMutationMiddleware || !unregisterMutationMiddleware) {
            return;
        }
        registerMutationMiddleware(callback);
        return () => {
            unregisterMutationMiddleware(callback);
        };
    }, [callback, registerMutationMiddleware, unregisterMutationMiddleware]);
};
