import * as React from 'react';
import fakeDataProvider from 'ra-data-fakerest';
import {
    createHashRouter,
    RouterProvider,
    Outlet,
    Link as ReactRouterLink,
    useNavigate as useReactRouterNavigate,
} from 'react-router';
import {
    CoreAdmin,
    Resource,
    CustomRoutes,
    ListBase,
    ShowBase,
    EditBase,
    CreateBase,
    useRecordContext,
    useLocation,
    LinkBase,
    testUI,
} from 'ra-core';
import { reactRouterNextProvider } from './reactRouterNextProvider';

const {
    useParams,
    useMatch,
    useInRouterContext,
    useCanBlock,
    Route,
    Navigate,
} = reactRouterNextProvider;
const { TextInput, SimpleList, SimpleShowLayout, SimpleForm, CreateButton } =
    testUI;

export default {
    title: 'ra-routing-react-router-next/React Router Provider',
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

const Field = ({ source }: { source: string }) => {
    const record = useRecordContext();
    return <span data-testid={source}>{record?.[source]}</span>;
};

const PostList = () => (
    <ListBase resource="posts">
        <div style={{ padding: 20 }}>
            <h2>Posts</h2>
            <CreateButton />
            <SimpleList
                render={record => (
                    <LinkBase to={`/posts/${record.id}/show`}>
                        {record.title}
                    </LinkBase>
                )}
            />
        </div>
    </ListBase>
);

const PostShow = () => (
    <ShowBase resource="posts">
        <div style={{ padding: 20 }}>
            <h2>Post Details</h2>
            <SimpleShowLayout>
                <Field source="title" />
                <Field source="body" />
            </SimpleShowLayout>
            <LinkBase to="/posts">Back to list</LinkBase>
        </div>
    </ShowBase>
);

const PostEdit = () => (
    <EditBase resource="posts">
        <div style={{ padding: 20 }}>
            <h2>Edit Post</h2>
            <SimpleForm>
                <TextInput source="title" />
                <TextInput source="body" />
            </SimpleForm>
        </div>
    </EditBase>
);

const PostCreate = () => (
    <CreateBase resource="posts" redirect="list">
        <div style={{ padding: 20 }}>
            <h2>Create Post</h2>
            <SimpleForm>
                <TextInput source="title" />
                <TextInput source="body" />
            </SimpleForm>
        </div>
    </CreateBase>
);

const LocationDisplay = () => {
    const location = useLocation();
    return (
        <div
            data-testid="location-display"
            style={{
                padding: 10,
                background: '#f0f0f0',
                marginTop: 20,
                fontFamily: 'monospace',
            }}
        >
            <strong>Current Location:</strong>
            <pre>{JSON.stringify(location, null, 2)}</pre>
        </div>
    );
};

const Layout = ({ children }: { children?: React.ReactNode }) => (
    <div>
        {children}
        <LocationDisplay />
    </div>
);

/**
 * The most basic setup: react-admin runs on its own hash router created by the
 * provider, with a single resource exercising list/show/edit/create.
 */
export const Basic = () => (
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
 * react-admin embedded inside an existing React Router app, mounted under a
 * basename. Exercises the provider detecting the surrounding router and the
 * basename support.
 */
const EmbeddedNav = () => {
    const navigate = useReactRouterNavigate();
    return (
        <nav style={{ padding: 10, background: '#333', color: 'white' }}>
            <ReactRouterLink to="/" style={{ color: 'white', marginRight: 20 }}>
                Home
            </ReactRouterLink>
            <ReactRouterLink
                to="/admin/posts"
                style={{ color: 'white', marginRight: 20 }}
            >
                Admin
            </ReactRouterLink>
            <button onClick={() => navigate('/')} style={{ color: 'black' }}>
                Home (Direct)
            </button>
        </nav>
    );
};

const EmbeddedAdmin = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        basename="/admin"
        layout={Layout}
    >
        <Resource name="posts" list={PostList} show={PostShow} />
    </CoreAdmin>
);

const embeddedRouter = createHashRouter([
    {
        path: '/',
        element: (
            <div>
                <EmbeddedNav />
                <Outlet />
            </div>
        ),
        children: [
            {
                index: true,
                element: (
                    <div style={{ padding: 20 }}>
                        <h1>Home Page</h1>
                        <p>
                            This is a React Router app with embedded
                            react-admin.
                        </p>
                        <ReactRouterLink to="/admin">
                            Go to Admin
                        </ReactRouterLink>
                    </div>
                ),
            },
            { path: 'admin/*', element: <EmbeddedAdmin /> },
        ],
    },
]);

export const Embedded = () => <RouterProvider router={embeddedRouter} />;

/**
 * Tests the provider Link (through LinkBase) using custom routes and no resource.
 */
const LinkPage = () => (
    <div style={{ padding: 20 }}>
        <h2>Link Component</h2>
        <LinkBase to="/page-2">Go to page 2</LinkBase>
        <LinkBase to={{ pathname: '/page-2', search: '?foo=bar' }}>
            Go to page 2 with search
        </LinkBase>
        <LinkBase to="/page-2" state={{ from: 'link' }}>
            Go to page 2 with state
        </LinkBase>
    </div>
);

const Page2 = () => (
    <div style={{ padding: 20 }}>
        <h2 data-testid="page-2">Page 2</h2>
        <LinkBase to="/">Back</LinkBase>
        <LocationDisplay />
    </div>
);

export const LinkComponent = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
    >
        <CustomRoutes noLayout>
            <Route path="/" element={<LinkPage />} />
            <Route path="/page-2" element={<Page2 />} />
        </CustomRoutes>
    </CoreAdmin>
);

