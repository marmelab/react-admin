import * as React from 'react';
import fakeDataProvider from 'ra-data-fakerest';
import {
    createRouter,
    createRootRoute,
    createRoute,
    RouterProvider,
    Outlet,
    Link as TanStackLink,
    useRouter,
} from '@tanstack/react-router';
import { createHashHistory } from '@tanstack/history';

import {
    useNavigate,
    useLocation,
    LinkBase,
    useBlocker,
    ListBase,
    ShowBase,
    EditBase,
    CreateBase,
    useRecordContext,
    CoreAdmin,
    Resource,
    CustomRoutes,
    Form,
    useInput,
    type InputProps,
} from 'ra-core';

// Simple TextInput for stories - uses ra-core's useInput hook
const TextInput = (props: InputProps) => {
    const { id, field } = useInput(props);
    return (
        <div>
            <label htmlFor={id}>{props.source}</label>
            <br />
            <input id={id} {...field} type="text" />
        </div>
    );
};
import { tanStackRouterProvider } from './tanStackRouterProvider';

const {
    useParams,
    useMatch,
    useInRouterContext,
    useCanBlock,
    Route,
    Navigate,
} = tanStackRouterProvider;

export default {
    title: 'ra-routing-tanstack/TanStack Router Provider',
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
    return (
        <ShowBase
            resource="posts"
            render={({ record }) => (
                <div style={{ padding: 20 }}>
                    <h2>Post Details</h2>
                    {record && (
                        <>
                            <dl>
                                <dt>ID:</dt>
                                <dd>{record.id}</dd>
                            </dl>
                            <dl>
                                <dt>Title:</dt>
                                <dd>{record.title}</dd>
                            </dl>
                            <dl>
                                <dt>Body:</dt>
                                <dd>{record.body}</dd>
                            </dl>
                            <button
                                onClick={() => navigate(`/posts/${record.id}`)}
                            >
                                Edit
                            </button>
                        </>
                    )}
                    <button onClick={() => navigate('/posts')}>
                        Back to List
                    </button>
                    <button onClick={() => navigate(-1)}>
                        Go Back (History)
                    </button>
                </div>
            )}
        />
    );
};

const PostEdit = () => {
    const navigate = useNavigate();
    return (
        <EditBase resource="posts">
            <div style={{ padding: 20 }}>
                <h2>Edit Post</h2>
                <Form>
                    <TextInput source="title" />
                    <TextInput source="body" />
                    <button type="submit">Save</button>
                    <button onClick={() => navigate('/posts')}>Cancel</button>
                </Form>
            </div>
        </EditBase>
    );
};

const PostCreate = () => {
    const navigate = useNavigate();
    return (
        <CreateBase resource="posts" redirect="list">
            <div style={{ padding: 20 }}>
                <h2>Create Post</h2>
                <Form>
                    <TextInput source="title" />
                    <TextInput source="body" />
                    <button type="submit">Save</button>
                    <button onClick={() => navigate('/posts')}>Cancel</button>
                </Form>
            </div>
        </CreateBase>
    );
};

const LocationDisplay = () => {
    const location = useLocation();
    return (
        <div
            style={{
                padding: 10,
                background: '#f0f0f0',
                marginTop: 20,
                fontFamily: 'monospace',
            }}
        >
            <strong>Current Location:</strong>
            <pre>{JSON.stringify(location, null, 2)}</pre>
            <div>window.location.hash: {window.location.hash}</div>
        </div>
    );
};

const LayoutWithLocationDisplay = ({
    children,
}: {
    children: React.ReactNode;
}) => (
    <div>
        {children}
        <LocationDisplay />
    </div>
);

/**
 * BasicStandalone: Admin creates its own TanStack Router (standalone mode)
 * Tests basic navigation, links, and programmatic navigation.
 */
