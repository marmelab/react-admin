import * as React from 'react';
import { ReactNode, forwardRef, useCallback, useMemo } from 'react';
import {
    useNavigate as useTanStackNavigate,
    useLocation as useTanStackLocation,
    useRouter,
    useBlocker as useTanStackBlocker,
    Link as TanStackLink,
    Navigate as TanStackNavigate,
    Outlet as TanStackOutlet,
    createRouter,
    createRootRoute,
    RouterProvider as TanStackRouterProvider,
} from '@tanstack/react-router';
import { createHashHistory } from '@tanstack/history';
import type {
    RouterProvider,
    RouterWrapperProps,
    RouterNavigateFunction,
    RouterLocation,
    RouterBlocker,
    RouterBlockerFunction,
    RouterMatch,
    RouterLinkProps,
    RouterNavigateProps,
    RouterRouteProps,
    RouterRoutesProps,
    RouterOutletProps,
} from '../RouterProvider';
import { useBasename } from '../useBasename';

/**
 * TanStack Router adapter for react-admin.
 *
 * This implementation is a translation layer that bridges react-admin's JSX-based,
 * render-time routing with TanStack Router's configuration-based approach,
 * while maintaining the same API that react-admin components expect.
 *
 * Key implementation details:
 *
 * TanStack Router expects routes defined at configuration time:
 *
 *     const postRoute = createRoute({
 *       path: '/posts/:id',
 *       // params are known at compile time
 *     })
 *
 * React-admin, on the other hand, defines routes declaratively in JSX at render time:
 *
 *     <Routes>
 *       <Route path=":id/show/*" element={<Show />} />
 *       <Route path=":id/*" element={<Edit />} />
 *     </Routes>
 *
 * The Routes component in the adapter uses a custom matchPath function
 * to determine which route matches, then stores the extracted params
 * in a ParamsContext. TanStack Router never "sees" these nested routes.
 *
 * This implementation uses its own useParams hook, not TanStack Router's native one.
 * TanStack Router's native useParams reads from its pre-compiled route tree,
 * but react-admin's routes don't exist in that tree - they're handled by
 * a custom Routes component.
 *
 * The custom useParams merges params from two sources:
 *
 *     // From react-admin's Routes matching
 *     const routesParams = React.useContext(ParamsContext);
 *
 *     // From TanStack Router's native matching (for embedded mode)
 *     const nativeParams = router.state.matches.reduce(...);
 *
 *     return { ...nativeParams, ...routesParams };
 *
 * This supports both:
 *
 *  - Standalone mode: Params come from ParamsContext
 *  - Embedded mode: An outer TanStack Router might have params (like /admin/:tenantId/*) that need to be merged with react-admin's inner params
 */

/**
 * Context for tracking the matched path in nested Routes.
 * This allows nested Routes to match against the remaining path.
 */
const MatchedPathContext = React.createContext<string>('');

/**
 * Context for tracking the matched params from Routes.
 * This allows useParams to return params from react-admin's route matching.
 */
const ParamsContext = React.createContext<Record<string, string>>({});

/**
 * Standalone path matcher similar to react-router's
 */
