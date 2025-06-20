import * as React from 'react';
import { NavigateFunction, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { TestMemoryRouter } from '../routing';
import { Resource } from './Resource';
import { CoreAdmin } from './CoreAdmin';

export default {
    title: 'ra-core/core/Resource',
};

const PostList = () => (
    <div>
        <div>PostList</div>
        <Link to="/posts/create">create</Link> <Link to="/posts/123">edit</Link>{' '}
        <Link to="/posts/123/show">show</Link>{' '}
        <Link to="/posts/customroute">custom</Link>
    </div>
);
const PostEdit = () => (
    <div>
        <div>PostEdit</div>
        <Link to="/posts">list</Link>
    </div>
);
const PostCreate = () => (
    <div>
        <div>PostCreate</div>
        <Link to="/posts">list</Link>
    </div>
);
const PostShow = () => (
    <div>
        <div>PostShow</div>
        <Link to="/posts">list</Link>
    </div>
);
const PostIcon = () => <div>PostIcon</div>;

const PostCustomRoute = () => (
    <div>
        <div>PostCustomRoute</div>
        <Link to="/posts">list</Link>
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
    navigateCallback?: (n: NavigateFunction) => void;
}) => (
    <TestMemoryRouter navigateCallback={navigateCallback}>
        <CoreAdmin loading={Loading}>
            <Resource {...resource} />
        </CoreAdmin>
    </TestMemoryRouter>
);

const Loading = () => <div>Loading...</div>;
