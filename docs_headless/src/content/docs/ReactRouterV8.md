---
title: "React Router v8 Integration"
sidebar:
  order: 8
---

By default, ra-core is powered by [React Router](https://reactrouter.com/) v6/v7 through the `ra-router-react-router` adapter, which is installed automatically. React Router v8 merged the former `react-router-dom` package into `react-router` and requires **React 19**, so support for it ships as a separate, opt-in adapter package: `ra-router-react-router-next`.

**New projects are encouraged to run on React Router v8 using `ra-router-react-router-next`.** The React Router v6/v7 adapter remains the default for backward compatibility, and **`ra-router-react-router-next` will become the default `ra-router-react-router` in ra-core v6.**

Use this package when your application runs on React Router v8.

## Installation

```bash
npm install ra-router-react-router-next react-router@^8
# or
yarn add ra-router-react-router-next react-router@^8
```

React Router v8 requires React 19. Make sure your application uses `react@^19.2.7` and `react-dom@^19.2.7`.

**Note:** For backward compatibility, React Router v6/v7 remains the default router, so `ra-core` always depends on the default `ra-router-react-router` adapter, which brings its own copy of `react-router` v7. As a consequence, an application using `ra-router-react-router-next` installs both React Router v7 and v8, and the v7 copy ends up in the application bundle. The application only uses React Router v8 at runtime, but the bundle is larger. This will be fixed in ra-core v6, when `ra-router-react-router-next` becomes the default adapter.

## Configuration

Set the `<CoreAdmin routerProvider>` to `reactRouterNextProvider`:

```jsx
import { CoreAdmin, Resource } from 'ra-core';
import { reactRouterNextProvider } from 'ra-router-react-router-next';
import { dataProvider } from './dataProvider';
import { PostList, PostEdit, PostCreate, PostShow } from './posts';

const App = () => (
    <CoreAdmin
        dataProvider={dataProvider}
        routerProvider={reactRouterNextProvider}
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

That's it! Ra-core will now use React Router v8 for all routing operations.

## Standalone Mode

When using `reactRouterNextProvider` without an existing React Router, ra-core creates its own hash router automatically (URLs like `/#/posts`). This is called **standalone mode**. This is the simplest setup and requires no additional configuration.

If you set the `<CoreAdmin basename>` prop in standalone mode, the hash router applies it to every route, so write paths without it (e.g. `<LinkBase to="/posts">`, not `<LinkBase to="/admin/posts">`).

## Embedded Mode

If your application already uses React Router, you can embed ra-core inside it. Ra-core detects the existing router context and uses it instead of creating its own.

```jsx
import * as React from 'react';
import { createHashRouter, RouterProvider, Outlet, Link } from 'react-router';
import { CoreAdmin, Resource } from 'ra-core';
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
    <CoreAdmin
        dataProvider={dataProvider}
        routerProvider={reactRouterNextProvider}
        basename="/admin"
    >
        <Resource name="posts" list={PostList} edit={PostEdit} />
    </CoreAdmin>
);

const router = createHashRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <div>Welcome to my app!</div> },
            // Mount ra-core at /admin. The splat matches /admin/posts, /admin/posts/1, etc.
            { path: 'admin/*', element: <StoreAdmin /> },
        ],
    },
]);

const App = () => <RouterProvider router={router} />;

export default App;
```

**Important**: When embedding ra-core, set the `basename` prop to match the path where ra-core is mounted. In the example above, ra-core is mounted at `/admin`, so `basename="/admin"`.

### Links Under The Basename

In embedded mode, `ra-router-react-router-next` adds the basename to the absolute paths you pass to ra-core's routing components and hooks (`<LinkBase>`, `<Navigate>`, `useNavigate`), unless the path already starts with the basename. This is the same behavior as the [TanStack Router adapter](./TanStackRouter.md). With `basename="/admin"`:

```jsx
import { LinkBase } from 'ra-core';

// Points to /admin/posts/1/show
<LinkBase to="/posts/1/show">Post #1</LinkBase>
// Points to /admin/posts (already prefixed, left as is)
<LinkBase to="/admin/posts">Posts</LinkBase>
// Points to /admin/, not to the host app's home page
<LinkBase to="/">Home</LinkBase>
```

To link to a route of the host application from inside ra-core, use React Router's own `<Link>` (`import { Link } from 'react-router'`), which doesn't add the basename.

**Note:** The default `ra-router-react-router` adapter (React Router v6/v7) behaves differently: it leaves absolute paths untouched. Only the paths built by ra-core itself (with `useCreatePath`, redirections, and authentication redirects) include the basename, so `<LinkBase to="/posts/1/show">` points to `/posts/1/show` in the host application. If you migrate an embedded app from the default adapter, check the hand-written links that point outside ra-core, as they now point inside it.

## When To Use This Package

- Use the **default** `ra-router-react-router` adapter (installed automatically, no extra setup) if your app runs on React Router v6 or v7.
- Use **`ra-router-react-router-next`** if your app runs on React Router v8 (and therefore React 19). This is the recommended choice for new projects, and it will become the default in ra-core v6.
