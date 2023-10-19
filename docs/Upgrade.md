---
layout: default
title: "Upgrading to v4"
---

# Upgrading to v4

React-admin v4 has upgraded all its dependencies to their latest major version. Some major dependencies were swapped (`react-query` instead of `redux`, `react-hook-form` instead of `react-final-form`). In addition, the lower layers of the react-admin code have been rewritten for better extensibility. 

We've done our best to keep the general API of react-admin v4 similar with the v3 API. But the changes mentioned above result in many small compatibility breaks. An application built with react-admin v3 will need some work to run with react-admin v4.

Depending on the size of your v3 application, the upgrade will take between a few hours to a few days. If you use TypeScript, the migration will be much faster.

## Material UI v5

React-admin v4 uses Material UI (Material-UI) v5. The Material UI team has written an upgrade guide, which you should read to upgrade your material-ui code.

[https://mui.com/material-ui/migration/migration-v4/](https://mui.com/material-ui/migration/migration-v4/)

## Redux Is Gone

React-admin no longer relies on Redux. Instead, it relies on [React context](https://react.dev/learn/passing-data-deeply-with-context) and third-party libraries (e.g. [react-query](https://react-query-v3.tanstack.com/)). 

You will need to update your code if it contains any of the following keywords:

- `createAdminStore`
- `customReducers`
- `customSagas`
- `initialState`
- `useSelector`
- `useDispatch`

### Running Inside A Redux App

You could run a react-admin app inside an existing Redux app, provided that you initialized the react-admin reducers. This is no longer necessary, so you can directly put your custom reducers in your Redux store:

```diff
-import { createAdminStore, Admin } from 'react-admin';
+import { Admin } from 'react-admin';
+import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

const App = () => (
    <Provider
-       store={createAdminStore({
-           authProvider,
-           dataProvider,
-           history,
-           customReducers,
-       })}
+       store={createStore(combineReducers(customReducers))}
    >
        <Admin
            authProvider={authProvider}
            dataProvider={dataProvider}
            history={history}
            title="My Admin"
        >
            ...
        </Admin>
    </Provider>
);
```

### Using Custom Reducers

If your app used custom reducers, then you need to create a store manually, and wrap the app with a `Provider` component.

```diff
import customReducers from './customReducers';
+import { createStore, combineReducers } from 'redux';
+import { Provider } from 'react-redux';

const App = () => (
+   <Provider store={createStore(combineReducers(customReducers))}>
        <Admin
            dataProvider={dataProvider}
-           customReducers={customReducers}
        >
            ...
        </Admin>
+   </Provider>
);
```

### `<Admin initialState>` Is Gone

The `<Admin initialState>` prop used to be used to initialize the store. As there is no Redux store anymore, you cannot set the react-admin defaults this way.

Apart from initializing the Redux store for unit tests (which is no longer necessary, as react-admin components don't use Redux anymore), the only use case for `initialState` was to initialize the sidebar `open` state to `false`. To achieve the same in v4, initialize the store and set the `sidebar.open` state to `false`:

{% raw %}
```diff
-import { Admin } from 'react-admin';
+import { Admin, localStorageStore } from 'react-admin';

+const store = localStorageStore();
+store.setItem('sidebar.open', false);

const App = () => (
    <Admin
        dataProvider={dataProvider}
-       initialState={{ admin : { ui: { sidebarOpen: false } } }}
+       store={store}
    >
        ...
    </Admin>
);
```
{% endraw %}

### `useSelector` Won't Return Anything

If your code used `useSelector` to read the react-admin application state, it will break. React-admin v4 doesn't use Redux anymore.

React-admin no longer uses Redux for **data fetching**. Instead, it uses react-query. If you used to read data from the Redux store (which was a bad practice by the way), you'll have to use specialized data provider hooks instead.

```diff
import * as React from "react";
-import { useSelector } from 'react-redux';
+import { useGetOne } from 'react-admin';
import { Loading, Error } from '../ui';

const UserProfile = ({ record }) => {
-   const data = useSelector(state => state.resources.users.data[record.id]);
+   const { data, isLoading, error } = useGetOne(
+       'users',
+       { id: record.id }
+   );
+   if (isLoading) { return <Loading />; }
+   if (error) { return <Error />; }
    return <div>User {data.username}</div>;
};
```

Besides, the `loadedOnce` reducer, used internally for the previous version of the List page logic, is no longer necessary and has been removed.

A non-documented hack allowed to **read records directly from the Redux store**. You now have to use the dataProvider hooks to get them. 

```diff
-import { useSelector } from 'react-redux';
+import { useGetOne } from 'react-admin';

const BookAuthor = ({ record }) => {
-   const author = useSelector(state =>
-       state.admin.resources.users.data[record.authorId]
-   );
+   const { data: author, isLoading, error } = useGetOne(
+       'users',
+       { id: record.authorId }
+   );
+   if (isLoading) { return <Loading />; }
+   if (error) { return <Error />; }
    return <div>Author {data.username}</div>;
};
```

React-admin no longer relies on Redux to fetch **relationships**. Instead, the cache of previously fetched relationships is managed by react-query.

If you need to get the records related to the current one via a one-to-many relationship (e.g. to fetch all the books of a given author), you can use the `useGetManyReference` hook instead of the `oneToMany` reducer.

If you need to get possible values for a relationship, use the `useGetList` hook instead of the `possibleValues` reducer.

React-admin no longer uses Redux for **resource definitions**. Instead, it uses a custom context. If you used the `useResourceDefinition` hook, this change is backwards compatible. But if you used to read the Redux state directly, you'll have to upgrade your code. This often happens for custom menus, using the `getResources` selector:

```diff
// in src/Menu.js
import * as React from 'react';
import { createElement } from 'react';
-import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';
-import { DashboardMenuItem, Menu, MenuItemLink, getResources } from 'react-admin';
+import { DashboardMenuItem, Menu, MenuItemLink, useResourceDefinitions } from 'react-admin';
import DefaultIcon from '@mui/icons-material/ViewList';
import LabelIcon from '@mui/icons-material/Label';

export const Menu = (props) => {
-   const resources = useSelector(getResources);
+   const resourcesDefinitions = useResourceDefinitions();
+   const resources = Object.keys(resourcesDefinitions).map(name => resourcesDefinitions[name]);
    const open = useSelector(state => state.admin.ui.sidebarOpen);
    return (
        <Menu {...props}>
            <DashboardMenuItem />
            {resources.map(resource => (
                <MenuItemLink
                    key={resource.name}
                    to={`/${resource.name}`}
                    primaryText={
                        (resource.options && resource.options.label) ||
                        resource.name
                    }
                    leftIcon={
                        resource.icon ? <resource.icon /> : <DefaultIcon />
                    }
                    onClick={props.onMenuClick}
                    sidebarIsOpen={open}
                />
            ))}
            {/* add your custom menus here */}
        </Menu>
    );
};
```

React-admin no longer uses Redux for storing the **list parameters** (current sort & filters, selected ids, expanded rows). This shouldn't impact you if you used the react-admin hooks (`useListParams`, `useRecordSelection`, `useExpanded`) to read the state.

React-admin no longer uses Redux to store the **sidebar state**. The introduction of a custom hook, `useSidebarState`, facilitates the migration.

```diff
import * as React from 'react';
import { createElement } from 'react';
-import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';
-import { MenuItemLink, useResourceDefinitions } from 'react-admin';
+import { MenuItemLink, useResourceDefinitions, useSidebarState } from 'react-admin';
import LabelIcon from '@mui/icons-material/Label';

const Menu = ({ onMenuClick, logout }) => {
    const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
-   const open = useSelector(state => state.admin.ui.sidebarOpen);
+   const [open] = useSidebarState();
    const resources = useResourceDefinitions();
    
    return (
        <div>
            {Object.keys(resources).map(name => (
                <MenuItemLink
                    key={name}
                    to={`/${name}`}
                    primaryText={resources[name].options && resources[name].options.label || name}
                    leftIcon={createElement(resources[name].icon)}
                    onClick={onMenuClick}
                    sidebarIsOpen={open}
                />
            ))}
            {isXSmall && logout}
        </div>
    );
}
export default Menu;
```

React-admin no longer uses Redux for **notifications**. Instead, it uses a custom context. This change is backwards compatible, as the APIs for the `useNotify` and the `<Notification>` component are the same. If you used to `dispatch` a `showNotification` action, you'll have to use the `useNotify` hook instead:

```diff
-import { useDispatch } from 'react-redux';
-import { showNotification } from 'react-admin';
+import { useNotify } from 'react-admin';

const NotifyButton = () => {
-   const dispatch = useDispatch();
+   const notify = useNotify();
    const handleClick = () => {
-       dispatch(showNotification('Comment approved', 'success'));
+       notify('Comment approved', { type: 'success' });
    }
    return <button onClick={handleClick}>Notify</button>;
};
```

### Action Creators Are Gone

As React-admin no longer uses Redux, each time your code used react-redux's `dispatch` with an action creator, you'll have to replace it with a hook. 

- `dispatch(fetchStart())` and `dispatch(fetchEnd())` must be replaced by `useQuery()` and `useMutation()`
- `dispatch(setSidebarVisibility(true))` must be replaced by `useSidebarState()`
- `dispatch(showNotification('Comment approved', 'success'))` must be replaced by `useNotify()`
- `dispatch(push('/comments'))` must be replaced by `useNavigate()`

React-admin used `dispatch` in many other places, but they were already behind a hook (`useRecordSelection`, `useListParams`, `useExpanded`, `useNotify`, `useSidebarState`), and not documented. If you dispatched react-admin actions manually, you'll have to look for the hook alternatives.

### Redux-Saga Was Removed

The use of sagas has been deprecated for a while. React-admin v4 will no longer uses sagas.

This means that the `<Admin customSagas>` prop is no longer supported.

If you still relied on sagas, you have to port your saga code to react `useEffect`, which is the standard way to write side effects in modern react.

### No More Data Actions

React-admin doesn't dispatch Redux actions like `RA/CRUD_GET_ONE_SUCCESS` and `RA/FETCH_END`. If you relied on these actions for your custom reducers, you must now use react-query `onSuccess` callback or React's `useEffect` instead.

The following actions no longer exist:

- `RA/CRUD_GET_ONE`
- `RA/CRUD_GET_ONE_LOADING`
- `RA/CRUD_GET_ONE_FAILURE`
- `RA/CRUD_GET_ONE_SUCCESS`
- `RA/CRUD_GET_LIST`
- `RA/CRUD_GET_LIST_LOADING`
- `RA/CRUD_GET_LIST_FAILURE`
- `RA/CRUD_GET_LIST_SUCCESS`
- `RA/CRUD_GET_ALL`
- `RA/CRUD_GET_ALL_LOADING`
- `RA/CRUD_GET_ALL_FAILURE`
- `RA/CRUD_GET_ALL_SUCCESS`
- `RA/CRUD_GET_MANY`
- `RA/CRUD_GET_MANY_LOADING`
- `RA/CRUD_GET_MANY_FAILURE`
- `RA/CRUD_GET_MANY_SUCCESS`
- `RA/CRUD_GET_MANY_REFERENCE`
- `RA/CRUD_GET_MANY_REFERENCE_LOADING`
- `RA/CRUD_GET_MANY_REFERENCE_FAILURE`
- `RA/CRUD_GET_MANY_REFERENCE_SUCCESS`
- `RA/CRUD_CREATE`
- `RA/CRUD_CREATE_LOADING`
- `RA/CRUD_CREATE_FAILURE`
- `RA/CRUD_CREATE_SUCCESS`
- `RA/CRUD_UPDATE`
- `RA/CRUD_UPDATE_LOADING`
- `RA/CRUD_UPDATE_FAILURE`
- `RA/CRUD_UPDATE_SUCCESS`
- `RA/CRUD_UPDATE_MANY`
- `RA/CRUD_UPDATE_MANY_LOADING`
- `RA/CRUD_UPDATE_MANY_FAILURE`
- `RA/CRUD_UPDATE_MANY_SUCCESS`
- `RA/CRUD_DELETE`
- `RA/CRUD_DELETE_LOADING`
- `RA/CRUD_DELETE_FAILURE`
- `RA/CRUD_DELETE_SUCCESS`
- `RA/CRUD_DELETE_MANY`
- `RA/CRUD_DELETE_MANY_LOADING`
- `RA/CRUD_DELETE_MANY_FAILURE`
- `RA/CRUD_DELETE_MANY_SUCCESS`
- `RA/FETCH_START`
- `RA/FETCH_END`
- `RA/FETCH_ERROR`
- `RA/FETCH_CANCEL`

Other actions related to data fetching were also removed:

- `RA/REFRESH_VIEW`
- `RA/SET_AUTOMATIC_REFRESH`
- `RA/START_OPTIMISTIC_MODE`
- `RA/STOP_OPTIMISTIC_MODE`

### Removed connected-react-router

If you were dispatching `connected-react-router` actions to navigate, you'll now have to use `react-router` hooks:

```diff
-import { useDispatch } from 'react-redux';
-import { push } from 'connected-react-router';
+import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
-    const dispatch = useDispatch();
+    const navigate = useNavigate();

    const myHandler = () => {
-        dispatch(push('/my-url'));
+        navigate('/my-url');
    }
}
```

## React-router V6

React-admin v4 uses react-router v6, which changes quite a few things internally.

This should be mostly transparent for you unless your code contains any of the following keywords:

- `history`
- `customRoutes`
- `useHistory`
- `push`
- `<Route>`
- `<RouteWithoutLayout>`

### The Way To Define Custom Routes Has Changed

Custom routes used to be provided to the `<Admin>` component through the `customRoutes` prop. This was awkward to use as you had to provide an array of `<Route>` elements. Besides, we had to provide the `<RouteWithoutLayout>` component to support custom routes rendered without the `<Layout>` and keep TypeScript happy.

As we upgraded to react-router v6, we had to come up with another way to support custom routes.

Meet the `<CustomRoutes>` component. You can pass it as a child of `<Admin>`, just like a `<Resource>`. It accepts react-router `<Route>` as its children (and only that). You can specify whether the custom routes it contains should be rendered with the `<Layout>` or not by setting the `noLayout` prop. It's `false` by default.

```diff
-import { Admin, Resource, RouteWithoutLayout } from 'react-admin';
+import { Admin, CustomRoutes, Resource } from 'react-admin';

const MyAdmin = () => (
    <Admin
-       customRoutes={[
-           <Route path="/custom" component={MyCustomRoute} />,
-           <RouteWithoutLayout path="/custom2" component={MyCustomRoute2} />,
-       ]}
    >
+       <CustomRoutes>
+           <Route path="/custom" element={<MyCustomRoute />} />
+       </CustomRoutes>
+       <CustomRoutes noLayout>
+           <Route path="/custom2" element={<MyCustomRoute2 />} />
+       </CustomRoutes>
        <Resource name="posts" />
    </Admin>
)
```

Note that `<CustomRoutes>` handles `null` elements and fragments correctly, so you can check for any condition before returning one of its children:

```jsx
    const MyAdmin = () => {
        const condition = useGetConditionFromSomewhere();
    
        return (
            <Admin>
                <CustomRoutes>
                    <Route path="/custom" element={<MyCustomRoute />} />
                    {condition
                        ? (
                              <>
                                  <Route path="/a_path" element={<ARoute />} />
                                  <Route path="/another_path" element={<AnotherRoute />} />
                              </>
                          )
                        : null}
                </CustomRoutes>
            </Admin>
        );
    }
```

See [https://reactrouter.com/en/6.6.2/upgrading/v5#advantages-of-route-element](https://reactrouter.com/en/6.6.2/upgrading/v5#advantages-of-route-element) for more details about the new `<Route>` element

### Use `useNavigate` instead of `useHistory`

See [https://reactrouter.com/en/v6/upgrading/v5#use-usenavigate-instead-of-usehistory](https://reactrouter.com/en/v6/upgrading/v5#use-usenavigate-instead-of-usehistory) to upgrade.

### Change The `<Route>` Syntax

If your admin contains components that add new sub routes (like react-admin's `<TabbedForm>` and `<TabbedShowLayout>`), you'll need to update the `<Route>` syntax. 

See [https://reactrouter.com/en/v6/upgrading/v5](https://reactrouter.com/en/v6/upgrading/v5) for details.

### Using A Custom History

To use a `BrowserHistory` instead of the default `HashHistory`, you previously had to pass a custom `<Admin history>` prop. You can now wrap your app with the history component you need:

```diff
-import { createBrowserHistory } from 'react-router';
+import { BrowserRouter } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';

const App = () => (
+   <BrowserRouter>
        <Admin 
            dataProvider={...}
-           history={createBrowserHistory()}
        >    
            <Resource name="posts" />
        </Admin>
+   </BrowserRouter>
);
```

### Mounting React-Admin In A Sub Path

If you were using react-admin in a sub path (e.g. `/admin`), and if you were using `BrowserHistory`, you'll have to update your code to set this base path as the `<Admin basename>` prop:

```diff
import { Admin, Resource } from 'react-admin';

const App = () => (
+   <BrowserRouter>
        <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
-           history={createBrowserHistory()}
+           basename="/admin"
        >
            <Resource name="posts" />
        </Admin>
+   </BrowserRouter>
);
```

You don't need to make that change if you were using `HashHistory` or `MemoryHistory`.

## Data Provider

React-admin v3 used Redux to communicate with the data provider ; react-admin v4 uses react-query. This leads to a few necessary changes in your code if you used one of the following keywords:

- `useQuery`
- `useQueryWithStore`
- `useMutation`
- `<Query>`
- `<Mutation>`
- `useDataProvider`
- `useGetOne`
- `useGetList`
- `useGetMany`
- `useGetReference`
- `useCreate`
- `useUpdate`
- `useUpdateMany`
- `useDelete`
- `useDeleteMany`
- `validUntil`

### Changed Signature Of Data Provider Hooks

Specialized data provider hooks (like `useGetOne`, `useGetList`, `useGetMany` and `useUpdate`) have a new signature. There are 2 changes:

- `loading` is renamed to `isLoading`
- the hook signature now reflects the dataProvider signature (so every hook now takes 2 arguments, `resource` and `params`).

For queries:

```diff
// useGetOne
-const { data, loading } = useGetOne(
-   'posts',
-   123,
-);
+const { data, isLoading } = useGetOne(
+   'posts',
+   { id: 123 }
+);

// useGetList
-const { data, ids, loading } = useGetList(
-   'posts',
-   { page: 1, perPage: 10 },
-   { field: 'published_at', order: 'DESC' },
-);
-return <>{ids.map(id => <span key={id}>{data[id].title}</span>)}</>;
+const { data, isLoading } = useGetList(
+   'posts',
+   {
+      pagination: { page: 1, perPage: 10 },
+      sort: { field: 'published_at', order: 'DESC' },
+   }
+);
+return <>{data.map(record => <span key={record.id}>{record.title}</span>)}</>;

// useGetMany
-const { data, loading } = useGetMany(
-   'posts',
-   [123, 456],
-);
+const { data, isLoading } = useGetMany(
+   'posts',
+   { ids: [123, 456] }
+);

// useGetManyReference
-const { data, ids, loading } = useGetManyReference(
-   'comments',
-   'post_id',
-   123,
-   { page: 1, perPage: 10 },
-   { field: 'published_at', order: 'DESC' }
-   'posts'
-);
-return <>{ids.map(id => <span key={id}>{data[id].title}</span>)}</>;
+const { data, isLoading } = useGetManyReference(
+   'comments',
+   {
+       target: 'post_id',
+       id: 123,
+       pagination: { page: 1, perPage: 10 },
+       sort: { field: 'published_at', order: 'DESC' }
+   }
+);
+return <>{data.map(record => <span key={record.id}>{record.title}</span>)}</>;
```

For mutations:

```diff
// useCreate
-const [create, { loading }] = useCreate(
-   'posts',
-   { title: 'hello, world!' },
-);
-create(resource, data, options);
+const [create, { isLoading }] = useCreate(
+   'posts',
+   { data: { title: 'hello, world!' } }
+);
+create(resource, { data }, options);

// useUpdate
-const [update, { loading }] = useUpdate(
-   'posts',
-   123,
-   { likes: 12 },
-   { id: 123, title: "hello, world", likes: 122 }
-);
-update(resource, id, data, previousData, options);
+const [update, { isLoading }] = useUpdate(
+   'posts',
+   {
+       id: 123,
+       data: { likes: 12 },
+       previousData: { id: 123, title: "hello, world", likes: 122 }
+   }
+);
+update(resource, { id, data, previousData }, options);

// useUpdateMany
-const [updateMany, { loading }] = useUpdateMany(
-   'posts',
-   [123, 456],
-   { likes: 12 },
-);
-updateMany(resource, ids, data, options);
+const [updateMany, { isLoading }] = useUpdateMany(
+   'posts',
+   {
+       ids: [123, 456],
+       data: { likes: 12 },
+   }
+);
+updateMany(resource, { ids, data }, options);

// useDelete
-const [deleteOne, { loading }] = useDelete(
-   'posts',
-   123,
-   { id: 123, title: "hello, world", likes: 122 }
-);
-deleteOne(resource, id, previousData, options);
+const [deleteOne, { isLoading }] = useDelete(
+   'posts',
+   {
+       id: 123,
+       previousData: { id: 123, title: "hello, world", likes: 122 }
+   }
+);
+deleteOne(resource, { id, previousData }, options);

// useDeleteMany
-const [deleteMany, { loading }] = useDeleteMany(
-   'posts',
-   [123, 456],
-);
-deleteMany(resource, ids, options);
+const [deleteMany, { isLoading }] = useDeleteMany(
+   'posts',
+   {
+       ids: [123, 456],
+   }
+);
+deleteMany(resource, { ids }, options);

```

This new signature should be easier to learn and use.

To upgrade, check every instance of your code of the following hooks:

- `useGetOne`
- `useGetList`
- `useGetMany`
- `useGetManyReference`
- `useCreate`
- `useUpdate`
- `useUpdateMany`
- `useDelete`
- `useDeleteMany`

And update the calls. If you're using TypeScript, your code won't compile until you properly upgrade the calls. 

These hooks are now powered by react-query, so the state argument contains way more than just `isLoading` (`reset`, `status`, `refetch`, etc.). Check the [`useQuery`](https://tanstack.com/query/v3/docs/react/reference/useQuery) and the [`useMutation`](https://tanstack.com/query/v3/docs/react/reference/useMutation) documentation on the react-query website for more details. 

### `useQuery`, `useMutation`, and `useQueryWithStore` Have Been Removed

React-admin v4 uses react-query rather than Redux for data fetching. The base react-query data fetching hooks (`useQuery`, `useMutation`, and `useQueryWithStore`) are no longer necessary as their functionality is provided by react-query.

If your application code uses these hooks, you have 2 ways to upgrade.

If you're using `useQuery` to call a regular dataProvider method (like `dataProvider.getOne`), then you can use the specialized dataProvider hooks instead:

```diff
import * as React from "react";
-import { useQuery } from 'react-admin';
+import { useGetOne } from 'react-admin';
import { Loading, Error } from '../ui';
const UserProfile = ({ record }) => {
-   const { loaded, error, data } = useQuery({
-       type: 'getOne',
-       resource: 'users',
-       payload: { id: record.id }
-   });
+   const { data, isLoading, error } = useGetOne(
+       'users',
+       { id: record.id }
+   );
-   if (!loaded) { return <Loading />; }
+   if (isLoading) { return <Loading />; }
    if (error) { return <Error />; }
    return <div>User {data.username}</div>;
};
```

If you're using `useMutation` to call a regular dataProvider method (like `dataProvider.update`), then you can use the specialized dataProvider hooks instead:

```diff
-import { useMutation } from 'react-admin';
+import { useUpdate } from 'react-admin';

const BanUserButton = ({ userId }) => {
-   const [update, { loading, error }] = useMutation({
-       type: 'update',
-       resource: 'users',
-       payload: { id: userId, data: { isBanned: true } }
-   });
+   const [update, { isLoading, error }] = useUpdate(
+       'users',
+       { id: userId, data: { isBanned: true } }
+   );
-   return <Button label="Ban" onClick={() => update()} disabled={loading} />;
+   return <Button label="Ban" onClick={() => update()} disabled={isLoading} />;
};
```

If you're calling a custom dataProvider method, or if you're calling an PI route directly, then you can use react-query's `useQuery` or `useMutation` instead:

```diff
-import { useMutation } from 'react-admin';
+import { useDataProvider } from 'react-admin';
+import { useMutation } from 'react-query';
const BanUserButton = ({ userId }) => {
-   const [mutate, { loading, error, data }] = useMutation({
-       type: 'banUser',
-       payload: userId
-   });
+   const dataProvider = useDataProvider();
+   const { mutate, isLoading } = useMutation(
+       () => dataProvider.banUser(userId)
+   );
-   return <Button label="Ban" onClick={() => mutate()} disabled={loading} />;
+   return <Button label="Ban" onClick={() => mutate()} disabled={isLoading} />;
};
```

Refer to [the react-query documentation](https://react-query-v3.tanstack.com/overview) for more information.

### `<Query>` and `<Mutation>` Have Been Removed

The component version of `useQuery` and `useMutation` have been removed. Use the related hook in your components instead.

{% raw %}
```diff
-import { Query } from 'react-admin';
+import { useGetOne } from 'react-admin';

const UserProfile = ({ record }) => {
-   return (
-       <Query type="getOne" resource="users" payload={{ id: record.id }}>
-           {({ loaded, error, data }) => {
-               if (!loaded) { return <Loading />; }
-               if (error) { return <Error />; }
-               return <div>User {data.username}</div>;
-           }}
-       </Query>
-   );
+   const { data, isLoading, error } = useGetOne(
+       'users',
+       { id: record.id }
+   );
+   if (isLoading) { return <Loading />; }
+   if (error) { return <Error />; }
+   return <div>User {data.username}</div>;
}
```
{% endraw %}

### `useDataProvider` No Longer Accepts Side Effects

`useDataProvider` returns a wrapper around the application `dataProvider` instance. In previous react-admin versions, the wrapper methods used to accept an `options` object, allowing to pass `onSuccess` and `onFailure` callbacks. This is no longer the case - the wrapper returns an object with the same method signatures as the original `dataProvider`.

If you need to call the `dataProvider` and apply side effects, use react-query's `useQuery` or `useMutation` hooks instead.

```diff
-import { useState } from 'react';
import { useDataProvider } from 'react-admin';
+import { useMutation } from 'react-query';

const BanUserButton = ({ userId }) => {
    const dataProvider = useDataProvider();
+   const { mutate, isLoading } = useMutation();
-   const [loading, setLoading] = useState(false);
    const handleClick = () => {
-       setLoading(true);
-       dataProvider.banUser(userId, {
-           onSuccess: () => {
-               setLoading(false);
-               console.log('User banned');
-           },
-       });
+       mutate(
+           ['banUser', userId],
+           () => dataProvider.banUser(userId),
+           { onSuccess: () => console.log('User banned') }
+       );
    }
-   return <Button label="Ban" onClick={handleClick} disabled={loading} />;
+   return <Button label="Ban" onClick={handleClick} disabled={isLoading} />;
};
```

Refer to [the react-query documentation](https://react-query-v3.tanstack.com/overview) for more information.


### Application Cache No Longer Uses `validUntil`

React-admin's *application cache* used to rely on the dataProvider returning a `validUntil` property in the response. This is no longer the case, as the cache functionality is handled by react-query. Therefore, you can safely remove the `validUntil` property from your dataProvider response.

```diff
const dataProvider = {
    getOne: (resource, { id }) => {
        return fetch(`/api/${resource}/${id}`)
            .then(r => r.json())
            .then(data => {
-               const validUntil = new Date();
-               validUntil.setTime(validUntil.getTime() + 5 * 60 * 1000);
                return { 
                    data,
-                   validUntil
                };
            }));
    }
};
```

This also implies that the `cacheDataProviderProxy` function was removed.

```diff
// in src/dataProvider.js
import simpleRestProvider from 'ra-data-simple-rest';
-import { cacheDataProviderProxy } from 'react-admin'; 

const dataProvider = simpleRestProvider('http://path.to.my.api/');

-export default cacheDataProviderProxy(dataProvider);
+export default dataProvider;
```

Instead, you must set up the cache duration at the react-query QueryClient level:

```jsx
import { QueryClient } from 'react-query';
import { Admin, Resource } from 'react-admin';

const App = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // 5 minutes
            },
        },
    });
    return (
        <Admin dataProvider={dataProvider} queryClient={queryClient}>
            <Resource name="posts" />
        </Admin>
    );
}
```

### Mutation Callbacks Can No Longer Be Used As Event Handlers

In 3.0, you could use a mutation callback in an event handler, e.g. a click handler on a button. This is no longer possible, so you'll have to call the callback manually inside a handler function:

```diff
const IncreaseLikeButton = ({ record }) => {
    const diff = { likes: record.likes + 1 };
    const [update, { isLoading, error }] = useUpdate('likes', { id: record.id, data: diff, previousData: record });
    if (error) { return <p>ERROR</p>; }
-   return <button disabled={isLoading} onClick={update}>Like</button>;
+   return <button disabled={isLoading} onClick={() => update()}>Like</button>;
};
```

TypeScript will complain if you don't.

To upgrade, check every instance of your code of the following hooks:

- `useCreate`
- `useUpdate`
- `useUpdateMany`
- `useDelete`
- `useDeleteMany`

Note that your code will be more readable if you pass the mutation parameters to the mutation callback instead of the mutation hook, e.g.

```diff
const IncreaseLikeButton = ({ record }) => {
    const diff = { likes: record.likes + 1 };
-   const [update, { isLoading, error }] = useUpdate('likes', { id: record.id, data: diff, previousData: record });
+   const [update, { isLoading, error }] = useUpdate();
+   const handleClick = () => {
+       update('likes', { id: record.id, data: diff, previousData: record });
+   };
    if (error) { return <p>ERROR</p>; }
-   return <button disabled={isLoading} onClick={update}>Like</button>;
+   return <button disabled={isLoading} onClick={handleClick}>Like</button>;
};
```

### Removed the undoable prop in Favor of mutationMode

We removed the `undoable` prop as we introduced the `mutationMode` in v3. This impact the following hooks and components:

- `useDeleteWithConfirmController`
- `useEditController`
- `useDataProvider`
- `useMutation`

- `BulkDeleteButton`
- `BulkDeleteWithConfirmButton`
- `DeleteButton`
- `DeleteWithConfirmButton`
- `Edit`

Wherever you were using `undoable`, replace it with `mutationMode`:

```diff
const {
    open,
    loading,
    handleDialogOpen,
    handleDialogClose,
    handleDelete,
} = useDeleteWithConfirmController({
    resource,
    record,
    redirect,
    onClick,
-    undoable: true
+    mutationMode: 'undoable'
});
```

Or in a component:
```diff
export const PostEdit = (props) => (
-    <Edit {...props} undoable>
+    <Edit {...props} mutationMode="undoable">
        <SimpleForm>
            <TextInput source="title" />
        </SimpleForm>
    </Edit>
);
```

### Removed `loading` and `loaded` Data Provider State Variables

The dataProvider hooks (`useGetOne`, etc.) return the request state. The `loading` and `loaded` state variables were changed to `isLoading` and `isFetching` respectively. The meaning has changed, too:

- `loading` is now `isFetching`
- `loaded` is now `!isLoading`

```diff
const BookDetail = ({ id }) => {
-   const { data, error, loaded } = useGetOne('books', id);
+   const { data, error, isLoading } = useGetOne('books', { id });
-   if (!loaded) {
+   if (isLoading) {
        return <Loading />;
    }
    if (error) {
        return <Error error={error} />;
    }
    if (!data) {
        return null;
    }
    return (
        <div>
            <h1>{data.book.title}</h1>
            <p>{data.book.author.name}</p>
        </div>
    );
};
```

In general, you should use `isLoading`. It's false as long as the data has never been loaded (whether from the dataProvider or from the cache).

The new props are actually returned by react-query's `useQuery` hook. Check [their documentation](https://tanstack.com/query/v3/docs/react/reference/useQuery) for more information.


## Auth Provider

### Renamed `loading` to `isLoading`

Some of the hooks allowing to call the `authProvider` methods are asynchronous: they return their result only when the `authProvider` promise resolves, and set the `loading` property to `true` until then.

In react-admin v4, this `loading` field is now renamed to `isLoading`. The `loaded` field has been removed.

```diff
import { useAuthState, Loading } from 'react-admin';

const MyPage = () => {
-   const { loading, authenticated } = useAuthState();
+   const { isLoading, authenticated } = useAuthState();
-   if (loading) {
+   if (isLoading) {
        return <Loading />;
    }
    if (authenticated) {
        return <AuthenticatedContent />;
    } 
    return <AnonymousContent />;
};
```

To upgrade, check every instance of your code of the following hooks:

- `useAuthState`
- `useGetIdentity`
- `usePermissions`

### `useAuthenticated` Signature has Changed

`useAuthenticated` uses to accept only the parameters passed to the `authProvider.checkAuth` function. It now accepts an option object with two properties:
- `enabled`: whether it should check for an authenticated user
- `params`: the parameters to pass to `checkAuth`

```diff
- useAuthenticated('permissions.posts.can_create');
+ useAuthenticated({ params: 'permissions.posts.can_create' })
```


## Admin 

### Admin Child Function Result Has Changed

In order to define the resources and their views according to users permissions, we used to support a function as a child of `<Admin>`. Just like the `customRoutes`, this function had to return an array of elements.

You can now return a fragment and this fragment may contain `null` elements. Besides, if you don't need to check the permissions for a resource, you may even include it as a direct child of `<Admin>`.

```diff
<Admin>
-    {permissions => [
-       <Resource name="posts" {...posts} />,
-       <Resource name="comments" {...comments} />,
-       permissions ? <Resource name="users" {...users} /> : null,
-       <Resource name="tags" {...tags} />,
-   ]}
+   <Resource name="posts" {...posts} />
+   <Resource name="comments" {...comments} />
+   <Resource name="tags" {...tags} />
+   {permissions => (
+       <>
+           {permissions ? <Resource name="users" {...users} /> : null}
+       </> 
+   )}
</Admin>
```

Last thing, you can return any element supported by `<Admin>`, including the new `<CustomRoutes>`:

```jsx
import { Admin, Resource, CustomRoutes } from 'react-admin';

const MyAdmin = () => (
    <Admin>
        <Resource name="posts" {...posts} />
        {permissions => (
            <>
                {permissions ? <Resource name="users" {...posts} /> : null}
                <CustomRoutes>
                    {permissions ? <Route path="/a_path" element={<ARoute />} /> : null}
                    <Route path="/another_path" element={<AnotherRoute />} />
                </CustomRoutes>
            </>
        )}
    </Admin>
)
```

## All CRUD Views

### No More Prop Injection In Page Components

Page components (`<List>`, `<Show>`, etc.) used to expect to receive props (route parameters, permissions, resource name). These components don't receive any props anymore by default. They use hooks to get the props they need from contexts or route state.  

```diff
-const PostShow = (props) => (
+const PostShow = () => (
-   <Show {...props}>
+   <Show>
        <SimpleShowLayout>
            <TextField source="title" />
        </SimpleShowLayout>
    </Show>
);
```

If you need to access the permissions previously passed as props, you need to call the `usePermissions` hook instead.

```diff
+import { usePermissions } from 'react-admin';

-const PostShow = ({ permissions, ...props }) => {
+const PostShow = () => {
+   const permissions = usePermissions();
    return (
-       <Show {...props}>
+       <Show>
            <SimpleShowLayout>
                <TextField source="title" />
                {permissions === 'admin' &&
                    <NumberField source="nb_views" />
                }
            </SimpleShowLayout>
        </Show>
    );
};
```

If you need to access the `hasList` and other flags related to resource configuration, use the `useResourceConfiguration` hook instead.

```diff
+const { useResourceDefinition } from 'react-admin';

-const PostShow = ({ hasEdit, ...props }) => {
+const PostShow = () => {
+   const { hasEdit } = useResourceDefinition();
    return (
        <Show actions={hasEdit ? <ShowActions /> : null}>
            <SimpleShowLayout>
                <TextField source="title" />
            </SimpleShowLayout>
        </Show>
    );
};
```

If you need to access a route parameter, use react-router's `useParams` hook instead.

```diff
+import { useParams } from 'react-router-dom';

-const PostShow = ({ id, ...props }) => {
+const PostShow = () => {
+   const { id } = useParams();
    return (
        <Show title={`Post #${id}`}>
            <SimpleShowLayout>
                <TextField source="title" />
            </SimpleShowLayout>
        </Show>
    );
};
```

We used to inject a `syncWithLocation` prop set to `true` to the `<List>` components used in a `<Resource>`. This instructed the `<List>` to synchronize its parameters (such as pagination, sorting and filters) with the browser location.

As we removed the props injection, we enabled this synchronization by default for all `<List>`, used in a `<Resource>` or not. As a consequence, we also inverted this prop and renamed it `disableSyncWithLocation`. This doesn't change anything if you only used `<List>` components inside `<Resource list>`. 

However, if you had multiple `<List>` components inside used a single page, or if you used `<List>` outside of a `<Resource>`, you now have to explicitly opt out the synchronization of the list parameters with the browser location:

```diff
const MyList = () => (
-    <List>
+    <List disableSyncWithLocation>
        // ...
    </List>
)
```

### Removed The `basePath` Prop

Many components received, or passed down, a prop named `basePath`. This was necessary to build internal routes that worked when react-admin was used under a sub-path. 

React-admin v4 now uses a context to keep the app basePath, so the `basePath` prop is no longer necessary. Every component that received it doesn't need it anymore. You can safely remove it from your code. 

```diff
-const PostEditActions = ({ basePath }) => (
+const PostEditActions = () => (
    <TopToolbar>
-       <ShowButton basePath={basePath} />
+       <ShowButton />
        {/* Add your custom actions */}
        <Button color="primary" onClick={customAction}>Custom Action</Button>
    </TopToolbar>
);
```

Keeping the `basePath` prop may result in unrecognized DOM props warnings, but your app will still work flawlessly even if you don't remove them. If you're using TypeScript, your code will not compile unless you remove all the `basePath` props.

When a function (not a component) received the `basePath` as argument, it now receives the `resource` instead. For instance, the `<Datagrid rowClick>` prop used to accept a function:

```diff
-   <Datagrid rowClick={(id, basePath, record) => {/* ... */}}>
+   <Datagrid rowClick={(id, resource, record) => {/* ... */}}>
```

In most cases, the injected `basePath` was the `resource` with a leading slash (e.g. basename: `/posts`, resource: `posts`).


### `onSuccess` And `onFailure` Props Have Moved

If you need to override the success or failure side effects of a component, you now have to use the `queryOptions` (for query side effects) or `mutationOptions` (for mutation side effects).

For instance, here is how to override the side effects for the `getOne` query in a `<Show>` component: 

{% raw %}
```diff
const PostShow = () => {
    const onSuccess = () => {
        // do something
    };
    const onFailure = () => {
        // do something
    };
    return (
        <Show 
-           onSuccess={onSuccess}
-           onFailure={onFailure}
+           queryOptions={{
+               onSuccess: onSuccess,
+               onError: onFailure
+           }}
        >
            <SimpleShowLayout>
                <TextField source="title" />
            </SimpleShowLayout>
        </Show>
    );
};
```
{% endraw %}

Here is how to customize side effects on the `update` mutation in `<Edit>`:

{% raw %}
```diff
const PostEdit = () => {
    const onSuccess = () => {
        // do something
    };
    const onFailure = () => {
        // do something
    };
    return (
        <Edit 
-           onSuccess={onSuccess}
-           onFailure={onFailure}
+           mutationOptions={{
+               onSuccess: onSuccess,
+               onError: onFailure
+           }}
        >
            <SimpleForm>
                <TextInput source="title" />
            </SimpleForm>
        </Show>
    );
};
```
{% endraw %}

Here is how to customize side effects on the `create` mutation in `<Create>`:

{% raw %}
```diff
const PostCreate = () => {
    const onSuccess = () => {
        // do something
    };
    const onFailure = () => {
        // do something
    };
    return (
        <Create 
-           onSuccess={onSuccess}
-           onFailure={onFailure}
+           mutationOptions={{
+               onSuccess: onSuccess,
+               onError: onFailure
+           }}
        >
            <SimpleForm>
                <TextInput source="title" />
            </SimpleForm>
        </Create>
    );
};
```
{% endraw %}

Note that the `onFailure` prop was renamed to `onError` in the options, to match the react-query convention.

**Tip**: `<Edit>` also has a `queryOption` prop allowing you to specify custom success and error side effects for the `getOne` query.

The change concerns the following components:

- `useCreateController`
- `<Create>`
- `<CreateBase>`
- `useEditController`
- `<Edit>`
- `<EditBase>`
- `<SaveButton>`
- `useShowController`
- `<Show>`
- `<ShowBase>`
- `useDeleteWithUndoController`
- `useDeleteWithConfirmController`
- `<DeleteButton>`
- `<BulkDeleteButton>`

It also affects the `save` callback returned by the `useSaveContext` hook:

```diff
const MyButton = () => {
    const { save, saving } = useSaveContext();
    const notify = useNotify();

    const handleClick = () => {
        save({ value: 123 }, {
-            onFailure: (error) => {
+            onError: (error) => {
                notify(error.message, { type: 'error' });
            },
        });
    };

    return <button onClick={handleClick}>Save</button>
}
```

### `onSuccess` Callback On DataProvider Hooks And Components Has A New Signature

The `onSuccess` callback used to receive the *response* from the dataProvider. On specialized hooks, it now receives the `data` property of the response instead. 

```diff
const [update] = useUpdate();
const handleClick = () => {
    update(
        'posts',
        { id: 123, data: { likes: 12 } },
        {
-           onSuccess: ({ data }) => {
+           onSuccess: (data) => {
                // do something with data
            }
        }
    );
};
```

The change concerns the following components:

- `useCreate`
- `useCreateController`
- `<Create>`
- `<CreateBase>`
- `useUpdate`
- `useEditController`
- `<Edit>`
- `<EditBase>`
- `<SaveButton>`
- `useGetOne`
- `useShowController`
- `<Show>`
- `<ShowBase>`
- `useDelete`
- `useDeleteWithUndoController`
- `useDeleteWithConfirmController`
- `<DeleteButton>`
- `useDeleteMany`
- `<BulkDeleteButton>`

## List Views

### List `ids` Prop And `RecordMap` Type Are Gone

Contrary to `dataProvider.getList`, `useGetList` used to return data under the shape of a record map. This is no longer the case: `useGetList` returns an array of records. 

So the `RecordMap` type is no longer necessary and was removed. TypeScript compilation will fail if you continue using it. You should update your code so that it works with an array of records instead.

```diff
-import { useGetList, RecordMap } from 'react-admin';
+import { useGetList, RaRecord } from 'react-admin';

const PostListContainer = () => {
-   const { data, ids, loading } = useGetList(
-      'posts',
-      { page: 1, perPage: 10 },
-      { field: 'published_at', order: 'DESC' },
-   );
-   return loading ? null: <PostListDetail data={data} ids={ids} />
+   const { data, isLoading } = useGetList(
+      'posts',
+      {
+         pagination: { page: 1, perPage: 10 },
+         sort: { field: 'published_at', order: 'DESC' },
+      }
+   );
+   return isLoading ? null: <PostListDetail data={data} />
};

-const PostListDetail = ({ ids, data }: { ids: string[], data: RecordMap }) => {
+const PostListDetail = ({ data }: { data: RaRecord[] }) => {
-   return <>{ids.map(id => <span key={id}>{data[id].title}</span>)}</>;
+   return <>{data.map(record => <span key={record.id}>{record.title}</span>)}</>;
};
```

### `useListContext` No Longer Returns An `ids` Prop

The `ListContext` used to return two props for the list data: `data` and `ids`. To render the list data, you had to iterate over the `ids`. 

Starting with react-admin v4, `useListContext` only returns a `data` prop, and it is now an array. This means you have to update all your code that relies on `ids` from a `ListContext`. Here is an example for a custom list iterator using cards:

{% raw %}
```diff
import * as React from 'react';
import { useListContext, List, TextField, DateField, ReferenceField, EditButton } from 'react-admin';
import { Card, CardActions, CardContent, CardHeader, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const CommentGrid = () => {
-   const { data, ids, loading } = useListContext();
+   const { data, isLoading } = useListContext();
-   if (loading) return null;
+   if (isLoading) return null;
    return (
        <div style={{ margin: '1em' }}>
-       {ids.map(id =>
+       {data.map(record =>
-           <Card key={id} style={cardStyle}>
+           <Card key={record.id} style={cardStyle}>
                <CardHeader
-                   title={<TextField record={data[id]} source="author.name" />}
+                   title={<TextField record={record} source="author.name" />}
-                   subheader={<DateField record={data[id]} source="created_at" />}
+                   subheader={<DateField record={record} source="created_at" />}
                    avatar={<Avatar icon={<PersonIcon />} />}
                />
                <CardContent>
-                   <TextField record={data[id]} source="body" />
+                   <TextField record={record} source="body" />
                </CardContent>
                <CardActions style={{ textAlign: 'right' }}>
-                   <EditButton resource="posts" record={data[id]} />
+                   <EditButton resource="posts" record={record} />
                </CardActions>
            </Card>
        )}
        </div>
    );
};
```
{% endraw %}

### List `bulkActionButtons` Prop Moved To Datagrid

The `Datagrid` is now responsible for managing the bulk actions component.

```diff
import { List, Datagrid } from 'react-admin'; 

const PostList = () => (
-    <List bulkActionButtons={<PostBulkActionButtons />}>
+    <List>
-        <Datagrid>
+        <Datagrid bulkActionButtons={<PostBulkActionButtons />}>        
            ...
        </Datagrid>
    </List>
);
```

### Datagrid `hasBulkActions` Prop Has Been Removed 

As a consequence of moving `bulkActionButtons` prop from `List` to `Datagrid`, `hasBulkActions` prop is now handled internaly by the `Datagrid` component, but it is still being passed down to its header and body components.
Just set `Datagrid`'s `bulkActionButtons` to `false` to have the same behavior.

```diff
import { List, Datagrid } from 'react-admin'; 

const PostList = () => (
    <List>
-        <Datagrid hasBulkActions={false}>
+        <Datagrid bulkActionButtons={false}>        
            ...
        </Datagrid>
    </List>
);
```

### `currentSort` Renamed To `sort`

If one of your components displays the current sort order, it probably uses the injected `currentSort` prop (or reads it from the `ListContext`). This prop has been renamed to `sort` in v4.

Upgrade your code by replacing `currentSort` with `sort`:

{% raw %}
```diff
import { useListContext } from 'react-admin';

const BookListIterator = () => {
-    const { data, loading, currentSort } = useListContext();
+    const { data, isLoading, sort } = useListContext();

    if (loading) return <Loading />;
    if (data.length === 0) return <p>No data</p>;

    return (<>
-       <div>Books sorted by {currentSort.field}</div>
+       <div>Books sorted by {sort.field}</div>
        <ul>
            {data.map(book =>
                <li key={book.id}>{book.title}</li>
            )}
        </ul>
    </>);
};
```
{% endraw %}

The same happens for `<Datagrid>`: when used in standalone, it used to accept a `currentSort` prop, but now it only accepts a `sort` prop.

{% raw %}
```diff
-<Datagrid data={data} currentSort={{ field: 'id', order: 'DESC' }}>
+<Datagrid data={data} sort={{ field: 'id', order: 'DESC' }}>
    <TextField source="id" />
    <TextField source="title" />
    <TextField source="author" />
    <TextField source="year" />
</Datagrid>
```
{% endraw %}

### `setSort()` Signature Changed

Some react-admin components have access to a `setSort()` callback to sort the current list of items. This callback is also present in the `ListContext`. Its signature has changed:

```diff
-setSort(field: string, order: 'ASC' | 'DESC');
+setSort({ field: string, order: 'ASC' | 'DESC' });
```

This impacts your code if you built a custom sort component:

```diff
const SortButton = () => {
    const { sort, setSort } = useListContext();
    const handleChangeSort = (event) => {
        const field = event.currentTarget.dataset.sort;
-       setSort(
-           field,
-           field === sort.field ? inverseOrder(sort.order) : 'ASC',
-       });
+       setSort({
+           field,
+           order: field === sort.field ? inverseOrder(sort.order) : 'ASC',
+       });
        setAnchorEl(null);
    };

    // ...
};
```


### No More props injection in custom Pagination and Empty components

The `<List>` component renders a Pagination component when there are records to display, and an Empty component otherwise. You can customize these components by passing your own with the `pagination` and `empty`props. 

`<List>` used to inject `ListContext` props (`data`, `isLoaded`, etc.) to the Pagination component. In v4, the component rendered by `<List>` no longer receive these props. They must grab them from the ListContext instead.

This means you'll have to do a few changes if you use a custom Pagination component in a List:

```diff
import { Button, Toolbar } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
+import { useListContext } from 'react-admin';

-const PostPagination = (props) => {
+const PostPagination = () => {
-   const { page, perPage, total, setPage } = props;
+   const { page, perPage, total, setPage } = useListContext();
    const nbPages = Math.ceil(total / perPage) || 1;
    return (
        nbPages > 1 &&
            <Toolbar>
                {page > 1 &&
                    <Button color="primary" key="prev" onClick={() => setPage(page - 1)}>
                        <ChevronLeft />
                        Prev
                    </Button>
                }
                {page !== nbPages &&
                    <Button color="primary" key="next" onClick={() => setPage(page + 1)}>
                        Next
                        <ChevronRight />
                    </Button>
                }
            </Toolbar>
    );
}

export const PostList = () => (
    <List pagination={<PostPagination />}>
        ...
    </List>
);
```

### `useGetMainList` Was Removed

`useGetMainList` was a modified version of `useGetList` designed to keep previous data on screen upon navigation. As [this is now supported natively by react-query](https://react-query-v3.tanstack.com/guides/paginated-queries#better-paginated-queries-with-keeppreviousdata), this hook is no longer necessary and has been removed. Use `useGetList()` instead.

### `useUnselectAll` Syntax Changed

You must now pass the resource name when calling the hook:

```diff
import { useUnselectAll } from 'react-admin';

const UnselectAllButton = () => {
-   const unselectAll = useUnselectAll();
+   const unselectAll = useUnselectAll('posts');
    const handleClick = () => {
-       unselectAll('posts');
+       unselectAll();
    }
    return <button onClick={handleClick}>Unselect all</button>;
};
```

## Forms

`react-final-form` has been replaced by `react-hook-form`.

### `initialValues` Is Now `defaultValues`

`<FormWithRedirect>` used to accept [`react-final-form` `<Form>` props](https://final-form.org/docs/react-final-form/types/FormProps). It now accepts [`react-hook-form` `useForm` props](https://react-hook-form.com/docs/useform). This also affects the other form components (`<SimpleForm>`, `<TabbedForm>`, etc.)

The most commonly used prop is probably `initialValues`, which is now named `defaultValues`:

{% raw %}
```diff
const PostCreate = () => (
    <Create>
        <SimpleForm
-            initialValues={{ title: 'A default title' }}
+            defaultValues={{ title: 'A default title' }}
        >
            ...
        </SimpleForm>
    </Create>
)
```
{% endraw %}

We kept the `validate` function prop, which we automatically translate to a custom [`react-hook-form` `resolver`](https://react-hook-form.com/docs/useform#validationResolver). So even if it's not technically a react-hook-form prop, you can still use `validate` as before.

This also means you can now use [`yup`](https://github.com/jquense/yup), [`zod`](https://github.com/colinhacks/zod), [`joi`](https://github.com/sideway/joi), [superstruct](https://github.com/ianstormtaylor/superstruct), [vest](https://github.com/ealush/vest) or any [resolver](https://react-hook-form.com/docs/useform#validationResolver) supported by `react-hook-form` to apply schema validation.

### Input-Level Validation Now Triggers on Submit

With `react-hook-form`, the default mode for form validation is 'onSubmit'. This means the validation errors only appear once the user submits the form. If you want to have input level validation triggered before submission (e.g. on blur), you can try a different [validation strategy](https://react-hook-form.com/docs/useform/) by passing a `mode` prop to the form:

```jsx
// This will trigger input validation onBlur
<SimpleForm mode="onBlur">
    <TextInput source="name" validate={maxLength(3)} />
</SimpleForm>
```

### Validation: Form Level & Input Level Are Mutually Exclusive

With `react-hook-form`, you can't have both form level validation and input level validation. This is because form level validation is meant to be used for [schema based validation](https://react-hook-form.com/docs/useform#validationResolver).

If you used form level validation to run complex checks for multiple input values combinations, you can use a schema library such as [yup](https://github.com/jquense/yup):

```diff
import { BooleanInput, NumberInput, SimpleForm } from 'react-admin';
+import { yupResolver } from '@hookform/resolvers/yup';
-const validateForm = values => {
-    if (values.isBig && values.count < 6) {
-        return {
-            count: 'Must be greater than 5'
-        }
-    }
-
-    if (values.count < 0) {
-        return {
-            count: 'Must be greater than 0'
-        }
-    }
-}
+const schema = object({
+  isBig: boolean(),
+  count: number().when('isBig', {
+    is: true,
+    then: (schema) => schema.min(5),
+    otherwise: (schema) => schema.min(0),
+  }),
+});

const MyForm = () => (
    <SimpleForm
-        validate={validateForm}
+        resolver={yupResolver(schema)}
    >
        <BooleanInput source="isBig" />
        <NumberInput source="count" />
    </SimpleForm>
)
```

### `<SimpleForm>` and `<TabbedForm>` No Longer Accept `margin` and `variant`

Just like Material UI, we don't provide a way to specify those props at the form level. Instead, you can either set those props on the inputs or leverage the Material UI [component overrides through theme](https://mui.com/material-ui/customization/theme-components/) if you need to change them globally:

```diff
const PostCreate = () => (
    <Create>
-        <SimpleForm margin="normal" variant="outlined">
+        <SimpleForm>
-            <TextInput source="title" />
+            <TextInput source="title" margin="normal" variant="outlined" />
        </SimpleForm>
    </Create>
)
```

You have several options when leveraging the [theme component overrides](https://mui.com/material-ui/customization/theme-components/):

- Provide your own default props for Material UI components such as the `TextField`:
```js
const myTheme = {
    components: {
        // Name of the component
        MuiTextField: {
            defaultProps: {
                margin: 'normal',
                variant: 'outlined',
            },
        },
    },
}
```

- Provide your own default props for react-admin components such as the `TextInput`:
```js
const myTheme = {
    components: {
        // Name of the component
        RaTextInput: {
            defaultProps: {
                margin: 'normal',
                variant: 'outlined',
            },
        },
    },
}
```

### No More Props Injection In `<SimpleForm>`, `<TabbedForm>` and `<FilterForm>`

The form components used to clone their children, inspect their props to handle labels and inject the `margin` and `variant` props.

This is no longer the case and makes custom layout easier.


### `<SimpleForm>` and `<TabbedForm>` No Longer Clone Their Children

This makes custom layouts easier as you don't need to worry about passing props through your intermediate components anymore:

```diff
-const LineWrapper = ({ children, ...props }) => (
-    <div style="display: flex">
-        {Children.map(children, child => cloneElement(child, { ...props, ...child.props }))}
-    </div>
-)

const PostCreate = () => (
    <Create>
        <SimpleForm>
-            <LineWrapper>
+            <div style="display: flex">
                 <TextInput source="title" />
-            </LineWrapper>
+            </div>
        </SimpleForm>
    </Create>
)
```

### Field components must be wrapped with `<Labeled>` in `<SimpleForm>`

Field components don't have a label by default anymore and must be wrapped with `<Labeled>` when used within a `<SimpleForm>`.

```diff
const PostEdit = () => (
    <Edit>
        <SimpleForm>
	    <TextInput source="title">
-	    <ReferenceField source="author_id" reference="users">
-	        <TextField source="username" />
-	    </ReferenceField>
+           <Labeled label="Author">
+	        <ReferenceField source="author_id" reference="users">
+	            <TextField source="username" />
+	        </ReferenceField>
+           </Labeled>
        </SimpleForm>
    </Edit>
)
```

### `<SimpleFormIterator>` Does Not Accept the `TransitionProps` prop anymore

Transitions were causing a lot of issues so we had to remove them for now, until we find a good solution.

{% raw %}
```diff
import { ArrayInput, SimpleFormIterator, TextInput } from 'react-admin';

<ArrayInput source="backlinks">
-    <SimpleFormIterator TransitionProps={{ timeout: 400 }}>
+    <SimpleFormIterator>
        <TextInput source="title" />
    </SimpleFormIterator>
</ArrayInput>
```
{% endraw %}

### `<FormWithRedirect>` Has Been Renamed to `<Form>`

The form components don't handle redirection anymore, as redirections are now handled in side effects (`<Create mutationOptions>` and `<Edit mutationOptions>`). As a consequence, the `<FormWithRedirect>` has been renamed to `<Form>`.

To upgrade, replace all occurrences of `<FormWithRedirect>` with  `<Form>`.

Also, the `render` prop has been removed, and the form content is now passed as child of the `<Form>` element.

```diff
- import { FormWithRedirect } from 'react-admin';
+ import { Form } from 'react-admin';

export const MyForm = () => (
+    <Form>
-    <FormWithRedirect
-        render={({handleSubmit}) => (
-            <form onSubmit={handleSubmit}>
                 <input type="text" id="name" name="name" />
                 <button type="submit">Save</button>
-            </form>
-        )}
-    />
+    </Form>
);
```

If you need to access the form state (`valid`, `invalid`, `pristine`, `dirty`), you can call [the react-hook-form `useFormState` hook](https://react-hook-form.com/docs/useformstate) instead:

```diff
import { FormWithRedirect } from 'react-admin';
+ import { Form } from 'react-admin';
+ import { useFormState } from 'react-hook-form';

const MyCustomForm = () => {
    return (
-        <FormWithRedirect
+        <Form>
-            render={({ valid, dirty, handleSubmit }) => (
-               <form onSubmit={handleSubmit}>
                    ...
-                    <SubmitButton disabled={!dirty || !valid}>Save</SubmitButton>
+                    <SubmitButton>Save</SubmitButton>
-               </form>
            )}
-       />
+       </Form>
    );
};

-const SubmitButton = ({ disabled, ...props }) => {
+const SubmitButton = (props) => {
+    const { isDirty, isValid } = useFormState();
    return (
-        <button disabled={disabled} {...props} />
+        <button disabled={!isDirty || !isValid} {...props} />
    );
}
```

**Reminder:** [react-hook-form's `formState` is wrapped with a Proxy](https://react-hook-form.com/docs/useformstate/#rules) to improve render performance and skip extra computation if specific state is not subscribed. So, make sure you deconstruct or read the `formState` before render in order to enable the subscription.

```js
const { isDirty } = useFormState(); // ✅
const formState = useFormState(); // ❌ should deconstruct the formState      
```

### `sanitizeEmptyValues` Works the Other Way Around

React-hook-form doesn't remove empty values like react-final-fom did. Therefore, if you opted out of this behavior with `sanitizeEmptyValues={false}`, you no longer need that prop:

```diff
export const PostEdit = () => (
    <Edit>
-       <SimpleForm sanitizeEmptyValues={false}>
+       <SimpleForm>
            <TextInput source="title" />
            <JsonInput source="body" />
        </SimpleForm>
    </Edit>
);
```

If you actually need to remove empty values, you have to set the `sanitizeEmptyValues` prop explicitly:

```diff
export const PostEdit = () => (
    <Edit>
-       <SimpleForm>
+       <SimpleForm sanitizeEmptyValues>
            <TextInput source="title" />
            <JsonInput source="body" />
        </SimpleForm>
    </Edit>
);
```

If this sanitization strategy doesn't suit your needs, you can use the `transform` prop on the `<Create>`, `<Edit>`, or `<SaveButton>` components.

### `useFormGroup` Hook Returned State Has Changed

The `useFormGroup` hook used to return the form group state props (`dirty`, `invalid`, `pristine`, `touched`, `valid` and `errors`). They don't exist in `react-hook-form` so now it will return `isDirty`, `isValid`, `isTouched` and `errors`:

```diff
const AccordionSectionTitle = ({ children, name }) => {
    const formGroupState = useFormGroup(name);

    return (
-      <Typography color={formGroupState.invalid && formGroupState.dirty ? 'error' : 'inherit'}>
+      <Typography color={!formGroupState.isValid && formGroupState.isDirty ? 'error' : 'inherit'}>
          {children}
      </Typography>
    );
}
```

### `<Toolbar>` Props Have Changed

The `<Toolbar>` component used to receive the form state props (`dirty`, `invalid`, `pristine` and `valid`). They don't exist in `react-hook-form` and you can get the form state with its `useFormState` hook:

```diff
import Toolbar from '@mui/material/Toolbar';
import { SaveButton, ToolbarProps } from 'react-admin';
+import { useFormState } from 'react-hook-form';

const ReviewEditToolbar = (props: ToolbarProps<Review>) => {
-    const { invalid, resource, saving } = props;
+    const { resource, saving } = props;
+    const { isValid } = useFormState();

    return (
        <Toolbar>
            <SaveButton
-               invalid={invalid}
+               invalid={!isValid}
                saving={saving}
            />
        </Toolbar>
    );
};
```

**Reminder:** [react-hook-form's `formState` is wrapped with a Proxy](https://react-hook-form.com/docs/useformstate/#rules) to improve render performance and skip extra computation if specific state is not subscribed. So, make sure you deconstruct or read the `formState` before render in order to enable the subscription.

```js
const { isDirty } = useFormState(); // ✅
const formState = useFormState(); // ❌ should deconstruct the formState      
```

### `<Toolbar>`'s `alwaysEnableSaveButton` Prop Has Been Removed

This prop has been replaced by `<SaveButton>`'s `alwaysEnable` with the same logic.

```diff
import { Toolbar, SaveButton } from 'react-admin';

const EditToolbar = props => (
-    <Toolbar {...props} alwaysEnableSaveButton />
+    <Toolbar {...props}>
+        <SaveButton alwaysEnable />
+    </Toolbar>
);
```

### `submitOnEnter` Prop Has Been Removed

The following components no longer accept this prop:

- `<SimpleForm>`
- `<TabbedForm>`
- `<Toolbar>`
- `<SaveButton>`

By default, `<SimpleForm>` and `<TabbedForm>` submit when the user presses `Enter`. To disable this behavior, you must now turn the `<SaveButton>` (which renders as a `<input type="submit" />` by default) into an `<input type="button">` element, by setting the `type` prop to "button".

If you didn't have a custom form toolbar, you'll have to create one to set the `<SaveButton type="button" />` and prevent submission on enter. 
 
```diff
import { Toolbar, SimpleForm, Edit, TextInput, SaveButton, DeleteButton } from 'react-admin';

+const MyToolbar = props => (
+   <Toolbar {...props}> 
+       <SaveButton type="button" />
+       <DeleteButton />
+   </Toolbar>
+);

export const PostEdit = () => (
    <Edit>
-       <SimpleForm submitOnEnter>
+       <SimpleForm toolbar={<MyToolbar/>}>
            <TextInput source="title" />
        </SimpleForm>
    </Edit>
);
```

The `<Toolbar>` component used to receive the `width` prop also, that allowed to display the mobile or desktop version depending on its value. This is handled internally in version 4 and you can safely remove this prop.

```diff
import { Toolbar } from 'react-admin';

const MyToolbar = () => {
    return (
-       <Toolbar width="xs"/>
+       <Toolbar />
    );
};
```

## Custom Forms

We previously had a complex solution for having multiple submit buttons: a `SaveContext` providing side effects modifiers and refs to the current ones. However, this was redundant and confusing as the `save` function provided by our mutation hooks also accept side effect override at call time.

We also supported a redirect prop both on the form component and on the `<SaveButton>`. It was even more confusing when adding custom or multiple `<SaveButton>` as those received two submission related functions: `handleSubmit` and `handleSubmitWithRedirect`.

Besides, our solution prevented the native browser submit on enter feature and this was an accessibility issue for some users such as Japanese people.

The new solution leverage the fact that we already have the `save` function available through context (`useSaveContext`). The following  sections explain in details the necessary changes and how to upgrade if needed.

### Common Patterns To Access Form State And Values Have Changed

If you used to rely on `react-final-form` hooks and components such as `useForm`, `useFormState` or `<FormSpy>`, you must replace them with their `react-hook-form` equivalent.

For instance, if you used `useFormState` in a component to show something depending on another form value, use `useWatch` instead:

```diff
-import { useFormState } from 'react-final-form';
+import { useWatch } from 'react-hook-form';

const CityInput = props => {
-    const { values } = useFormState();
+    const country = useWatch({ name: 'country' });
    return (
        <SelectInput
-            choices={values.country ? toChoices(cities[values.country]) : []}
+            choices={country ? toChoices(cities[country]) : []}
            {...props}
        />
    );
};
```

If you used `<FormSpy>`:

{% raw %}
```diff
-import { FormSpy } from 'react-final-form';
+import { useWatch } from 'react-hook-form';

const CityInput = props => {
+    const country = useWatch({ name: 'country' });
    return (
-        <FormSpy subscription={{ values: true }}>
-            {({ values }) => (
-                <SelectInput
-                    choices={values.country ? toChoices(cities[values.country]) : []}
-                    {...props}
-                />
-            )}
-        </FormSpy>
+        <SelectInput
+             choices={country ? toChoices(cities[country]) : []}
+             {...props}
+        />
    );
};
```
{% endraw %}

If you had a component setting a form value imperatively via `useForm`, you should use `useFormContext`:

```diff
-import { useForm } from 'react-final-form';
+import { useFormContext } from 'react-hook-form';

const ClearCountry = () => {
-    const { change } = useForm();
+    const { setValue } = useFormContext();

    const handleClick = () => {
-        change('country', '');
+        setValue('country', '');
    };

    return <button onClick={handleClick}>Clear country</button>
}
```

If you called `useForm` to access the form API, you should now call `useFormContext`:

```diff
-import { useForm } from 'react-final-form';
+import { useFormContext } from 'react-hook-form';

const ResetFormButton = () => {
-    const { reset } = useForm();
+    const { reset } = useFormContext();
    return <Button onClick={() => reset()}>Reset</Button>
}
```

### `handleSubmitWithRedirect` No Longer Exist

If you had custom forms using `<FormWithRedirect>`, custom toolbars or buttons, you probably relied on either the `handleSubmit` or `handleSubmitWithRedirect` prop to submit your form (and wonder which one to use).

We now embrace the native behavior of html forms and their buttons. Any button with `type="submit"` will call `handleSubmit`, while buttons with `type="button"` won't:

```diff
const MyForm = () => {
    return (
        <Create>
-           <FormWithRedirect
+           <Form>
-                render={formProps) => (
                         <TextInput source="name" />
-                        <MySaveButton handleSubmit={handleSubmit}>
+                        <MySaveButton />
-                )}
-           />
+           </Form>
        </Create>
    );
};

-const MySaveButton = ({ handleSubmit }) => (
+const MySaveButton = () => (
-    <button onClick={handleSubmit}>Save</button>
+    <button type="submit">Save</button>
);
```

If you relied on the `handleSubmitWithRedirect` to change the redirection:

```diff
const MyForm = () => {
    return (
-        <Create>
+        <Create redirect="show">
-            <FormWithRedirect
+            <Form>
-                render={({ handleSubmitWithRedirect, ...formProps }) => (
                         <TextInput source="name" />
-                        <MySaveButton handleSubmitWithRedirect={handleSubmitWithRedirect}>
+                        <MySaveButton />
-                )}
-            />
+            </Form>
        </Create>
    );
};

-const MySaveButton = ({ handleSubmitWithRedirect }) => (
+const MySaveButton = () => {
    return (
-        <button onClick={() => handleSubmitWithRedirect('show')}>Save</button>
+        <button type="submit">Save</button>
    );
);
```

You can also use a function to handle the redirection target, as described in [the redirection after submission documentation](./EditTutorial.md#redirection-after-submission).

### `<SaveButton>` Accepts `mutationOptions` Instead of `onSuccess` and `onFailure`

The `<SaveButton>` used to accept the `onSuccess`, `onFailure` and `transform` props to handle multiple submit buttons.

Just like the `Edit` and `Create` components, it now accepts a `mutationOptions` prop which may contain an `onSuccess` and/or `onError` function. It still accepts a `transform` prop though.

{% raw %}
```diff
const Toolbar = (props) => {
    return (
        <Toolbar>
            <SaveButton
-                onSuccess={handleSuccess}
-                onFailure={handleFailure}
+                mutationOptions={{ onSuccess: handleSuccess, onError: handleFailure }}
            />
        </Toolbar>
    );
}
```
{% endraw %}

We removed the `handleSubmit` and `handleSubmitWithRedirect` props completely. Instead, when provided any of the side effects props, the `<SaveButton>` will render a simple button and will call the `save` function with them. It also takes care of preventing the default form submit.

If you relied on `handleSubmit` or `handleSubmitWithRedirect`, you can now use the `SaveButton` and override any of the side effect props: `onSuccess`, `onFailure` or `transform`.

### The `save` Function Signature Changed

The `save` function signature no longer takes a redirection side effect as the second argument. Instead, it only receives the data and an options object for side effects (which was the third argument before):

```diff
const MyCustomCreate = () => {
    const createControllerProps = useCreateController();
    const notify = useNotify();
+   const redirect = useRedirect();

    const handleSubmit = (values) => {
-        createControllerProps.save(values, 'show', {
+        createControllerProps.save(values, {
            onSuccess: (data) => {
                notify('Success');
+               redirect('show', '/posts', data.id);
            }
        })
    }

    return (
        <CreateContextProvider value={createControllerProps}>
            <Form onSubmit={handleSubmit}>
               ...
            </Form>
        </CreateContextProvider>
    )
}
```

### `<FormContext>`, `<FormContextProvider>` and `useFormContext` Have Been Removed

These changes only concern you if you had custom forms not built with `<FormWithRedirect>`, or custom components relying on the form groups management (accordions or collapsible sections for instance).

As the `save` and `saving` properties are already available through the `<SaveContext>` component and its `useSaveContext` hook, we removed the `<FormContext>`, `<FormContextProvider>` components as well the `useFormContext` hook. The functions around form groups management have been extracted into the `<FormGroupsProvider>` component:

```diff
const CustomForm = ({ save, ...props }) => {
-    const formContext = {
-        save,
-        saving,
-        ...form group management functions
-    }
    return (
        <Form
            {...props}
            onSubmit={save}
        >
-           <FormContextProvider value={formContext}>
+           <FormGroupsProvider>
                ...
-           </FormContextProvider>
+           </FormGroupsProvider>
            )}
        </Form>
    );
};
```

### The `redirect` prop Has Been Removed From Form Components

The `<FormWithRedirect>`, `<SimpleForm>`, `<TabbedForm>` and `<SaveButton>` don't have a `redirect` prop anymore.

If you had the `redirect` prop set on the form component, move it to `Create` or `Edit` component:

```diff
-<Create>
+<Create redirect="edit">
-    <SimpleForm redirect="edit">
+    <SimpleForm>
        <TextInput source="name">
    </SimpleForm>
</Create>
```

If you had the `redirect` prop set on the `SaveButton`, provide a `onSuccess` prop:

```diff
const PostCreateToolbar = props => {
+   const notify = useNotify();
+   const redirect = useRedirect();
    return (
        <Toolbar {...props}>
            <SaveButton
                label="post.action.save_and_edit"
-               redirect="edit"
+               onSuccess={data => {
+                   notify('ra.notification.updated', {
+                       type: 'info',
+                       messageArgs: { smart_count: 1 },
+                       undoable: true,
+                   });
+                   redirect('edit', '/posts', data.id)
+               }}
            />
        </Toolbar>
    );
};
```

### The Form Components `save` Prop Has Been Renamed to `onSubmit`

This change only matters to you if you used the form components outside of `<Create>` or `<Edit>`.

```diff
const MyComponent = () => {
    const handleSave = () => {

    }

    return (
-        <SimpleForm save={handleSave}>
+        <SimpleForm onSubmit={handleSave}>
            <TextInput source="name" />
        </SimpleForm>
    )
};
```

## Fields

### The `record` Prop Is No Longer Injected

The List and Show components that took Field as children (e.g. `<Datagrid>`, `<SimpleShowLayout>`) used to clone these children a and to inject the current `record` as prop. This is no longer the case, and Field components have to "pull" the record using `useRecordContext` instead. 

All the react-admin Field components have been updated to use the `useRecordContext` hook. But you will need to update your custom fields:

```diff
+import { useRecordContext } from 'react-admin';

-const MyField = ({ record }) => {
+const MyField = () => {
+   const record = useRecordContext();
    return <div>{record ? record.title : ''}</div>;
}

const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="author" />
            <MyField />
        </Datagrid>
    </List>
);
```

The same goes for other components that used to receive the `record` prop, like e.g. aside components:

```diff
-const Aside = ({ record }) => (
+const Aside = () => {
+   const record = useRecordContext();
    return (
        <div>
            <Typography variant="h6">Post details</Typography>
            {record && (
                <Typography variant="body2">
                    Creation date: {record.createdAt}
                </Typography>
            )}
        </div>
    );
};
```

**Tip**: If you're using TypeScript, you can specify the type of the record returned by the hook:

```tsx
const record = useRecordContext<Customer>();
// record is of type Customer
```

### No More Props Injection In `<ReferenceField>`

`<ReferenceField>` creates a `RecordContext` for the reference record, and this allows using any of react-admin's Field components. It also used to pass many props to the underlying component (including the current `record`), but this is no longer the case. If you need to access the `record` in a child of `<ReferenceField>`, you need to use the `useRecordContext` hook instead.

```diff
const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <ReferenceField source="author_id" reference="users">
                <NameField />
            </ReferenceField>
        </SimpleShowLayout>
    </Show>
);

-const NameField = ({ record }) => {
+const NameField = () => {
+   const { record } = useRecordContext();
    return <span>{record?.name}</span>;
};
```

### `addLabel` Prop No Longer Considered For Show Labelling 

`<SimpleShowLayout>` and `<TabbedShowLayout>` used to look for an `addLabel` prop to decide whether they needed to add a label or not. This relied on `defaultProps`, which will soon be removed from React. 

The Show layout components now render a label for their children as soon as they have a `source` or a `label` prop. If you don't want a field to have a label in the show view, pass the `label={false}` prop.

```jsx
const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            {/* this field will have a Label */}
            <TextField source="title" />
            {/* this one will also have a Label */}
            <TextField label="Author name" source="author" />
            {/* this field will not */}
            <TextField label={false} source="title" />
        </SimpleShowLayout>
    </Show>
);
```

As the `addLabel` prop is now ignored in fields and inputs, you can remove it from your custom fields and inputs:

```diff
const MyCustomField = () => (
    ... 
);
-MyCustomField.defaultProps = {
-    addLabel: true
-};
```

### `<ArrayField>` Does Not Accept a `fieldKey` Prop Anymore

The `ArrayField` component used to accept a `fieldKey` prop, allowing to specify a record property for use as a React key, enabling some performance improvements. Moving to react-query has made this workaround unnecessary and you can safely remove this prop:

```diff
-<ArrayField source="backlinks" fieldKey="uuid">
+<ArrayField source="backlinks">
    <Datagrid>
        <DateField source="date" />
        <UrlField source="url" />
    </Datagrid>
</ArrayField>
```


## Inputs

### `initalValue` and `defaultValue` Have Been Merged Into `defaultValue`

All React Admin inputs used to accept both a `initialValue` and a `defaultValue` prop and they had different meanings in `react-final-form`. With `react-hook-form` there's only `defaultValue`:

```diff
const PostCreate = () => (
    <Create>
        <SimpleForm>
-            <TextInput source="title" initialValue="A default">
+            <TextInput source="title" defaultValue="A default">
        </SimpleForm>
    </Create>
)
```

### Custom Form Inputs Must Use `useController` instead of `<Field>`

To interface a custom form input with `react-hook-form`, you must use the `useController` hook instead of `<Field>`.

```diff
-import { Field } from 'react-final-form';
+import { useController } from 'react-hook-form';

const LatLngInput = () => {
+   const input1 = useController({ name: 'position.lat' });
+   const input2 = useController({ name: 'position.lng' });
    
    return (
        <span>
-           <Field name="lat" component="input" type="number" placeholder="latitude" />
+           <input {...input1.field} type="number" placeholder="latitude" />
            &nbsp;
-           <Field name="lng" component="input" type="number" placeholder="longitude" />
+           <input {...input2.field} type="number" placeholder="longitude" />
        </span>
    );
);
export default LatLngInput;
```

### `useInput` Signature And Return Value Have Changed

Just like all inputs, `useInput` now only accept `defaultValue` and will ignore `initialValue`.

Besides, `useInput` used to return `final-form` properties such as `input` and `meta`. It now returns `field`, `fieldState` and `formState` (see https://react-hook-form.com/docs/usecontroller).

Note that the `error` returned by `fieldState` is not just a simple string anymore but an object with a `message` property.

```diff
import TextField from 'mui/material/TextField';
import { useInput, required } from 'react-admin';

const MyInput = ({ helperText, ...props }) => {
    const {
-       input,
+       field,
-       meta: { touched, error },
+       fieldState: { isTouched, invalid, error },
+       formState: { isSubmitted }
        isRequired
    } = useInput(props);

    return (
        <TextField
-           {...input}
+           {...field}
            label={props.label}
-           error={touched && !!error}
+           error={(isTouched || isSubmitted) && invalid}
-           helperText={touched && !!error ? error : helperText}
+           helperText={(isTouched || isSubmitted) && invalid ? error?.message : helperText}
            required={isRequired}
            {...rest}
        />
    );
};

const UserForm = () => (
    <SimpleForm>
-       <MyInput initialValue="John" />
+       <MyInput defaultValue="John" />
    </SimpleForm>
)
```

**Reminder:** [react-hook-form's `formState` is wrapped with a Proxy](https://react-hook-form.com/docs/useformstate/#rules) to improve render performance and skip extra computation if specific state is not subscribed. So, make sure you deconstruct or read the `formState` before render in order to enable the subscription.

```js
const { isDirty } = useFormState(); // ✅
const formState = useFormState(); // ❌ should deconstruct the formState      
```

### The `addLabel` prop Has Been Removed From All Inputs and Fields

Inputs and fields used to support an `addLabel` prop that instructed components such as the `<SimpleForm>` to decorate the input or the field with a label. This is no longer the case as inputs are now responsible for their label display and you must wrap fields inside a `<Labeled>` to add a label for them.

If you used the `addLabel` prop to hide inputs label by passing `false`, you can pass `false` to the `label` prop instead.

### `<AutocompleteInput>` and `<AutocompleteArrayInput>` Now Use Material UI Autocomplete

We migrated both the `AutocompleteInput` and `AutocompleteArrayInput` components so that they leverage Material UI [`<Autocomplete>`](https://mui.com/material-ui/react-autocomplete/). If you relied on [Downshift](https://www.downshift-js.com/) options, you'll have to update your component.

Besides, some props aren't available anymore:
- `allowDuplicates`: This is not supported by Material UI Autocomplete.
- `clearAlwaysVisible`: the clear button is now always visible, either while hovering the input or when it has focus. You can hide it using the `<Autocomplete>` `disableClearable` prop though.
- `resettable`: Removed for the same reason as `clearAlwaysVisible`

### Options element no longer receive a `record`

`<AutocompleteInput>`, `<AutocompleteArrayInput>`, `<SelectInput>`, `<SelectArrayInput>`, `<CheckboxGroupInput>` and `<RadioButtonGroupInput>` no longer inject props to React elements passed as `optionText`.

To access the record, you can use the `useRecordContext` hook.

```diff
const choices = [
   { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
   { id: 456, first_name: 'Jane', last_name: 'Austen' },
];

-const FullNameField = ({ record }) => {
+const FullNameField = () => {
+    const record = useRecordContext();    
    return <span>{record.first_name} {record.last_name}</span>;
}

const AuthorsInput = () => {
    <RadioButtonGroupInput source="authors" choices={choices} optionText={<FullNameField />}/>
}
```

### `rich-text-input` Package Has Changed

Our old `<RichTextInput>` was based on [Quill](https://quilljs.com/) but:
- it wasn't accessible (button without labels, etc.)
- it wasn't translatable (labels in Quill are in the CSS)
- it wasn't using Material UI components for its UI and looked off

The new `<RichTextInput>` uses [TipTap](https://github.com/ueberdosis/tiptap), a UI less library to build rich text editors. It gives us the freedom to implement the UI how we want with Material UI components. That solves all the above issues.

If you used the `<RichTextInput>` without passing Quill options such as custom toolbars, you have nothing to do.

If you customized the available buttons with the `toolbar` props, you can now use the components we provide:

```diff
const MyRichTextInput = (props) => (
    <RichTextInput
        {...props}
-        toolbar={[ ['bold', 'italic', 'underline', 'link'] ]}
+        toolbar={
            <RichTextInputToolbar>
				<FormatButtons size={size} />
				<LinkButtons size={size} />
			</RichTextInputToolbar>
        }
    />
)
```

If you customized the Quill instance to add custom handlers, you'll have to use [TipTap](https://github.com/ueberdosis/tiptap) primitives.

```diff
import {
	RichTextInput,
+	DefaultEditorOptions,
+	RichTextInputToolbar,
+	LevelSelect,
+	FormatButtons,
+	AlignmentButtons,
+	ListButtons,
+	LinkButtons,
+	QuoteButtons,
+	ClearButtons,
} from 'ra-input-rich-text';

-const configureQuill = quill => quill.getModule('toolbar').addHandler('insertSmile', function (value) {
-    const { index, length } = this.quill.getSelection();
-    this.quill..insertText(index + length, ':-)', 'api');
-});

const MyRichTextInput = (props) => (
    <RichTextInput
        {...props}
-       configureQuill={configureQuill}
+       toolbar={
+           <RichTextInputToolbar>
+               <LevelSelect size={size} />
+	        <FormatButtons size={size} />
+	        <AlignmentButtons {size} />
+	        <ListButtons size={size} />
+	        <LinkButtons size={size} />
+	        <QuoteButtons size={size} />
+	        <ClearButtons size={size} />
+               <ToggleButton
+                   aria-label="Add a smile"
+	            title="Add a smile"
+                   onClick={() => editor.insertContent(':-)')}
+	        >
+                   <Remove fontSize="inherit" />
+	        </ToggleButton>
+           </RichTextInputToolbar>
	}
    />
}
```

### `BooleanInput` Change Handlers Receive an Event Object

In previous versions BooleanInput's `onChange` event handlers only received the checked state of the input. Now they receive the event object, so you have to take the checked state from there.

```diff
import { BooleanInput } from 'react-admin';

<BooleanInput
    label="Commentable"
    source="commentable"
-   onChange={checked => { console.log(checked); }}
+   onChange={e => { console.log(e.target.checked); }}
/>
```

### `allowEmpty` Has Been Removed

The `<SelectInput>`, `<SelectArrayInput>`, `<AutocompleteInput>` and `<AutocompleteArrayInput>` components used to accept an `allowEmpty` prop. When set to `true`, a choice was added for setting the input value to an empty value (empty string by default).

However, the underlying Material UI components now require that the current input value has a matching choice. Those components now always accept an empty value (an empty string by default). You can safely remove this prop.

```diff
const choices = [{ id: 1, name: 'value' }, { id: 2, name: 'value 2' }]

const MyOptionalSelect = () => (
-    <SelectInput choices={choices} allowEmpty />
+    <SelectInput choices={choices} />
);
```

If you require the input to have a non-empty value, use the `required` validation.

```diff
const MyRequiredSelect = () => (
-    <SelectInput choices={choices} />
+    <SelectInput choices={choices} validate={[required()]} />
);
```

### `<ReferenceInput>` and `<ReferenceArrayInput>` Now Provide A `ChoicesContext`

`<ReferenceInput>` and `<ReferenceArrayInput>` used to inject props to their children. They now provide a `ChoicesContext` with support for sorting, paginating and filtering through methods and properties that match those of the `ListContext`. All their methods now have the same signature. As a result, several changes were made to both components:

#### `<ReferenceInput>` No Longer Accepts The `filterToQuery` Prop

It is now the responsibility of the child input to call the `setFilters` function provided through the `ChoicesContext` with the expected filter. If you used the `filterToQuery` prop to convert an `<AutocompleteInput>` search, you'll have to move the `filterToQuery` prop on the `<AutocompleteInput>` itself:

```diff
const UserListFilter = [
    <ReferenceInput
        source="email"
-       filterToQuery={search => ({ email: search })}
    >
-       <AutocompleteInput />
+       <AutocompleteInput filterToQuery={search => ({ email: search })} />
    </ReferenceInput>
]
```

#### `<ReferenceInput>` and `<ReferenceArrayInput>` No Longer Accepts [Common Props](https://marmelab.com/react-admin/Inputs.html#common-input-props)

Since these components no longer inject props to their children, you have to pass these props directly to them.

```diff
const UserInput = [
    <ReferenceInput
        source="email"
        reference="users"
-       label="User"
-       validate={[required()]}
-       fullWidth
-       className="myCustomCLass"
-       formClassName=="myCustomFormClass"
-       helperText="Custom helper text"
    >
-        <AutocompleteInput />
+        <AutocompleteInput 
+            label="User" 
+            validate={[required()]}
+            fullWidth
+            className="myCustomClass"
+            formClassName=="myCustomFormClass"
+            helperText="Custom helper text"
+        />
    </ReferenceInput>
]
```

**Note**: `<ReferenceInput>` and `<ReferenceArrayInput>` still accept the `label` prop, which is used as the Filter label when they are used in a Filter array.

#### `<ReferenceArrayInput>` No Longer Provides a `ListContext`

As the `ChoicesContext` now provide an API very similar to the `ListContext`, it no longer sets up a `ListContext`. If you used this to display a `<Datagrid>`, we will soon provide the `<DatagridInput>` for this purpose.

#### `<ReferenceArrayInputContext>`, `<ReferenceArrayInputContextProvider>` And `useReferenceArrayInputContext` Have Been Removed

As we now have a common interface to fetch choices related data and methods with the `ChoicesContext`, we removed the `<ReferenceArrayInputContext>` and `<ReferenceArrayInputContextProvider>` components as well as the `useReferenceArrayInputContext` hook.

```diff
-import { useReferenceArrayInputContext } from 'react-admin';
-import { useChoicesContext } from 'react-admin';

const MyCustomInput = () => {
-    const {
-        choices, 
-        error, 
-        warning, 
-        loaded, 
-        loading, 
-        setFilter, 
-        setPagination, 
-        setSort, 
-        setSortForList,
-    } = useReferenceArrayInputContext();
+    const {
+        allChoices,
+        availableChoices,
+        selectedChoices,
+        filter,
+        filterValues,
+        page,
+        perPage,
+        setFilters,
+        setPage,
+        setPerPage,
+        setSort,
+        sort,
+   } = useChoicesContext();
    return // ...
}
```

#### Other Changes

The other changes only impact you if you had a custom child component for either the `<ReferenceInput>` or `<ReferenceArrayInput>`.

The `ChoicesContext` provides access to the choices via 3 properties:
- `availableChoices`: The choices which are not selected but matches the parameters (sorting, pagination and filters)
- `selectedChoices`: The selected choices. 
- `allChoices`: Merge of both available and selected choices. 

The `ReferenceInput` and `ReferenceArrayInput` components also handled the form binding and injected final-form `input` and `meta` to their child. They don't need to do that anymore, and simply watch the form value changes to ensure they load the required data when needed.

```diff
const MyCustomAutocomplete = (props) => {
-    const { choices, input, meta, resource, setFilter, source } = props;
+    const { allChoices, setFilters } = useChoicesContext(props); 

-    const { input, meta } = useInput({ input, meta });
+    const { field, fieldState } = useInput(props);

    const handleTextInputChange = (event) => {
-        setFilter(event.target.value);
         // Note that we don't force you to use `q` anymore
+        setFilters({ q: event.target.value });
    };

    return (
        //...
    )
}
```

## UI components

### Custom Menus Should Get Resource Definition From Context

React-admin used to store the definition of each resource (its name, icon, label, etc.) in the Redux state. This is no longer the case, as the resource definition is now stored in a custom context.

If you relied on the `useResourceDefinition` hook, this change shouldn't affect you.

If you need to access the definitions of all resources, however, you must upgrade your code, and use the new `useResourceDefinitions` hook.

The most common use case is when you override the default `<Menu>` component:

```diff
// in src/Menu.js
import * as React from 'react';
import { createElement } from 'react';
-import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';
-import { DashboardMenuItem, Menu, MenuItemLink, getResources } from 'react-admin';
+import { DashboardMenuItem, Menu, MenuItemLink, useResourceDefinitions } from 'react-admin';
import DefaultIcon from '@mui/icons-material/ViewList';
import LabelIcon from '@mui/icons-material/Label';

export const Menu = (props) => {
-   const resources = useSelector(getResources);
+   const resourcesDefinitions = useResourceDefinitions();
+   const resources = Object.keys(resourcesDefinitions).map(name => resourcesDefinitions[name]);
    const open = useSelector(state => state.admin.ui.sidebarOpen);
    return (
        <Menu {...props}>
            <DashboardMenuItem />
            {resources.map(resource => (
                <MenuItemLink
                    key={resource.name}
                    to={`/${resource.name}`}
                    primaryText={
                        (resource.options && resource.options.label) ||
                        resource.name
                    }
                    leftIcon={
                        resource.icon ? <resource.icon /> : <DefaultIcon />
                    }
                    onClick={props.onMenuClick}
                    sidebarIsOpen={open}
                />
            ))}
            {/* add your custom menus here */}
        </Menu>
    );
};
```

### `<AppBar>` and `<UserMenu>` No Longer Inject Props

When a React element was provided as the `userMenu` prop, the `<AppBar>` used to clone it and inject the `logout` prop (a React element). This is no longer the case and if you provided a custom user menu, you now have to include the logout yourself.

Besides, the `<UserMenu>` used to clone its children to inject the `onClick` prop, allowing them to close the menu. It now provides a `onClose` function through a new `UserContext` accessible by calling the `useUserMenu` hook.

Finally, the `<UserMenu>` no longer accepts a `logout` prop. Instead, you should pass the `<Logout>` component as one of the `<UserMenu>` children. Besides, you should not use an `<MenuItemLink>` in `<UserMenu>` as they also close the `<SideBar>` on mobile:

```diff
-import { MenuItemLink, UserMenu } from 'react-admin';
+import { Logout, UserMenu, useUserMenu } from 'react-admin';
import { Link } from 'react-router-dom';
+import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';

-const ConfigurationMenu = (props) => {
// It's important to pass the ref to allow Material UI to manage the keyboard navigation
+const ConfigurationMenu = forwardRef((props, ref) => {
+   const { onClose } = useUserMenu();
    return (
-       <MenuItemLink
+       <MenuItem
+           ref={ref}
            // It's important to pass the props to allow Material UI to manage the keyboard navigation
            {...props}
+           component={Link}
            to="/configuration"
-            onClick={props.onClick}
+            onClick={onClose}
        >
            <ListItemIcon>
                <SettingsIcon />
            </ListItemIcon>
            <ListItemText>
                Configuration
            </ListItemText>
-       </MenuItemLink>
+       </MenuItem>
    );
});

-const CustomUserMenu = (props) => (
+const CustomUserMenu = () => (
-    <UserMenu {...props}>
+    <UserMenu>
        <ConfigurationMenu />
+       <Logout />
    </UserMenu>
);
```

### `<MenuItemLink>` Automatically Translates `primaryText`

You can pass a translation key directly as the `primaryText` prop for `<MenuItemLink>`.

```diff
const MyMenuItem = forwardRef((props, ref) => {
-    const translate = useTranslate();
    return (
        <MenuItemLink
            ref={ref}
            {...props}
            to="/configuration"
-            primaryText={translate('pos.configuration')}
+            primaryText="pos.configuration"
            leftIcon={<SettingsIcon />}
        />
    )
});
```

### `<Admin>`, `<Layout>`, `<AppBar>` And `<UserMenu>` No Longer Accept A `logout` Or `logoutButton` Prop

As we already provide a way to override the user menu displayed in the `<AppBar>`, we removed the `logoutButton` prop from the `<Admin>` component and the `logout` prop from the `<Layout>`, `<AppBar>` and `<UserMenu>` components.

If you passed your own logout component through this prop, you must now provide a custom user menu:

```diff
-import { Admin, Logout } from 'react-admin';
+import { Admin, AppBar, Layout, Logout, UserMenu } from 'react-admin';

const MyCustomLogout = () => <Logout className="my-class-name" />;

+ const MyUserMenu = () => <UserMenu><MyCustomLogout /></UserMenu>;

+ const MyAppBar = () => <AppBar userMenu={<MyUserMenu />} />;

+ const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

const MyAdmin = () => (
    <Admin
-        logoutButton={<MyCustomLogout />}
+        layout={MyLayout}
    >
        // ....
    </Admin>
)
```

### The Material UI `<ThemeProvider>` is not set by `<Layout>` anymore

The `<ThemeProvider>` is now set by the `<AdminContext>` component which is rendered by `<Admin>`.

This shouldn't impact your code unless you had a completely custom `<Layout>` component. If you do but still uses the default `<Admin>` component, you can safely remove the `ThemeProvider` from your `Layout`:

```diff
-import { Container, ThemeProvider } from '@mui/material';
+import { Container } from '@mui/material';
import { Notification, Error } from 'react-admin';
import Header from './Header';

const Layout = (props) => {
-    const { children, theme } = props;
+    const { children } = props;
    return (
-        <ThemeProvider theme={theme}>
+        <>
            <Header />
            <Container>
                <main id="main-content">
                    {children}
                </main>
            </Container>
            <Notification />
-        </ThemeProvider>
+        </>
    );
};
```

### The `<Notification>` Component Is Included By `<Admin>` Rather Than `<Layout>`

If you customized the `<Notification>` component (e.g. to tweak the delay after which a notification disappears), you passed your custom notification component to the `<Layout>` component. The `<Notification>` is now included by the `<Admin>` component, which facilitates custom layouts and login screens. As a consequence, you'll need to move your custom notification component to the `<Admin>` component.

```diff
// in src/MyNotification.js
import { Notification } from 'react-admin';

export const MyNotification = props => (
    <Notification {...props} autoHideDuration={5000} />
);

// in src/MyLayout.js
-import { Layout } from 'react-admin';
-import { MyNotification } from './MyNotification';

-export const MyLayout = props => (
-   <Layout {...props} notification={MyNotification} />
-);

// in src/App.js
-import { MyLayout } from './MyLayout';
+import { MyNotification } from './MyNotification';
import dataProvider from './dataProvider';

const App = () => (
-   <Admin layout={MyLayout} dataProvider={dataProvider}>
+   <Admin notification={MyNotification} dataProvider={dataProvider}>
        // ...
    </Admin>
);
```

If you had a custom Layout and/or Login component, you no longer need to include the `<Notification>` component.

```diff
-import { Notification } from 'react-admin';

export const MyLayout = ({
    children,
    dashboard,
    logout,
    title,
}) => {
    // ...
    return (<>
        // ...
-       <Notification />
    </>);
};
```

### Renamed `useToggleSidebar` to `useSidebarState`

The `useToggleSidebar` hook has been renamed to `useSidebarState`. The second value returned by the hook is no longer a toggle function, but a value updater. 

```diff
const MyButton = () => {
-   const [open, toggleSidebar] = useToggleSidebar();
+   const [open, setOpen] = useSidebarState();
    return (
        <Button
            color="inherit"
-           onClick={() => toggleSidebar()}
+           onClick={() => setOpen(!open)}
        >
            {open ? 'Open' : 'Close'}
        </Button>
    );
};
```

## I18n

### Changes In Translation Messages

The `ra.navigation.prev` message was renamed to `ra.navigation.previous`. Update your translation files accordingly.

```diff
const messages = {
    ra: {
        navigation: {
            no_results: 'No results found',
            no_more_results:
                'The page number %{page} is out of boundaries. Try the previous page.',
            page_out_of_boundaries: 'Page number %{page} out of boundaries',
            page_out_from_end: 'Cannot go after last page',
            page_out_from_begin: 'Cannot go before page 1',
            page_range_info: '%{offsetBegin}-%{offsetEnd} of %{total}',
            partial_page_range_info:
                '%{offsetBegin}-%{offsetEnd} of more than %{offsetEnd}',
            current_page: 'Page %{page}',
            page: 'Go to page %{page}',
            next: 'Go to next page',
-           prev: 'Go to previous page',
+           previous: 'Go to previous page',
            page_rows_per_page: 'Rows per page:',
            skip_nav: 'Skip to content',
        },
        // ...
```

### Renamed `<TranslationProvider>` to `<I18nContextProvider>`

If you created a custom app (without the `<Admin>` component), you may have used the `<TranslationProvider>` component. It has been renamed to `<I18nContextProvider>`, and accepts an `i18nProvider`.

```diff
-<TranslationProvider locale="en" i18nProvider={i18nProvider}>
+<I18nContextProvider value={i18nProvider}>
   ...
-</TranslationProvider>
+</I18nContextProvider>
```

## Miscellaneous

### Custom Themes Must Extend `defaultTheme`

If you pass a custom object to `<Admin theme>` to change the look and feel of your application, the object must now extend the `defaultTheme` object, or the inputs will default to the `outlined` variant instead of the `filled` variant:

```diff
+import { defaultTheme } from 'react-admin';

const theme = {
+   ...defaultTheme,
    components: {
+       ...defaultTheme.components,
        RaDatagrid: {
            root: {
                backgroundColor: "Lavender",
                "& .RaDatagrid-headerCell": {
                    backgroundColor: "MistyRose",
                },
            }
        }
    }
};
```

Alternately, set the default `variant`  for `MuiTextField` to `filled`:

```diff
const theme = {
    components: {
        RaDatagrid: {
            root: {
                backgroundColor: "Lavender",
                "& .RaDatagrid-headerCell": {
                    backgroundColor: "MistyRose",
                },
            }
        }
+       MuiTextField: {
+           defaultProps: {
+               variant: 'filled',
+           }
+       }
    }
};
```

### `useNotify` Now Takes An Options Object

When a component has to display a notification, developers may want to tweak the type, duration, translation arguments, or the ability to undo the action. The callback returned by `useNotify()` used to accept a long series of argument, but the syntax wasn't very intuitive. To improve the developer experience, these options are now part of an `options` object, passed as second argument.

```diff
```jsx
import { useNotify } from 'react-admin';

const NotifyButton = () => {
    const notify = useNotify();
    const handleClick = () => {
-       notify(`Comment approved`, 'success', undefined, true);
+       notify(`Comment approved`, { type: 'success', undoable: true });
    }
    return <button onClick={handleClick}>Notify</button>;
};
```

Check [the `useNotify` documentation](https://marmelab.com/react-admin/useNotify.html) for more information.

### The `useVersion` Hook Was Removed

React-admin v3 relied on a global `version` variable stored in the Redux state to force page refresh. This is no longer the case, as the refresh functionality is handled by react-query.

If you relied on `useVersion` to provide a component key, you can safely remove the call. The refresh button will force all components relying on a dataProvider query to re-execute.

```diff
-import { useVersion } from 'react-admin';

const MyComponent = () => {
-   const version = useVersion();
    return (
-       <Card key={version}>
+       <Card>
            ...
        </Card>
    );
};
```

And if you relied on a `version` prop to be available in a page context, you can safely remove it.

```diff
import { useShowContext } from 'react-admin';

const PostDetail = () => {
-   const { data, version } = useShowContext();
+   const { data } = useShowContext();
    return (
-       <Card key={version}>
+       <Card>
            ...
        </Card>
    );
}
```

### `useRedirect()` No Longer Clears Forms When Called With `false`

To implement a form that would reset after submittion and allow adding more data, react-admin used to encourage you to call `useRedirect()` with `false` to clear the form. This no longer works: `useRedirect()` manages redirections, not forms. You'll have to clear the form manually in your side effect:

{% raw %}
```diff
-import { useNotify, useRedirect } from 'react-admin';
+import { useNotify } from 'react-admin';
+import { useFormContext } from 'react-hook-form';

const PostCreateToolbar = props => {
    const notify = useNotify();
-   const redirect = useRedirect();
+   const { reset } = useFormContext();

    return (
        <Toolbar {...props}>
-           <SaveButton label="Save" />
            <SaveButton
                label="Save and add"
                type="button"
                mutationOptions={{
                    onSuccess: () => {
-                       redirect(false);
+                       reset();
+                       window.scrollTo(0, 0);
                        notify('ra.notification.created', {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                        });
                    },
                }}
            />
        </Toolbar>
    );
};
```
{% endraw %}

### No More Props Injection In `<Title>`

`<Title>` no longer clones the `title` prop and injects it to the `record`. Call the `useRecordContext` hook to get the current record.

```diff
-const PostTitle = ({ record }) => {
-const PostTitle = () => {
+    const record = useRecordContext();
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const PostEdit = () => (
    <Edit title={<PostTitle />}>
        ...
    </Edit>
);
```

Use the `<Title>` component instead.

### Removed Deprecated Elements

- Removed `<BulkDeleteAction>` (use `<BulkDeleteButton>` instead)
- Removed `<ReferenceFieldController>` (use [`useReference`](./useGetOne.md#aggregating-getone-calls) instead)
- Removed `<ReferenceArrayFieldController>` (use `useReferenceArrayFieldController` instead)
- Removed `<ReferenceManyFieldController>` (use `useReferenceManyFieldController` instead)
- Removed `<ReferenceInputController>` (use `useReferenceInputController` instead)
- Removed `<ReferenceArrayInputController>` (use `useReferenceArrayInputController` instead)
- Removed declarative side effects in dataProvider hooks (e.g. `{ onSuccess: { refresh: true } }`). Use function side effects instead (e.g. `{ onSuccess: () => { refresh(); } }`)
- Removed `<CardActions>` (use `<TopToolbar>` instead)

### Removed Deprecated Props

- Removed `<ReferenceField linkType>` prop (use `<ReferenceField link>` instead)

### Removed Deprecated HOCs

- Removed `withTranslate` HOC (use `useTranslate` hook)
- Removed `withDataProvider` HOC (use `useDataProvider` hook)

### `<Edit successMessage>` Prop Was Removed

This prop has been deprecated for a long time. Replace it with a custom success handler in the `mutationOptions`:

{% raw %}
```diff
-import { Edit, SimpleForm } from 'react-admin';
+import { Edit, SimpleForm, useNotify } from 'react-admin';

const PostEdit = () => {
+   const notify = useNotify();
+   const onSuccess = () => notify('Post updated successfully');
    return (
-       <Edit successMessage="Post updated successfully">
+       <Edit mutationOptions={{ onSuccess }}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Edit>
    );
};
```
{% endraw %}


## TypeScript

### `Record` Was Renamed To `RaRecord`

Data Provider methods used to return records with a generic `Record` type, unless you were passing an explicit type. The `Record` type conflicted with TypeScript's native `Record` type and sometimes confused IDEs.

We've renamed that type to `RaRecord` to avoid any confusion.

If you've declared custom Record types, you'll need to upgrade your code as follows:

```diff
-import { Record } from 'react-admin';
+import { RaRecord } from 'react-admin';

-export interface Customer extends Record {
+export interface Customer extends RaRecord {
    id: string;
    name: string;
    email: string;
}
```

## Tests

### `ra-test` Has Been Removed

You no longer need a special package to unit test your components. The `react-admin` package provides all you need.

If you used `TestContext` from 'ra-test', use `AdminContext` instead:

```diff
import React from 'react';
-import { TestContext } from 'ra-test';
+import { AdminContext } from 'react-admin';
import { render, screen } from '@testing-library/react';

import MyComponent from './MyComponent';

test('<MyComponent>', async () => {
    render(
-       <TestContext>
+       <AdminContext>
            <MyComponent />
-       </TestContext>
+       </AdminContext>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```

`<AdminContext>` accepts the same props as `<Admin>`, so you can pass a custom `dataProvider`, `authProvider`, or `i18nProvider` for testing purposes. 

For instance, if the component to test calls the `useGetOne` hook:

{% raw %}
```jsx
import React from 'react';
import { AdminContext } from 'react-admin';
import { render, screen } from '@testing-library/react';

import MyComponent from './MyComponent';

test('<MyComponent>', async () => {
    render(
        <AdminContext dataProvider={{
            getOne: () => Promise.resolve({ data: { id: 1, name: 'foo' } }),
        }}>
            <MyComponent />
        </AdminContext>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```
{% endraw %}

If you used `renderWithRedux` from 'ra-test', replace it with react-testing-library's `render`, and use `AdminContext` as a wrapper:

```diff
import React from 'react';
-import { renderWithRedux } from 'ra-test';
+import { AdminContext } from 'react-admin';
import { render, screen } from '@testing-library/react';

import MyComponent from './MyComponent';

test('<MyComponent>', async () => {
-   renderWithRedux(
+   render(
+       <AdminContext>
            <MyComponent />
+       </AdminContext>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```

If you used `renderHook` from 'ra-test', replace it with [react-testing-library's `renderHook`](https://react-hooks-testing-library.com/):

```diff
-import { renderHook } from 'ra-test'
+import { renderHook } from '@testing-library/react-hooks'
import useCounter from './useCounter'

test('should use counter', () => {
-   const { hookValue } = renderHook(() => useCounter())
+   const { result } = renderHook(() => useCounter())

-   expect(hookValue.count).toBe(0)
+   expect(result.current.count).toBe(0)
})
```

### Unit Tests for Data Provider Dependent Components Need A QueryClientContext

If you were using components dependent on the dataProvider hooks in isolation (e.g. in unit or integration tests), you now need to wrap them inside a `<QueryClientContext>` component, to let the access react-query's `QueryClient` instance.

```diff
+import { QueryClientProvider, QueryClient } from 'react-query';

// this component relies on dataProvider hooks
const BookDetail = ({ id }) => {
    const { data, error, isLoading } = useGetOne('books', { id });
    if (isLoading) {
        return <Loading />;
    }
    if (error) {
        return <Error error={error} />;
    }
    if (!data) {
        return null;
    }
    return (
        <div>
            <h1>{data.book.title}</h1>
            <p>{data.book.author.name}</p>
        </div>
    );
};

test('MyComponent', () => {
    render(
+       <QueryClientProvider client={new QueryClient()}>
            <BookDetail id={1} />
+       </QueryClientProvider>
    );
    // ...
});
```