export const BasicStandalone = () => (
    <CoreAdmin
        routerProvider={tanStackRouterProvider}
        dataProvider={dataProvider}
        layout={LayoutWithLocationDisplay}
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
 * EmbeddedInTanStackRouter: Admin inside an existing TanStack Router app
 * Tests that react-admin detects existing router and uses it.
 */
// Nav component that uses the router for navigation
const EmbeddedNav = () => {
    const router = useRouter();
    return (
        <nav style={{ padding: 10, background: '#333', color: 'white' }}>
            <TanStackLink to="/" style={{ color: 'white', marginRight: 20 }}>
                Home
            </TanStackLink>
            {/* Link to /admin/posts to trigger react-admin's routing */}
            <TanStackLink
                to="/admin/posts"
                style={{ color: 'white', marginRight: 20 }}
            >
                Admin
            </TanStackLink>
            <button
                onClick={() => router.navigate({ to: '/' })}
                style={{ color: 'black' }}
            >
                Home (Direct)
            </button>
        </nav>
    );
};

// Create routes outside the component to avoid recreating on every render
const embeddedRootRoute = createRootRoute({
    component: () => (
        <div>
            <EmbeddedNav />
            <Outlet />
        </div>
    ),
});

const embeddedHomeRoute = createRoute({
    getParentRoute: () => embeddedRootRoute,
    path: '/',
    component: () => (
        <div style={{ padding: 20 }}>
            <h1>Home Page</h1>
            <p>This is a TanStack Router app with embedded react-admin.</p>
            <TanStackLink to="/admin">Go to Admin</TanStackLink>
        </div>
    ),
});

const EmbeddedAdmin = () => (
    <CoreAdmin
        routerProvider={tanStackRouterProvider}
        dataProvider={dataProvider}
        basename="/admin"
        layout={LayoutWithLocationDisplay}
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

// Create two routes to handle both /admin and /admin/* paths
// TanStack Router requires explicit route definitions for nested paths
const embeddedAdminRoute = createRoute({
    getParentRoute: () => embeddedRootRoute,
    path: '/admin',
    component: EmbeddedAdmin,
});

// Splat route to handle /admin/posts, /admin/posts/1/show, etc.
const embeddedAdminSplatRoute = createRoute({
    getParentRoute: () => embeddedRootRoute,
    path: '/admin/$',
    component: EmbeddedAdmin,
});

const embeddedRouteTree = embeddedRootRoute.addChildren([
    embeddedHomeRoute,
    embeddedAdminRoute,
    embeddedAdminSplatRoute,
]);

/**
 * Admin inside an existing TanStack Router app
 * Tests that react-admin detects existing router and uses it.
 */
export const EmbeddedInTanStackRouter = () => {
    const router = React.useMemo(
        () =>
            createRouter({
                routeTree: embeddedRouteTree,
                history: createHashHistory(),
            }),
        []
    );

    return <RouterProvider router={router} />;
};

/**
 * Tests back/forward navigation
 */
export const HistoryNavigation = () => {
    const HistoryButtons = () => {
        const navigate = useNavigate();
        return (
            <div style={{ padding: 10, background: '#e0e0e0' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ marginRight: 10 }}
                >
                    ← Back
                </button>
                <button onClick={() => navigate(1)}>Forward →</button>
            </div>
        );
    };

    const ListWithHistory = () => (
        <div>
            <HistoryButtons />
            <PostList />
        </div>
    );

    const ShowWithHistory = () => (
        <div>
            <HistoryButtons />
            <PostShow />
        </div>
    );

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
            layout={LayoutWithLocationDisplay}
        >
            <Resource
                name="posts"
                list={<ListWithHistory />}
                show={<ShowWithHistory />}
            />
        </CoreAdmin>
    );
};

/**
 * Tests that routes match correctly
 * Tests resource routes, custom routes, and catch-all routes.
 */
export const RouteMatching = () => {
    const Dashboard = () => (
        <div style={{ padding: 20 }}>
            <h2>Dashboard</h2>
            <p>Welcome to the admin dashboard.</p>
            <ul>
                <li>
                    <LinkBase to="/posts">Posts</LinkBase>
                </li>
            </ul>
        </div>
    );

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
            dashboard={Dashboard}
            layout={LayoutWithLocationDisplay}
        >
            <Resource name="posts" list={PostList} show={PostShow} />
        </CoreAdmin>
    );
};

/**
 * Tests to, replace, state props work correctly.
 */
