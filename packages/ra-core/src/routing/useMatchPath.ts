import { useRouterProvider } from './RouterProviderContext';
import type { RouterMatch } from './RouterProvider';

/**
 * Returns the matchPath function from the configured router provider.
 *
 * @example
 * import { useMatchPath } from 'react-admin';
 *
 * const MyComponent = () => {
 *     const matchPath = useMatchPath();
 *     const match = matchPath('/posts/:id', '/posts/123');
 *     // match.params.id === '123'
 * };
 */
export const useMatchPath = (): ((
    pattern: string | { path: string; end?: boolean },
    pathname: string
) => RouterMatch | null) => {
    const provider = useRouterProvider();
    return provider.matchPath;
};
