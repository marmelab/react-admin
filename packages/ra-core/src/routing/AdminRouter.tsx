import * as React from 'react';

import { BasenameContextProvider } from './BasenameContextProvider';
import { useRouterProvider } from './RouterProviderContext';

/**
 * Creates a Router unless the app is already inside existing router.
 * Also creates a BasenameContext with the basename prop.
 *
 * Uses the RouterWrapper from the configured routerProvider to create
 * the appropriate router type (HashRouter by default with react-router).
 */
export const AdminRouter = ({ basename = '', children }: AdminRouterProps) => {
    const { RouterWrapper, useInRouterContext } = useRouterProvider();
    const isInRouter = useInRouterContext();

    return (
        <BasenameContextProvider basename={isInRouter ? basename : ''}>
            <RouterWrapper basename={basename}>{children}</RouterWrapper>
        </BasenameContextProvider>
    );
};

export interface AdminRouterProps {
    basename?: string;
    children: React.ReactNode;
}