export const LinkComponent = () => {
    const LinkTestPage = () => {
        const location = useLocation();
        return (
            <div style={{ padding: 20 }}>
                <h2>Link Component Tests</h2>

                <h3>Basic Link</h3>
                <LinkBase to="/posts/1/show">Go to Post #1</LinkBase>

                <h3>Link with Replace</h3>
                <LinkBase to="/posts/2/show" replace>
                    Go to Post #2 (replace history)
                </LinkBase>

                <h3>Link with State</h3>
                <LinkBase to="/posts/3/show" state={{ from: 'link-test' }}>
                    Go to Post #3 (with state)
                </LinkBase>

                <h3>Link with Location object</h3>
                <LinkBase
                    to={{ pathname: '/posts/4/show', search: '?foo=bar' }}
                >
                    Go to Post #4 (with search)
                </LinkBase>

                <h3>Link with no pathname change</h3>
                <LinkBase to={{ search: '?foo=bar' }}>
                    Go to same page with search param
                </LinkBase>
            </div>
        );
    };

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
            layout={LayoutWithLocationDisplay}
        >
            <Resource name="posts" list={LinkTestPage} show={PostShow} />
        </CoreAdmin>
    );
};

/**
 * Tests navigation between multiple resources
 */
export const MultipleResources = () => {
    const CommentList = () => (
        <div style={{ padding: 20 }}>
            <h2>Comments</h2>
            <ul>
                <li>Comment #1: Nice post!</li>
                <li>Comment #2: Great article</li>
            </ul>
            <LinkBase to="/posts">Go to Posts</LinkBase>
        </div>
    );

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
            layout={LayoutWithLocationDisplay}
        >
            <Resource
                name="posts"
                list={
                    <div>
                        <PostList />
                        <LinkBase to="/comments">Go to Comments</LinkBase>
                    </div>
                }
                show={PostShow}
            />
            <Resource name="comments" list={CommentList} />
        </CoreAdmin>
    );
};

export const CustomRoutesSupport = () => {
    const CustomPage = () => {
        const navigate = useNavigate();
        return (
            <div style={{ padding: 20 }}>
                <h2>Custom Page</h2>
                <p>
                    This is a custom route using react-router's Route component.
                </p>
                <button onClick={() => navigate('/posts')}>Go to Posts</button>
            </div>
        );
    };

    const CustomNoLayoutPage = () => (
        <div style={{ padding: 20 }}>
            <h2>Custom Page (No Layout)</h2>
            <p>This page renders outside the layout.</p>
            <LinkBase to="/posts">Go to Posts</LinkBase>
            <LocationDisplay />
        </div>
    );

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
            layout={LayoutWithLocationDisplay}
        >
            <CustomRoutes>
                <Route path="/custom" element={<CustomPage />} />
            </CustomRoutes>
            <CustomRoutes noLayout>
                <Route
                    path="/custom-no-layout"
                    element={<CustomNoLayoutPage />}
                />
            </CustomRoutes>
            <Resource
                name="posts"
                list={
                    <div>
                        <PostList />
                        <div style={{ marginTop: 20 }}>
                            <LinkBase to="/custom">Go to Custom Page</LinkBase>
                            <br />
                            <LinkBase to="/custom-no-layout">
                                Go to Custom Page (No Layout)
                            </LinkBase>
                        </div>
                    </div>
                }
            />
        </CoreAdmin>
    );
};

/**
 * Displays URL parameters extracted from the current route.
 */
export const UseParamsTest = () => {
    const ParamsDisplay = () => {
        const params = useParams();
        return (
            <div
                style={{
                    padding: 10,
                    background: '#e8f5e9',
                    marginTop: 10,
                    fontFamily: 'monospace',
                }}
            >
                <strong>URL Params:</strong>
                <pre data-testid="params-display">
                    {JSON.stringify(params, null, 2)}
                </pre>
            </div>
        );
    };

    const PostShowWithParams = () => {
        const record = useRecordContext();
        return (
            <div style={{ padding: 20 }}>
                <h2>Post Details</h2>
                <ParamsDisplay />
                {record && (
                    <>
                        <p>
                            <strong>ID:</strong> {record.id}
                        </p>
                        <p>
                            <strong>Title:</strong> {record.title}
                        </p>
                    </>
                )}
                <LinkBase to="/posts">Back to List</LinkBase>
            </div>
        );
    };

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
        >
            <Resource
                name="posts"
                list={
                    <div style={{ padding: 20 }}>
                        <h2>Posts</h2>
                        <ParamsDisplay />
                        <ul>
                            <li>
                                <LinkBase to="/posts/1/show">Post #1</LinkBase>
                            </li>
                            <li>
                                <LinkBase to="/posts/2/show">Post #2</LinkBase>
                            </li>
                        </ul>
                    </div>
                }
                show={<PostShowWithParams />}
            />
        </CoreAdmin>
    );
};

