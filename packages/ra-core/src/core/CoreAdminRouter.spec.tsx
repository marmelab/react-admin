import * as React from 'react';
import { waitFor } from '@testing-library/react';
import expect from 'expect';
import { Route } from 'react-router-dom';

import { renderWithRedux } from 'ra-test';
import { CoreAdminRouter } from './CoreAdminRouter';
import AuthContext from '../auth/AuthContext';
import { Resource } from './Resource';
import { CustomRoutes } from './CustomRoutes';
import { CoreLayoutProps } from '../types';

const Layout = ({ children }: CoreLayoutProps) => <div>Layout {children}</div>;
const CatchAll = () => <div />;
const Loading = () => <>Loading</>;

describe('<CoreAdminRouter>', () => {
    const defaultProps = {
        customRoutes: [],
    };

    describe('With resources as regular children', () => {
        it('should render all resources in routes', () => {
            const { getByText, history } = renderWithRedux(
                <CoreAdminRouter
                    {...defaultProps}
                    layout={Layout}
                    catchAll={CatchAll}
                    loading={Loading}
                >
                    <Resource name="posts" list={() => <span>PostList</span>} />
                    <Resource
                        name="comments"
                        list={() => <span>CommentList</span>}
                    />
                </CoreAdminRouter>
            );
            expect(getByText('Layout')).not.toBeNull();
            history.push('/posts');
            expect(getByText('PostList')).not.toBeNull();
            history.push('/comments');
            expect(getByText('CommentList')).not.toBeNull();
        });
    });

    describe('With no authProvider defined', () => {
        it('should render all resources with a render prop', async () => {
            const { getByText, history } = renderWithRedux(
                <CoreAdminRouter
                    {...defaultProps}
                    layout={Layout}
                    catchAll={CatchAll}
                    loading={Loading}
                >
                    {() => (
                        <>
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
                </CoreAdminRouter>
            );
            await waitFor(() => {
                expect(getByText('Layout')).not.toBeNull();
            });
            history.push('/posts');
            await waitFor(() => {
                expect(getByText('PostList')).not.toBeNull();
            });
            history.push('/comments');
            await waitFor(() => {
                expect(getByText('CommentList')).not.toBeNull();
            });
        });
    });

    describe('With resources returned from a function as children', () => {
        it('should render all resources with a registration intent', async () => {
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };

            const { queryByText, history } = renderWithRedux(
                <AuthContext.Provider value={authProvider}>
                    <CoreAdminRouter
                        layout={Layout}
                        catchAll={CatchAll}
                        loading={Loading}
                    >
                        {() => (
                            <>
                                <Resource
                                    name="posts"
                                    list={() => <span>PostList</span>}
                                />
                                <Resource
                                    name="comments"
                                    list={() => <span>CommentList</span>}
                                />
                                {null}
                            </>
                        )}
                    </CoreAdminRouter>
                </AuthContext.Provider>
            );
            // Timeout needed because of the authProvider call
            await waitFor(() => {
                expect(queryByText('Layout')).not.toBeNull();
            });
            history.push('/posts');
            expect(queryByText('PostList')).not.toBeNull();
            history.push('/comments');
            expect(queryByText('CommentList')).not.toBeNull();
        });

        it('should return loading while the resources are not resolved', async () => {
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };
            const Custom = () => <>Custom</>;

            const { queryByText, history } = renderWithRedux(
                <AuthContext.Provider value={authProvider}>
                    <CoreAdminRouter
                        {...defaultProps}
                        layout={Layout}
                        loading={Loading}
                        catchAll={CatchAll}
                    >
                        <CustomRoutes noLayout>
                            <Route path="/foo" element={<Custom />} />
                        </CustomRoutes>
                        {() => new Promise(() => null)}
                    </CoreAdminRouter>
                </AuthContext.Provider>
            );
            // Timeout needed because we wait for a second before displaying the loading screen
            await new Promise(resolve => setTimeout(resolve, 1010));
            history.push('/posts');
            expect(queryByText('Loading')).not.toBeNull();
            history.push('/foo');
            expect(queryByText('Loading')).toBeNull();
            expect(queryByText('Custom')).not.toBeNull();
        });
    });

    it('should render the custom routes with and without layout', () => {
        const { getByText, history, queryByText } = renderWithRedux(
            <CoreAdminRouter
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
                <Resource name="posts" />
            </CoreAdminRouter>
        );
        history.push('/foo');
        expect(queryByText('Layout')).toBeNull();
        expect(getByText('Foo')).not.toBeNull();
        history.push('/bar');
        expect(getByText('Layout')).not.toBeNull();
        expect(getByText('Bar')).not.toBeNull();
    });
});
