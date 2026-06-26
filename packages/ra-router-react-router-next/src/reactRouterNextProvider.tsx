import * as React from 'react';
import { useContext, useEffect, useRef, forwardRef, ReactNode } from 'react';
import {
    useNavigate as useReactRouterNavigate,
    useLocation,
    useParams,
    useBlocker,
    useMatch,
    useInRouterContext,
    Link as ReactRouterLink,
    Navigate as ReactRouterNavigate,
    Route,
    Routes,
    Outlet,
    matchPath,
    createHashRouter,
    RouterProvider as ReactRouterProvider,
    UNSAFE_DataRouterContext,
    UNSAFE_DataRouterStateContext,
} from 'react-router';
import { useBasename } from 'ra-core';
import type {
    RouterProvider,
    RouterWrapperProps,
    RouterNavigateFunction,
    RouterLinkProps,
    RouterNavigateProps,
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
    const basename = useBasename();
    const navigateRef = useRef<RouterNavigateFunction>(
        navigate as RouterNavigateFunction
    );

    useEffect(() => {
        navigateRef.current = navigate as RouterNavigateFunction;
    }, [navigate]);

    // Return a stable function that always calls the latest navigate
    return React.useCallback(
        (...args: Parameters<RouterNavigateFunction>) => {
            const [to, ...rest] = args;

            // Handle numeric navigation (go back/forward)
            if (typeof to === 'number') {
                return navigateRef.current(to, ...rest);
            }

            // Helper to prepend basename to absolute paths
            // Only prepend if path doesn't already start with basename
            const resolvePath = (path: string) => {
                if (!basename || !path.startsWith('/')) return path;
                // Don't prepend if path already includes basename
                if (path.startsWith(basename + '/') || path === basename) {
                    return path;
                }
                return `${basename}${path}`;
            };

            // Handle object navigation { pathname?, search?, hash?, state? }
            // This covers both { pathname: '/foo' } and { search: '?bar=1' }
            if (typeof to === 'object' && to !== null) {
                // If no pathname provided, keep current pathname
                return navigateRef.current(
                    to.pathname
                        ? { ...to, pathname: resolvePath(to.pathname) }
                        : to,
                    ...rest
                );
            }

            // Handle string path
            const resolvedPath = resolvePath(to as string);
            return navigateRef.current(resolvedPath, ...rest);
        },
        [basename]
    ) as RouterNavigateFunction;
};

const Link = forwardRef<HTMLAnchorElement, RouterLinkProps>(
    ({ to, ...rest }, ref) => {
        const basename = useBasename();

        // Helper to prepend basename to absolute paths
        const resolvePath = (path: string) => {
            if (!basename || !path.startsWith('/')) return path;
            if (path.startsWith(basename + '/') || path === basename) {
                return path;
            }
            return `${basename}${path}`;
        };

        // Handle object `to` (e.g., { pathname: '/path', search: '?foo=bar' })
        let resolvedTo: typeof to;
        if (typeof to === 'object' && to !== null) {
            // If no pathname provided, keep it as-is to stay on current page
            resolvedTo = to.pathname
                ? { ...to, pathname: resolvePath(to.pathname) }
                : to;
        } else {
            resolvedTo = resolvePath(to as string);
        }
        return <ReactRouterLink ref={ref} to={resolvedTo} {...rest} />;
    }
);
Link.displayName = 'Link';

const Navigate = ({ to, ...rest }: RouterNavigateProps) => {
    const basename = useBasename();
    const currentLocation = useLocation();

    // Handle both string and object forms of `to`
    let resolvedPath: string;

    if (typeof to === 'string') {
        resolvedPath = to;
    } else {
        // If no pathname provided, use current pathname to stay on current page
        resolvedPath = to.pathname ?? currentLocation.pathname;

        // Append search and hash directly to the path to preserve the raw
        // query string format
        if (to.search) {
            resolvedPath += to.search.startsWith('?')
                ? to.search
                : `?${to.search}`;
        }
        if (to.hash) {
            resolvedPath += to.hash.startsWith('#') ? to.hash : `#${to.hash}`;
        }
    }

    // Prepend basename to the path
    // Only prepend if path doesn't already start with basename
    if (basename && resolvedPath.startsWith('/')) {
        if (
            !resolvedPath.startsWith(basename + '/') &&
            resolvedPath !== basename
        ) {
            resolvedPath = `${basename}${resolvedPath}`;
        }
    }

    return <ReactRouterNavigate to={resolvedPath} {...rest} />;
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
 * react-admin uses its built-in react-router v6/v7 adapter by default. Pass this
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
