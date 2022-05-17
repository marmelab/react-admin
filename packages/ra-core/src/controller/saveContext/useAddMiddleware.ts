import { useEffect } from 'react';
import { Middleware } from './useMutationMiddlewares';
import { useSaveContext } from './useSaveContext';

/**
 * Internal hook that registers a middleware for the save function in the current SaveContext.
 * @param callback The middleware function.
 */
export const useAddMiddleware = <
    MutateFunc extends (...args: any[]) => any = (...args: any[]) => any
>(
    callback: Middleware<MutateFunc>
) => {
    const { addMiddleware, removeMiddleware } = useSaveContext();

    useEffect(() => {
        addMiddleware(callback);
        return () => {
            removeMiddleware(callback);
        };
    }, [callback, addMiddleware, removeMiddleware]);
};
