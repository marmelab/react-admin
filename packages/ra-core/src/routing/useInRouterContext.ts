import { useRouterProvider } from './RouterProviderContext';

/**
 * Hook to check if we are inside a router context.
 * This is a router-agnostic wrapper that uses the configured router provider.
 *
 * @example
 * const isInRouter = useInRouterContext();
 * if (!isInRouter) {
 *   // Need to wrap with a router
 * }
 */
export const useInRouterContext = (): boolean => {
    const provider = useRouterProvider();
    return provider.useInRouterContext();
};
