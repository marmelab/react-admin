import * as React from 'react';
import { ReactNode } from 'react';
import {
    useInRouterContext,
    createHashRouter,
    RouterProvider,
    FutureConfig,
} from 'react-router-dom';

import { BasenameContextProvider } from './BasenameContextProvider';

/**
 * Creates a react-router Router unless the app is already inside existing router.
 * Also creates a BasenameContext with the basename prop
 */
export const AdminRouter = ({ basename = '', children }: AdminRouterProps) => {
    const isInRouter = useInRouterContext();
    const Router = isInRouter ? DummyRouter : InternalRouter;

    return (
        <BasenameContextProvider basename={isInRouter ? basename : ''}>
            <Router basename={basename}>{children}</Router>
        </BasenameContextProvider>
    );
};

export interface AdminRouterProps {
    basename?: string;
    children: React.ReactNode;
}

const DummyRouter = ({
    children,
}: {
    children: ReactNode;
    basename?: string;
}) => <>{children}</>;

const routerProviderFuture: Partial<
    Pick<FutureConfig, 'v7_startTransition' | 'v7_relativeSplatPath'>
> = { v7_startTransition: false, v7_relativeSplatPath: false };

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
    return <RouterProvider router={router} future={routerProviderFuture} />;
};
