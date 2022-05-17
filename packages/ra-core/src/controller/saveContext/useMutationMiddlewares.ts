import { useCallback, useMemo, useRef } from 'react';

/**
 * Internal hook used to handle middlewares.
 */
export const useMutationMiddlewares = <
    MutateFunc extends (...args: any[]) => any = (...args: any[]) => any
>(): UseMutationMiddlewaresResult<MutateFunc> => {
    const callbacks = useRef<Middleware<MutateFunc>[]>([]);

    const addMiddleware = useCallback((callback: Middleware<MutateFunc>) => {
        callbacks.current.push(callback);
    }, []);

    const removeMiddleware = useCallback((callback: Middleware<MutateFunc>) => {
        callbacks.current = callbacks.current.filter(cb => cb !== callback);
    }, []);

    const getMutateWithMiddlewares = useCallback((fn: MutateFunc) => {
        return (...args: Parameters<MutateFunc>) => {
            let index = callbacks.current.length - 1;

            const next = (...newArgs: any) => {
                index--;
                if (index >= 0) {
                    return callbacks.current[index](...newArgs, next);
                } else {
                    return fn(...newArgs);
                }
            };

            if (callbacks.current.length > 0) {
                // @ts-ignore
                return callbacks.current[index](...args, next);
            }

            return fn(...args);
        };
    }, []);

    const functions = useMemo<UseMutationMiddlewaresResult>(
        () => ({
            addMiddleware,
            getMutateWithMiddlewares,
            removeMiddleware,
        }),
        [addMiddleware, getMutateWithMiddlewares, removeMiddleware]
    );

    // @ts-ignore
    return functions;
};

export interface UseMutationMiddlewaresResult<
    MutateFunc extends (...args: any[]) => any = (...args: any[]) => any
> {
    addMiddleware: (callback: Middleware<MutateFunc>) => void;
    getMutateWithMiddlewares: (mutate: MutateFunc) => MutateFunc;
    removeMiddleware: (callback: Middleware<MutateFunc>) => void;
}

export type Middleware<MutateFunc> = MutateFunc extends (...a: any[]) => infer R
    ? (...a: [...U: Parameters<MutateFunc>, next: MutateFunc]) => R
    : never;