/**
 * Shows active link highlighting based on current route match.
 */
export const UseMatchTest = () => {
    const NavLink = ({
        to,
        children,
    }: {
        to: string;
        children: React.ReactNode;
    }) => {
        const match = useMatch({ path: to, end: false });
        return (
            <LinkBase
                to={to}
                style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    marginRight: 8,
                    background: match ? '#1976d2' : '#e0e0e0',
                    color: match ? 'white' : 'black',
                    textDecoration: 'none',
                    borderRadius: 4,
                }}
            >
                {children}
            </LinkBase>
        );
    };

    const MatchDisplay = () => {
        const postsMatch = useMatch({ path: '/posts', end: false });
        const commentsMatch = useMatch({ path: '/comments', end: false });
        const exactPostsMatch = useMatch({ path: '/posts', end: true });

        return (
            <div
                style={{
                    padding: 10,
                    background: '#fff3e0',
                    marginTop: 10,
                    fontFamily: 'monospace',
                }}
            >
                <strong>Match Results:</strong>
                <div data-testid="posts-match">
                    /posts (end: false): {postsMatch ? 'MATCH' : 'no match'}
                </div>
                <div data-testid="posts-exact-match">
                    /posts (end: true): {exactPostsMatch ? 'MATCH' : 'no match'}
                </div>
                <div data-testid="comments-match">
                    /comments (end: false):{' '}
                    {commentsMatch ? 'MATCH' : 'no match'}
                </div>
            </div>
        );
    };

    const NavBar = () => (
        <nav style={{ padding: 10, background: '#f5f5f5' }}>
            <NavLink to="/posts">Posts</NavLink>
            <NavLink to="/comments">Comments</NavLink>
        </nav>
    );

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
        >
            <Resource
                name="posts"
                list={
                    <div>
                        <NavBar />
                        <MatchDisplay />
                        <div style={{ padding: 20 }}>
                            <h2>Posts List</h2>
                            <ul>
                                <li>
                                    <LinkBase to="/posts/1/show">
                                        Post #1
                                    </LinkBase>
                                </li>
                            </ul>
                        </div>
                    </div>
                }
                show={
                    <div>
                        <NavBar />
                        <MatchDisplay />
                        <div style={{ padding: 20 }}>
                            <h2>Post Show</h2>
                            <LinkBase to="/posts">Back to List</LinkBase>
                        </div>
                    </div>
                }
            />
            <Resource
                name="comments"
                list={
                    <div>
                        <NavBar />
                        <MatchDisplay />
                        <div style={{ padding: 20 }}>
                            <h2>Comments List</h2>
                        </div>
                    </div>
                }
            />
        </CoreAdmin>
    );
};

/**
 * Blocks navigation when there are unsaved changes.
 */
