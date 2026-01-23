import { useRouterProvider } from './RouterProviderContext';
import type { RouterLocation } from './RouterProvider';

/**
 * Hook to access the current location.
 * This is a router-agnostic wrapper that uses the configured router provider.
 *
 * @example
 * const location = useLocation();
 * console.log(location.pathname);
 */
export const useLocation = (): RouterLocation => {
    const provider = useRouterProvider();
    return provider.useLocation();
};
