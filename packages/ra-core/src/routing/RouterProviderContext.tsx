import { createContext, useContext } from 'react';
import type { RouterProvider } from './RouterProvider';
import { reactRouterProvider } from './adapters/reactRouterProvider';

/**
 * Context for providing the router provider throughout the application.
 * Defaults to react-router provider, so existing apps work without changes.
 */
export const RouterProviderContext =
    createContext<RouterProvider>(reactRouterProvider);

RouterProviderContext.displayName = 'RouterProviderContext';

/**
 * Hook to access the current router provider.
 * Used internally by ra-core hooks and components to access routing primitives.
 *
 * @example
 * const provider = useRouterProvider();
 * const location = provider.useLocation();
 */
export const useRouterProvider = (): RouterProvider => {
    return useContext(RouterProviderContext);
};
