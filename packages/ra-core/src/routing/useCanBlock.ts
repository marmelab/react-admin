import { useRouterProvider } from './RouterProviderContext';

/**
 * Returns whether navigation blocking (useBlocker) is supported in the current context.
 * For react-router, this requires a data router. For other routers, it may always be true.
 *
 * @returns {boolean} Whether blocking is supported
 */
export const useCanBlock = (): boolean => {
    const provider = useRouterProvider();
    return provider.useCanBlock();
};
