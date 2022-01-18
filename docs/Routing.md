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

## Using A Custom Router 

By default, react-admin creates a [HashRouter](https://reactrouter.com/docs/en/v6/api#hashrouter). The hash portion of the URL (i.e. `#/posts/123` in the example) contains the main application route. This strategy has the benefit of working without a server, and with legacy web browsers. 

But you may want to use another routing strategy, e.g. to allow server-side rendering. React-router offers various Router components to implement such routing strategies. If you want to use a different router, simply wrap it around your app. React-admin will detect that it's already inside a router, and skip its own router. 

```jsx
import { BrowserRouter } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';

const App = () => (
    <BrowserRouter>
        <Admin dataProvider={...}>
            <Resource name="posts" />
        </Admin>
    </BrowserRouter>
);
```

## Using React-Admin In A Sub Path

React-admin links are absolute (e.g. `/posts/123/show`). If you serve your admin from a sub path (e.g. `/admin`), react-admin works seamlessly as it only appends a hash (URLs will look like `/admin#/posts/123/show`).

However, if you serve your admin from a sub path AND use another Router (like `BrowserRouter` for instance), you need to set the `<Admin basename>` prop, so that react-admin routes include the basename in all links (e.g. `/admin/posts/123/show`).

```jsx
import { Admin, Resource } from 'react-admin';

const App = () => (
    <BrowserRouter>
        <Admin basename="/admin" dataProvider={...}>
            <Resource name="posts" />
        </Admin>
    </BrowserRouter>
);
```

## Using React-Admin Inside a Route

If you want to include a react-admin app inside another app using a react-router `<Route>`, you need to set the `<Admin basename>` prop, too. This will let react-admin build absolute URLs including the sub path.

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

const StoreFront = () => (/* ... */);

const StoreAdmin = () => (
    <Admin basename="/admin" dataProvider={...}>
        <Resource name="posts" />
    </Admin>
);
```