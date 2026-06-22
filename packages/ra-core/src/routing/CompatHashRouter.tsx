import * as React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { createPath, NavigationType, parsePath, Router } from 'react-router';
import type { Location, Navigator, Path, To } from 'react-router';
import type { RouterWrapperProps } from './RouterProvider';

type HashHistory = Navigator & {
    readonly action: NavigationType;
    readonly location: Location;
    listen(
        listener: (update: {
            action: NavigationType;
            location: Location;
        }) => void
    ): () => void;
};

const createKey = () => Math.random().toString(36).substring(2, 10);

/**
 * Minimal hash history reimplementation react-router v6, where
 * `createHashRouter` is not exported from the `react-router` package (it
 * lived only in `react-router-dom`), nor the low-level `createHashHistory`.
 * Mirrors `createHashHistory` and builds upon the browser History API.
 * It feeds into the low-level `<Router>` component which is available
 * on every supported version.
 */
const createHashHistory = (): HashHistory => {
    const globalHistory = window.history;
    let action: NavigationType = NavigationType.Pop;
    let index: number;
    let location: Location;
    const listeners = new Set<
        (update: { action: NavigationType; location: Location }) => void
    >();

    const getIndexAndLocation = (): [number, Location] => {
        const {
            pathname = '/',
            search = '',
            hash = '',
        } = parsePath(window.location.hash.substring(1));
        const historyState = globalHistory.state || {};
        return [
            historyState.idx,
            {
                pathname,
                search,
                hash,
                state: historyState.usr ?? null,
                key: historyState.key ?? 'default',
            },
        ];
    };

    [index, location] = getIndexAndLocation();
    if (index == null) {
        index = 0;
        globalHistory.replaceState({ ...globalHistory.state, idx: index }, '');
    }

    const getNextLocation = (to: To, state: any = null): Location => {
        const parsed = typeof to === 'string' ? parsePath(to) : to;
        return {
            pathname: location.pathname,
            search: '',
            hash: '',
            ...parsed,
            state,
            key: createKey(),
        } as Location;
    };

    const getHistoryStateAndUrl = (
        nextLocation: Location,
        nextIndex: number
    ): [any, string] => [
        { usr: nextLocation.state, key: nextLocation.key, idx: nextIndex },
        '#' + createPath(nextLocation),
    ];

    const notify = () => {
        listeners.forEach(listener => listener({ action, location }));
    };

    const handlePop = () => {
        action = NavigationType.Pop;
        const [nextIndex, nextLocation] = getIndexAndLocation();
        index = nextIndex ?? 0;
        location = nextLocation;
        notify();
    };

    window.addEventListener('popstate', handlePop);
    window.addEventListener('hashchange', () => {
        const [, nextLocation] = getIndexAndLocation();
        // popstate already handles back/forward; only react to manual hash edits.
        if (createPath(nextLocation) !== createPath(location)) {
            handlePop();
        }
    });

    return {
        get action() {
            return action;
        },
        get location() {
            return location;
        },
        createHref: (to: To) =>
            '#' + (typeof to === 'string' ? to : createPath(to)),
        encodeLocation: (to: To): Path => {
            const path = typeof to === 'string' ? parsePath(to) : to;
            return {
                pathname: path.pathname || '',
                search: path.search || '',
                hash: path.hash || '',
            };
        },
        push: (to: To, state?: any) => {
            action = NavigationType.Push;
            location = getNextLocation(to, state);
            index += 1;
            const [historyState, url] = getHistoryStateAndUrl(location, index);
            try {
                globalHistory.pushState(historyState, '', url);
            } catch {
                // iOS limits history.pushState calls; fall back to a hard reload.
                window.location.assign(url);
            }
            notify();
        },
        replace: (to: To, state?: any) => {
            action = NavigationType.Replace;
            location = getNextLocation(to, state);
            const [historyState, url] = getHistoryStateAndUrl(location, index);
            globalHistory.replaceState(historyState, '', url);
            notify();
        },
        go: (delta: number) => globalHistory.go(delta),
        listen: listener => {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
    };
};

/**
 * Minimal non-data `<HashRouter>` reimplementation for the react-router v6, where `HashRouter`
 * is not exported from the `react-router` package (it lived only in `react-router-dom`).
 *
 * Used as the v6 fallback by the default `InternalRouter`, which prefers react-router's native
 * `createHashRouter` when it exists (v7/v8). v6 users can always override this by wrapping
 * the react element tree with `react-router-dom`'s `<HashRouter>` component.
 */
export const CompatHashRouter = ({
    basename,
    children,
}: RouterWrapperProps) => {
    const historyRef = useRef<HashHistory | undefined>(undefined);
    if (historyRef.current == null) {
        historyRef.current = createHashHistory();
    }
    const history = historyRef.current!;
    const [state, setState] = useState({
        action: history.action,
        location: history.location,
    });
    useLayoutEffect(() => history.listen(setState), [history]);

    return (
        <Router
            basename={basename}
            location={state.location}
            navigationType={state.action}
            navigator={history}
        >
            {children}
        </Router>
    );
};
