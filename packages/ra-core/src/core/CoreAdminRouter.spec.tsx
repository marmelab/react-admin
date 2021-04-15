import * as React from 'react';
import { waitFor } from '@testing-library/react';
import expect from 'expect';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { renderWithRedux } from 'ra-test';
import CoreAdminRouter from './CoreAdminRouter';
import AuthContext from '../auth/AuthContext';
import Resource from './Resource';

const Layout = ({ children }) => <div>Layout {children}</div>;

describe('<CoreAdminRouter>', () => {
    const defaultProps = {
        customRoutes: [],
    };

    describe('With resources as regular children', () => {
        it('should render all resources in routes', () => {
            const history = createMemoryHistory();
            const { getByText } = renderWithRedux(
                <Router history={history}>
                    <CoreAdminRouter {...defaultProps} layout={Layout}>
                        <Resource
                            name="posts"
                            list={() => <span>PostList</span>}
                        />
                        <Resource
                            name="comments"
                            list={() => <span>CommentList</span>}
                        />
                    </CoreAdminRouter>
                </Router>
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
            const history = createMemoryHistory();
            const { getByText } = renderWithRedux(
                <Router history={history}>
                    <CoreAdminRouter {...defaultProps} layout={Layout}>
                        {() => [
                            <Resource
                                name="posts"
                                list={() => <span>PostList</span>}
                            />,
                            <Resource
                                name="comments"
                                list={() => <span>CommentList</span>}
                            />,
                        ]}
                    </CoreAdminRouter>
                </Router>
            );
            await waitFor(() => {
                expect(getByText('Layout')).not.toBeNull();
            });
            history.push('/posts');
            expect(getByText('PostList')).not.toBeNull();
            history.push('/comments');
            expect(getByText('CommentList')).not.toBeNull();
        });
    });

    describe('With resources returned from a function as children', () => {
        it('should render all resources with a registration intent', async () => {
            const history = createMemoryHistory();
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };

            const { queryByText } = renderWithRedux(
                <AuthContext.Provider value={authProvider}>
                    <Router history={history}>
                        <CoreAdminRouter layout={Layout}>
                            {() => [
                                <Resource
                                    key="posts"
                                    name="posts"
                                    list={() => <span>PostList</span>}
                                />,
                                <Resource
                                    key="comments"
                                    name="comments"
                                    list={() => <span>CommentList</span>}
                                />,
                                null,
                            ]}
                        </CoreAdminRouter>
                    </Router>
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
            const history = createMemoryHistory();
            const authProvider = {
                login: jest.fn().mockResolvedValue(''),
                logout: jest.fn().mockResolvedValue(''),
                checkAuth: jest.fn().mockResolvedValue(''),
                checkError: jest.fn().mockResolvedValue(''),
                getPermissions: jest.fn().mockResolvedValue(''),
            };
            const Loading = () => <>Loading</>;
            const Custom = () => <>Custom</>;

            const { queryByText } = renderWithRedux(
                <AuthContext.Provider value={authProvider}>
                    <Router history={history}>
                        <CoreAdminRouter
                            {...defaultProps}
                            layout={Layout}
                            loading={Loading}
                            customRoutes={[
                                <Route
                                    key="foo"
                                    noLayout
                                    path="/foo"
                                    component={Custom}
                                />,
                            ]}
                        >
                            {() => new Promise(() => {})}
                        </CoreAdminRouter>
                    </Router>
                </AuthContext.Provider>
            );
            // Timeout needed because of the authProvider call
            await new Promise(resolve => setTimeout(resolve, 1010));
            history.push('/posts');
            expect(queryByText('Loading')).not.toBeNull();
            history.push('/foo');
            expect(queryByText('Loading')).toBeNull();
            expect(queryByText('Custom')).not.toBeNull();
        });
    });

    it('should render the custom routes with and without layout', () => {
        const history = createMemoryHistory();
        const { getByText, queryByText } = renderWithRedux(
            <Router history={history}>
                <CoreAdminRouter
                    layout={Layout}
                    customRoutes={[
                        <Route
                            key="foo"
                            noLayout
                            exact
                            path="/foo"
                            render={() => <div>Foo</div>}
                        />,
                        <Route
                            key="bar"
                            exact
                            path="/bar"
                            component={() => <div>Bar</div>}
                        />,
                    ]}
                    location={{ pathname: '/custom' }}
                >
                    <Resource name="posts" />
                </CoreAdminRouter>
            </Router>
        );
        history.push('/foo');
        expect(queryByText('Layout')).toBeNull();
        expect(getByText('Foo')).not.toBeNull();
        history.push('/bar');
        expect(getByText('Layout')).not.toBeNull();
        expect(getByText('Bar')).not.toBeNull();
    });
});
