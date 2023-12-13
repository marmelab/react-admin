import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { MemoryRouter, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { CoreAdminContext } from './CoreAdminContext';
import { CoreAdminRoutes } from './CoreAdminRoutes';
import { Resource } from './Resource';
import { CustomRoutes } from './CustomRoutes';
import { CoreLayoutProps } from '../types';
import { testDataProvider } from '../dataProvider';

const Layout = ({ children }: CoreLayoutProps) => <div>Layout {children}</div>;
const CatchAll = () => <div />;
const Loading = () => <>Loading</>;

describe('<CoreAdminRoutes>', () => {
    const defaultProps = {
        customRoutes: [],
    };

    describe('With resources as regular children', () => {
        it('should render resources and custom routes with and without layout', async () => {
            const history = createMemoryHistory();
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider()}
                    history={history}
                >
                    <CoreAdminRoutes
                        layout={Layout}
                        catchAll={CatchAll}
                        loading={Loading}
                    >
                        <CustomRoutes noLayout>
                            <Route path="/foo" element={<div>Foo</div>} />
                        </CustomRoutes>
                        <CustomRoutes>
                            <Route path="/bar" element={<div>Bar</div>} />
                        </CustomRoutes>
                        <Resource
                            name="posts"
                            list={() => <span>PostList</span>}
                        />
                        <Resource
                            name="comments"
                            list={() => <span>CommentList</span>}
                        />
                    </CoreAdminRoutes>
                </CoreAdminContext>
            );
            await screen.findByText('Layout');
            history.push('/posts');
            await screen.findByText('PostList');
            history.push('/comments');
            await screen.findByText('CommentList');
            history.push('/foo');
            await screen.findByText('Foo');
            expect(screen.queryByText('Layout')).toBeNull();
            history.push('/bar');
            await screen.findByText('Layout');
            await screen.findByText('Bar');
        });
    });

    describe('With children returned from a function as children', () => {
        it('should render resources and custom routes with and without layout', async () => {
            const history = createMemoryHistory();
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider()}
                    history={history}
                >
                    <CoreAdminRoutes
                        layout={Layout}
                        catchAll={CatchAll}
                        loading={Loading}
                    >
                        <CustomRoutes noLayout>
                            <Route path="/foo" element={<div>Foo</div>} />
                        </CustomRoutes>
                        {() => (
                            <>
                                <CustomRoutes>
                                    <Route
                                        path="/bar"
                                        element={<div>Bar</div>}
                                    />
                                </CustomRoutes>
                                <Resource
                                    name="posts"
                                    list={() => <span>PostList</span>}
                                />
                                <Resource
                                    name="comments"
                                    list={() => <span>CommentList</span>}
                                />
                            </>
                        )}
                    </CoreAdminRoutes>
                </CoreAdminContext>
            );
            history.push('/foo');
            await screen.findByText('Foo');
            expect(screen.queryByText('Layout')).toBeNull();
            history.push('/bar');
            await screen.findByText('Bar');
            await screen.findByText('Layout');
            await screen.findByText('Bar');
            history.push('/posts');
            await screen.findByText('PostList');
            history.push('/comments');
            await screen.findByText('CommentList');
        });

        it('should render resources and custom routes with and without layout even without an authProvider', async () => {
            const history = createMemoryHistory();
            render(
                <CoreAdminContext
                    dataProvider={testDataProvider()}
                    history={history}
                >
                    <CoreAdminRoutes
                        layout={Layout}
                        catchAll={CatchAll}
                        loading={Loading}
                    >
                        <CustomRoutes noLayout>
                            <Route path="/foo" element={<div>Foo</div>} />
                        </CustomRoutes>
                        {() => (
                            <>
                                <CustomRoutes>
                                    <Route
                                        path="/bar"
                                        element={<div>Bar</div>}
                                    />
                                </CustomRoutes>
                                <Resource
                                    name="posts"
                                    list={() => <span>PostList</span>}
                                />
                                <Resource
                                    name="comments"
                                    list={() => <span>CommentList</span>}
                                />
                            </>
                        )}
                    </CoreAdminRoutes>
                </CoreAdminContext>
            );
            history.push('/foo');
            await screen.findByText('Foo');
            expect(screen.queryByText('Layout')).toBeNull();
            history.push('/bar');
            await screen.findByText('Bar');
            expect(screen.queryByText('Layout')).not.toBeNull();
            history.push('/posts');
            await screen.findByText('PostList');
            history.push('/comments');
            await screen.findByText('CommentList');
        });

        it('should return loading while the function child is not resolved', async () => {
            jest.useFakeTimers();
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };
            const Custom = () => <>Custom</>;

            const history = createMemoryHistory();
            render(
                <CoreAdminContext
                    authProvider={authProvider}
                    dataProvider={testDataProvider()}
                    history={history}
                >
                    <CoreAdminRoutes
                        layout={Layout}
                        loading={Loading}
                        catchAll={CatchAll}
                    >
                        <CustomRoutes noLayout>
                            <Route path="/foo" element={<Custom />} />
                        </CustomRoutes>
                        {() => new Promise(() => null)}
                    </CoreAdminRoutes>
                </CoreAdminContext>
            );
            // Timeout needed because we wait for a second before displaying the loading screen
            jest.advanceTimersByTime(1010);
            history.push('/posts');
            await screen.findByText('Loading');
            history.push('/foo');
            await screen.findByText('Custom');
            expect(screen.queryByText('Loading')).toBeNull();
            jest.useRealTimers();
        });
    });

    describe('requireAuth', () => {
        it('should not wait for the authProvider.checkAuth to return before rendering by default', () => {
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: (): Promise<void> => new Promise(() => {}), // never resolves
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };

            render(
                <MemoryRouter>
                    <CoreAdminContext
                        authProvider={authProvider}
                        dataProvider={testDataProvider()}
                    >
                        <CoreAdminRoutes
                            {...defaultProps}
                            layout={Layout}
                            loading={Loading}
                            catchAll={CatchAll}
                        >
                            <Resource
                                name="posts"
                                list={() => <i>PostList</i>}
                            />
                        </CoreAdminRoutes>
                    </CoreAdminContext>
                </MemoryRouter>
            );
            expect(screen.queryByText('PostList')).not.toBeNull();
            expect(screen.queryByText('Loading')).toBeNull();
        });
        it('should wait for the authProvider.checkAuth to return before rendering when requireAuth is true', async () => {
            let resolve;
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: (): Promise<void> =>
                    new Promise(res => (resolve = res)),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };

            render(
                <MemoryRouter>
                    <CoreAdminContext
                        authProvider={authProvider}
                        dataProvider={testDataProvider()}
                    >
                        <CoreAdminRoutes
                            layout={Layout}
                            loading={Loading}
                            catchAll={CatchAll}
                            requireAuth
                        >
                            <Resource
                                name="posts"
                                list={() => <i>PostList</i>}
                            />
                        </CoreAdminRoutes>
                    </CoreAdminContext>
                </MemoryRouter>
            );
            expect(screen.queryByText('PostList')).toBeNull();
            expect(screen.queryByText('Loading')).not.toBeNull();
            resolve();
            await waitFor(() =>
                expect(screen.queryByText('PostList')).not.toBeNull()
            );
        });
        it('should redirect to login when requireAuth is true and authProvider.checkAuth() rejects', async () => {
            let reject;
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: (): Promise<void> =>
                    new Promise((res, rej) => (reject = rej)),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };

            const history = createMemoryHistory();
            render(
                <CoreAdminContext
                    authProvider={authProvider}
                    dataProvider={testDataProvider()}
                    history={history}
                >
                    <CoreAdminRoutes
                        layout={Layout}
                        loading={Loading}
                        catchAll={CatchAll}
                        requireAuth
                    >
                        <CustomRoutes noLayout>
                            <Route path="/login" element={<i>Login</i>} />
                        </CustomRoutes>
                        <Resource name="posts" list={() => <i>PostList</i>} />
                    </CoreAdminRoutes>
                </CoreAdminContext>
            );
            expect(screen.queryByText('PostList')).toBeNull();
            expect(screen.queryByText('Loading')).not.toBeNull();
            reject();
            await waitFor(() =>
                expect(screen.queryByText('Login')).not.toBeNull()
            );
        });
        it('should render custom routes when the user is not authenticated and requireAuth is false', async () => {
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: () => Promise.reject('Not authenticated'),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };

            const history = createMemoryHistory();
            render(
                <CoreAdminContext
                    authProvider={authProvider}
                    dataProvider={testDataProvider()}
                    history={history}
                >
                    <CoreAdminRoutes
                        layout={Layout}
                        loading={Loading}
                        catchAll={CatchAll}
                    >
                        <CustomRoutes noLayout>
                            <Route path="/custom" element={<i>Custom</i>} />
                            <Route path="/login" element={<i>Login</i>} />
                        </CustomRoutes>
                        <Resource name="posts" list={() => <i>PostList</i>} />
                    </CoreAdminRoutes>
                </CoreAdminContext>
            );
            expect(screen.queryByText('PostList')).not.toBeNull();
            expect(screen.queryByText('Loading')).toBeNull();
            history.push('/custom');
            await new Promise(resolve => setTimeout(resolve, 1100));
            await waitFor(() =>
                expect(screen.queryByText('Custom')).not.toBeNull()
            );
        });
    });
});