/**
 * Tests the provider Navigate (declarative redirect) using custom routes.
 */
const RedirectPage = () => <Navigate to="/target" />;

const TargetPage = () => (
    <div data-testid="target-page" style={{ padding: 20 }}>
        Target page
    </div>
);

export const NavigateComponent = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
    >
        <CustomRoutes noLayout>
            <Route path="/" element={<RedirectPage />} />
            <Route path="/target" element={<TargetPage />} />
        </CustomRoutes>
    </CoreAdmin>
);

/**
 * Tests the useParams hook using a custom route.
 */
const ParamsReader = () => {
    const params = useParams();
    return <div data-testid="params">{JSON.stringify(params)}</div>;
};

export const UseParams = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
    >
        <CustomRoutes noLayout>
            <Route path="/" element={<Navigate to="/items/42" />} />
            <Route path="/items/:id" element={<ParamsReader />} />
        </CustomRoutes>
    </CoreAdmin>
);

/**
 * Tests the useMatch hook using a custom route.
 */
const MatchReader = () => {
    const match = useMatch({ path: '/posts/:id/show' });
    return (
        <div data-testid="match">{JSON.stringify(match?.params ?? null)}</div>
    );
};

export const UseMatch = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
    >
        <CustomRoutes noLayout>
            <Route path="/" element={<Navigate to="/posts/7/show" />} />
            <Route path="/posts/:id/show" element={<MatchReader />} />
        </CustomRoutes>
    </CoreAdmin>
);

/**
 * Tests the useLocation hook using a custom route.
 */
export const UseLocation = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
    >
        <CustomRoutes noLayout>
            <Route path="/" element={<LocationDisplay />} />
        </CustomRoutes>
    </CoreAdmin>
);

/**
 * Tests the useInRouterContext and useCanBlock hooks using a custom route.
 */
const ContextInfo = () => {
    const isInRouter = useInRouterContext();
    const canBlock = useCanBlock();
    return (
        <div style={{ padding: 20, fontFamily: 'monospace' }}>
            <div data-testid="in-router-context">{String(isInRouter)}</div>
            <div data-testid="can-block">{String(canBlock)}</div>
        </div>
    );
};

export const RouterContext = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
    >
        <CustomRoutes noLayout>
            <Route path="/" element={<ContextInfo />} />
        </CustomRoutes>
    </CoreAdmin>
);

/**
 * Tests navigation blocking through react-admin's built-in
 * useWarnWhenUnsavedChanges (via the Form `warnWhenUnsavedChanges` prop), rather
 * than a hand-rolled blocker. When the form is dirty, leaving triggers a
 * `window.confirm` before navigating away.
 */
const PostEditWithWarning = () => (
    <EditBase resource="posts" id={1}>
        <div style={{ padding: 20 }}>
            <h2>Edit Post</h2>
            <SimpleForm warnWhenUnsavedChanges>
                <TextInput source="title" />
                <TextInput source="body" />
            </SimpleForm>
            <LinkBase to="/comments">Go to comments</LinkBase>
        </div>
    </EditBase>
);

export const WarnWhenUnsavedChanges = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
    >
        <Resource name="posts" edit={PostEditWithWarning} />
        <Resource name="comments" list={() => <h2>Comments</h2>} />
        <CustomRoutes noLayout>
            <Route path="/" element={<Navigate to="/posts/1" />} />
        </CustomRoutes>
    </CoreAdmin>
);