const matchPath = (
    pattern: string | { path: string; end?: boolean },
    pathname: string
): RouterMatch | null => {
    const path = typeof pattern === 'string' ? pattern : pattern.path;
    const end = typeof pattern === 'object' ? pattern.end ?? true : true;

    // Handle catch-all patterns: "*" or "/*"
    if (path === '*' || path === '/*') {
        // Extract what comes after the base path (/ for /*, empty for *)
        const base = path === '/*' ? '/' : '';
        const rest =
            path === '/*'
                ? pathname.startsWith('/')
                    ? pathname.slice(1)
                    : pathname
                : pathname;
        return {
            params: { '*': rest },
            pathname,
            pathnameBase: base || '/',
        };
    }

    // Handle empty path (index route)
    if (path === '' || path === '/') {
        if (pathname === '/' || pathname === '') {
            return {
                params: {},
                pathname: '/',
                pathnameBase: '/',
            };
        }
        if (!end) {
            return {
                params: {},
                pathname: '/',
                pathnameBase: '/',
            };
        }
        return null;
    }

    // Convert path pattern to regex
    // First, escape special regex characters, then replace param placeholders
    const paramNames: string[] = [];
    let normalizedPath = path.replace(/\/$/, ''); // Remove trailing slash

    // Normalize: ensure path starts with / for matching
    if (!normalizedPath.startsWith('/')) {
        normalizedPath = '/' + normalizedPath;
    }

    // Check if path ends with splat (/*) - we'll need to capture this
    const hasSplat = normalizedPath.endsWith('/*') || normalizedPath === '/*';

    // Calculate the static base path (before splat or params)
    const staticBase = normalizedPath
        .replace(/\/\*$/, '')
        .replace(/\/:[^/]+.*$/, '');

    let regexPattern = normalizedPath;

    // Escape special regex characters first (except : and *)
    regexPattern = regexPattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

    // Replace :param patterns with capture groups
    regexPattern = regexPattern.replace(/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
    });

    // Replace /* with optional slash + catch-all pattern
    // This allows posts/* to match both /posts and /posts/anything
    if (hasSplat) {
        paramNames.push('*');
    }
    regexPattern = regexPattern.replace(/\/\*/g, '(?:/(.*))?');

    // Replace standalone * with catch-all pattern
    regexPattern = regexPattern.replace(/\*/g, '(.*)');

    const regex = new RegExp(`^${regexPattern}${end ? '/?$' : '(?:/|$)'}`);
    const match = pathname.match(regex);

    if (!match) return null;

    const params: Record<string, string> = {};
    paramNames.forEach((name, index) => {
        params[name] = match[index + 1] ?? '';
    });

    const matchedPathname = match[0].replace(/\/$/, '') || '/';

    // pathnameBase is the consumed portion of the path (before the splat).
    // For routes with dynamic segments like `:id/*`, we need to include
    // the matched dynamic segments, not just the static portion.
    // This is used by nested Routes to calculate the remaining path.
    let pathnameBase: string;
    if (hasSplat) {
        // For splat routes, calculate base by removing what the splat matched
        const splatValue = params['*'] || '';
        if (splatValue) {
            // Remove the splat portion and the preceding slash
            pathnameBase =
                matchedPathname.slice(
                    0,
                    matchedPathname.length - splatValue.length - 1
                ) || '/';
        } else {
            // Splat matched empty string - base is the full matched path
            pathnameBase = matchedPathname;
        }
    } else {
        // For non-splat routes, the full match is consumed
        pathnameBase = matchedPathname;
    }

    return {
        params,
        pathname: matchedPathname,
        pathnameBase,
    };
};

const useInRouterContext = (): boolean => {
    const router = useRouter({ warn: false });
    return router != null;
};

const useCanBlock = (): boolean => true; // TanStack Router always supports blocking.

const mapHistoryAction = (action: string): 'POP' | 'PUSH' | 'REPLACE' => {
    switch (action) {
        case 'PUSH':
            return 'PUSH';
        case 'REPLACE':
            return 'REPLACE';
        case 'POP':
        case 'BACK':
        case 'FORWARD':
        case 'GO':
        default:
            return 'POP';
    }
};

const useLocation = (): RouterLocation => {
    const location = useTanStackLocation();
    return {
        pathname: location.pathname,
        search: location.searchStr ?? '',
        hash: location.hash ?? '',
        state: location.state,
        key: '',
    };
};

