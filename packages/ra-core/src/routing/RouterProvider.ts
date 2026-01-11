import { ComponentType, ReactNode } from 'react';

export interface RouterLocation {
    pathname: string;
    search: string;
    hash: string;
    state?: any;
    key?: string;
}

export interface RouterNavigateOptions {
    replace?: boolean;
    state?: any;
}

export type RouterNavigateFunction = (
    to: string | Partial<RouterLocation> | number,
    options?: RouterNavigateOptions
) => void;

export interface RouterBlockerBlocked {
    state: 'blocked';
    reset: () => void;
    proceed: () => void;
    location: RouterLocation;
}

export interface RouterBlockerUnblocked {
    state: 'unblocked';
    reset: undefined;
    proceed: undefined;
    location: undefined;
}

export interface RouterBlockerProceeding {
    state: 'proceeding';
    reset: undefined;
    proceed: undefined;
    location: RouterLocation;
}

export type RouterBlocker =
    | RouterBlockerBlocked
    | RouterBlockerUnblocked
    | RouterBlockerProceeding;

export type RouterHistoryAction = 'POP' | 'PUSH' | 'REPLACE';

export type RouterBlockerFunction = (args: {
    currentLocation: RouterLocation;
    nextLocation: RouterLocation;
    historyAction: RouterHistoryAction;
}) => boolean;

export interface RouterMatch {
    params: Record<string, string | undefined>;
    pathname: string;
    pathnameBase: string;
}

export type RouterTo = string | Partial<RouterLocation>;

export interface RouterLinkProps {
    to: RouterTo;
    replace?: boolean;
    state?: any;
    children?: ReactNode;
    className?: string;
    [key: string]: any;
}

export interface RouterNavigateProps {
    to: string | Partial<RouterLocation>;
    replace?: boolean;
    state?: any;
}

export interface RouterRouteProps {
    path?: string;
    element?: ReactNode;
    children?: ReactNode;
    index?: boolean;
}

export interface RouterRoutesProps {
    children: ReactNode;
    location?: RouterLocation | string;
}

export interface RouterOutletProps {
    context?: any;
}

export interface RouterWrapperProps {
    basename?: string;
    children: ReactNode;
}

/**
 * The RouterProvider interface defines all routing primitives used by ra-core.
 * Implement this interface to use a different router library (e.g., TanStack Router).
 *
 * @example
 * // Using the default react-router provider (no configuration needed)
 * <Admin dataProvider={dataProvider}>
 *   <Resource name="posts" list={PostList} />
 * </Admin>
 *
 * @example
 * // Using a custom router provider
 * import { tanStackRouterProvider } from 'ra-core';
 *
 * <Admin dataProvider={dataProvider} routerProvider={tanStackRouterProvider}>
 *   <Resource name="posts" list={PostList} />
 * </Admin>
 */
export interface RouterProvider {
    // === Hooks ===

    /**
     * Returns the current location object.
     */
    useLocation: () => RouterLocation;

    /**
     * Returns a function to navigate programmatically.
     */
    useNavigate: () => RouterNavigateFunction;

    /**
     * Returns route parameters as key-value pairs.
     */
    useParams: <
        T extends Record<string, string | undefined> = Record<
            string,
            string | undefined
        >,
    >() => T;

    /**
     * Blocks navigation based on a condition.
     * Used by useWarnWhenUnsavedChanges to prevent losing form data.
     */
    useBlocker: (shouldBlock: RouterBlockerFunction | boolean) => RouterBlocker;

    /**
     * Returns a match object if the current location matches the given pattern.
     */
    useMatch: (pattern: { path: string; end?: boolean }) => RouterMatch | null;

    /**
     * Returns whether we are currently inside a router context.
     */
    useInRouterContext: () => boolean;

    /**
     * Returns whether navigation blocking (useBlocker) is supported in the current context.
     * For react-router, this requires a data router. For other routers, it may always be true.
     */
    useCanBlock: () => boolean;

    // === Components ===

    /**
     * Link component for navigation.
     */
    Link: ComponentType<RouterLinkProps>;

    /**
     * Component for programmatic/declarative navigation.
     */
    Navigate: ComponentType<RouterNavigateProps>;

    /**
     * Route definition component.
     */
    Route: ComponentType<RouterRouteProps>;

    /**
     * Routes container component.
     */
    Routes: ComponentType<RouterRoutesProps>;

    /**
     * Outlet for nested routes.
     */
    Outlet: ComponentType<RouterOutletProps>;

    // === Utilities ===

    /**
     * Matches a path pattern against a pathname.
     */
    matchPath: (
        pattern: string | { path: string; end?: boolean },
        pathname: string
    ) => RouterMatch | null;

    // === Router Creation ===

    /**
     * Component that wraps children with a router if not already in a router context.
     *
     * The component should:
     * 1. Check if already inside a router context (using useInRouterContext)
     * 2. If yes, render children directly
     * 3. If no, wrap children with a router
     */
    RouterWrapper: ComponentType<RouterWrapperProps>;
}
