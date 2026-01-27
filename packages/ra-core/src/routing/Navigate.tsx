import * as React from 'react';
import { useRouterProvider } from './RouterProviderContext';
import type { RouterNavigateProps } from './RouterProvider';

export type { RouterNavigateProps as NavigateProps } from './RouterProvider';

/**
 * Navigate component for declarative navigation.
 * This is a router-agnostic wrapper that uses the configured router provider.
 *
 * @example
 * import { Navigate } from 'react-admin';
 *
 * const MyComponent = () => (
 *     <Navigate to="/login" replace />
 * );
 */
export const Navigate = (props: RouterNavigateProps) => {
    const provider = useRouterProvider();
    return <provider.Navigate {...props} />;
};
