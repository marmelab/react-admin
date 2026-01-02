import { useRouterProvider } from './RouterProviderContext';

/**
 * Hook to access URL parameters.
 * This is a router-agnostic wrapper that uses the configured router provider.
 *
 * @example
 * const params = useParams<{ id: string }>();
 * console.log(params.id);
 */
export const useParams = <
    T extends Record<string, string | undefined> = Record<
        string,
        string | undefined
    >,
>(): T => {
    const provider = useRouterProvider();
    return provider.useParams<T>();
};
