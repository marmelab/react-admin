import * as React from 'react';
import { useRouterProvider } from './RouterProviderContext';
import type { RouterOutletProps } from './RouterProvider';

export type { RouterOutletProps as OutletProps } from './RouterProvider';

/**
 * Outlet component for nested route rendering.
 * This is a router-agnostic wrapper that uses the configured router provider.
 *
 * @example
 * import { Outlet } from 'react-admin';
 *
 * const MyLayout = () => (
 *     <div>
 *         <header>My App</header>
 *         <main>
 *             <Outlet />
 *         </main>
 *     </div>
 * );
 */
export const Outlet = (props: RouterOutletProps) => {
    const provider = useRouterProvider();
    return <provider.Outlet {...props} />;
};
