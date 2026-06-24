import * as React from 'react';
import fakeDataProvider from 'ra-data-fakerest';
import {
    CoreAdmin,
    Resource,
    CustomRoutes,
    ListBase,
    ShowBase,
    EditBase,
    CreateBase,
    useRecordContext,
    useNavigate,
    useLocation,
    LinkBase,
    useBlocker,
    Form,
    testUI,
} from 'ra-core';
import { reactRouterNextProvider } from './reactRouterNextProvider';

const { useParams, useMatch, useInRouterContext, Route, Navigate } =
    reactRouterNextProvider;
const { TextInput } = testUI;

export default {
    title: 'ra-routing-react-router-next/React Router v8 Provider',
};

const dataProvider = fakeDataProvider(
    {
        posts: [
            { id: 1, title: 'Post #1', body: 'Hello World' },
            { id: 2, title: 'Post #2', body: 'Second post' },
            { id: 3, title: 'Post #3', body: 'Third post' },
            { id: 4, title: 'Post #4', body: 'Fourth post' },
        ],
        comments: [
            { id: 1, post_id: 1, body: 'Nice post!' },
            { id: 2, post_id: 1, body: 'Great article' },
        ],
    },
    process.env.NODE_ENV === 'development'
);

const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
};

const Layout = ({ children }: { children?: React.ReactNode }) => (
    <div>
        <LocationDisplay />
        {children}
    </div>
);

const PostList = () => {
    const navigate = useNavigate();
    return (
        <ListBase
            resource="posts"
            render={({ data }) => (
                <div style={{ padding: 20 }}>
                    <h2>Posts</h2>
                    <ul>
                        {data?.map(record => (
                            <li key={record.id}>
                                <LinkBase to={`/posts/${record.id}/show`}>
                                    {record.title}
                                </LinkBase>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => navigate('/posts/create')}>
                        Create New Post
                    </button>
                </div>
            )}
        />
    );
};

const PostShow = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    return (
        <ShowBase resource="posts" id={id}>
            <PostShowView onEdit={() => navigate(`/posts/${id}`)} />
        </ShowBase>
    );
};

const PostShowView = ({ onEdit }: { onEdit: () => void }) => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <div style={{ padding: 20 }}>
            <h2>{record.title}</h2>
            <p>{record.body}</p>
            <button onClick={onEdit}>Edit</button>
            <LinkBase to="/posts">Back to list</LinkBase>
        </div>
    );
};

const PostEdit = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <EditBase resource="posts" id={id} redirect={false}>
            <Form>
                <TextInput source="title" />
                <TextInput source="body" />
            </Form>
        </EditBase>
    );
};

const PostCreate = () => (
    <CreateBase resource="posts" redirect={false}>
        <Form>
            <TextInput source="title" />
            <TextInput source="body" />
        </Form>
    </CreateBase>
);

/**
 * BasicStandalone: react-admin runs on its own hash router created by the
 * react-router v8 provider (no surrounding router).
 */
export const BasicStandalone = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        layout={Layout}
    >
        <Resource
            name="posts"
            list={PostList}
            show={PostShow}
            edit={PostEdit}
            create={PostCreate}
        />
    </CoreAdmin>
);

/**
 * MultipleResources: several resources sharing the v8 provider.
 */
const CommentList = () => (
    <ListBase
        resource="comments"
        render={({ data }) => (
            <ul>
                {data?.map(record => <li key={record.id}>{record.body}</li>)}
            </ul>
        )}
    />
);

export const MultipleResources = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        layout={Layout}
    >
        <Resource name="posts" list={PostList} show={PostShow} />
        <Resource name="comments" list={CommentList} />
    </CoreAdmin>
);

/**
 * LinkComponent: navigation through LinkBase (which renders the provider Link).
 */
export const LinkComponent = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        layout={Layout}
    >
        <Resource name="posts" list={PostList} show={PostShow} />
    </CoreAdmin>
);

/**
 * NavigateComponent: declarative redirect through the provider Navigate.
 */
const RedirectToPosts = () => <Navigate to="/posts" />;

export const NavigateComponent = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        layout={Layout}
    >
        <CustomRoutes>
            <Route path="/" element={<RedirectToPosts />} />
        </CustomRoutes>
        <Resource name="posts" list={PostList} show={PostShow} />
    </CoreAdmin>
);

/**
 * CustomRoutesSupport: a custom page rendered through CustomRoutes.
 */
const CustomPage = () => {
    const location = useLocation();
    return (
        <div data-testid="custom-page">Custom page at {location.pathname}</div>
    );
};

export const CustomRoutesSupport = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        layout={Layout}
    >
        <CustomRoutes>
            <Route path="/custom" element={<CustomPage />} />
        </CustomRoutes>
        <Resource name="posts" list={PostList} />
    </CoreAdmin>
);

/**
 * UseParamsTest: reads the record id from the URL params.
 */
const ParamsReader = () => {
    const params = useParams();
    return <div data-testid="params">{JSON.stringify(params)}</div>;
};

export const UseParamsTest = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        layout={Layout}
    >
        <CustomRoutes>
            <Route path="/items/:id" element={<ParamsReader />} />
        </CustomRoutes>
        <Resource name="posts" list={PostList} />
    </CoreAdmin>
);

/**
 * UseMatchTest: matches the current location against a pattern.
 */
const MatchReader = () => {
    const match = useMatch({ path: '/posts/:id/show' });
    return <div data-testid="match">{JSON.stringify(match)}</div>;
};

export const UseMatchTest = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        layout={Layout}
    >
        <CustomRoutes>
            <Route path="/posts/:id/show" element={<MatchReader />} />
        </CustomRoutes>
        <Resource name="posts" list={PostList} />
    </CoreAdmin>
);

/**
 * UseLocationTest: surfaces the current location.
 */
export const UseLocationTest = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        layout={Layout}
    >
        <Resource name="posts" list={PostList} show={PostShow} />
    </CoreAdmin>
);

/**
 * RouterContextTest: confirms react-admin detects it is inside a router.
 */
const InRouterContextReader = () => {
    const inContext = useInRouterContext();
    return <div data-testid="in-router">{String(inContext)}</div>;
};

export const RouterContextTest = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        layout={Layout}
    >
        <CustomRoutes>
            <Route path="/" element={<InRouterContextReader />} />
        </CustomRoutes>
        <Resource name="posts" list={PostList} />
    </CoreAdmin>
);

/**
 * UseBlockerTest: blocks navigation while a form is dirty.
 */
const BlockerForm = () => {
    const [dirty, setDirty] = React.useState(false);
    const blocker = useBlocker(dirty);
    const navigate = useNavigate();
    return (
        <div style={{ padding: 20 }}>
            <label>
                <input
                    type="checkbox"
                    checked={dirty}
                    onChange={e => setDirty(e.target.checked)}
                />
                Form is dirty
            </label>
            <button onClick={() => navigate('/posts')}>Leave</button>
            {blocker.state === 'blocked' ? (
                <div data-testid="blocked">
                    <button onClick={() => blocker.proceed()}>Confirm</button>
                    <button onClick={() => blocker.reset()}>Cancel</button>
                </div>
            ) : null}
        </div>
    );
};

export const UseBlockerTest = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        layout={Layout}
    >
        <CustomRoutes>
            <Route path="/" element={<BlockerForm />} />
        </CustomRoutes>
        <Resource name="posts" list={PostList} />
    </CoreAdmin>
);