export const UseBlockerTest = () => {
    const FormWithBlocker = () => {
        const [isDirty, setIsDirty] = React.useState(false);
        const [inputValue, setInputValue] = React.useState('');

        const blocker = useBlocker(
            ({ currentLocation, nextLocation }) =>
                isDirty && currentLocation.pathname !== nextLocation.pathname
        );

        return (
            <div style={{ padding: 20 }}>
                <h2>Form with Unsaved Changes Warning</h2>
                <div style={{ marginBottom: 20 }}>
                    <label>
                        Edit this field:{' '}
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => {
                                setInputValue(e.target.value);
                                setIsDirty(true);
                            }}
                            data-testid="form-input"
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 20 }}>
                    <span
                        data-testid="dirty-status"
                        style={{
                            padding: '4px 8px',
                            background: isDirty ? '#ffcdd2' : '#c8e6c9',
                            borderRadius: 4,
                        }}
                    >
                        {isDirty ? 'Unsaved changes' : 'No changes'}
                    </span>
                </div>
                <div style={{ marginBottom: 20 }}>
                    <button onClick={() => setIsDirty(false)}>
                        Mark as Saved
                    </button>
                </div>
                <div>
                    <LinkBase to="/comments">Go to Comments</LinkBase>
                </div>
                {blocker.state === 'blocked' && (
                    <div
                        data-testid="blocker-dialog"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                background: 'white',
                                padding: 20,
                                borderRadius: 8,
                            }}
                        >
                            <h3>Unsaved Changes</h3>
                            <p>
                                You have unsaved changes. Are you sure you want
                                to leave?
                            </p>
                            <button
                                onClick={() => blocker.proceed?.()}
                                data-testid="blocker-proceed"
                            >
                                Leave
                            </button>
                            <button
                                onClick={() => blocker.reset?.()}
                                data-testid="blocker-cancel"
                                style={{ marginLeft: 10 }}
                            >
                                Stay
                            </button>
                        </div>
                    </div>
                )}
                <div
                    style={{
                        marginTop: 20,
                        padding: 10,
                        background: '#f5f5f5',
                        fontFamily: 'monospace',
                    }}
                >
                    <strong>Blocker State:</strong>{' '}
                    <span data-testid="blocker-state">{blocker.state}</span>
                </div>
            </div>
        );
    };

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
        >
            <Resource name="posts" list={<FormWithBlocker />} />
            <Resource
                name="comments"
                list={
                    <div style={{ padding: 20 }}>
                        <h2>Comments</h2>
                        <p>You navigated away from the form.</p>
                        <LinkBase to="/posts">Back to Form</LinkBase>
                    </div>
                }
            />
        </CoreAdmin>
    );
};

