import { useCallback, useMemo, useRef } from 'react';

/**
 * Internal hook used to handle mutation middlewares.
 *
 * @example
 * // We have a form creating an order for a new customer.
 * // The form contains the customer fields in addition to the order fields
 * // but they should be saved as a new customer resource record
 * // and the order should only reference this new customer
 * type Order = { id: string; reference: string };
 * type OrderCreateFormData = { id: string; reference: string; customer: Customer };
 * type Customer = { id: string; email: string; firstName: string; lastName: string };
 *
 * const CustomerForm = props => {
 *     const [createCustomer] = useCreate<Customer>();
 *     const middleware: Middleware<UseCreateResult<OrderCreateFormData>[0]> = useCallback(async (resource, params, options, next) => {
 *         const { data } = params;
 *         const { user, ...orderData } = data;
 *         await createCustomer(
 *             'customers',
 *             { data: user },
 *             {
 *                 onSuccess: (newCustomer) => {
 *                     const orderDataWithCustomer = { ...orderData, customerId: newCustomer.id };
 *                     next(resource, { data: orderDataWithCustomer }, options);
 *                 },
 *             }
 *         });
 *     }, [createCustomer]);
 *     useRegisterMutationMiddleware(middleware);
 *
 *     return (
 *         <>
 *             <TextInput source="user.email" />
 *             <TextInput source="user.firstName" />
 *             <TextInput source="user.lastName" />
 *         </>
 *     );
 * }
 */
export const useMutationMiddlewares = <
    MutateFunc extends (...args: any[]) => any = (...args: any[]) => any
>(): UseMutationMiddlewaresResult<MutateFunc> => {
    const callbacks = useRef<Middleware<MutateFunc>[]>([]);

    const registerMutationMiddleware = useCallback(
        (callback: Middleware<MutateFunc>) => {
            callbacks.current.push(callback);
        },
        []
    );

    const unregisterMutationMiddleware = useCallback(
        (callback: Middleware<MutateFunc>) => {
            callbacks.current = callbacks.current.filter(cb => cb !== callback);
        },
        []
    );

    const getMutateWithMiddlewares = useCallback((fn: MutateFunc) => {
        return (...args: Parameters<MutateFunc>): ReturnType<MutateFunc> => {
            let index = callbacks.current.length - 1;

            // Called by middlewares to call the next middleware function
            // Should take the same arguments as the original mutation function
            const next = (...newArgs: any) => {
                // Decrement the middlewares counter so that when next is called again, we
                // call the next middleware
                index--;

                // If there are no more middlewares, we call the original mutation function
                if (index >= 0) {
                    return callbacks.current[index](...newArgs, next);
                } else {
                    return fn(...newArgs);
                }
            };

            if (callbacks.current.length > 0) {
                // Call the first middleware with the same args as the original mutation function
                // with an additional next function
                return callbacks.current[index](...args, next);
            }

            return fn(...args);
        };
    }, []);

    const functions = useMemo<UseMutationMiddlewaresResult<MutateFunc>>(
        () => ({
            registerMutationMiddleware,
            getMutateWithMiddlewares,
            unregisterMutationMiddleware,
        }),
        [
            registerMutationMiddleware,
            getMutateWithMiddlewares,
            unregisterMutationMiddleware,
        ]
    );

    return functions;
};

export interface UseMutationMiddlewaresResult<
    MutateFunc extends (...args: any[]) => any = (...args: any[]) => any
> {
    registerMutationMiddleware: (callback: Middleware<MutateFunc>) => void;
    getMutateWithMiddlewares: (
        mutate: MutateFunc
    ) => (...args: Parameters<MutateFunc>) => ReturnType<MutateFunc>;
    unregisterMutationMiddleware: (callback: Middleware<MutateFunc>) => void;
}

export type Middleware<
    MutateFunc = (...args: any[]) => any
> = MutateFunc extends (...a: any[]) => infer R
    ? (...a: [...U: Parameters<MutateFunc>, next: MutateFunc]) => R
    : never;
