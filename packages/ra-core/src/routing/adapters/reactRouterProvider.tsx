import * as React from 'react';
import { useContext, useEffect, useRef, ReactNode } from 'react';
import {
    useNavigate as useReactRouterNavigate,
    useLocation,
    useParams,
    useBlocker,
    useMatch,
    useInRouterContext,
    Link,
    Navigate,
    Route,
    Routes,
    Outlet,
    matchPath,
    createHashRouter,
    RouterProvider as ReactRouterProvider,
    UNSAFE_DataRouterContext,
    UNSAFE_DataRouterStateContext,
    type FutureConfig,
} from 'react-router-dom';
import type {
    RouterProvider,
    RouterWrapperProps,
    RouterNavigateFunction,
} from '../RouterProvider';

const routerProviderFuture: Partial<
    Pick<FutureConfig, 'v7_startTransition' | 'v7_relativeSplatPath'>
> = { v7_startTransition: false, v7_relativeSplatPath: false };

/**
 * Hook to check if navigation blocking is supported.
 * In react-router, blocking requires a data router.
 */
const useCanBlock = (): boolean => {
    const dataRouterContext = useContext(UNSAFE_DataRouterContext);
    const dataRouterStateContext = useContext(UNSAFE_DataRouterStateContext);
    return !!(dataRouterContext && dataRouterStateContext);
};

/**
 * Wrapper around react-router's useNavigate that returns a stable function reference.
 *
 * react-router's useNavigate forces rerenders on every navigation, even if we don't use the result.
 * @see https://github.com/remix-run/react-router/issues/7634
 *
 * This wrapper uses a ref to return a stable function reference, avoiding unnecessary rerenders
 * in components that use navigate but don't need to rerender on navigation.
 */
const useNavigate = (): RouterNavigateFunction => {
    const navigate = useReactRouterNavigate();
    const navigateRef = useRef<RouterNavigateFunction>(
        navigate as RouterNavigateFunction
    );

    useEffect(() => {
        navigateRef.current = navigate as RouterNavigateFunction;
    }, [navigate]);

    // Return a stable function that always calls the latest navigate
    return React.useCallback((...args: Parameters<RouterNavigateFunction>) => {
        return navigateRef.current(...args);
    }, []) as RouterNavigateFunction;
};

/**
 * Internal router component that creates a HashRouter.
 * Only used when not already inside a router context.
 */
const InternalRouter = ({
    children,
    basename,
}: {
    children: ReactNode;
    basename?: string;
}) => {
    const router = createHashRouter([{ path: '*', element: <>{children}</> }], {
        basename,
        future: {
            v7_fetcherPersist: false,
            v7_normalizeFormMethod: false,
            v7_partialHydration: false,
            v7_relativeSplatPath: false,
            v7_skipActionErrorRevalidation: false,
        },
    });
    return (
        <ReactRouterProvider router={router} future={routerProviderFuture} />
    );
};

/**
 * RouterWrapper component for react-router.
 * Creates a HashRouter if not already inside a router context.
 */
const RouterWrapper = ({ basename, children }: RouterWrapperProps) => {
    const isInRouter = useInRouterContext();

    if (isInRouter) {
        return <>{children}</>;
    }

    return <InternalRouter basename={basename}>{children}</InternalRouter>;
};

/**
 * Default router provider using react-router-dom.
 * This provider is used by default when no custom routerProvider is provided to <Admin>.
 */
export const reactRouterProvider: RouterProvider = {
    // Hooks
    useNavigate,
    useLocation,
    useParams: useParams as RouterProvider['useParams'],
    useBlocker,
    useMatch,
    useInRouterContext,
    useCanBlock,

    // Components
    Link,
    Navigate,
    Route,
    Routes,
    Outlet,

    // Router creation
    RouterWrapper,

    // Utilities
    matchPath,
};
