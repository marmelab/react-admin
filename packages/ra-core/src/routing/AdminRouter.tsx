import * as React from 'react';
import { useMemo } from 'react';
import { useInRouterContext } from 'react-router-dom';
import { createHashHistory, History } from 'history';

import { HistoryRouter } from './HistoryRouter';
import { BasenameContextProvider } from './BasenameContextProvider';

/**
 * Creates a react-router Router unless the app is already inside existing router.
 * Also creates a BasenameContext with the basename prop
 */
export const AdminRouter = ({
    history,
    basename = '',
    children,
}: AdminRouterProps) => {
    const isInRouter = useInRouterContext();
    const Router = isInRouter ? DummyRouter : HistoryRouter;
    const finalHistory = useMemo(() => history || createHashHistory(), [
        history,
    ]);
    return (
        <BasenameContextProvider basename={isInRouter ? basename : ''}>
            <Router basename={basename} history={finalHistory}>
                {children}
            </Router>
        </BasenameContextProvider>
    );
};

export interface AdminRouterProps {
    history?: History;
    basename?: string;
    children: React.ReactNode;
}

const DummyRouter = ({ children }) => children;
