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
} from 'react-router';
import type {
    RouterProvider,
    RouterWrapperProps,
    RouterNavigateFunction,
} from 'ra-core';

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
    });
    return <ReactRouterProvider router={router} />;
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
 * Router provider for react-router v8.
 *
 * react-router v8 merged the former `react-router-dom` package into `react-router`
 * and dropped the v6/v7 `future` flags (they are now the default behavior), so this
 * adapter is a thin pass-through over the native `react-router` API.
 *
 * react-admin uses its built-in react-router v6 adapter by default. Pass this
 * provider to `<Admin routerProvider={reactRouterNextProvider}>` to run on react-router v8.
 * New projects are encouraged to use this provider; it will become the default
 * (republished as `ra-router-react-router`) in react-admin v6.
 */
// FIXME kept for BC: republish as ra-router-react-router for react-admin v6
export const reactRouterNextProvider: RouterProvider = {
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
