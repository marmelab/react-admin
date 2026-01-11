---
title: "TanStack Router Integration"
sidebar:
  order: 7
---

Ra-core supports [TanStack Router](https://tanstack.com/router/latest) as an alternative to react-router. This allows you to use ra-core in a TanStack Start application.

## Installation

To use TanStack Router with ra-core, install the required packages:

```bash
npm install @tanstack/react-router @tanstack/history
# or
yarn add @tanstack/react-router @tanstack/history
```

These packages are optional peer dependencies of `ra-core`, so they won't be installed automatically.

## Configuration

To use TanStack Router, pass the `tanStackRouterProvider` to the `<CoreAdmin>` component:

```jsx
import { CoreAdmin, Resource, tanStackRouterProvider } from 'ra-core';
import { dataProvider } from './dataProvider';
import { PostList, PostEdit, PostCreate, PostShow } from './posts';

const App = () => (
    <CoreAdmin
        dataProvider={dataProvider}
        routerProvider={tanStackRouterProvider}
    >
        <Resource
            name="posts"
            list={PostList}
            edit={PostEdit}
            create={PostCreate}
            show={PostShow}
        />
    </CoreAdmin>
);

export default App;
```

That's it! Ra-core will now use TanStack Router for all routing operations.

## Standalone Mode

When using `tanStackRouterProvider` without an existing TanStack Router, ra-core creates its own router automatically. This is called **standalone mode**.

In standalone mode, ra-core:

- Creates a TanStack Router with hash-based history (URLs like `/#/posts`)
- Handles all route matching internally
- Manages navigation and history

This is the simplest setup and requires no additional configuration.

```jsx
// Standalone mode - ra-core creates the router
import { CoreAdmin, Resource, tanStackRouterProvider } from 'ra-core';

const App = () => (
    <CoreAdmin
        dataProvider={dataProvider}
        routerProvider={tanStackRouterProvider}
    >
        <Resource name="posts" list={PostList} />
    </CoreAdmin>
);
```

## Embedded Mode

If your application already uses TanStack Router, you can embed ra-core inside it. Ra-core detects the existing router context and uses it instead of creating its own.

```jsx
import * as React from 'react';
import {
    createRouter,
    createRootRoute,
    createRoute,
    RouterProvider,
    Outlet,
    Link,
} from '@tanstack/react-router';
import { createHashHistory } from '@tanstack/history';
import { CoreAdmin, Resource, tanStackRouterProvider } from 'ra-core';
import { dataProvider } from './dataProvider';
import { PostList, PostEdit } from './posts';

// Define your routes
const rootRoute = createRootRoute({
    component: () => (
        <div>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/admin">Admin</Link>
            </nav>
            <Outlet />
        </div>
    ),
});

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <div>Welcome to my app!</div>,
});

// Mount ra-core at /admin
const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: () => (
        <CoreAdmin
            dataProvider={dataProvider}
            routerProvider={tanStackRouterProvider}
            basename="/admin"
        >
            <Resource name="posts" list={PostList} edit={PostEdit} />
        </CoreAdmin>
    ),
});

const routeTree = rootRoute.addChildren([homeRoute, adminRoute]);

const router = createRouter({
    routeTree,
    history: createHashHistory(),
});

const App = () => <RouterProvider router={router} />;

export default App;
```

**Important**: When embedding ra-core, set the `basename` prop to match the path where ra-core is mounted. In the example above, ra-core is mounted at `/admin`, so `basename="/admin"`.

## Custom Routes

Custom routes work the same way as with react-router. You can use `<CustomRoutes>` to add custom pages:

```jsx
import { CoreAdmin, Resource, CustomRoutes, tanStackRouterProvider } from 'ra-core';

const { Route } = tanStackRouterProvider;

const App = () => (
    <CoreAdmin
        dataProvider={dataProvider}
        routerProvider={tanStackRouterProvider}
    >
        <CustomRoutes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
        </CustomRoutes>
        <CustomRoutes noLayout>
            <Route path="/public" element={<PublicPage />} />
        </CustomRoutes>
        <Resource name="posts" list={PostList} />
    </CoreAdmin>
);
```

## Using Router Hooks

When using TanStack Router, import routing hooks from `ra-core` instead of directly from TanStack Router:

```jsx
// Recommended - router-agnostic
import { useNavigate, useLocation, useParams } from 'ra-core';
```

The hooks from `ra-core` work with both react-router and TanStack Router, making your code portable:

```jsx
import { useNavigate, useLocation, useParams } from 'ra-core';

const MyComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const handleClick = () => {
        navigate('/posts');
        // or navigate(-1) to go back
        // or navigate({ pathname: '/posts', search: '?filter=active' })
    };

    return (
        <div>
            <p>Current path: {location.pathname}</p>
            <p>Record ID: {id}</p>
            <button onClick={handleClick}>Go to Posts</button>
        </div>
    );
};
```

## Navigation Blocking

TanStack Router supports navigation blocking out of the box. The `warnWhenUnsavedChanges` feature in ra-core forms works automatically:

```jsx
import { Form } from 'ra-core';

const PostEdit = () => (
    <Form warnWhenUnsavedChanges>
        {/* form fields */}
    </Form>
);
```

Unlike react-router (which requires a Data Router for blocking to work), TanStack Router always supports navigation blocking.

## Linking Between Pages

Use the `LinkBase` component from `ra-core` for router-agnostic links:

```jsx
import { LinkBase } from 'ra-core';

const Dashboard = () => (
    <div>
        <h1>Dashboard</h1>
        <LinkBase to="/posts">View all posts</LinkBase>
        <LinkBase to="/posts/create">Create a new post</LinkBase>
        <LinkBase to="/posts/123/show">View post #123</LinkBase>
    </div>
);
```

Or use `useCreatePath` for dynamic paths:

```jsx
import { LinkBase, useCreatePath } from 'ra-core';

const Dashboard = () => {
    const createPath = useCreatePath();
    return (
        <div>
            <LinkBase to={createPath({ resource: 'posts', type: 'list' })}>
                Posts
            </LinkBase>
            <LinkBase to={createPath({ resource: 'posts', type: 'create' })}>
                Create Post
            </LinkBase>
            <LinkBase to={createPath({ resource: 'posts', type: 'show', id: 123 })}>
                Post #123
            </LinkBase>
        </div>
    );
};
```

## Limitations

The TanStack Router adapter has some limitations compared to native TanStack Router usage:

### Type Safety

TanStack Router's main feature is compile-time type safety based on route definitions. The ra-core adapter doesn't provide this level of type safety because ra-core generates routes dynamically from `<Resource>` components.

### Search Params

TanStack Router treats search params as typed objects with validation. The adapter uses string-based search (`?key=value`) for compatibility with ra-core's list filters.

### Route Loaders

TanStack Router's data loading features (`loader`, `beforeLoad`) are not used by the adapter. Ra-core handles data loading through its own `dataProvider` system.

### File-Based Routing

TanStack Router supports file-based routing similar to Next.js. This feature is not compatible with ra-core's declarative `<Resource>` approach.
