import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import expect from 'expect';

import { CoreAdminContext } from '../core/CoreAdminContext';
import useLogin from './useLogin';

describe('useLogin', () => {
    describe('redirect after login', () => {
        it('should redirect to home page by default', async () => {
            const Login = () => {
                const login = useLogin();
                return <button onClick={login}>Login</button>;
            };
            const authProvider = {
                login: () => Promise.resolve(),
                checkError: () => Promise.resolve(),
                checkAuth: () => Promise.resolve(),
                logout: () => Promise.resolve(),
                getIdentity: () => Promise.resolve({ id: 'joe' }),
                getPermissions: () => Promise.resolve(),
            };
            render(
                <MemoryRouter initialEntries={['/login']}>
                    <CoreAdminContext authProvider={authProvider}>
                        <Routes>
                            <Route path="/" element={<div>Home</div>} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </CoreAdminContext>
                </MemoryRouter>
            );
            await screen.findByText('Login');
            fireEvent.click(screen.getByText('Login'));
            await screen.findByText('Home');
        });
        it('should redirect to the redirectTo returned by login', async () => {
            const Login = () => {
                const login = useLogin();
                return <button onClick={login}>Login</button>;
            };
            const authProvider = {
                login: () => Promise.resolve({ redirectTo: '/foo' }),
                checkError: () => Promise.resolve(),
                checkAuth: () => Promise.resolve(),
                logout: () => Promise.resolve(),
                getIdentity: () => Promise.resolve({ id: 'joe' }),
                getPermissions: () => Promise.resolve(),
            };
            render(
                <MemoryRouter initialEntries={['/login']}>
                    <CoreAdminContext authProvider={authProvider}>
                        <Routes>
                            <Route path="/" element={<div>Home</div>} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/foo" element={<div>Foo</div>} />
                        </Routes>
                    </CoreAdminContext>
                </MemoryRouter>
            );
            await screen.findByText('Login');
            fireEvent.click(screen.getByText('Login'));
            await screen.findByText('Foo');
        });

        it('should not redirect if login returns redirectTo false', async () => {
            const Login = () => {
                const login = useLogin();
                return <button onClick={login}>Login</button>;
            };
            const authProvider = {
                login: () => Promise.resolve({ redirectTo: false }),
                checkError: () => Promise.resolve(),
                checkAuth: () => Promise.resolve(),
                logout: () => Promise.resolve(),
                getIdentity: () => Promise.resolve({ id: 'joe' }),
                getPermissions: () => Promise.resolve(),
            };
            render(
                <MemoryRouter initialEntries={['/login']}>
                    <CoreAdminContext authProvider={authProvider}>
                        <Routes>
                            <Route path="/" element={<div>Home</div>} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </CoreAdminContext>
                </MemoryRouter>
            );
            await screen.findByText('Login');
            fireEvent.click(screen.getByText('Login'));
            await waitFor(
                // there is no other way to know if the login has been done
                () => new Promise(resolve => setTimeout(resolve, 50))
            );
            expect(screen.queryByText('Home')).toBeNull();
            expect(screen.queryByText('Login')).not.toBeNull();
        });
    });
});
