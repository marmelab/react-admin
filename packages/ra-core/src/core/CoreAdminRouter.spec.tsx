import React from 'react';
import { cleanup, wait } from '@testing-library/react';
import expect from 'expect';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import renderWithRedux from '../util/renderWithRedux';
import CoreAdminRouter from './CoreAdminRouter';
import AuthContext from '../auth/AuthContext';
import Resource from './Resource';

const Layout = ({ children }) => <div>Layout {children}</div>;

describe('<CoreAdminRouter>', () => {
    afterEach(cleanup);

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
            expect(getByText('Layout')).toBeDefined();
            history.push('/posts');
            expect(getByText('PostList')).toBeDefined();
            history.push('/comments');
            expect(getByText('CommentList')).toBeDefined();
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
            await new Promise(resolve => setTimeout(resolve, 10));
            expect(getByText('Layout')).toBeDefined();
            history.push('/posts');
            expect(getByText('PostList')).toBeDefined();
            history.push('/comments');
            expect(getByText('CommentList')).toBeDefined();
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

            const { getByText } = renderWithRedux(
                <AuthContext.Provider value={authProvider}>
                    <Router history={history}>
                        <CoreAdminRouter {...defaultProps} layout={Layout}>
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
            await wait();
            expect(getByText('Layout')).toBeDefined();
            history.push('/posts');
            expect(getByText('PostList')).toBeDefined();
            history.push('/comments');
            expect(getByText('CommentList')).toBeDefined();
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
        expect(getByText('Foo')).toBeDefined();
        history.push('/bar');
        expect(getByText('Layout')).toBeDefined();
        expect(getByText('Bar')).toBeDefined();
    });
});
