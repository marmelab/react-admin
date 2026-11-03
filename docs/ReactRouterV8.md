---
layout: default
title: "React Router v8 Integration"
---

# React Router v8 Integration

By default, react-admin is powered by [React Router](https://reactrouter.com/) v6/v7 through the `ra-router-react-router` adapter, which is installed automatically. React Router v8 merged the former `react-router-dom` package into `react-router` and requires **React 19**, so support for it ships as a separate, opt-in adapter package: `ra-router-react-router-next`.

**New projects are encouraged to run on React Router v8 using `ra-router-react-router-next`.** The React Router v6/v7 adapter remains the default for backward compatibility, and **`ra-router-react-router-next` will become the default `ra-router-react-router` in react-admin v6.**

**Note:** `ra-core` depends on the default `ra-router-react-router` adapter, which brings its own copy of `react-router` v7, so an application using `ra-router-react-router-next` bundles both React Router v7 and v8, even though it only uses v8. This will be fixed in react-admin v6, when `ra-router-react-router-next` becomes the default adapter.

## Installation

```bash
npm install ra-router-react-router-next react-router@^8
# or
yarn add ra-router-react-router-next react-router@^8
```

React Router v8 requires React 19. Make sure your application uses `react@^19.2.7` and `react-dom@^19.2.7`.

## Configuration

Set the `<Admin routerProvider>` to `reactRouterNextProvider`:

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import { reactRouterNextProvider } from 'ra-router-react-router-next';
import { dataProvider } from './dataProvider';

const App = () => (
    <Admin
        dataProvider={dataProvider}
        routerProvider={reactRouterNextProvider}
    >
        <Resource name="posts" list={ListGuesser} />
        <Resource name="comments" list={ListGuesser} />
    </Admin>
);

export default App;
```

That's it! React-admin will now use React Router v8 for all routing operations.

## Standalone Mode

When using `reactRouterNextProvider` without an existing React Router, react-admin creates its own router automatically. This is called **standalone mode**.

In standalone mode, react-admin:

- Creates a React Router with hash-based history (URLs like `/#/posts`)
- Handles all route matching internally
- Manages navigation and history

This is the simplest setup and requires no additional configuration.

```tsx
// Standalone mode - react-admin creates the router
import { Admin, Resource } from 'react-admin';
import { reactRouterNextProvider } from 'ra-router-react-router-next';

const App = () => (
    <Admin
        dataProvider={dataProvider}
        routerProvider={reactRouterNextProvider}
    >
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

## Embedded Mode

If your application already uses React Router, you can embed react-admin inside it. React-admin detects the existing router context and uses it instead of creating its own.

```tsx
import * as React from 'react';
import { createHashRouter, RouterProvider, Outlet, Link } from 'react-router';
import { Admin, Resource } from 'react-admin';
import { reactRouterNextProvider } from 'ra-router-react-router-next';
import { dataProvider } from './dataProvider';
import { PostList, PostEdit } from './posts';

const Layout = () => (
    <div>
        <nav>
            <Link to="/">Home</Link>
            <Link to="/admin">Admin</Link>
        </nav>
        <Outlet />
    </div>
);

const StoreAdmin = () => (
    <Admin
        dataProvider={dataProvider}
        routerProvider={reactRouterNextProvider}
        basename="/admin"
    >
        <Resource name="posts" list={PostList} edit={PostEdit} />
    </Admin>
);

const router = createHashRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <div>Welcome to my app!</div> },
            // Mount react-admin at /admin. The splat matches /admin/posts, /admin/posts/1, etc.
            { path: 'admin/*', element: <StoreAdmin /> },
        ],
    },
]);

const App = () => <RouterProvider router={router} />;

export default App;
```

**Important**: When embedding react-admin, set the `basename` prop to match the path where react-admin is mounted. In the example above, react-admin is mounted at `/admin`, so `basename="/admin"`.

## Links Under The Basename

`ra-router-react-router-next` adds the basename to the absolute paths you pass to react-admin's routing components and hooks (`<Link>`, `<LinkBase>`, `<Navigate>`, `useNavigate`), so write paths without it. This is the same behavior as the [TanStack Router adapter](./TanStackRouter.md). With `basename="/admin"`:

```tsx
import { Link } from 'react-admin';

// Points to /admin/posts/1/show
<Link to="/posts/1/show">Post #1</Link>
// Points to the react-admin home page, not to the host app's home page
<Link to="/">Home</Link>
```

In embedded mode, a path that already starts with the basename is left as is: `<Link to="/admin/posts">` points to `/admin/posts`. In standalone mode, the router adds the basename to every path, so the same link points to `/admin/admin/posts`.

To link to a route of the host application from inside react-admin, use React Router's own `<Link>` (`import { Link } from 'react-router'`), which doesn't add the basename.

**Note:** The default `ra-router-react-router` adapter (React Router v6/v7) behaves differently: it leaves absolute paths untouched. Only the paths built by react-admin itself (with `useCreatePath`, redirections, and authentication redirects) include the basename, so in embedded mode `<Link to="/posts/1/show">` points to `/posts/1/show` in the host application. If you migrate an embedded admin from the default adapter, check the hand-written links that point outside react-admin, as they now point inside it.
