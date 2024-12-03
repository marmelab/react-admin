import * as React from 'react';
import usePermissions, { UsePermissionsResult } from './usePermissions';
import { CoreAdminContext, TestMemoryRouter, useLogin, useLogout } from '..';

export default {
    title: 'ra-core/auth/useLogin',
};

const getAuthProviderWithLoginAndLogout = () => {
    let isLoggedIn = false;
    return {
        login: () => {
            isLoggedIn = true;
            return Promise.resolve();
        },
        logout: () => {
            isLoggedIn = false;
            return Promise.resolve();
        },
        checkAuth: () => (isLoggedIn ? Promise.resolve() : Promise.reject()),
        checkError: () => Promise.reject('bad method'),
        getPermissions: () =>
            new Promise(resolve =>
                setTimeout(resolve, 300, isLoggedIn ? 'admin' : 'guest')
            ),
    };
};

const LoginButton = () => {
    const login = useLogin();
    return <button onClick={login}>Login</button>;
};

const LogoutButton = () => {
    const logout = useLogout();
    return <button onClick={logout}>Logout</button>;
};

const UsePermissions = ({
    children,
}: {
    children: (state: UsePermissionsResult<any, Error>) => React.ReactNode;
}) => {
    const permissionQueryParams = {
        retry: false,
    };
    const res = usePermissions({}, permissionQueryParams);
    return children(res);
};

const inspectPermissionsState = (state: UsePermissionsResult<any, Error>) => (
    <div>
        {state.isPending ? <span>LOADING</span> : null}
        {state.permissions ? (
            <span>PERMISSIONS: {state.permissions}</span>
        ) : null}
        {state.error ? <span>ERROR</span> : null}
    </div>
);

export const PermissionsState = () => (
    <TestMemoryRouter>
        <CoreAdminContext authProvider={getAuthProviderWithLoginAndLogout()}>
            <UsePermissions>
                {state => inspectPermissionsState(state)}
            </UsePermissions>
            <LoginButton />
            <LogoutButton />
        </CoreAdminContext>
    </TestMemoryRouter>
);
