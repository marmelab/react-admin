import { useRouterProvider } from './RouterProviderContext';
import type { RouterMatch } from './RouterProvider';

/**
 * Hook to match the current location against a pattern.
 * This is a router-agnostic wrapper that uses the configured router provider.
 *
 * @example
 * const match = useMatch({ path: '/posts/:id', end: true });
 * if (match) {
 *   console.log(match.params.id);
 * }
 */
export const useMatch = (pattern: {
    path: string;
    end?: boolean;
}): RouterMatch | null => {
    const provider = useRouterProvider();
    return provider.useMatch(pattern);
};
