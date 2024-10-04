import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { NavigateFunction, Route } from 'react-router-dom';

import { CoreAdminContext } from './CoreAdminContext';
import { CoreAdminRoutes } from './CoreAdminRoutes';
import { Resource } from './Resource';
import { CustomRoutes } from './CustomRoutes';
import { CoreLayoutProps } from '../types';
import { testDataProvider } from '../dataProvider';
import { TestMemoryRouter } from '../routing';
import { Basic } from './CoreAdminRoutes.stories';

const Layout = ({ children }: CoreLayoutProps) => <div>Layout {children}</div>;
const CatchAll = () => <div />;
const Loading = () => <>Loading</>;

describe('<CoreAdminRoutes>', () => {
    const defaultProps = {
        customRoutes: [],
    };

    describe('With resources as regular children', () => {
        it('should render resources and custom routes with and without layout', async () => {
            let navigate: NavigateFunction | null = null;
            render(
                <Basic
                    navigateCallback={n => {
                        navigate = n;
                    }}
                />
            );
            await screen.findByText('Layout');
            navigate!('/posts');
            await screen.findByText('PostList');
            navigate!('/comments');
            await screen.findByText('CommentList');
            navigate!('/foo');
            await screen.findByText('Foo');
            expect(screen.queryByText('Layout')).toBeNull();
            navigate!('/bar');
            await screen.findByText('Layout');
            await screen.findByText('Bar');
        });
    });

    describe('With children returned from a function as children', () => {
        it('should render resources and custom routes with and without layout when there is no authProvider', async () => {
            let navigate: NavigateFunction | null = null;
            render(
                <TestMemoryRouter
                    navigateCallback={n => {
                        navigate = n;
                    }}
                >
                    <CoreAdminContext dataProvider={testDataProvider()}>
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
                </TestMemoryRouter>
            );
            navigate!('/foo');
            await screen.findByText('Foo');
            expect(screen.queryByText('Layout')).toBeNull();
            navigate!('/bar');
            await screen.findByText('Bar');
            await screen.findByText('Layout');
            await screen.findByText('Bar');
            navigate!('/posts');
            await screen.findByText('PostList');
            navigate!('/comments');
            await screen.findByText('CommentList');
        });

        it('should render resources and custom routes with and without layout when there is an authProvider', async () => {
            let navigate: NavigateFunction | null = null;
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };
            render(
                <Basic
                    authProvider={authProvider}
                    navigateCallback={n => {
                        navigate = n;
                    }}
                />
            );
            navigate!('/foo');
            await screen.findByText('Foo');
            expect(screen.queryByText('Layout')).toBeNull();
            navigate!('/bar');
            await screen.findByText('Bar');
            expect(screen.queryByText('Layout')).not.toBeNull();
            navigate!('/posts');
            await screen.findByText('PostList');
            navigate!('/comments');
            await screen.findByText('CommentList');
        });

        it('should show the first resource by default when there is no authProvider', async () => {
            render(<Basic />);
            await screen.findByText('PostList');
        });

        it('should show the first resource by default when there is an authProvider', async () => {
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };
            render(<Basic authProvider={authProvider} />);
            await screen.findByText('PostList');
        });

        it('should show the first resource by default when there is an authProvider that supports canAccess', async () => {
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
                canAccess: jest.fn().mockResolvedValue(true),
            };
            render(<Basic authProvider={authProvider} />);
            await screen.findByText('PostList');
        });

        it('should show the first allowed resource by default when there is an authProvider that supports canAccess', async () => {
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
                canAccess: jest.fn(({ resource }) =>
                    Promise.resolve(resource === 'comments')
                ),
            };
            render(<Basic authProvider={authProvider} />);
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

            let navigate: NavigateFunction | null = null;
            render(
                <TestMemoryRouter
                    navigateCallback={n => {
                        navigate = n;
                    }}
                >
                    <CoreAdminContext
                        authProvider={authProvider}
                        dataProvider={testDataProvider()}
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
                </TestMemoryRouter>
            );
            // Timeout needed because we wait for a second before displaying the loading screen
            jest.advanceTimersByTime(1010);
            navigate!('/posts');
            await screen.findByText('Loading');
            navigate!('/foo');
            await screen.findByText('Custom');
            expect(screen.queryByText('Loading')).toBeNull();
            jest.useRealTimers();
        });
    });
    describe('anonymous access', () => {
        it('should not wait for the authProvider.checkAuth to return before rendering by default', () => {
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: (): Promise<void> => new Promise(() => {}), // never resolves
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };

            render(
                <TestMemoryRouter>
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
                </TestMemoryRouter>
            );
            expect(screen.queryByText('PostList')).not.toBeNull();
            expect(screen.queryByText('Loading')).toBeNull();
        });
        it('should render custom routes with no layout when the user is not authenticated ', async () => {
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: () => Promise.reject('Not authenticated'),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };
            let navigate;

            render(
                <TestMemoryRouter
                    navigateCallback={n => {
                        navigate = n;
                    }}
                >
                    <CoreAdminContext
                        authProvider={authProvider}
                        dataProvider={testDataProvider()}
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
                            <Resource
                                name="posts"
                                list={() => <i>PostList</i>}
                            />
                        </CoreAdminRoutes>
                    </CoreAdminContext>
                </TestMemoryRouter>
            );
            expect(screen.queryByText('PostList')).not.toBeNull();
            expect(screen.queryByText('Loading')).toBeNull();
            navigate('/custom');
            await new Promise(resolve => setTimeout(resolve, 1100));
            await waitFor(() =>
                expect(screen.queryByText('Custom')).not.toBeNull()
            );
        });
    });
    describe('requireAuth', () => {
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
                <TestMemoryRouter>
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
                </TestMemoryRouter>
            );
            expect(screen.queryByText('PostList')).toBeNull();
            expect(screen.queryByText('Loading')).not.toBeNull();
            resolve();
            await waitFor(() =>
                expect(screen.queryByText('PostList')).not.toBeNull()
            );
        });
        it('should redirect anonymous users to login when requireAuth is true and user accesses a resource page', async () => {
            let reject;
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: (): Promise<void> =>
                    new Promise((res, rej) => (reject = rej)),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };

            render(
                <TestMemoryRouter>
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
                            <CustomRoutes noLayout>
                                <Route path="/login" element={<i>Login</i>} />
                            </CustomRoutes>
                            <Resource
                                name="posts"
                                list={() => <i>PostList</i>}
                            />
                        </CoreAdminRoutes>
                    </CoreAdminContext>
                </TestMemoryRouter>
            );
            expect(screen.queryByText('PostList')).toBeNull();
            expect(screen.queryByText('Loading')).not.toBeNull();
            reject();
            await waitFor(() =>
                expect(screen.queryByText('Login')).not.toBeNull()
            );
        });
        it('should redirect anonymous users to login when requireAuth is true and user accesses a custom route', async () => {
            let reject;
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: (): Promise<void> =>
                    new Promise((res, rej) => (reject = rej)),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };

            render(
                <TestMemoryRouter initialEntries={['/custom']}>
                    <CoreAdminContext
                        dataProvider={testDataProvider()}
                        authProvider={authProvider}
                    >
                        <CoreAdminRoutes
                            layout={Layout}
                            loading={Loading}
                            catchAll={CatchAll}
                            requireAuth
                        >
                            <CustomRoutes>
                                <Route path="/custom" element={<i>Custom</i>} />
                            </CustomRoutes>
                            <CustomRoutes noLayout>
                                <Route path="/login" element={<i>Login</i>} />
                            </CustomRoutes>
                        </CoreAdminRoutes>
                    </CoreAdminContext>
                </TestMemoryRouter>
            );
            expect(screen.queryByText('Custom')).toBeNull();
            expect(screen.queryByText('Loading')).not.toBeNull();
            reject();
            await waitFor(() =>
                expect(screen.queryByText('Login')).not.toBeNull()
            );
        });
        it('should render custom routes with no layout even for anonymous users', async () => {
            let reject;
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: (): Promise<void> =>
                    new Promise((res, rej) => (reject = rej)),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };

            render(
                <TestMemoryRouter initialEntries={['/custom']}>
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
                            <CustomRoutes noLayout>
                                <Route path="/custom" element={<i>Custom</i>} />
                                <Route path="/login" element={<i>Login</i>} />
                            </CustomRoutes>
                        </CoreAdminRoutes>
                    </CoreAdminContext>
                </TestMemoryRouter>
            );
            // the custom page should show during loading and after the checkAuth promise is rejected
            expect(screen.queryByText('Custom')).not.toBeNull();
            expect(screen.queryByText('Loading')).toBeNull();
            reject();
            expect(screen.queryByText('Custom')).not.toBeNull();
        });
    });
});
