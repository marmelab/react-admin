import * as React from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { TestMemoryRouter } from '../routing/TestMemoryRouter';
import { CoreAdminContext } from '../core/CoreAdminContext';
import useLogout from './useLogout';

export default {
    title: 'ra-core/auth/useLogout',
};

export const Redirect = ({
    redirectTo,
    search = '',
}: {
    redirectTo: 'default' | 'authProvider.logout' | 'caller';
    search?: string;
}) => {
    const authProvider = {
        logout: () =>
            Promise.resolve(
                redirectTo === 'authProvider.logout'
                    ? '/logout_redirect'
                    : undefined
            ),
    } as any;

    return (
        <TestMemoryRouter key={redirectTo} initialEntries={[`/${search}`]}>
            <CoreAdminContext authProvider={authProvider}>
                <Routes>
                    <Route path="/" element={<div>Page</div>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/logout_redirect"
                        element={<div>Custom from authProvider.logout</div>}
                    />
                    <Route
                        path="/caller_redirect"
                        element={<div>Custom from useLogout caller</div>}
                    />
                </Routes>

                <LogoutButton
                    redirectTo={
                        redirectTo === 'caller' ? '/caller_redirect' : undefined
                    }
                />
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

Redirect.args = {
    redirectTo: 'default',
};

Redirect.argTypes = {
    redirectTo: {
        type: 'string',
        options: ['default', 'authProvider.logout', 'caller'],
        mapping: {
            default: undefined,
            'authProvider.logout': 'authProvider.logout',
            caller: 'caller',
        },
        control: {
            type: 'radio',
        },
    },
};

const LoginPage = () => {
    const location = useLocation();
    return (
        <>
            <div>Login</div>
            <p>Search after login: {location.state?.nextSearch}</p>
        </>
    );
};

const LogoutButton = ({ redirectTo }: { redirectTo?: string }) => {
    const logout = useLogout();
    return (
        <button onClick={() => logout(undefined, redirectTo)}>Logout</button>
    );
};
