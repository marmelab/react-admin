import * as React from 'react';
import { ReactNode } from 'react';
import {
    useInRouterContext,
    createHashRouter,
    RouterProvider,
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

const InternalRouter = ({
    children,
    basename,
}: {
    children: ReactNode;
    basename?: string;
}) => {
    const router = createHashRouter([{ path: '*', element: <>{children}</> }], {
        basename,
    });
    return <RouterProvider router={router} />;
};
