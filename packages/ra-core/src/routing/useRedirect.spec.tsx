import * as React from 'react';
import { useEffect } from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { CoreAdminContext } from '../core';
import { useRedirect } from './useRedirect';
import { testDataProvider } from '../dataProvider';

const Redirect = ({
    redirectTo,
    basePath = '',
    id = null,
    data = null,
    state = null,
}) => {
    const redirect = useRedirect();
    useEffect(() => {
        redirect(redirectTo, basePath, id, data, state);
    }, [basePath, data, id, redirect, redirectTo, state]);
    return null;
};

const Component = () => {
    const location = useLocation();

    return (
        <div>
            <label htmlFor="pathname">Pathname</label>
            <input id="pathname" readOnly value={location.pathname} />
            <label htmlFor="search">Search</label>
            <input id="search" readOnly value={location.search} />
            <label htmlFor="state">State</label>
            <input id="state" readOnly value={JSON.stringify(location.state)} />
        </div>
    );
};

describe('useRedirect', () => {
    it('should redirect to the path with query string', async () => {
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={createMemoryHistory()}
            >
                <Routes>
                    <Route
                        path="/"
                        element={<Redirect redirectTo="/foo?bar=baz" />}
                    />
                    <Route path="foo" element={<Component />} />
                </Routes>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByDisplayValue('?bar=baz')).not.toBeNull();
        });
    });
    it('should redirect to the path with state', async () => {
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={createMemoryHistory()}
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Redirect
                                redirectTo="/foo"
                                state={{ bar: 'baz' }}
                            />
                        }
                    />
                    <Route path="/foo" element={<Component />} />
                </Routes>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(
                screen.queryByDisplayValue(
                    JSON.stringify({ _scrollToTop: true, bar: 'baz' })
                )
            ).not.toBeNull();
        });
    });

    it('should support absolute URLs', () => {
        const oldLocation = window.location;
        delete window.location;
        // @ts-ignore
        window.location = { href: '' };
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={createMemoryHistory()}
            >
                <Redirect redirectTo="https://google.com" />
            </CoreAdminContext>
        );
        expect(window.location.href).toBe('https://google.com');
        window.location = oldLocation;
    });
});
