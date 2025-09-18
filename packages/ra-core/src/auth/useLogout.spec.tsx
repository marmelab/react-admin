import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import expect from 'expect';

import { useGetOne } from '../dataProvider';
import useLogout from './useLogout';
import { CoreAdminContext } from '../core/CoreAdminContext';

import { TestMemoryRouter } from '../routing';

describe('useLogout', () => {
    it('should clear the QueryClient cache', async () => {
        const LogoutButton = () => {
            const logout = useLogout();
            return <button onClick={logout}>Logout</button>;
        };
        const dataProvider = {
            getOne: () => Promise.resolve({ data: { id: 1, title: 'foo' } }),
        } as any;
        const queryClient = new QueryClient();
        const Content = () => {
            const { data } = useGetOne('posts', { id: 1 });
            return <div>{data?.title}</div>;
        };
        const Login = () => <div>Login</div>;
        render(
            <TestMemoryRouter>
                <CoreAdminContext
                    dataProvider={dataProvider}
                    queryClient={queryClient}
                >
                    <Routes>
                        <Route path="/" element={<Content />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>

                    <LogoutButton />
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await screen.findByText('foo');
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '1' }])
        ).toEqual({
            id: 1,
            title: 'foo',
        });
        fireEvent.click(screen.getByText('Logout'));
        await screen.findByText('Login');
        expect(
            queryClient.getQueryData(['posts', 'getOne', { id: '1' }])
        ).toBeUndefined();
    });
    it('should redirect to `/login` by default', async () => {
        const LogoutButton = () => {
            const logout = useLogout();
            return <button onClick={logout}>Logout</button>;
        };
        const authProvider = {
            logout: () => Promise.resolve(),
        } as any;
        const Page = () => <div>Page</div>;
        const Login = () => <div>Login</div>;
        render(
            <TestMemoryRouter>
                <CoreAdminContext authProvider={authProvider}>
                    <Routes>
                        <Route path="/" element={<Page />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>

                    <LogoutButton />
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await screen.findByText('Page');
        fireEvent.click(screen.getByText('Logout'));
        await screen.findByText('Login');
    });
    it('should redirect to the url returned by the authProvider.logout call', async () => {
        const LogoutButton = () => {
            const logout = useLogout();
            return <button onClick={logout}>Logout</button>;
        };
        const authProvider = {
            logout: () => Promise.resolve('/not_login'),
        } as any;
        const queryClient = new QueryClient();
        const Page = () => <div>Page</div>;
        const Login = () => <div>Login</div>;
        const NotLogin = () => <div>NotLogin</div>;
        render(
            <TestMemoryRouter>
                <CoreAdminContext
                    authProvider={authProvider}
                    queryClient={queryClient}
                >
                    <Routes>
                        <Route path="/" element={<Page />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/not_login" element={<NotLogin />} />
                    </Routes>

                    <LogoutButton />
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await screen.findByText('Page');
        fireEvent.click(screen.getByText('Logout'));
        await screen.findByText('NotLogin');
    });
    it('should redirect to the url returned by the caller', async () => {
        const LogoutButton = () => {
            const logout = useLogout();
            return (
                <button onClick={() => logout(undefined, '/caller_redirect')}>
                    Logout
                </button>
            );
        };
        const authProvider = {
            logout: () => Promise.resolve('/not_login'),
        } as any;
        const Page = () => <div>Page</div>;
        const Login = () => <div>Login</div>;
        const NotLogin = () => <div>NotLogin</div>;
        const CallerRedirect = () => <div>CallerRedirect</div>;
        render(
            <TestMemoryRouter>
                <CoreAdminContext authProvider={authProvider}>
                    <Routes>
                        <Route path="/" element={<Page />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/not_login" element={<NotLogin />} />
                        <Route
                            path="/caller_redirect"
                            element={<CallerRedirect />}
                        />
                    </Routes>

                    <LogoutButton />
                </CoreAdminContext>
            </TestMemoryRouter>
        );
        await screen.findByText('Page');
        fireEvent.click(screen.getByText('Logout'));
        await screen.findByText('CallerRedirect');
    });
});
