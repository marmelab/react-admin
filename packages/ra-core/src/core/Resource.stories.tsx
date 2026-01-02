import * as React from 'react';
import { Route } from 'react-router';
import { TestMemoryRouter, LinkBase, RouterNavigateFunction } from '../routing';
import { Resource } from './Resource';
import { CoreAdmin } from './CoreAdmin';

export default {
    title: 'ra-core/core/Resource',
};

const PostList = () => (
    <div>
        <div>PostList</div>
        <LinkBase to="/posts/create">create</LinkBase>{' '}
        <LinkBase to="/posts/123">edit</LinkBase>{' '}
        <LinkBase to="/posts/123/show">show</LinkBase>{' '}
        <LinkBase to="/posts/customroute">custom</LinkBase>
    </div>
);
const PostEdit = () => (
    <div>
        <div>PostEdit</div>
        <LinkBase to="/posts">list</LinkBase>
    </div>
);
const PostCreate = () => (
    <div>
        <div>PostCreate</div>
        <LinkBase to="/posts">list</LinkBase>
    </div>
);
const PostShow = () => (
    <div>
        <div>PostShow</div>
        <LinkBase to="/posts">list</LinkBase>
    </div>
);
const PostIcon = () => <div>PostIcon</div>;

const PostCustomRoute = () => (
    <div>
        <div>PostCustomRoute</div>
        <LinkBase to="/posts">list</LinkBase>
    </div>
);

const resource = {
    name: 'posts',
    options: { foo: 'bar' },
    list: PostList,
    edit: PostEdit,
    create: PostCreate,
    show: PostShow,
    icon: PostIcon,
    children: <Route path="customroute" element={<PostCustomRoute />} />,
};

export const Basic = ({
    navigateCallback,
}: {
    navigateCallback?: (n: RouterNavigateFunction) => void;
}) => (
    <TestMemoryRouter navigateCallback={navigateCallback}>
        <CoreAdmin loading={Loading}>
            <Resource {...resource} />
        </CoreAdmin>
    </TestMemoryRouter>
);

const Loading = () => <div>Loading...</div>;
