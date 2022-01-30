import * as React from 'react';
import expect from 'expect';
import { waitFor } from '@testing-library/react';

import Authenticated from './Authenticated';
import AuthContext from './AuthContext';
import { renderWithRedux } from 'ra-test';
import { showNotification } from '../actions/notificationActions';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

describe('<Authenticated>', () => {
    const Foo = () => <div>Foo</div>;

    it('should render its child by default', async () => {
        const { dispatch, queryByText } = renderWithRedux(
            <Authenticated>
                <Foo />
            </Authenticated>
        );
        expect(queryByText('Foo')).not.toBeNull();
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledTimes(0);
        });
    });

    it('should logout, redirect to login and show a notification after a tick if the auth fails', async () => {
        const authProvider = {
            login: jest.fn().mockResolvedValue(''),
            logout: jest.fn().mockResolvedValue(''),
            checkAuth: jest.fn().mockRejectedValue(undefined),
            checkError: jest.fn().mockResolvedValue(''),
            getPermissions: jest.fn().mockResolvedValue(''),
        };

        const history = createMemoryHistory();

        const { dispatch } = renderWithRedux(
            <Router history={history}>
                <AuthContext.Provider value={authProvider}>
                    <Authenticated>
                        <Foo />
                    </Authenticated>
                </AuthContext.Provider>
            </Router>
        );
        await waitFor(() => {
            expect(authProvider.checkAuth.mock.calls[0][0]).toEqual({});
            expect(authProvider.logout.mock.calls[0][0]).toEqual({});
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch.mock.calls[0][0]).toEqual(
                showNotification('ra.auth.auth_check_error', 'warning')
            );
            expect(dispatch.mock.calls[1][0]).toEqual({
                type: 'RA/CLEAR_STATE',
            });
            expect(history.location.pathname).toEqual('/login');
            expect(history.location.state).toEqual({
                nextPathname: '/',
                nextSearch: '',
            });
        });
    });
});
