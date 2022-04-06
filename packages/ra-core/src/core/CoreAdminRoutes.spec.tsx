import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { Route } from 'react-router-dom';
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
        it('should render resources and custom routes with and without layout', () => {
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
            expect(screen.getByText('Layout')).not.toBeNull();
            history.push('/posts');
            expect(screen.getByText('PostList')).not.toBeNull();
            history.push('/comments');
            expect(screen.getByText('CommentList')).not.toBeNull();
            history.push('/foo');
            expect(screen.queryByText('Layout')).toBeNull();
            expect(screen.getByText('Foo')).not.toBeNull();
            history.push('/bar');
            expect(screen.getByText('Layout')).not.toBeNull();
            expect(screen.getByText('Bar')).not.toBeNull();
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
            expect(screen.queryByText('Layout')).toBeNull();
            expect(screen.getByText('Foo')).not.toBeNull();
            history.push('/bar');
            await waitFor(() => {
                expect(screen.queryByText('Layout')).not.toBeNull();
            });
            expect(screen.getByText('Bar')).not.toBeNull();
            history.push('/posts');
            expect(screen.queryByText('PostList')).not.toBeNull();
            history.push('/comments');
            expect(screen.queryByText('CommentList')).not.toBeNull();
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
            expect(screen.queryByText('Layout')).toBeNull();
            expect(screen.getByText('Foo')).not.toBeNull();
            history.push('/bar');
            await waitFor(() => {
                expect(screen.queryByText('Layout')).not.toBeNull();
            });
            expect(screen.getByText('Bar')).not.toBeNull();
            history.push('/posts');
            expect(screen.queryByText('PostList')).not.toBeNull();
            history.push('/comments');
            expect(screen.queryByText('CommentList')).not.toBeNull();
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
            expect(screen.queryByText('Loading')).not.toBeNull();
            history.push('/foo');
            expect(screen.queryByText('Loading')).toBeNull();
            expect(screen.queryByText('Custom')).not.toBeNull();
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

            const history = createMemoryHistory();
            render(
                <CoreAdminContext
                    authProvider={authProvider}
                    dataProvider={testDataProvider()}
                    history={history}
                >
                    <CoreAdminRoutes
                        {...defaultProps}
                        layout={Layout}
                        loading={Loading}
                        catchAll={CatchAll}
                    >
                        <Resource name="posts" list={() => <i>PostList</i>} />
                    </CoreAdminRoutes>
                </CoreAdminContext>
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
                        <Resource name="posts" list={() => <i>PostList</i>} />
                    </CoreAdminRoutes>
                </CoreAdminContext>
            );
            expect(screen.queryByText('PostList')).toBeNull();
            expect(screen.queryByText('Loading')).toBeNull();
            resolve();
            await waitFor(() =>
                expect(screen.queryByText('PostList')).not.toBeNull()
            );
        });
        it('should show a loader when requireAuth is true and dataProvider.checkAuth() takes more than 1s to reply', async () => {
            let resolve;
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: (): Promise<void> =>
                    new Promise(res => (resolve = res)),
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
                        <Resource name="posts" list={() => <i>PostList</i>} />
                    </CoreAdminRoutes>
                </CoreAdminContext>
            );
            expect(screen.queryByText('PostList')).toBeNull();
            expect(screen.queryByText('Loading')).toBeNull();
            await new Promise(resolve => setTimeout(resolve, 1100));
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
            expect(screen.queryByText('Loading')).toBeNull();
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
