import React from 'react';
import { Route } from 'react-router';
import { TestMemoryRouter, LinkBase, RouterNavigateFunction } from '../routing';
import { testDataProvider } from '../dataProvider';
import { CoreAdminContext } from './CoreAdminContext';
import { CoreAdminRoutes } from './CoreAdminRoutes';
import { CustomRoutes } from './CustomRoutes';
import { Resource } from './Resource';
import { AuthProvider, CoreLayoutProps } from '../types';
import { Browser } from '../storybook/FakeBrowser';

export default {
    title: 'ra-core/core/CoreAdminRoutes',
};

export const Basic = ({
    authProvider,
    navigateCallback,
}: {
    authProvider?: AuthProvider;
    navigateCallback?: (n: RouterNavigateFunction) => void;
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
            <LinkBase to="/foo">foo</LinkBase>{' '}
            <LinkBase to="/bar">bar</LinkBase>{' '}
            <LinkBase to="/posts">posts</LinkBase>{' '}
            <LinkBase to="/comments">comments</LinkBase>
        </div>
        <div>
            <div>Layout</div>
            {children}
        </div>
    </div>
);
const CatchAll = () => <div />;
const Loading = () => <>Loading</>;
