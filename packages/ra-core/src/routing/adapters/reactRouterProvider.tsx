import * as React from 'react';
import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from 'react';
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

const RouterChildrenContext = createContext<ReactNode>(null);

const RouterChildren = () => <>{useContext(RouterChildrenContext)}</>;

/**
 * Internal router component that creates a HashRouter.
 * Only used when not already inside a router context.
 *
 * The router is created once: recreating it on every render would discard its
 * state, e.g. a pending navigation blocked by useBlocker, or a navigation
 * triggered while the component rendering <Admin> rerenders.
 *
 * As the router keeps the route element it was created with, that element
 * reads the children from a context rather than closing over them, so that
 * children updates still reach the router.
 *
 * The basename can only be set at creation time, so RouterWrapper remounts
 * this component when the basename changes.
 */
const InternalRouter = ({
    children,
    basename,
}: {
    children: ReactNode;
    basename?: string;
}) => {
    const [router] = useState(() =>
        createHashRouter([{ path: '*', element: <RouterChildren /> }], {
            basename,
            future: {
                v7_fetcherPersist: false,
                v7_normalizeFormMethod: false,
                v7_partialHydration: false,
                v7_relativeSplatPath: false,
                v7_skipActionErrorRevalidation: false,
            },
        })
    );
    return (
        <RouterChildrenContext.Provider value={children}>
            <ReactRouterProvider
                router={router}
                future={routerProviderFuture}
            />
        </RouterChildrenContext.Provider>
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

    return (
        <InternalRouter key={basename} basename={basename}>
            {children}
        </InternalRouter>
    );
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
