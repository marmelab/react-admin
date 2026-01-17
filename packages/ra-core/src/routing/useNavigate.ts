import { useRouterProvider } from './RouterProviderContext';
import type { RouterNavigateFunction } from './RouterProvider';

/**
 * Hook to access the navigate function.
 * This is a router-agnostic wrapper that uses the configured router provider.
 *
 * @example
 * const navigate = useNavigate();
 * navigate('/posts');
 * navigate('/posts', { replace: true });
 * navigate(-1); // go back
 */
export const useNavigate = (): RouterNavigateFunction => {
    const provider = useRouterProvider();
    return provider.useNavigate();
};