export const NavigateComponent = () => {
    const DummyPage = () => {
        return (
            <div>
                <p>Dummy page</p>
                <Navigate to={{ pathname: '/posts', search: '?foo=bar' }} />
            </div>
        );
    };

    const RedirectPage = () => {
        return (
            <div>
                <p>Redirecting...</p>
                <Navigate to="/posts" />
            </div>
        );
    };

    const ConditionalRedirect = () => {
        const [shouldRedirect, setShouldRedirect] = React.useState(false);
        return (
            <div style={{ padding: 20 }}>
                <h2>Conditional Redirect</h2>
                {shouldRedirect ? (
                    <Navigate to="/posts" />
                ) : (
                    <div>
                        <p>Click the button to trigger a redirect.</p>
                        <button
                            onClick={() => setShouldRedirect(true)}
                            data-testid="trigger-redirect"
                        >
                            Redirect to Posts
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
            layout={LayoutWithLocationDisplay}
        >
            <CustomRoutes>
                <Route path="/dummy" element={<DummyPage />} />
                <Route path="/redirect" element={<RedirectPage />} />
                <Route
                    path="/conditional-redirect"
                    element={<ConditionalRedirect />}
                />
            </CustomRoutes>
            <Resource
                name="posts"
                list={
                    <div style={{ padding: 20 }}>
                        <h2>Posts</h2>
                        <p data-testid="posts-page">
                            You are on the posts page.
                        </p>
                        <ul>
                            <li>
                                <LinkBase to="/redirect">
                                    Go to Redirect Page (auto-redirects here)
                                </LinkBase>
                            </li>
                            <li>
                                <LinkBase to="/conditional-redirect">
                                    Go to Conditional Redirect
                                </LinkBase>
                            </li>
                            <li>
                                <LinkBase to="/dummy">
                                    Go to redirect with params
                                </LinkBase>
                            </li>
                        </ul>
                    </div>
                }
            />
        </CoreAdmin>
    );
};

export const UseLocationTest = () => {
    const DetailedLocationDisplay = () => {
        const location = useLocation();
        return (
            <div
                style={{
                    padding: 20,
                    background: '#e3f2fd',
                    fontFamily: 'monospace',
                }}
            >
                <h3>useLocation() Result:</h3>
                <div data-testid="location-pathname">
                    <strong>pathname:</strong> {location.pathname}
                </div>
                <div data-testid="location-search">
                    <strong>search:</strong> "{location.search}"
                </div>
                <div data-testid="location-hash">
                    <strong>hash:</strong> "{location.hash}"
                </div>
                <div data-testid="location-state">
                    <strong>state:</strong>{' '}
                    {JSON.stringify(location.state) || 'null'}
                </div>
            </div>
        );
    };

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
        >
            <Resource
                name="posts"
                list={
                    <div style={{ padding: 20 }}>
                        <h2>Location Test</h2>
                        <DetailedLocationDisplay />
                        <div style={{ marginTop: 20 }}>
                            <h3>Navigation Links:</h3>
                            <ul>
                                <li>
                                    <LinkBase to="/posts/1/show">
                                        Go to Post Show
                                    </LinkBase>
                                </li>
                                <li>
                                    <LinkBase
                                        to="/posts/1/show"
                                        state={{ from: 'list', extra: 'data' }}
                                    >
                                        Go to Post Show (with state)
                                    </LinkBase>
                                </li>
                            </ul>
                        </div>
                    </div>
                }
                show={
                    <div style={{ padding: 20 }}>
                        <h2>Post Show</h2>
                        <DetailedLocationDisplay />
                        <LinkBase to="/posts">Back to List</LinkBase>
                    </div>
                }
            />
        </CoreAdmin>
    );
};

/**
 * RouterContextTest: Tests useInRouterContext and useCanBlock hooks
 */
export const RouterContextTest = () => {
    const ContextInfo = () => {
        const isInRouter = useInRouterContext();
        const canBlock = useCanBlock();

        return (
            <div
                style={{
                    padding: 20,
                    background: '#fce4ec',
                    fontFamily: 'monospace',
                }}
            >
                <h3>Router Context Info:</h3>
                <div data-testid="in-router-context">
                    <strong>useInRouterContext():</strong>{' '}
                    {isInRouter ? 'true' : 'false'}
                </div>
                <div data-testid="can-block">
                    <strong>useCanBlock():</strong>{' '}
                    {canBlock ? 'true' : 'false'}
                </div>
            </div>
        );
    };

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
        >
            <Resource
                name="posts"
                list={
                    <div style={{ padding: 20 }}>
                        <h2>Router Context Test</h2>
                        <ContextInfo />
                    </div>
                }
            />
        </CoreAdmin>
    );
};

const { Routes, Outlet: RouterOutlet } = tanStackRouterProvider;

export const NestedResources = () => (
    <CoreAdmin
        routerProvider={tanStackRouterProvider}
        dataProvider={dataProvider}
        layout={LayoutWithLocationDisplay}
    >
        <Resource name="posts" list={<PostList />}>
            <Route path=":id/show" element={<PostShow />} />
        </Resource>
    </CoreAdmin>
);

/**
 * Tests that query parameters work correctly (for list sorting, filtering, pagination).
 * This tests the navigate({ search: '?...' }) pattern used by useListParams.
 */
export const QueryParameters = () => {
    const ListWithQueryParams = () => {
        const location = useLocation();
        const navigate = useNavigate();

        // Parse current query params
        const searchParams = new URLSearchParams(location.search);
        const sort = searchParams.get('sort') || 'id';
        const order = searchParams.get('order') || 'ASC';
        const page = searchParams.get('page') || '1';

        const setSort = (field: string, newOrder: string) => {
            navigate({
                search: `?sort=${field}&order=${newOrder}&page=${page}`,
            });
        };

        const setPage = (newPage: number) => {
            navigate({
                search: `?sort=${sort}&order=${order}&page=${newPage}`,
            });
        };

        return (
            <div style={{ padding: 20 }}>
                <h2>Posts with Query Parameters</h2>
                <div
                    style={{
                        padding: 10,
                        background: '#e3f2fd',
                        marginBottom: 20,
                        fontFamily: 'monospace',
                    }}
                >
                    <div data-testid="current-search">
                        Current search: {location.search || '(empty)'}
                    </div>
                    <div data-testid="current-sort">
                        Sort: {sort} {order}
                    </div>
                    <div data-testid="current-page">Page: {page}</div>
                </div>
                <div style={{ marginBottom: 20 }}>
                    <strong>Sort by:</strong>{' '}
                    <button
                        onClick={() =>
                            setSort(
                                'id',
                                sort === 'id' && order === 'ASC'
                                    ? 'DESC'
                                    : 'ASC'
                            )
                        }
                        data-testid="sort-id"
                    >
                        ID {sort === 'id' ? (order === 'ASC' ? '↑' : '↓') : ''}
                    </button>{' '}
                    <button
                        onClick={() =>
                            setSort(
                                'title',
                                sort === 'title' && order === 'ASC'
                                    ? 'DESC'
                                    : 'ASC'
                            )
                        }
                        data-testid="sort-title"
                    >
                        Title{' '}
                        {sort === 'title' ? (order === 'ASC' ? '↑' : '↓') : ''}
                    </button>
                </div>
                <div style={{ marginBottom: 20 }}>
                    <strong>Page:</strong>{' '}
                    <button onClick={() => setPage(1)} data-testid="page-1">
                        1
                    </button>{' '}
                    <button onClick={() => setPage(2)} data-testid="page-2">
                        2
                    </button>{' '}
                    <button onClick={() => setPage(3)} data-testid="page-3">
                        3
                    </button>
                </div>
                <ul>
                    <li>Post #1</li>
                    <li>Post #2</li>
                    <li>Post #3</li>
                </ul>
            </div>
        );
    };

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
            layout={LayoutWithLocationDisplay}
        >
            <Resource name="posts" list={<ListWithQueryParams />} />
        </CoreAdmin>
    );
};

