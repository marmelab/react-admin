---
layout: default
title: "Routing in React-Admin Apps"
---

# Routing

React-admin uses [the react-router library](https://reactrouter.com/) to handle routing. This allows to use different routing strategies, and to integrate a react-admin app inside another app.

## Route Structure

For each `<Resource>`, react-admin creates 4 routes:

* `/:resource`: the list page
* `/:resource/create`: the create page
* `/:resource/:id/edit`: the edit page
* `/:resource/:id/show`: the show page

These routes are fixed (i.e. they cannot be changed via configuration). Having constant routing rules allow react-admin to handle cross-resource links natively. 

**Tip**: React-admin allows to use resource names containing slashes, e.g. 'cms/categories'.

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

Internally, react-admin uses a helper to build links, to allow mounting react-admin apps inside an existing app. You can use this helper, `useCreatePath`, in your components, if they have to work in admins momunted in a sub path:

```jsx
import { Link } from 'react-router-dom';
import { useCreatePath } from 'react-admin';

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

## Using React-Admin Inside An Existing App

React-admin links are absolute (e.g. `/posts/123/show`). If you serve your admin from a sub path (e.g. `/admin`), you need to set the `<Admin basename>` prop, so that react-admin routes include the basename (e.g. `/admin/posts/123/show`).

```jsx
import { Admin, Resource } from 'react-admin';

const App = () => (
    <Admin
        dataProvider={...}
        authProvider={...}
        basename="/admin"
    >
        <Resource name="posts" />
    </Admin>
);
```

If you want to use react-admin in another single-page app using react-router, and mount it under a sub path, read the next section.

## Using A Custom Router 

By default, react-admin creates a [HashRouter](https://reactrouter.com/docs/en/v6/api#hashrouter). The hash portion of the URL (i.e. `#/posts/123` in the example) contains the main application route. This strategy has the benefit of working without a server, and with legacy web browsers. 

But you may want to use another routing strategy, e.g. to allow server-side rendering. React-router offers various Router components to implement such routing strategies. If you want to use a different router, simply wrap it around your app. React-admin will detect that it's already inside a router, and skip its own router. 

```jsx
import { BrowserRouter } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';

const App = () => (
    <BrowserRouter>
        <Admin dataProvider={...} authProvider={...}>
            <Resource name="posts" />
        </Admin>
    </BrowserRouter>
);
```

If you want to include your react-admin app inside another app that already has its own router, you just need to set the `<Admin basename>` prop to let react-admin build URLs relative to the sub path.

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';

export const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<StoreFront />} />
            <Route path="/admin/*" element={<StoreAdmin />} />
        </Routes>
    </BrowserRouter>
);

const StoreFront = () => (
    // ...
);

const StoreAdmin = () => (
    <Admin
        dataProvider={...}
        authProvider={...}
        basename="/admin"
    >
        <Resource name="posts" />
    </Admin>
);
```