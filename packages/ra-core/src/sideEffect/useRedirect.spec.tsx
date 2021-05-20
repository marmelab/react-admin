import * as React from 'react';
import { useEffect } from 'react';
import expect from 'expect';
import { renderWithRedux } from 'ra-test';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import useRedirect from './useRedirect';

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

describe('useRedirect', () => {
    it('should redirect to the path with query string', () => {
        const history = createMemoryHistory();
        renderWithRedux(
            <Router history={history}>
                <Redirect redirectTo="/foo?bar=baz" />
            </Router>
        );
        expect(history.location).toMatchObject({
            pathname: '/foo',
            search: '?bar=baz',
            state: { _scrollToTop: true },
        });
    });
    it('should redirect to the path with state', () => {
        const history = createMemoryHistory();
        renderWithRedux(
            <Router history={history}>
                <Redirect redirectTo="/foo" state={{ bar: 'baz' }} />
            </Router>
        );
        expect(history.location).toMatchObject({
            pathname: '/foo',
            state: { _scrollToTop: true, bar: 'baz' },
        });
    });
});
