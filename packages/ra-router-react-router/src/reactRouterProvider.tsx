import * as React from 'react';
import {
    useContext,
    useEffect,
    useRef,
    forwardRef,
    createContext,
    ReactNode,
} from 'react';
import {
    useNavigate as useReactRouterNavigate,
    useLocation,
    useParams,
    useBlocker,
    useMatch,
    useInRouterContext,
    Navigate as ReactRouterNavigate,
    Route,
    Routes,
    Outlet,
    matchPath,
    RouterProvider as ReactRouterProvider,
    UNSAFE_DataRouterContext,
    UNSAFE_DataRouterStateContext,
    type FutureConfig,
    type NavigateProps,
} from 'react-router';
import {
    Link as ReactRouterDomLink,
    createHashRouter,
    type LinkProps,
} from 'react-router-dom';

// These types are used in the RouterProvider interface definition in ra-core.
// To avoid a circular build dependency (ra-core -> ra-router-react-router -> ra-core),
// this package redeclares necessary types. These types should exactly mirror the
// types in ra-core's RouterProvider interface.
type RouterNavigateFunction = (
    to: string | Partial<Location> | number,
    options?: { replace?: boolean; state?: any }
) => void;

interface RouterWrapperProps {
    basename?: string;
    children: ReactNode;
}

type UseParams = <
    T extends Record<string, string | undefined> = Record<
        string,
        string | undefined
    >,
>() => T;

const routerProviderFuture: Partial<
    Pick<FutureConfig, 'v7_startTransition' | 'v7_relativeSplatPath'>
> = { v7_startTransition: false, v7_relativeSplatPath: false };

/**
 * Provider-local basename context.
 *
 * react-admin exposes the basename through ra-core's `useBasename`, but this
 * package cannot import ra-core (it would create a circular build dependency:
 * ra-core -> ra-router-react-router -> ra-core). Instead, RouterWrapper — which
 * receives the basename from react-admin's AdminRouter — publishes it here, and
 * Link/Navigate/useNavigate read it to prepend the basename to absolute paths.
 *
 * It mirrors AdminRouter's own logic: empty in standalone mode (the basename
 * lives on the hash router) and the real basename in embedded mode (the host
 * router owns no basename, so links must carry it themselves).
 */
const BasenameContext = createContext<string>('');
const useProviderBasename = (): string => useContext(BasenameContext);

/**
 * Prepend the basename to an absolute path, guarded against double-prepending
 * paths that already include it (e.g. those built by react-admin's
 * `useCreatePath`).
 */
const prependBasename = (path: string, basename: string): string => {
    if (!basename || !path.startsWith('/')) return path;
    if (path === basename || path.startsWith(`${basename}/`)) return path;
    return `${basename}${path}`;
};

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
    const basename = useProviderBasename();
    const navigateRef = useRef<RouterNavigateFunction>(
        navigate as RouterNavigateFunction
    );
    const basenameRef = useRef(basename);
    basenameRef.current = basename;

    useEffect(() => {
        navigateRef.current = navigate as RouterNavigateFunction;
    }, [navigate]);

    // Return a stable function that always calls the latest navigate
    return React.useCallback((...args: Parameters<RouterNavigateFunction>) => {
        const [to, ...rest] = args;
        const bn = basenameRef.current;
        if (typeof to === 'string') {
            return navigateRef.current(prependBasename(to, bn), ...rest);
        }
        if (to && typeof to === 'object' && 'pathname' in to && to.pathname) {
            return navigateRef.current(
                { ...to, pathname: prependBasename(to.pathname, bn) },
                ...rest
            );
        }
        return navigateRef.current(to, ...rest);
    }, []) as RouterNavigateFunction;
};

/**
 * Wrapper around react-router-dom's Link that prepends the react-admin
 * basename to absolute paths (see prependBasename and BasenameContext).
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ to, ...rest }, ref) => {
        const basename = useProviderBasename();
        const resolvedTo =
            typeof to === 'string'
                ? prependBasename(to, basename)
                : to && typeof to === 'object' && to.pathname
                  ? { ...to, pathname: prependBasename(to.pathname, basename) }
                  : to;
        return <ReactRouterDomLink ref={ref} to={resolvedTo} {...rest} />;
    }
);
Link.displayName = 'Link';

/**
 * Wrapper around react-router's Navigate that prepends the react-admin
 * basename to absolute paths, mirroring the Link behavior.
 */
const Navigate = ({ to, ...rest }: NavigateProps) => {
    const basename = useProviderBasename();
    const resolvedTo =
        typeof to === 'string'
            ? prependBasename(to, basename)
            : to && typeof to === 'object' && to.pathname
              ? { ...to, pathname: prependBasename(to.pathname, basename) }
              : to;
    return <ReactRouterNavigate to={resolvedTo} {...rest} />;
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
        // Embedded mode: the host router owns no basename, so publish it for
        // Link/Navigate/useNavigate to prepend.
        return (
            <BasenameContext.Provider value={basename ?? ''}>
                {children}
            </BasenameContext.Provider>
        );
    }

    // Standalone mode: the hash router carries the basename natively, so the
    // provider-local basename stays empty to avoid double-prepending.
    return (
        <BasenameContext.Provider value="">
            <InternalRouter basename={basename}>{children}</InternalRouter>
        </BasenameContext.Provider>
    );
};

/**
 * Default router provider using react-router-dom.
 * This provider is used by default when no custom routerProvider is provided to <Admin>.
 */
export const reactRouterProvider = {
    // Hooks
    useNavigate,
    useLocation,
    useParams: useParams as UseParams,
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
