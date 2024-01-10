import * as React from 'react';
import { useLayoutEffect, useState } from 'react';
import { History } from 'history';
import { Router } from 'react-router';

/**
 * A router that accepts a custom history.
 * To remove once https://github.com/remix-run/react-router/pull/7586 is merged.
 */
export function HistoryRouter({
    basename,
    children,
    history,
}: HistoryRouterProps) {
    const [state, setState] = useState({
        action: history.action,
        location: history.location,
    });

    useLayoutEffect(() => history.listen(setState), [history]);

    return (
        <Router
            basename={basename}
            children={children}
            location={state.location}
            navigationType={state.action}
            navigator={history}
        />
    );
}

export interface HistoryRouterProps {
    basename?: string;
    children?: React.ReactNode;
    history: History;
}