/**
 * This tests the pattern where a parent Route has child Routes and uses Outlet
 * to render the matched child (like TabbedShowLayout).
 */
export const NestedRoutesWithOutlet = () => {
    const TabbedLayout = () => {
        const location = useLocation();
        return (
            <div style={{ padding: 20 }}>
                <h2>Tabbed Layout (like TabbedShowLayout)</h2>
                <Routes>
                    <Route
                        path="/*"
                        element={
                            <div>
                                <nav
                                    style={{
                                        display: 'flex',
                                        gap: 10,
                                        marginBottom: 20,
                                    }}
                                >
                                    <LinkBase
                                        to="/posts/1/show"
                                        style={{
                                            padding: '8px 16px',
                                            background:
                                                location.pathname.endsWith(
                                                    '/show'
                                                )
                                                    ? '#1976d2'
                                                    : '#e0e0e0',
                                            color: location.pathname.endsWith(
                                                '/show'
                                            )
                                                ? 'white'
                                                : 'black',
                                            textDecoration: 'none',
                                            borderRadius: 4,
                                        }}
                                    >
                                        Content Tab
                                    </LinkBase>
                                    <LinkBase
                                        to="/posts/1/show/1"
                                        style={{
                                            padding: '8px 16px',
                                            background:
                                                location.pathname.endsWith('/1')
                                                    ? '#1976d2'
                                                    : '#e0e0e0',
                                            color: location.pathname.endsWith(
                                                '/1'
                                            )
                                                ? 'white'
                                                : 'black',
                                            textDecoration: 'none',
                                            borderRadius: 4,
                                        }}
                                    >
                                        Metadata Tab
                                    </LinkBase>
                                </nav>
                                <div
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: 20,
                                        borderRadius: 4,
                                    }}
                                >
                                    <RouterOutlet />
                                </div>
                            </div>
                        }
                    >
                        <Route
                            path=""
                            element={
                                <div data-testid="content-tab">
                                    <h3>Content Tab</h3>
                                    <p>
                                        This is the content tab (first tab,
                                        default).
                                    </p>
                                    <p>Title: Hello World</p>
                                    <p>Body: Welcome to react-admin!</p>
                                </div>
                            }
                        />
                        <Route
                            path="1"
                            element={
                                <div data-testid="metadata-tab">
                                    <h3>Metadata Tab</h3>
                                    <p>
                                        This is the metadata tab (second tab).
                                    </p>
                                    <p>ID: 1</p>
                                    <p>Created: 2024-01-15</p>
                                    <p>Author: Admin</p>
                                </div>
                            }
                        />
                    </Route>
                </Routes>
            </div>
        );
    };

    return (
        <CoreAdmin
            routerProvider={tanStackRouterProvider}
            dataProvider={dataProvider}
            layout={LayoutWithLocationDisplay}
        >
            <Resource name="posts" list={PostList} show={TabbedLayout} />
        </CoreAdmin>
    );
};
