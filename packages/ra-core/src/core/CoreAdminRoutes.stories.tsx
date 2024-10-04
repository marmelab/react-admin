import React from 'react';
import { NavigateFunction, Route } from 'react-router';
import { TestMemoryRouter } from '../routing/TestMemoryRouter';
import { testDataProvider } from '../dataProvider';
import { CoreAdminContext } from './CoreAdminContext';
import { CoreAdminRoutes } from './CoreAdminRoutes';
import { CustomRoutes } from './CustomRoutes';
import { Resource } from './Resource';
import { AuthProvider, CoreLayoutProps } from '../types';
import { Link } from 'react-router-dom';
import { Browser } from '../storybook/FakeBrowser';

export default {
    title: 'ra-core/core/CoreAdminRoutes',
};

export const Basic = ({
    authProvider,
    navigateCallback,
}: {
    authProvider?: AuthProvider;
    navigateCallback?: (n: NavigateFunction) => void;
}) => (
    <TestMemoryRouter navigateCallback={navigateCallback}>
        <Browser>
            <CoreAdminContext
                dataProvider={testDataProvider()}
                authProvider={authProvider}
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
                    <Resource name="posts" list={() => <div>PostList</div>} />
                    <Resource
                        name="comments"
                        list={() => <div>CommentList</div>}
                    />
                </CoreAdminRoutes>
            </CoreAdminContext>
        </Browser>
    </TestMemoryRouter>
);

const Layout = ({ children }: CoreLayoutProps) => (
    <div>
        <div>
            <Link to="/foo">foo</Link> <Link to="/bar">bar</Link>{' '}
            <Link to="/posts">posts</Link> <Link to="/comments">comments</Link>
        </div>
        <div>
            <div>Layout</div>
            {children}
        </div>
    </div>
);
const CatchAll = () => <div />;
const Loading = () => <>Loading</>;
