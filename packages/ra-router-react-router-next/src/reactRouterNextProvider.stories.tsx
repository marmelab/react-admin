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
    useNavigate,
    useLocation,
    LinkBase,
    ListBase,
    ShowBase,
    EditBase,
    CreateBase,
    useRecordContext,
    CoreAdmin,
    Resource,
    CustomRoutes,
    RouterProviderContext,
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

const PostList = () => (
    <ListBase resource="posts">
        <div style={{ padding: 20 }}>
            <h2>Posts</h2>
            <SimpleList
                render={record => (
                    <LinkBase to={`/posts/${record.id}/show`}>
                        {record.title}
                    </LinkBase>
                )}
            />
            <CreateButton />
        </div>
    </ListBase>
);

const PostShow = () => (
    <ShowBase
        resource="posts"
        render={({ record }) => (
            <div style={{ padding: 20 }}>
                <h2>Post Details</h2>
                <SimpleShowLayout>
                    <span>ID: {record?.id}</span>
                    <span>Title: {record?.title}</span>
                    <span>Body: {record?.body}</span>
                </SimpleShowLayout>
                <LinkBase to="/posts">Back to list</LinkBase>
            </div>
        )}
    />
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
 * Basic: Admin creates its own React Router v8 (standalone mode)
 * Tests basic navigation, links, and programmatic navigation.
 */
export const Basic = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
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
 * EmbeddedInReactRouter: Admin inside an existing React Router app
 * Tests that react-admin detects existing router and uses it.
 */
// Nav component that uses the router for navigation
const EmbeddedNav = () => {
    const navigate = useReactRouterNavigate();
    return (
        <nav style={{ padding: 10, background: '#333', color: 'white' }}>
            <ReactRouterLink to="/" style={{ color: 'white', marginRight: 20 }}>
                Home
            </ReactRouterLink>
            {/* Link to /admin/posts to trigger react-admin's routing */}
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

// Create routes outside the component to avoid recreating on every render
const embeddedRootRoute = {
    element: (
        <div>
            <EmbeddedNav />
            <Outlet />
        </div>
    ),
};

const embeddedHomeRoute = {
    index: true,
    element: (
        <div style={{ padding: 20 }}>
            <h1>Home Page</h1>
            <p>This is a React Router app with embedded react-admin.</p>
            <ReactRouterLink to="/admin">Go to Admin</ReactRouterLink>
        </div>
    ),
};

const EmbeddedAdmin = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
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

// Splat route to handle /admin, /admin/posts, /admin/posts/1/show, etc.
const embeddedAdminRoute = { path: 'admin/*', element: <EmbeddedAdmin /> };

const embeddedRouteTree = [
    {
        path: '/',
        ...embeddedRootRoute,
        children: [embeddedHomeRoute, embeddedAdminRoute],
    },
];

/**
 * Admin inside an existing React Router app
 * Tests that react-admin detects existing router and uses it.
 */
export const EmbeddedInReactRouter = () => {
    const router = React.useMemo(() => createHashRouter(embeddedRouteTree), []);

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
            routerProvider={reactRouterNextProvider}
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
            routerProvider={reactRouterNextProvider}
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
    const LinkTestPage = () => (
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
            <LinkBase to={{ pathname: '/posts/4/show', search: '?foo=bar' }}>
                Go to Post #4 (with search)
            </LinkBase>

            <h3>Link with no pathname change</h3>
            <LinkBase to={{ search: '?foo=bar' }}>
                Go to same page with search param
            </LinkBase>
        </div>
    );

    return (
        <CoreAdmin
            routerProvider={reactRouterNextProvider}
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
            routerProvider={reactRouterNextProvider}
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
            routerProvider={reactRouterNextProvider}
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
            routerProvider={reactRouterNextProvider}
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
            routerProvider={reactRouterNextProvider}
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
export const UseWarnWhenUnsavedChangesTest = () => {
    const FormWithWarnWhenUnsavedChanges = () => (
        <div style={{ padding: 20 }}>
            <h2>Form with Unsaved Changes Warning</h2>
            <SimpleForm warnWhenUnsavedChanges>
                <TextInput source="title" />
                <TextInput source="body" />
            </SimpleForm>
            <LinkBase to="/comments">Go to Comments</LinkBase>
        </div>
    );

    return (
        <CoreAdmin
            routerProvider={reactRouterNextProvider}
            dataProvider={dataProvider}
        >
            <Resource name="posts" list={<FormWithWarnWhenUnsavedChanges />} />
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

    // Page that uses Navigate with only search params (no pathname)
    // This should stay on the current page but update search params
    const SearchOnlyRedirectPage = () => {
        const location = useLocation();
        const hasUpdatedParam = location.search.includes('updated');

        return (
            <div style={{ padding: 20 }}>
                <h2>Search-Only Redirect Page</h2>
                <p data-testid="search-only-page">
                    This page tests Navigate with only search params.
                </p>
                {!hasUpdatedParam && (
                    <LinkBase to={{ search: '?updated=true' }}>
                        <button data-testid="trigger-search-redirect">
                            Update search params only
                        </button>
                    </LinkBase>
                )}
                {hasUpdatedParam && (
                    <p data-testid="search-updated">
                        Search params updated successfully!
                    </p>
                )}
            </div>
        );
    };

    // Page that demonstrates Navigate with only search (redirects once)
    const NavigateSearchOnlyPage = () => {
        const location = useLocation();
        const hasRedirected = location.search.includes('redirected');

        // Only render Navigate if we haven't already redirected
        // This prevents infinite navigation loops
        if (!hasRedirected) {
            return (
                <div>
                    <p>Redirecting with search only...</p>
                    <Navigate to={{ search: '?redirected=true' }} replace />
                </div>
            );
        }

        return (
            <div style={{ padding: 20 }}>
                <h2>Navigate Search-Only Test</h2>
                <p data-testid="navigate-search-only-page">
                    Successfully navigated with search-only (no pathname).
                </p>
            </div>
        );
    };

    return (
        <CoreAdmin
            routerProvider={reactRouterNextProvider}
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
                <Route
                    path="/search-only-redirect"
                    element={<SearchOnlyRedirectPage />}
                />
                <Route
                    path="/navigate-search-only"
                    element={<NavigateSearchOnlyPage />}
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
                            <li>
                                <LinkBase to="/search-only-redirect">
                                    Go to search-only redirect test (Link)
                                </LinkBase>
                            </li>
                            <li>
                                <LinkBase to="/navigate-search-only">
                                    Go to Navigate search-only test
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
            routerProvider={reactRouterNextProvider}
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
            routerProvider={reactRouterNextProvider}
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

const { Routes, Outlet: RouterOutlet } = reactRouterNextProvider;

export const NestedResources = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        layout={LayoutWithLocationDisplay}
    >
        <Resource name="posts" list={<PostList />}>
            <Route path=":id/show" element={<PostShow />} />
        </Resource>
    </CoreAdmin>
);

const PostEditWithLinkToComments = () => {
    const navigate = useNavigate();
    return (
        <ShowBase
            resource="posts"
            render={({ record }) => (
                <div style={{ padding: 20 }}>
                    <h2>Post Details</h2>
                    {record && <h3>{record.title}</h3>}
                    <button onClick={() => navigate('/posts')}>
                        Back to List
                    </button>
                    <button
                        onClick={() => navigate(`/posts/${record.id}/comments`)}
                    >
                        View Comments
                    </button>
                </div>
            )}
        />
    );
};

const CommentList = () => {
    const { post_id } = useParams();
    const navigate = useNavigate();
    return (
        <ListBase
            resource="comments"
            filter={{ post_id }}
            render={({ data }) => (
                <div style={{ padding: 20 }}>
                    <h2>Comments for Post {post_id}</h2>
                    <ul>
                        {data?.map(record => (
                            <li key={record.id}>{record.body}</li>
                        ))}
                    </ul>
                    <button onClick={() => navigate(`/posts/${post_id}/show`)}>
                        Back to Post
                    </button>
                </div>
            )}
        />
    );
};

export const NestedResourcesPrecedence = () => (
    <CoreAdmin
        routerProvider={reactRouterNextProvider}
        dataProvider={dataProvider}
        layout={LayoutWithLocationDisplay}
    >
        <Resource
            name="posts"
            list={PostList}
            edit={PostEditWithLinkToComments}
        >
            <Route path=":post_id/comments" element={<CommentList />} />
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
            routerProvider={reactRouterNextProvider}
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
            routerProvider={reactRouterNextProvider}
            dataProvider={dataProvider}
            layout={LayoutWithLocationDisplay}
        >
            <Resource name="posts" list={PostList} show={TabbedLayout} />
        </CoreAdmin>
    );
};

export const PathlessLayoutRoutes = () => {
    const { RouterWrapper } = reactRouterNextProvider;

    return (
        <RouterProviderContext.Provider value={reactRouterNextProvider}>
            <RouterWrapper>
                <Routes>
                    <Route
                        element={
                            <div data-testid="layout-wrapper">
                                <h2>Layout Wrapper</h2>
                                <nav>
                                    <LinkBase
                                        to="/posts"
                                        style={{ marginRight: 10 }}
                                    >
                                        Posts
                                    </LinkBase>
                                    <LinkBase to="/comments">Comments</LinkBase>
                                </nav>
                                <div
                                    style={{
                                        border: '2px solid blue',
                                        padding: 20,
                                        marginTop: 10,
                                    }}
                                >
                                    <RouterOutlet />
                                </div>
                            </div>
                        }
                    >
                        <Route
                            path="/posts"
                            element={
                                <div data-testid="posts-page">Posts Page</div>
                            }
                        />
                        <Route
                            path="/comments"
                            element={
                                <div data-testid="comments-page">
                                    Comments Page
                                </div>
                            }
                        />
                    </Route>
                </Routes>
                <LocationDisplay />
            </RouterWrapper>
        </RouterProviderContext.Provider>
    );
};

export const PathlessLayoutRoutesPriority = () => {
    const { RouterWrapper } = reactRouterNextProvider;

    return (
        <RouterProviderContext.Provider value={reactRouterNextProvider}>
            <RouterWrapper>
                <div data-testid="layout-wrapper">
                    <nav>
                        <LinkBase to="/posts" style={{ marginRight: 10 }}>
                            Posts
                        </LinkBase>
                        <LinkBase to="/comments" style={{ marginRight: 10 }}>
                            Comments
                        </LinkBase>
                        <LinkBase
                            to="/users/john_doe"
                            style={{ marginRight: 10 }}
                        >
                            User
                        </LinkBase>
                        <LinkBase
                            to="/users/jane_doe/block"
                            style={{ marginRight: 10 }}
                        >
                            Block a user
                        </LinkBase>
                    </nav>
                    <div
                        style={{
                            border: '2px solid blue',
                            padding: 20,
                            marginTop: 10,
                        }}
                    >
                        <Routes>
                            <Route
                                path="/posts"
                                element={
                                    <div data-testid="posts-page">
                                        Posts Page
                                    </div>
                                }
                            />
                            <Route
                                path="/comments"
                                element={
                                    <div data-testid="comments-page">
                                        Comments Page
                                    </div>
                                }
                            />
                            <Route
                                element={
                                    <div
                                        style={{
                                            border: '2px solid green',
                                            padding: 20,
                                            marginTop: 10,
                                        }}
                                    >
                                        <RouterOutlet />
                                    </div>
                                }
                            >
                                <Route
                                    path="/users/*"
                                    element={
                                        <div data-testid="users-page">
                                            Users View
                                        </div>
                                    }
                                />
                            </Route>
                            <Route
                                element={
                                    <div
                                        style={{
                                            border: '2px solid red',
                                            padding: 20,
                                            marginTop: 10,
                                        }}
                                    >
                                        <RouterOutlet />
                                    </div>
                                }
                            >
                                <Route
                                    path="/users/:username/block"
                                    element={
                                        <div data-testid="block-user-page">
                                            Block a user
                                        </div>
                                    }
                                />
                            </Route>
                        </Routes>
                    </div>
                </div>
                <LocationDisplay />
            </RouterWrapper>
        </RouterProviderContext.Provider>
    );
};

export const PathlessLayoutRoutesWithEmptyRoute = () => {
    const { RouterWrapper } = reactRouterNextProvider;

    return (
        <RouterProviderContext.Provider value={reactRouterNextProvider}>
            <RouterWrapper>
                <p style={{ marginBottom: 10 }}>
                    Expected: "/" renders Home Page (path=""). If you see
                    Catch-all Page instead, path="" is being treated as
                    catch-all.
                </p>
                <Routes>
                    <Route
                        path="*"
                        element={
                            <div data-testid="catchall-page">
                                Catch-all Page
                            </div>
                        }
                    />
                    <Route
                        element={
                            <div data-testid="layout-wrapper">
                                <h2>Layout Wrapper</h2>
                                <nav>
                                    <LinkBase
                                        to="/posts"
                                        style={{ marginRight: 10 }}
                                    >
                                        Posts
                                    </LinkBase>
                                    <LinkBase to="/comments">Comments</LinkBase>
                                </nav>
                                <nav>
                                    <LinkBase
                                        to="/"
                                        style={{ marginRight: 10 }}
                                    >
                                        Home (path="")
                                    </LinkBase>
                                </nav>
                                <div
                                    style={{
                                        border: '2px solid blue',
                                        padding: 20,
                                        marginTop: 10,
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
                                <div data-testid="home-page">
                                    Home Page (path="")
                                </div>
                            }
                        />
                        <Route
                            path="/posts"
                            element={
                                <div data-testid="posts-page">Posts Page</div>
                            }
                        />
                        <Route
                            path="/comments"
                            element={
                                <div data-testid="comments-page">
                                    Comments Page
                                </div>
                            }
                        />
                    </Route>
                </Routes>
                <LocationDisplay />
            </RouterWrapper>
        </RouterProviderContext.Provider>
    );
};

export const PathlessLayoutRoutesWithIndexRoute = () => {
    const { RouterWrapper } = reactRouterNextProvider;

    return (
        <RouterProviderContext.Provider value={reactRouterNextProvider}>
            <RouterWrapper>
                <Routes>
                    <Route
                        path="*"
                        element={
                            <div data-testid="catchall-page">
                                Catch-all Page
                            </div>
                        }
                    />
                    <Route
                        element={
                            <div data-testid="layout-wrapper">
                                <h2>Layout Wrapper</h2>
                                <nav>
                                    <LinkBase
                                        to="/posts"
                                        style={{ marginRight: 10 }}
                                    >
                                        Posts
                                    </LinkBase>
                                    <LinkBase to="/comments">Comments</LinkBase>
                                </nav>
                                <nav>
                                    <LinkBase
                                        to="/"
                                        style={{ marginRight: 10 }}
                                    >
                                        Home (index)
                                    </LinkBase>
                                </nav>
                                <div
                                    style={{
                                        border: '2px solid blue',
                                        padding: 20,
                                        marginTop: 10,
                                    }}
                                >
                                    <RouterOutlet />
                                </div>
                            </div>
                        }
                    >
                        <Route
                            index
                            element={
                                <div data-testid="home-page">
                                    Home Page (index)
                                </div>
                            }
                        />
                        <Route
                            path="/posts"
                            element={
                                <div data-testid="posts-page">Posts Page</div>
                            }
                        />
                        <Route
                            path="/comments"
                            element={
                                <div data-testid="comments-page">
                                    Comments Page
                                </div>
                            }
                        />
                    </Route>
                </Routes>
                <LocationDisplay />
            </RouterWrapper>
        </RouterProviderContext.Provider>
    );
};
