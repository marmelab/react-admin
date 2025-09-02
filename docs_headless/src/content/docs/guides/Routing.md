---
title: "Routing"
---

Ra-core uses [the react-router library](https://reactrouter.com/) to handle routing. This allows to use different routing strategies, and to integrate an ra-core app inside another app.

## Route Structure

For each `<Resource>`, ra-core creates 4 routes:

* `/:resource`: the list page
* `/:resource/create`: the create page
* `/:resource/:id/edit`: the edit page
* `/:resource/:id/show`: the show page

These routes are fixed (i.e. they cannot be changed via configuration). Having constant routing rules allow ra-core to handle cross-resource links natively.

**Tip**: Ra-core allows to use resource names containing slashes, e.g. 'cms/categories'.

## Linking To A Page

Use react-router's `<Link>` component to link to a page. Pass the path you want to link to as the `to` prop.

```jsx
import { Link } from 'react-router-dom';

const Dashboard = () => (
    <div>
        <h1>Dashboard</h1>
        <Link to="/posts">Posts</Link>
        <Link to="/posts/create">Create a new post</Link>
        <Link to="/posts/123/show">My favorite post</Link>
    </div>
);
```

Internally, ra-core uses a helper to build links, to allow mounting ra-core apps inside an existing app. You can use this helper, `useCreatePath`, in your components, if they have to work in admins mounted in a sub path:

```jsx
import { Link } from 'react-router-dom';
import { useCreatePath } from 'ra-core';

const Dashboard = () => {
    const createPath = useCreatePath();
    return (
        <div>
            <h1>Dashboard</h1>
            <Link to={createPath({ resource: 'posts', type: 'list' })}>Posts</Link>
            <Link to={createPath({ resource: 'posts', type: 'create' })}>Create a new post</Link>
            <Link to={createPath({ resource: 'posts', type: 'show', id: 123 })}>My favorite post</Link>
        </div>
    );
}
```

## Reacting To A Page Change

Use `react-router-dom`'s [`useLocation` hook](https://reactrouter.com/en/main/hooks/use-location) to perform some side effect whenever the current location changes. For instance, if you want to add an analytics event when the user visits a page, you can do it like this:

```jsx
import * as React from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  React.useEffect(() => {
    // track pageview with gtag / react-ga / react-ga4, for example:
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
    });
  }, [location]);
}
```

Then, use that hook in your [layout](../app-configuration/CoreAdmin.md#layout):

```jsx
import { usePageTracking } from './usePageTracking';

export const MyLayout = ({ children }) => {
    usePageTracking();
    return <div className="admin-layout">{children}</div>;
}
```

**Tip**: When using `useLocation`, you may get an error saying:

> `useLocation()` may be used only in the context of a `<Router>` component

... or a location that doesn't reflect the actual app location. See [the troubleshooting section](#troubleshooting) for a solution.

## Adding Custom Pages

In addition to CRUD pages for resources, you can create as many routes as you want for your custom pages. Use [the `<CustomRoutes>` component](../app-configuration/CustomRoutes.md) to do so.

```jsx
// in src/App.js
import * as React from "react";
import { Route } from 'react-router-dom';
import { CoreAdmin, Resource, CustomRoutes } from 'ra-core';
import posts from './posts';
import comments from './comments';
import Settings from './Settings';
import Profile from './Profile';

const App = () => (
    <CoreAdmin dataProvider={simpleRestProvider('http://path.to.my.api')}>
        <Resource name="posts" {...posts} />
        <Resource name="comments" {...comments} />
        <CustomRoutes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
        </CustomRoutes>
    </CoreAdmin>
);

export default App;
```

## Using A Custom Router

Ra-core uses [the react-router library](https://reactrouter.com/) to handle routing, with a [HashRouter](https://reactrouter.com/en/routers/create-hash-router). This means that the hash portion of the URL (i.e. `#/posts/123` in the example) contains the main application route. This strategy has the benefit of working without a server, and with legacy web browsers.

But you may want to use another routing strategy, e.g. to allow server-side rendering of individual pages. React-router offers various Router components to implement such routing strategies. If you want to use a different router, simply put your app in a create router function. Ra-core will detect that it's already inside a router, and skip its own router.

```tsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { CoreAdmin, Resource } from 'ra-core';
import { dataProvider } from './dataProvider';

const App = () => {
    const router = createBrowserRouter([
        {
            path: "*",
            element: (
                <CoreAdmin dataProvider={dataProvider}>
                    <Resource name="posts" />
                </CoreAdmin>
            ),
        },
    ]);
    return <RouterProvider router={router} />;
};
```

## Using Ra-Core In A Sub Path

Ra-core links are absolute (e.g. `/posts/123/show`). If you serve your admin from a sub path (e.g. `/admin`), ra-core works seamlessly as it only appends a hash (URLs will look like `/admin#/posts/123/show`).

However, if you serve your admin from a sub path AND use another Router (like [`createBrowserRouter`](https://reactrouter.com/en/main/routers/create-browser-router) for instance), you need to set the [`opts.basename`](https://reactrouter.com/en/main/routers/create-browser-router#optsbasename) of `createBrowserRouter` function, so that ra-core routes include the basename in all links (e.g. `/admin/posts/123/show`).

```tsx
import { CoreAdmin, Resource } from 'ra-core';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { dataProvider } from './dataProvider';

const App = () => {
    const router = createBrowserRouter(
        [
            {
                path: "*",
                element: (
                    <CoreAdmin dataProvider={dataProvider}>
                        <Resource name="posts" />
                    </CoreAdmin>
                ),
            },
        ],
        { basename: "/admin" },
    );
    return <RouterProvider router={router} />;
};
```

This makes all links be prefixed with `/admin`.

Note that it is your responsibility to serve the admin from the sub path, e.g. by setting the `base` field in `vite.config.ts` if you use [Vite.js](https://vitejs.dev/config/shared-options.html#base), or the `homepage` field in `package.json` if you use [Create React App](https://create-react-app.dev/docs/deployment/#building-for-relative-paths).

If you want to use ra-core as a sub path of a larger React application, check the next section for instructions. 

## Using Ra-Core Inside a Route

You can include an ra-core app inside another app, using a react-router `<Route>`:

```tsx
import { RouterProvider, Routes, Route, createBrowserRouter } from 'react-router-dom';
import { StoreFront } from './StoreFront';
import { StoreAdmin } from './StoreAdmin';

export const App = () => {
    const router = createBrowserRouter(
        [
            {
                path: "*",
                element: (
                    <Routes>
                        <Route path="/" element={<StoreFront />} />
                        <Route path="/admin/*" element={<StoreAdmin />} />
                    </Routes>
                ),
            },
        ],
    );
    return <RouterProvider router={router} />;
};
```

Ra-core will have to prefix all the internal links with `/admin`. Use the `<CoreAdmin basename>` prop for that:

```tsx
// in src/StoreAdmin.js
import { CoreAdmin, Resource } from 'ra-core';
import { dataProvider } from './dataProvider';
import posts from './posts';

export const StoreAdmin = () => (
    <CoreAdmin basename="/admin" dataProvider={dataProvider}>
        <Resource name="posts" {...posts} />
    </CoreAdmin>
);
```

This will let ra-core build absolute URLs including the sub path.

## Troubleshooting

When using custom routing configurations, you may encounter strange error messages like:

> `useLocation()` may be used only in the context of a `<Router>` component

or

> `useNavigate()` may be used only in the context of a `<Router>` component

or 

> `useRoutes()` may be used only in the context of a `<Router>` component

or 

> `useHref()` may be used only in the context of a `<Router>` component.

or

> `<Route>` may be used only in the context of a `<Router>` component

These errors can happen if you added `react-router` and/or `react-router-dom` to your dependencies, and didn't use the same version as ra-core. In that case, your application has two versions of react-router, and the calls you add can't see the ra-core routing context.

You can use the `npm list react-router` and `npm list react-router-dom` commands to check which versions are installed.

If there are duplicates, you need to make sure to use only the same version as ra-core. You can deduplicate them using yarn's `resolutions` or npm's `overrides`.

```js
// in packages.json
{
    // ...
  "resolutions": {
    "react-router-dom": "6.7.0",
    "react-router": "6.7.0"
  }
}
```