const useNavigate = (): RouterNavigateFunction => {
    const navigate = useTanStackNavigate();
    const router = useRouter();
    const basename = useBasename();

    return useCallback(
        (to, options) => {
            // Handle numeric navigation (go back/forward)
            if (typeof to === 'number') {
                router.history.go(to);
                return;
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

            // Handle object navigation { pathname, search, hash, state }
            if (typeof to === 'object' && to !== null && 'pathname' in to) {
                const loc = to as Partial<RouterLocation>;
                navigate({
                    to: resolvePath(loc.pathname ?? '/'),
                    search: loc.search
                        ? Object.fromEntries(new URLSearchParams(loc.search))
                        : undefined,
                    hash: loc.hash,
                    state: loc.state || options?.state,
                    replace: options?.replace,
                } as any);
                return;
            }

            // Handle string path
            navigate({
                to: resolvePath(to as string),
                state: options?.state,
                replace: options?.replace,
            } as any);
        },
        [navigate, router, basename]
    ) as RouterNavigateFunction;
};

const useParams = <
    T extends Record<string, string | undefined> = Record<string, string>,
>(): T => {
    // Get params from react-admin's Routes matching
    const routesParams = React.useContext(ParamsContext);

    // Also get params from TanStack Router's native matching (for embedded mode)
    const router = useRouter();
    const matches = router.state.matches;
    const nativeParams = matches.reduce(
        (acc, match) => ({
            ...acc,
            ...(match.params as Record<string, string>),
        }),
        {}
    );

    // Merge both, with react-admin's Routes params taking precedence
    return { ...nativeParams, ...routesParams } as T;
};

const useMatch = (pattern: {
    path: string;
    end?: boolean;
}): RouterMatch | null => {
    const location = useTanStackLocation();
    return matchPath(pattern, location.pathname);
};

const useBlocker = (
    shouldBlock: RouterBlockerFunction | boolean
): RouterBlocker => {
    // Use a ref to always get the latest shouldBlock function/value
    // This avoids closure issues where TanStack Router caches the callback
    // but the shouldBlock value changes (e.g., when form becomes dirty)
    const shouldBlockRef = React.useRef(shouldBlock);
    // Update ref synchronously on every render so it's always current
    shouldBlockRef.current = shouldBlock;

    const blocker = useTanStackBlocker({
        shouldBlockFn: ({ current, next, action }) => {
            const currentShouldBlock = shouldBlockRef.current;
            if (typeof currentShouldBlock === 'function') {
                return currentShouldBlock({
                    currentLocation: {
                        pathname: current.pathname,
                        search: '',
                        hash: '',
                        state: {},
                        key: '',
                    },
                    nextLocation: {
                        pathname: next.pathname,
                        search: '',
                        hash: '',
                        state: {},
                        key: '',
                    },
                    historyAction: mapHistoryAction(action),
                });
            }
            return currentShouldBlock;
        },
        withResolver: true,
    });

    if (blocker.status === 'blocked') {
        return {
            state: 'blocked',
            proceed: blocker.proceed!,
            reset: blocker.reset!,
            location: {
                pathname: blocker.next?.pathname ?? '',
                search: '',
                hash: '',
                state: {},
                key: '',
            },
        };
    }

    return {
        state: 'unblocked',
        proceed: undefined,
        reset: undefined,
        location: undefined,
    };
};

const Link = forwardRef<HTMLAnchorElement, RouterLinkProps>(
    ({ to, replace, state, children, ...rest }, ref) => {
        const basename = useBasename();

        // Helper to prepend basename to absolute paths
        const resolvePath = (path: string) => {
            if (!basename || !path.startsWith('/')) return path;
            if (path.startsWith(basename + '/') || path === basename) {
                return path;
            }
            return `${basename}${path}`;
        };

        // Handle object `to` with pathname (e.g., { pathname: '/path', search: '?foo=bar' })
        let resolvedTo: string;
        let resolvedState = state;
        if (typeof to === 'object' && to !== null && 'pathname' in to) {
            const loc = to as Partial<RouterLocation>;
            let path = resolvePath(loc.pathname ?? '/');
            if (loc.search) {
                path += loc.search.startsWith('?')
                    ? loc.search
                    : `?${loc.search}`;
            }
            if (loc.hash) {
                path += loc.hash.startsWith('#') ? loc.hash : `#${loc.hash}`;
            }
            resolvedTo = path;
            resolvedState = loc.state || state;
        } else {
            resolvedTo = resolvePath(to as string);
        }

        return (
            <TanStackLink
                ref={ref}
                to={resolvedTo}
                replace={replace}
                state={resolvedState}
                {...rest}
            >
                {children}
            </TanStackLink>
        );
    }
);
Link.displayName = 'Link';

const Navigate = ({ to, replace, state }: RouterNavigateProps) => {
    const basename = useBasename();

    // Prepend basename to the path (like react-router does)
    // Only prepend if path doesn't already start with basename
    let resolvedTo = to;
    if (typeof to === 'string' && basename && to.startsWith('/')) {
        if (!to.startsWith(basename + '/') && to !== basename) {
            resolvedTo = `${basename}${to}`;
        }
    }

    return (
        <TanStackNavigate
            to={resolvedTo as string}
            replace={replace}
            state={state}
        />
    );
};

/**
 * Route component - just a data container, doesn't render anything.
 * Used by Routes to build route configuration.
 */
const Route = (_props: RouterRouteProps): null => null;
interface RouteConfig {
    path: string;
    element?: ReactNode;
    index?: boolean;
    children?: RouteConfig[];
}

const Routes = ({ children, location: locationProp }: RouterRoutesProps) => {
    const currentLocation = useTanStackLocation();
    const basename = useBasename();
    const parentMatchedPath = React.useContext(MatchedPathContext);

    // locationProp can be string or RouterLocation
    let fullPathname =
        typeof locationProp === 'string'
            ? locationProp
            : locationProp?.pathname ?? currentLocation.pathname;

    // In embedded mode with a basename, only match routes that are within the basename scope.
    // If the current path doesn't start with the basename, don't match any routes.
    // This prevents the admin from hijacking navigation to paths outside its scope.
    // We track this flag here but return null AFTER all hooks are called (Rules of Hooks).
    const isOutsideBasenameScope =
        basename && !fullPathname.startsWith(basename);

    // Strip basename from pathname for route matching (like react-router does)
    if (basename && fullPathname.startsWith(basename)) {
        fullPathname = fullPathname.slice(basename.length) || '/';
    }

    // Strip parent's matched path to get the remaining path for this Routes
    let pathname = fullPathname;
    if (parentMatchedPath && fullPathname.startsWith(parentMatchedPath)) {
        pathname = fullPathname.slice(parentMatchedPath.length) || '/';
        // Ensure it starts with /
        if (!pathname.startsWith('/')) {
            pathname = '/' + pathname;
        }
    }

    // Extract route configs from JSX children
    // We use duck-typing to detect Route elements because users may import
    // Route from react-router, react-router-dom, or use the adapter's Route.
    // A Route element has either a 'path' or 'index' prop, and optionally 'element'.
    const routes = useMemo(() => {
        const isRouteElement = (child: React.ReactElement): boolean => {
            const props = child.props as RouterRouteProps;
            // Check if it looks like a Route: has path, index, or element prop
            return (
                props.path !== undefined ||
                props.index !== undefined ||
                props.element !== undefined
            );
        };

        const extractRoutes = (nodes: ReactNode): RouteConfig[] => {
            return React.Children.toArray(nodes)
                .filter(
                    (child): child is React.ReactElement =>
                        React.isValidElement(child) && isRouteElement(child)
                )
                .map(child => ({
                    path: (child.props as RouterRouteProps).path ?? '',
                    element: (child.props as RouterRouteProps).element,
                    index: (child.props as RouterRouteProps).index,
                    children: (child.props as RouterRouteProps).children
                        ? extractRoutes(
                              (child.props as RouterRouteProps).children
                          )
                        : undefined,
                }));
        };
        return extractRoutes(children);
    }, [children]);

    // Get parent params to merge with current match params
    const parentParams = React.useContext(ParamsContext);

    // Find matching route and calculate the new matched path
    const matchResult = useMemo(() => {
        for (const route of routes) {
            if (route.index && (pathname === '/' || pathname === '')) {
                // Index route: matched path stays the same
                const newMatchedPath = parentMatchedPath || '/';
                return { route, matchedPath: newMatchedPath, params: {} };
            }
            if (route.path) {
                const match = matchPath(route.path, pathname);
                if (match) {
                    // Calculate new matched path by combining parent + matched portion
                    const matchedPortion = match.pathnameBase || '/';
                    let newMatchedPath: string;
                    if (!parentMatchedPath || parentMatchedPath === '/') {
                        // No parent or root parent - just use matched portion
                        newMatchedPath = matchedPortion;
                    } else if (matchedPortion === '/') {
                        // Matched root - keep parent
                        newMatchedPath = parentMatchedPath;
                    } else {
                        // Combine parent and matched portion
                        newMatchedPath = `${parentMatchedPath}${matchedPortion}`;
                    }
                    return {
                        route,
                        matchedPath: newMatchedPath,
                        params: match.params,
                    };
                }
            }
        }
        // Check for catch-all route (path="*")
        const catchAll = routes.find(r => r.path === '*');
        if (catchAll) {
            const match = matchPath('*', pathname);
            return {
                route: catchAll,
                matchedPath: fullPathname,
                params: match?.params ?? {},
            };
        }
        return null;
    }, [routes, pathname, parentMatchedPath, fullPathname]);

    // Now that all hooks have been called, we can safely return early
    // if we're outside the basename scope
    if (isOutsideBasenameScope) {
        return null;
    }

    if (!matchResult) {
        return null;
    }

    // Merge parent params with current match params
    // Filter out undefined values to ensure type safety
    const mergedParams: Record<string, string> = { ...parentParams };
    for (const [key, value] of Object.entries(matchResult.params)) {
        if (value !== undefined) {
            mergedParams[key] = value;
        }
    }

    // Wrap in context providers so nested Routes can:
    // 1. Strip the matched path (MatchedPathContext)
    // 2. Access accumulated params (ParamsContext)
    return (
        <MatchedPathContext.Provider value={matchResult.matchedPath}>
            <ParamsContext.Provider value={mergedParams}>
                {matchResult.route.element}
            </ParamsContext.Provider>
        </MatchedPathContext.Provider>
    );
};

const Outlet = (_props: RouterOutletProps) => {
    return <TanStackOutlet />;
};

const InternalRouter = ({
    children,
    basename,
}: {
    children: ReactNode;
    basename?: string;
}) => {
    // We use useRef to ensure it's only created once
    // see https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents
    const routerRef = React.useRef<any>(null);
    if (!routerRef.current) {
        const rootRoute = createRootRoute({
            component: () => <>{children}</>,
        });

        routerRef.current = createRouter({
            routeTree: rootRoute,
            basepath: basename,
            history: createHashHistory(),
        });
    }

    return <TanStackRouterProvider router={routerRef.current} />;
};

/**
 * Creates a HashRouter if not already inside a router context.
 */
const RouterWrapper = ({ basename, children }: RouterWrapperProps) => {
    // This hook call is unconditional - Rules of Hooks compliant
    const router = useRouter({ warn: false });
    const isInRouter = router != null;

    if (isInRouter) {
        // Embedded mode: already inside a TanStack Router
        return <>{children}</>;
    }

    // Standalone mode: create our own router
    return <InternalRouter basename={basename}>{children}</InternalRouter>;
};

/**
 * TanStack Router provider for react-admin.
 */
export const tanStackRouterProvider: RouterProvider = {
    // Hooks
    useNavigate,
    useLocation,
    useParams: useParams as RouterProvider['useParams'],
    useBlocker: useBlocker as RouterProvider['useBlocker'],
    useMatch: useMatch as RouterProvider['useMatch'],
    useInRouterContext,
    useCanBlock,

    // Components
    Link: Link as RouterProvider['Link'],
    Navigate: Navigate as RouterProvider['Navigate'],
    Route: Route as RouterProvider['Route'],
    Routes: Routes as RouterProvider['Routes'],
    Outlet: Outlet as RouterProvider['Outlet'],

    // Router creation
    RouterWrapper,

    // Utilities
    matchPath: matchPath as RouterProvider['matchPath'],
};
