import { useRouterProvider } from './RouterProviderContext';
import type { RouterBlocker, RouterBlockerFunction } from './RouterProvider';

/**
 * Hook to block navigation based on a condition.
 * This is a router-agnostic wrapper that uses the configured router provider.
 * Used by useWarnWhenUnsavedChanges to prevent losing form data.
 *
 * @example
 * const blocker = useBlocker(shouldBlock);
 * if (blocker.state === 'blocked') {
 *   // Show confirmation dialog
 *   blocker.proceed(); // or blocker.reset();
 * }
 */
export const useBlocker = (
    shouldBlock: RouterBlockerFunction | boolean
): RouterBlocker => {
    const provider = useRouterProvider();
    return provider.useBlocker(shouldBlock);
};
