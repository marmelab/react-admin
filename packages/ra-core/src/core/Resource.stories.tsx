import * as React from 'react';
import { NavigateFunction, Route, Routes } from 'react-router';
import { Link, useParams, useLocation } from 'react-router-dom';
import { TestMemoryRouter } from '../routing';
import { Resource } from './Resource';
import { CoreAdmin } from './CoreAdmin';
import { Browser } from '../storybook/FakeBrowser';

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
        <Browser>
            <CoreAdmin loading={Loading}>
                <Resource {...resource} />
            </CoreAdmin>
        </Browser>
    </TestMemoryRouter>
);

const Loading = () => <div>Loading...</div>;

export const OnlyList = ({
    navigateCallback,
}: {
    navigateCallback?: (n: NavigateFunction) => void;
}) => (
    <TestMemoryRouter navigateCallback={navigateCallback}>
        <Browser>
            <CoreAdmin loading={Loading}>
                <Resource name="posts" list={PostList} />
            </CoreAdmin>
        </Browser>
    </TestMemoryRouter>
);

export const WithAllDialogs = ({
    navigateCallback,
}: {
    navigateCallback?: (n: NavigateFunction) => void;
}) => (
    <TestMemoryRouter navigateCallback={navigateCallback}>
        <Browser>
            <CoreAdmin loading={Loading}>
                <Resource name="posts" list={PostListWithAllDialogs} />
            </CoreAdmin>
        </Browser>
    </TestMemoryRouter>
);

const PostListWithAllDialogs = () => (
    <div>
        <div>PostList</div>
        <Link to="/posts/create">create</Link> <Link to="/posts/123">edit</Link>{' '}
        <Link to="/posts/123/show">show</Link>
        <PostEditDialog />
        <PostCreateDialog />
        <PostShowDialog />
    </div>
);

const PostCreateDialog = () => (
    <Routes>
        <Route
            path="create/*"
            element={
                <div
                    style={{
                        border: '1px solid black',
                        margin: '1em',
                        padding: '1em',
                        maxWidth: '400px',
                    }}
                >
                    <div>
                        <Link to="/posts">close</Link>
                    </div>
                    <div>PostCreate</div>
                </div>
            }
        />
    </Routes>
);

const PostEditDialog = () => {
    return (
        <Routes>
            <Route path=":id/*" element={<PostEditDialogView />} />
        </Routes>
    );
};

const PostEditDialogView = () => {
    const params = useParams<'id'>();
    const location = useLocation();
    const isMatch =
        params.id &&
        params.id !== 'create' &&
        location.pathname.indexOf('/show') === -1;
    return isMatch ? (
        <div
            style={{
                border: '1px solid black',
                margin: '1em',
                padding: '1em',
                maxWidth: '400px',
            }}
        >
            <div>
                <Link to="/posts">close</Link>
            </div>
            <div>PostEdit</div>
        </div>
    ) : null;
};

const PostShowDialog = () => {
    return (
        <Routes>
            <Route path=":id/show/*" element={<PostShowDialogView />} />
        </Routes>
    );
};

const PostShowDialogView = () => {
    const params = useParams<'id'>();
    const isMatch = params.id && params.id !== 'create';
    return isMatch ? (
        <div
            style={{
                border: '1px solid black',
                margin: '1em',
                padding: '1em',
                maxWidth: '400px',
            }}
        >
            <div>
                <Link to="/posts">close</Link>
            </div>
            <div>PostShow</div>
        </div>
    ) : null;
};

export const WithCreateDialog = ({
    navigateCallback,
}: {
    navigateCallback?: (n: NavigateFunction) => void;
}) => (
    <TestMemoryRouter navigateCallback={navigateCallback}>
        <Browser>
            <CoreAdmin loading={Loading}>
                <Resource
                    name="posts"
                    list={PostListWithCreateDialog}
                    edit={PostEdit}
                />
            </CoreAdmin>
        </Browser>
    </TestMemoryRouter>
);

const PostListWithCreateDialog = () => (
    <div>
        <div>PostList</div>
        <Link to="/posts/create">create</Link> <Link to="/posts/123">edit</Link>{' '}
        <PostCreateDialog />
    </div>
);

export const WithShowDialog = ({
    navigateCallback,
}: {
    navigateCallback?: (n: NavigateFunction) => void;
}) => (
    <TestMemoryRouter navigateCallback={navigateCallback}>
        <Browser>
            <CoreAdmin loading={Loading}>
                <Resource
                    name="posts"
                    list={PostListWithShowDialog}
                    edit={PostEdit}
                />
            </CoreAdmin>
        </Browser>
    </TestMemoryRouter>
);

const PostListWithShowDialog = () => (
    <div>
        <div>PostList</div>
        <Link to="/posts/123">edit</Link> <Link to="/posts/123/show">show</Link>
        <PostShowDialog />
    </div>
);
