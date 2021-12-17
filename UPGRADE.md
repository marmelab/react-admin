# Upgrade to 4.0

## The Way To Define Custom Routes Has Changed

Custom routes used to be provided to the `Admin` component through the `customRoutes` prop. This was awkward to use as you had to provide an array of `<Route>` elements. Besides, we had to provide the `<RouteWithoutLayout>` component to support custom routes rendered without the `<Layout>` and keep TypeScript happy.

As we upgraded to react-router v6 (more on that later), we had to come up with another way to support custom routes.

Meet the `<CustomRoutes>` component. You you can pass it as a child of `<Admin>`, just like a `<Resource>`. It accepts react-router `<Route>` as its children (and only that). You can specify whether the custom routes it contains should be rendered with the `<Layout>` or not by setting the `noLayout` prop. It's `false` by default.

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

## Admin Child Function Result Has Changed

In order to define the resources and their views according to users permissions, we used to support a function as a child of `<Admin>`. Just like the `customRoutes`, this function had to return an array of elements.

You can now return a fragment and this fragment may contains `null` elements. Besides, if you don't need to check the permissions for a resource, you may even include it as a direct child of `<Admin>`.

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

## React Router Upgraded to v6

This should be mostly transparent for you unless:

- you had custom routes: see [https://reactrouter.com/docs/en/v6/upgrading/v5#advantages-of-route-element](https://reactrouter.com/docs/en/v6/upgrading/v5#advantages-of-route-element) to upgrade.
- you used `useHistory` to navigate: see [https://reactrouter.com/docs/en/v6/upgrading/v5#use-usenavigate-instead-of-usehistory](https://reactrouter.com/docs/en/v6/upgrading/v5#use-usenavigate-instead-of-usehistory) to upgrade.
- you had custom components similar to our `TabbedForm` or `TabbedShowLayout` (declaring multiple sub routes): see [https://reactrouter.com/docs/en/v6/upgrading/v5](https://reactrouter.com/docs/en/v6/upgrading/v5) to upgrade.

## Changed Signature Of Data Provider Hooks

Specialized data provider hooks (like `useGetList` and `useUpdate`) have a new signature. There are 2 changes:

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
```

For mutations:

```diff
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
```

This new signature should be easier to learn and use.

To upgrade, check every instance of your code of the following hooks:

- `useGetOne`
- `useGetList`
- `useGetMany`
- `useUpdate`

And update the calls. If you're using TypeScript, your code won't compile until you properly upgrade the calls. 

These hooks are now powered by react-query, so the state argument contains way more than just `isLoading` (`reset`, `status`, `refetch`, etc.). Check the [`useQuery`](https://react-query.tanstack.com/reference/useQuery) and the [`useMutation`](https://react-query.tanstack.com/reference/useMutation) documentation on the react-query website for more details. 

## Mutation Callbacks Can No Longer Be Used As Event Handlers

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

Note that your code will be more readable if you pass the mutation parameters to the mutation callback instaed of the mutation hook, e.g.

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

## `onSuccess` And `onFailure` Props Have Moved

If you need to override the success or failure side effects of a component, you now have to use the `queryOptions` (for query side effects) or `mutationOptions` (for mutation side effects).

For instance, here is how to override the side eggects for the `getOne` query in a `<Show>` component: 

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

Here is how to customize side effects on the `update` mutation in `<Edit>`:

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

Note that the `onFailure` prop was renamed to `onError` in the options, to match the react-query convention.

**Tip**: `<Edit>` also has a `queryOption` prop allowing you to specify custom success and error side effects for the `getOne` query.

The change concerns the following components:

- `useEditController`
- `<Edit>`
- `<EditBase>`
- `<SaveButton>`
- `useShowController`
- `<Show>`
- `<ShowBase>`

## `onSuccess` Callback On DataProvider Hooks And Components Has A New Signature

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

- `useUpdate`
- `useEditController`
- `<Edit>`
- `<EditBase>`
- `<SaveButton>`
- `useGetOne`
- `useShowController`
- `<Show>`
- `<ShowBase>`

## `<Edit successMessage>` Prop Was Removed

This prop has been deprecated for a long time. Replace it with a custom success handler in the `mutationOptions`:

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

## No More Prop Injection In Page Components

Page components (`<List>`, `<Show>`, etc.) used to expect to receive props (route parameters, permissions, resource name). These components don't receive any props anymore by default. They use hooks to get the props they need from contexts or route state.  

```diff
-const PostShow = (props) => (
+const PostShow = () => (
-   <Show>
+   <Show {...props}>
        <SimpleShowLayout>
            <TextField source="title" />
        </SimpleShowLayout>
    </Show>
);
```

If you need to access the permissions previously passed as props, you need to call the `usePermissions` hook instead.

```diff
+const { usePermissions } from 'react-admin';

-const PostShow = ({ permissions, ...props }) => {
+const PostShow = () => {
+   const permissions = usePermissions();
    return (
-       <Show>
+       <Show {...props}>
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
+const { useParams } from 'react-router-dom';

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

## No More props injection in custom Pagination and Empty components

The `<List>` component renders a Pagination component when there are records to display, and an Empty component otherwise. You can customize these components by passing your own with the `pagination`and `empty`props. 

`<List>` used to inject `ListContext` props (`data`, `isLoaded`, etc.) to these Pagination component. In v4, the component rendered by `<List>` no longer receive these props. They must grab them from the ListContext instead.

This means you'll have to do a few changes if you use a custom Pagination component in a List:

```diff
import { Button, Toolbar } from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
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

## `useListContext` No Longer Returns An `ids` Prop

The `ListContext` used to return two props for the list data: `data` and `ids`. To render the list data, you had to iterate over the `ids`. 

Starting with react-admin v4, `useListContext` only returns a `data` prop, and it is now an array. This means you have to update all your code that relies on `ids` from a `ListContext`. Here is an example for a custom list iterator using cards:

```diff
import * as React from 'react';
import { useListContext, List, TextField, DateField, ReferenceField, EditButton } from 'react-admin';
import { Card, CardActions, CardContent, CardHeader, Avatar } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

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

## Redux-Saga Was Removed

The use of sagas has been deprecated for a while. React-admin v4 doesn't support them anymore. That means that the Redux actions don't include meta parameters anymore to trigger sagas, the Redux store doesn't include the saga middleware, and the saga-based side effects were removed.

In particular, the data action creators (like `crudGetList`) don't support the `onSuccess` and `onFailure` callbacks anymore. You should use the related data provider hook (e.g. `useGetList`) instead.

If you still relied on sagas, you have to port your saga code to react `useEffect`, which is the standard way to write side effects in modern react.

## Removed Deprecated Elements

- Removed `<BulkDeleteAction>` (use `<BulkDeleteButton>` instead)
- Removed `<ReferenceFieldController>` (use `useReferenceFieldController` instead)
- Removed `<ReferenceArrayFieldController>` (use `useReferenceArrayFieldController` instead)
- Removed `<ReferenceManyFieldController>` (use `useReferenceManyFieldController` instead)
- Removed `<ReferenceInputController>` (use `useReferenceInputController` instead)
- Removed `<ReferenceArrayInputController>` (use `useReferenceArrayInputController` instead)
- Removed declarative side effects in dataProvider hooks (e.g. `{ onSuccess: { refresh: true } }`). Use function side effects instead (e.g. `{ onSuccess: () => { refresh(); } }`)

## Removed connected-react-router

If you were dispatching `connected-react-router` actions to navigate, you'll now have to use `react-router` hooks:

```diff
-import { useDispatch } from 'react-redux';
-import { push } from 'connected-react-router';
+import { useNavigate } from 'react-router';

const MyComponent = () => {
-    const dispatch = useDispatch();
+    const navigate = useNavigate();

    const myHandler = () => {
-        dispatch(push('/my-url'));
+        navigate('/my-url');
    }
}
```

## Removed the undoable prop in Favor of mutationMode

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
    basePath,
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

## `addLabel` Prop No Longer Considered For Show Labelling 

`<SimpleShowLayout>` and `<TabbedShowLayout>` used to look for an `addLabel` prop to decide whether they needed to add a label or not. this relied on `defaultProps`, which will soon be removed from React. 

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

As the `addLabel` prop is now ignored in fields, you can remove it from your custom fields:

```diff
const MyCustomField = () => (
    ... 
);
-MyCustomField.defaultProps = {
-    addLabel: true
-};
```

## Removed `loading` and `loaded` Data Provider State Variables

The dataProvider hooks (`useGetOne`, etc) return the request state. The `loading` and `loaded` state variables were changed to `isLoading` and `isFetching` respectively. The meaning has changed, too:

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

The new props are actually returned by react-query's `useQuery` hook. Check [their documentation](https://react-query.tanstack.com/reference/useQuery) for more information.

## Unit Tests for Data Provider Dependent Components Need A QueryClientContext

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

## AutocompleteInput Now Uses Material UI Autocomplete

We migrated the `AutocompleteInput` so that it leverages Material UI [`<Autocomplete>`](https://mui.com/components/autocomplete/). If you relied on [Downshift](https://www.downshift-js.com/) options, you'll have to update your component.

Besides, some props supported by the previous implementation aren't anymore:
- `clearAlwaysVisible`: the clear button is now always visible, either while hovering the input or when it has focus. You can hide it using the `<Autocomplete>` `disableClearable` prop though.
- `resettable`: Removed for the same reason as `clearAlwaysVisible`

## `useAuthenticated` Signature has Changed

`useAuthenticated` uses to accept only the parameters passed to the `authProvider.checkAuth` function. It now accepts an option object with two properties:
- `enabled`: whether it should check for an authenticated user
- `params`: the parameters to pass to `checkAuth`

```diff
- useAuthenticated('permissions.posts.can_create');
+ useAuthenticated({ params: 'permissions.posts.can_create' })
```

## `useGetMainList` Was Removed

`useGetMainList` was a modified version of `useGetList` designed to keep previous data on screen upon navigation. As [this is now supported natively by react-query](https://react-query.tanstack.com/guides/paginated-queries#better-paginated-queries-with-keeppreviousdata), this hook is no longer necessary and has been removed. Use `useGetList()` instead.

# Upgrade to 3.0

We took advantage of the major release to fix all the problems in react-admin that required a breaking change. As a consequence, you'll need to do many small changes in the code of existing react-admin v2 applications. Follow this step-by-step guide to upgrade to react-admin v3.

## Upgrade all react-admin packages

In the `packages.json`, upgrade ALL react-admin related dependencies to 3.0.0. This includes `react-admin`, `ra-language-XXX`, `ra-data-XXX`, etc.

```diff
{
    "name": "demo",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
-       "ra-data-simple-rest": "^2.9.6",
+       "ra-data-simple-rest": "^3.0.0",
-       "ra-input-rich-text": "^2.9.6",
+       "ra-input-rich-text": "^3.0.0",
-       "ra-language-english": "^2.9.6",
+       "ra-language-english": "^3.0.0",
-       "ra-language-french": "^2.9.6",
+       "ra-language-french": "^3.0.0",
-       "react-admin": "^2.9.6",
+       "react-admin": "^3.0.0",
        "react": "^16.9.0",
        "react-dom": "^16.9.0",
        ...
    },
```

Failing to upgrade one of the `ra-` packages will result in a duplication of the react-admin package in two incompatible versions, and cause hard-to-debug bugs.

## Increased version requirement for key dependencies

* `react` and `react-dom` are now required to be >= 16.9. This version is backward compatible with 16.3, which was the minimum requirement in react-admin, and it offers the support for Hooks, on which react-admin v3 relies heavily.
* `react-redux` requires a minimum version of 7.1.0 (instead of 5.0). Check their upgrade guide for [6.0](https://github.com/reduxjs/react-redux/releases/tag/v6.0.0) and [7.0](https://github.com/reduxjs/react-redux/releases/tag/v7.0.0)
* `redux-saga` requires a minimum version of 1.0.0 (instead of ~0.16.0). Check their [list of breaking changes for redux-saga 1.0](https://github.com/redux-saga/redux-saga/releases/tag/v1.0.0) on GitHub. 
* `material-ui` requires a minimum of 4.0.0 (instead of 1.5). Check their [Upgrade guide](https://mui.com/guides/migration-v3/).

## `react-router-redux` replaced by `connected-react-router`

We've replaced the `react-router-redux` package, which was deprecated and not compatible with the latest version of `react-redux`, by an equivalent package named `connected-react-router`. As they share the same API, you can just change the `import` statement and it should work fine.

```diff
-import { push } from 'react-router-redux';
+import { push } from 'connected-react-router';

-import { LOCATION_CHANGE } from 'react-router-redux';
+import { LOCATION_CHANGE } from 'connected-react-router';
```

It's a bit more work if you're using a Custom App, as the initialization of `connected-react-router` requires one more step than `react-router-redux`.

If you create a custom reducer, here is how to update your `createAdminStore` file:

```diff
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
-import { routerMiddleware, routerReducer } from 'react-router-redux';
+import { routerMiddleware, connectRouter } from 'connected-react-router';
-import { reducer as formReducer } from 'redux-form';

...

export default ({
    authProvider,
    dataProvider,
    history,
    locale = 'en',
}) => {
    const reducer = combineReducers({
        admin: adminReducer,
-       form: formReducer,
-       router: routerReducer,
+       router: connectRouter(history),
        { /* add your own reducers here */ },
    });
    ...
```

The syntax of the `routerMiddleware` doesn't change.

And if you don't use the `<Admin>` component, change the package for `ConnectedRouter`:

```diff
import * as React from "react";
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
-import { ConnectedRouter } from 'react-router-redux';
+import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import withContext from 'recompose/withContext';
...
```

## `redux-form` replaced by `react-final-form`

The author of `redux-form` has written a new Form library for React called `react-final-form` to fix all the problems that `redux-form` had by construction. `react-final-form` no longer stores the form state in Redux. But the two libraries share a similar API. So in many cases, changing the imported package will suffice:

```diff
-import { Field } from 'redux-form';
+import { Field } from 'react-final-form';
```

The next sections highlight changes that you must do to your code as a consequence of switching to `react-final-form`.

## Custom Form Toolbar or Buttons Must Use New `handleSubmit` Signature or must Use `onSave`

If you were using custom buttons (to alter the form values before submit for example), you'll need to update your code. In `react-admin` v2, the form toolbar and its buttons used to receive `handleSubmit` and `handleSubmitWithRedirect` props. These props accepted functions which were called with the form values.

The migration to `react-final-form` changes their signature and behavior to the following:

- `handleSubmit`: accepts no arguments, and will submit the form with its current values immediately
- `handleSubmitWithRedirect` accepts a custom redirect, and will submit the form with its current values immediately

Here's how to migrate the *Altering the Form Values before Submitting* example from the documentation:

```jsx
import * as React from 'react';
import { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { SaveButton, Toolbar, useCreate, useRedirect } from 'react-admin';

const SaveWithNoteButton = ({ handleSubmit, handleSubmitWithRedirect, ...props }) => {
    const [create] = useCreate('posts');
    const redirectTo = useRedirect();
    const { basePath, redirect } = props;

    const form = useForm();

    const handleClick = useCallback(() => {
        form.change('average_note', 10);

        handleSubmitWithRedirect('edit');
    }, [form]);

    return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};
```

The override of these functions has now a huge drawback, which makes it impractical: by skipping the default `handleSubmitWithRedirect`, the button doesn't trigger form validation. And unfortunately, react-final-form doesn't provide a way to trigger form validation manually.

That's why react-admin now provides a way to override just the data provider call and its side effect called `onSave`.

The `onSave` value should be a function expecting 2 arguments: the form values to save, and the redirection to perform.

Here's how to migrate the *Using `onSave` To Alter the Form Submission Behavior* example from the documentation:

```jsx
import * as React from 'react';
import { useCallback } from 'react';
import {
    SaveButton,
    Toolbar,
    useCreate,
    useRedirect,
    useNotify,
} from 'react-admin';

const SaveWithNoteButton = props => {
    const [create] = useCreate('posts');
    const redirectTo = useRedirect();
    const notify = useNotify();
    const { basePath } = props;

    const handleSave = useCallback(
        (values, redirect) => {
            create(
                {
                    payload: { data: { ...values, average_note: 10 } },
                },
                {
                    onSuccess: ({ data: newRecord }) => {
                        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
                        redirectTo(redirect, basePath, newRecord.id, newRecord);
                    },
                }
            );
        },
        [create, notify, redirectTo, basePath]
    );

    // set onSave props instead of handleSubmitWithRedirect
    return <SaveButton {...props} onSave={handleSave} />;
};
```

## `FormDataConsumer` Children No Longer Receives `dispatch`

In `react-admin` v2, you could link two inputs using the `FormDataConsumer` component. The render prop function received the `dispatch` function that it could use to trigger form changes.

The migration to `react-final-form` changes this render prop signature a little as it will no longer receive a `dispatch` function. However, it's possible to use the `useForm` hook from `react-final-form` to achieve the same behavior:

```diff
import * as React from 'react';
import { Fragment } from 'react';
-import { change } from 'redux-form';
+import { useForm } from 'react-final-form';
import { FormDataConsumer, REDUX_FORM_NAME } from 'react-admin';

+const OrderOrigin = ({ formData, ...rest }) => {
+    const form = useForm();
+
+    return (
+        <Fragment>
+            <SelectInput
+                source="country"
+                choices={countries}
+                onChange={value => form.change('city', value)}
+                {...rest}
+            />
+            <SelectInput
+                source="city"
+                choices={getCitiesFor(formData.country)}
+                {...rest}
+            />
+        </Fragment>
+    );
+};

const OrderEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <FormDataConsumer>
-                {({ formData, dispatch, ...rest }) => (
-                    <Fragment>
-                        <SelectInput
-                            source="country"
-                            choices={countries}
-                            onChange={value => dispatch(
-                                change(REDUX_FORM_NAME, 'city', value)
-                            )}
-                             {...rest}
-                        />
-                        <SelectInput
-                            source="city"
-                            choices={getCitiesFor(formData.country)}
-                             {...rest}
-                        />
-                    </Fragment>
-                )}
+                {formDataProps => 
+                    <OrderOrigin {...formDataProps} />
+                }
            </FormDataConsumer>
        </SimpleForm>
    </Edit>
);
```

## Validators Should Return Non-Translated Messages

Form validators used to return translated error messages - that's why they received the field `props` as argument, including the `translate` function. They don't receive these props anymore, and they must return untranslated messages instead - react-admin translates validation messages afterwards.

```diff
// in validators/required.js
-const required = () => (value, allValues, props) =>
+const required = () => (value, allValues) =>
    value
        ? undefined
-       : props.translate('myroot.validation.required');
+       : 'myroot.validation.required';
```

In case the error message depends on a variable, you can return an object `{ message, args }` instead of a message string:

```diff
-const minLength = (min) => (value, allValues, props) => 
+const minLength = (min) => (value, allValues) => 
    value.length >= min
        ? undefined
-       : props.translate('myroot.validation.minLength', { min });
+       : { message: 'myroot.validation.minLength', args: { min } };
```

React-admin core validators have been modified so you don't have to change anything when using them.

```jsx
import {
    required,
    minLength,
    maxLength,
    minValue,
    number,
    email,
} from 'react-admin';

// no change vs 2.x
const validateFirstName = [required(), minLength(2), maxLength(15)];
const validateEmail = email();
const validateAge = [number(), minValue(18)];

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput label="First Name" source="firstName" validate={validateFirstName} />
            <TextInput label="Email" source="email" validate={validateEmail} />
            <TextInput label="Age" source="age" validate={validateAge}/>
        </SimpleForm>
    </Create>
);
```

## Migration to react-final-form Requires Custom App Modification

We used to implement some black magic in `formMiddleware` to handle `redux-form` correctly. It is no longer necessary now that we migrated to `react-final-form`. Besides, `redux-form` required a reducer which is no longer needed as well. 

If you had your own custom Redux store, you can migrate it by following this diff:

```diff
// in src/createAdminStore.js
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
-import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import {
    adminReducer,
    adminSaga,
    createAppReducer,
    defaultI18nProvider,
    i18nReducer,
-   formMiddleware,
    USER_LOGOUT,
} from 'react-admin';

export default ({
    authProvider,
    dataProvider,
    i18nProvider = defaultI18nProvider,
    history,
    locale = 'en',
}) => {
    const reducer = combineReducers({
        admin: adminReducer,
        i18n: i18nReducer(locale, i18nProvider(locale)),
-       form: formReducer,
        router: connectRouter(history),
        { /* add your own reducers here */ },
    });
    const resettableAppReducer = (state, action) =>
        reducer(action.type !== USER_LOGOUT ? state : undefined, action);

    const saga = function* rootSaga() {
        yield all(
            [
                adminSaga(dataProvider, authProvider, i18nProvider),
                // add your own sagas here
            ].map(fork)
        );
    };
    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        resettableAppReducer,
        { /* set your initial state here */ },
        compose(
            applyMiddleware(
                sagaMiddleware,
-               formMiddleware,
                routerMiddleware(history),
                // add your own middlewares here
            ),
            typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
                ? window.__REDUX_DEVTOOLS_EXTENSION__()
                : f => f
            // add your own enhancers here
        )
    );
    sagaMiddleware.run(saga);
    return store;
};
```

## Custom Forms Using `reduxForm()` Must Be Replaced By The `<Form>` Component

The [final-form migration documentation here](https://final-form.org/docs/react-final-form/migration/redux-form) explains the various changes you have to perform in your code.

```diff
-import { reduxForm } from 'redux-form'
+import { Form } from 'react-final-form'

-const CustomForm = reduxForm({ form: 'record-form', someOptions: true })(({ record, resource }) => (
+const CustomForm = ({ record, resource }) => (
+    <Form someOptions={true}>
+        {({ handleSubmit }) => (
+            <form onSubmit={handleSubmit}>
-            <Fragment>
                <Typography>Notes</Typography>
                <TextInput source="note" />
+            </form>
-            </Fragment>
+        )}
+    </Form>
+);
-));
```

## Material-ui Icons Have Changed

If you were using Material-ui icons for your design, be aware that some icons present in 1.X versions were removed from version 4.0.

Example:

* `LightbulbOutline` is no more available in `@Material-ui/icons`

But there is a quick fix for this one by using another package instead:

* `import Lightbulb from '@material-ui/docs/svgIcons/LightbulbOutline';`


## Custom Exporter Functions Must Use `jsonexport` Instead Of `papaparse`

React-admin used to bundle the `papaparse` library for converting JSON to CSV, as part of the Export functionality. But 90% of the `papaparse` code is used to convert CSV to JSON and was useless in react-admin. We decided to replace it by a lighter library: [jsonexport](https://github.com/kauegimenes/jsonexport).

If you had custom exporter on `List` components, here's how to migrate:

```diff
-import { unparse as convertToCSV } from 'papaparse/papaparse.min';
+import jsonExport from 'jsonexport/dist';

-const csv = convertToCSV({
-    data: postsForExport,
-    fields: ['id', 'title', 'author_name', 'body']
-});
-downloadCSV(csv, 'posts');
+jsonExport(postsForExport, {
+    headers: ['id', 'title', 'author_name', 'body']
+}, (err, csv) => {
+    downloadCSV(csv, 'posts');
+});
```

## The `exporter` Function Has Changed Signature

In a `List`, you can pass a custom `exporter` function to control the data downloaded by users when they click on the "Export" button.

```jsx
const CommentList = props => (
    <List {...props} exporter={exportComments}>
        // ...
    </List>
)
```

In react-admin v3, you can still pass an `exporter` function this way, but its signature has changed:

```diff
-const exportComments = (data, fetchRelaterRecords, dispatch) => {
+const exportComments = (data, fetchRelaterRecords, dataProvider) => {
    // ...
}
```

If you used `dispatch` to call the dataProvider using an action creator with a `callback` side effect, you will see that the v3 version makes your exporter code much simpler. If you used it to dispatch custom side effects (like notification or redirect), we recommend that you override the `<ExportButton>` component completely - it'll be much easier to maintain.

As a base, here is the simplified `ExportButton` code:

```jsx
import {
    downloadCSV,
    useDataProvider,
    useNotify,
} from 'react-admin';
import jsonExport from 'jsonexport/dist';

const ExportButton = ({ sort, filter, maxResults = 1000, resource }) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const payload = { sort, filter, pagination: { page: 1, perPage: maxResults }}
    const handleClick = dataProvider.getList(resource, payload)
        .then(({ data }) => jsonExport(data, (err, csv) => downloadCSV(csv, resource)))
        .catch(error => notify('ra.notification.http_error', { type: 'warning' }));

    return (
        <Button
            label="Export"
            onClick={handleClick}
        />
    );
};
```

## `authProvider` No Longer Uses Legacy React Context

When you provide an `authProvider` to the `<Admin>` component, react-admin creates a React context to make it available everywhere in the application. In version 2.x, this used the [legacy React context API](https://reactjs.org/docs/legacy-context.html). In 3.0, this uses the normal context API. That means that any context consumer will need to use the new context API.

```diff
-import * as React from "react";
+import * as React from 'react';
import { useContext } from 'react';
+import { AuthContext } from 'react-admin';

-const MyComponentWithAuthProvider = (props, context) => {
+const MyComponentWithAuthProvider = (props) => {
+   const authProvider = useContext(AuthContext);
    authProvider('AUTH_CHECK');
    return <div>I'm authenticated</div>;
}

-MyComponentWithAuthProvider.contextTypes = { authProvider: PropTypes.object }
```

If you didn't access the `authProvider` context manually, you have nothing to change. All react-admin components have been updated to use the new context API.

Note that direct access to the `authProvider` from the context is discouraged (and not documented). If you need to interact with the `authProvider`, use the new auth hooks:

- `useLogin`
- `useLogout`
- `useAuthenticated`
- `useAuthState`
- `usePermissions`

## `authProvider` No Longer Receives `match` in Params

Whenever it called the `authProvider`, react-admin used to pass both the `location` and the `match` object from react-router. In v3, the `match` object is no longer passed as argument. There is no legitimate usage of this parameter we can think about, and it forced passing down that object across several components for nothing, so it's been removed. Upgrade your `authProvider` to remove that parameter.

```diff
// in src/authProvider
export default (type, params) => {
-   const { location, match } = params;
+   const { location } = params;
    // ...
}
```

## The `authProvider` Must Handle Permissions

React-admin calls the `authProvider` to get the permissions for each page - using the `AUTH_GET_PERMISSIONS` verb. While in 2.x, implementing this `AUTH_GET_PERMISSIONS` verb was optional, it becomes compulsory in 3.0 as soon as you provide a custom `authProvider`. You can simply return a resolved Promise to ignore permissions handling.

```diff
// in src/authProvider.js
-import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';
+import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'react-admin';

export default (type, params) => {
    if (type === AUTH_LOGIN) {
        // ...
    }
    if (type === AUTH_LOGOUT) {
        // ...
    }
    if (type === AUTH_ERROR) {
        // ...
    }
    if (type === AUTH_CHECK) {
        const { resource } = params;
        if (resource === 'posts') {
            // check credentials for the posts resource
        }
        if (resource === 'comments') {
            // check credentials for the comments resource
        }
    }
+   if (type === AUTH_GET_PERMISSIONS) {
+       return Promise.resolve();
+   }
    return Promise.reject('Unknown method');
};
```

## The `authProvider` No Longer Receives Default Parameters

When calling the `authProvider` for permissions (with the `AUTH_GET_PERMISSIONS` verb), react-admin used to include the `pathname` as second parameter. That allowed you to return different permissions based on the page. In a similar fashion, for the `AUTH_CHECK` call, the `params` argument contained the `resource` name, allowing different checks for different resources.

We believe that authentication and permissions should not vary depending on where you are in the application ; it's up to components to decide to do something or not depending on permissions. So we've removed the default parameters from all the `authProvider` calls. 

If you want to keep location-dependent authentication or permissions logic, read the current location from the `window` object directly in your `authProvider`, using `window.location.hash` (if you use a hash router), or using `window.location.pathname` (if you use a browser router):

```diff
// in myauthProvider.js
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_GET_PERMISSIONS } from 'react-admin';
import decodeJwt from 'jwt-decode';

export default (type, params) => {
    if (type === AUTH_CHECK) {
-       const { resource } = params;
+       const resource = window.location.hash.substring(2, window.location.hash.indexOf('/', 2))
        // resource-dependent logic follows
    }
    if (type === AUTH_GET_PERMISSIONS) {
-       const { pathname } = params;
+       const pathname = window.location.hash;
        // pathname-dependent logic follows 
        // ...
    }
    return Promise.reject('Unknown method');
};
```

## No More Redux Actions For Authentication

React-admin now uses hooks instead of sagas to handle authentication and authorization. That means that react-admin no longer dispatches the following actions:

- `USER_LOGIN`
- `USER_LOGIN_LOADING`
- `USER_LOGIN_FAILURE`
- `USER_LOGIN_SUCCESS`
- `USER_CHECK`
- `USER_CHECK_SUCCESS`
- `USER_LOGOUT`

If you have custom Login or Logout buttons dispatching these actions, they will still work, but you are encouraged to migrate to the hook equivalents (`useLogin` and `useLogout`).

If you had custom reducer or sagas based on these actions, they will no longer work. You will have to reimplement that custom logic using the new authentication hooks. 

**Tip**: If you need to clear the Redux state, you can dispatch the `CLEAR_STATE` action.

## Login uses children instead of a loginForm prop

If you were using `Login` with a custom login form, you now need to pass that as a child instead of a prop of `Login`.

```diff
import { Login } from 'react-admin';
const LoginPage = () => (
     <Login
-        loginForm={<LoginForm />}
         backgroundImage={backgroundImage}
-    />
+    >
+        <LoginForm />
+    </Login>
 );
```

## i18nProvider Signature Changed

The react-admin translation (i18n) layer lets developers provide translations for UI and content, based on Airbnb's [Polyglot](https://airbnb.io/polyglot.js/) library. The `i18nProvider`, which contains that translation logic, used to be a function. It must now be an object exposing three methods: `translate`, `changeLocale` and `getLocale`.

```jsx
// react-admin 2.x
const i18nProvider = (locale) => messages[locale];

// react-admin 3.x
const polyglot = new Polyglot({ locale: 'en', phrases: messages.en });
let translate = polyglot.t.bind(polyglot);
let locale = 'en';
const i18nProvider = {
    translate: (key, options) => translate(key, options),
    changeLocale: newLocale => {
        locale = newLocale;
        return new Promise((resolve, reject) => {
            // load new messages and update the translate function
        })
    },
    getLocale: () => locale
} 
```

But don't worry: react-admin v3 contains a module called `ra-i18n-polyglot`, that is a wrapper around your old `i18nProvider` to make it compatible with the new provider signature:

```diff
import * as React from "react";
import { Admin, Resource } from 'react-admin';
+import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

const messages = {
    fr: frenchMessages,
    en: englishMessages,
};
-const i18nProvider = locale => messages[locale];
+const i18nProvider = polyglotI18nProvider(locale => messages[locale], 'fr');

const App = () => (
-    <Admin locale="fr" i18nProvider={i18nProvider}>
+    <Admin i18nProvider={i18nProvider}>
        ...
    </Admin>
);

export default App;
```

**Tip**: The `Admin` component does not accept a `locale` prop anymore as it is the `i18nProvider` provider responsibility. Pass the initial locale as second argument to `polyglotI18nProvider` instead of passing it to `Admin`

## The Translation Layer No Longer Uses Redux

The previous implementation if the i18n layer used Redux and redux-saga. In react-admin 3.0, the translation utilities are implemented using a React context and a set of hooks. 

If you didn't use translations, or if you passed your `i18nProvider` to the `<Admin>` component and used only one language, you have nothing to change. Your app will continue to work just as before. We encourage you to migrate from the `withTranslate` HOC to the `useTranslate` hook, but that's not compulsory.

```diff
-import { withTranslate } from 'react-admin';
+import { useTranslate } from 'react-admin';

-const SettingsMenu = ({ translate }) => {
+const SettingsMenu = () => {
+   const translate = useTranslate();
    return <MenuItem>{translate('settings')}</MenuItem>;
}

-export default withTranslate(SettingsMenu);
+export default SettingsMenu;
```

However, if your app allowed users to change locale at runtime, you need to update the menu or button that triggers that locale change. Instead of dispatching a `CHANGE_LOCALE` Redux action (which has no effect in react-admin 3.0), use the `useSetLocale` hook as follows:

```diff
import * as React from "react";
-import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
-import { changeLocale } from 'react-admin';
+import { useSetLocale } from 'react-admin';

-const localeSwitcher = ({ changeLocale }) => 
+const LocaleSwitcher = () => {
+   const setLocale = useSetLocale();
-   const switchToFrench = () => changeLocale('fr');
+   const switchToFrench = () => setLocale('fr');
-   const switchToEnglish = () => changeLocale('en');
+   const switchToEnglish = () => setLocale('en');
    return (
        <div>
            <div>Language</div>
            <Button onClick={switchToEnglish}>en</Button>
            <Button onClick={switchToFrench}>fr</Button>
        </div>
    );
}

-export default connect(null, { changeLocale })(LocaleSwitcher);
+export default LocaleSwitcher;
```

Also, if you connected a component to the Redux store to get the current language, you now need to use the `useLocale()` hook instead.

```diff
-import { connect } from 'react-redux';
+import { useLocale } from 'react-admin';

const availableLanguages = {
    en: 'English',
    fr: 'Français',
}

-const CurrentLanguage = ({ locale }) => {
+const CurrentLanguage = () => {
+   const locale = useLocale();
    return <span>{availableLanguages[locale]}</span>;
}

- const mapStatetoProps = state => state.i18n.locale

-export default connect(mapStateToProps)(CurrentLanguage);
+export default CurrentLanguage;
```

If you used a custom Redux store, you must update the `createAdminStore` call to omit the i18n details:

```diff
const App = () => (
    <Provider
        store={createAdminStore({
            authProvider,
            dataProvider,
-           i18nProvider,
            history,
        })}
    >
        <Admin
            authProvider={authProvider}
            dataProvider={dataProvider}
            history={history}
            title="My Admin"
        >
```

## `withDataProvider` No Longer Injects `dispatch`

The `withDataProvider` HOC used to inject two props: `dataProvider`, and Redux' `dispatch`. This last prop is now easy to get via the `useDispatch` hook from Redux, so `withDataProvider` no longer injects it.

```diff
import {
   showNotification,
   UPDATE,
   withDataProvider,
} from 'react-admin';
+ import { useDispatch } from 'react-redux';

-const ApproveButton = ({ dataProvider, dispatch, record }) => {
+const ApproveButton = ({ dataProvider, record }) => {
+   const dispatch = useDispatch();
    const handleClick = () => {
        const updatedRecord = { ...record, is_approved: true };
        dataProvider(UPDATE, 'comments', { id: record.id, data: updatedRecord })
            .then(() => {
                dispatch(showNotification('Comment approved'));
                dispatch(push('/comments'));
            })
            .catch((e) => {
                dispatch(showNotification('Error: comment not approved', 'warning'))
            });
    }

    return <Button label="Approve" onClick={handleClick} />;
}

export default withDataProvider(ApproveButton);
```

## Resource `context` Renamed to `intent`

If you're using a Custom App, you had to render `<Resource>` components with the registration *context* prior to rendering your app routes. The `context` prop was renamed to `intent` because it conflicted with a prop injected by `react-redux`.

```diff
-               <Resource name="posts" context="registration" />
+               <Resource name="posts" intent="registration" />
-               <Resource name="comments" context="registration" />
+               <Resource name="comments" intent="registration" />
-               <Resource name="users" context="registration" />
+               <Resource name="users" intent="registration" />
```

## `<ReferenceField>` `linkType` Prop Renamed to `link`

When using the `<ReferenceField>` component, you should rename the `linkType` prop to `link`. This prop now also accepts custom functions to return a link (see the Fields documentation).

```diff
- <ReferenceField resource="comments" record={data[id]} source="post_id" reference="posts" basePath={basePath} linkType="show">
+ <ReferenceField resource="comments" record={data[id]} source="post_id" reference="posts" basePath={basePath} link="show">
```

## `<CardActions>` Renamed to `<TopToolbar>`

The `<CardActions>` component, which used to wrap the action buttons in the `Edit`, `Show` and `Create` views, is now named `<TopToolbar>`. That's because actions aren't located inside the `Card` anymore, but above it.

```diff
import Button from '@material-ui/core/Button';
-import { CardActions, ShowButton } from 'react-admin';
+import { TopToolbar, ShowButton } from 'react-admin';

const PostEditActions = ({ basePath, data, resource }) => (
-   <CardActions>
+   <TopToolbar>
        <ShowButton basePath={basePath} record={data} />
        {/* Add your custom actions */}
        <Button color="primary" onClick={customAction}>Custom Action</Button>
-   </CardActions>
+   </TopToolbar>
);

export const PostEdit = (props) => (
    <Edit actions={<PostEditActions />} {...props}>
        ...
    </Edit>
);
```

But watch out, you can't just replace "CardActions" by "TopToolbar" in your entire codebase, because you probably also use material-ui's `<CardActions>`, and that component still exists. The fact that react-admin exported a component with the same name but with a different look and feel than the material-ui component was also a motivation to rename it.

## `<Admin>` `appLayout` Prop Renamed To `layout`

You can inject a layout component in the `<Admin>` component to override the default layout. However, this injection used a counterintuitive prop name: `appLayout`. It has been renamed to the more natural `layout`.

You will only have to change your code if you used a custom layout:

```diff
const App = () => (
-   <Admin appLayout={MyLayout}>
+   <Admin layout={MyLayout}>
        <Resource name="posts" list={PostList} edit={PostEdit} />
    </Admin>
);
```

## Prop `isLoading` Renamed To `loading`

Most of the react-admin controller components that fetch data used to inject an `isLoading` boolean prop, set to true whenever a `dataProvider` call was pending. This prop was renamed to `loading` everywhere. Use the search and replace feature of your IDE to rename that prop.

For instance:

```diff
  <ReferenceInputController {...props}>
-     {({ isLoading, otherProps }) => (
+     {({ loading, otherProps }) => (
          <CustomReferenceInputView
              {...otherProps}
-             isLoading={isLoading}
+             loading={loading}
          />
      )}
  </ReferenceInputController>
```

## Prop `loadedOnce` Renamed To `loaded`

The `List`, `ReferenceArrayField` and `ReferenceManyField` used to inject a `loadedOnce` prop to their child. This prop has been renamed to `loaded`.

As a consequence, the components usually used as child of these 3 components now accept a `loaded` prop instead of `loadedOnce`. This concerns `Datagrid`, `SingleFieldList`, and `GridList`.

This change is transparent unless you use a custom view component inside a `List`, `ReferenceArrayField` or `ReferenceManyField`.

```diff
const PostList = props => (
    <List {...props}>
        <MyListView />
    </List>
)

-const MyListView = ({ loadedOnce, ...props }) => (
+const MyListView = ({ loaded, ...props }) => (
-   if (!loadedOnce) return null;
+   if (!loaded) return null;
    // rest of the view
);
```

## Deprecated components were removed

Components deprecated in 2.X have been removed in 3.x. This includes:

* `AppBarMobile` (use `AppBar` instead, which is responsive)
* `Header` (use `Title` instead)
* `ViewTitle` (use `Title` instead)
* `RecordTitle` (use `TitleForRecord` instead)
* `TitleDeprecated` (use `Title` instead)
* `Headroom` (use `HideOnScroll` instead)
* `LongTextInput` (use the `TextInput` instead)

```diff
- import { LongTextInput } from 'react-admin';
- <LongTextInput source="body" />
+ import { TextInput } from 'react-admin';
+ <TextInput multiline source="body" />
```

* `BulkActions` (use the [`bulkActionButtons` prop](https://marmelab.com/react-admin/List.html#bulk-action-buttons) instead)

```diff
- const PostBulkActions = props => (
-     <BulkActions {...props}>
-         <CustomBulkMenuItem />
-         {/* Add the default bulk delete action */}
-         <BulkDeleteMenuItem />
-     </BulkActions>
- );
+ const PostBulkActionButtons = props => (
+     <Fragment>
+         <ResetViewsButton label="Reset Views" {...props} />
+         {/* Add the default bulk delete action */}
+         <BulkDeleteButton {...props} />
+     </Fragment>
+ );

export const PostList = (props) => (
    <List 
        {...props} 
-       bulkActions={<PostBulkActions />}
+       bulkActionButtons={<PostBulkActionButtons />}>
        ...
    </List>
);
```

## The `DisabledInput` Component Was Removed

See [RFC 3518](https://github.com/marmelab/react-admin/issues/3518) for the rationale.

You can replace `<DisabledInput>` with a disabled or read-only `TextInput`. For example, the `disabled` prop:

```diff
-import { DisabledInput } from 'react-admin';
+import { TextInput } from 'react-admin';

-<DisabledInput source="id" />
+<TextInput source="id" disabled />
```

See material-ui [`TextField` documentation](https://material-ui.com/components/text-fields/#textfield) for available options.

## The SideBar Width Must Be Set Through The `theme`

The `<SideBar>` component used to accept `size` and `closedSize` prop to control its width.

You can now customize those values by providing a custom material-ui theme.

```jsx
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    sidebar: {
        width: 300, // The default value is 240
        closedWidth: 70, // The default value is 55
    },
});

const App = () => (
    <Admin theme={theme} dataProvider={simpleRestProvider('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

## Reference Inputs No Longer Inject A `helperText` field Inside `meta`

`<ReferenceInput>` used to send a `helperText` inside the `meta` prop of its child whenever it was unable to retrieve referenced records. The same goes for `<ReferenceArrayInput>`.

These components now use the `meta: { error }` prop and won't override their child `helperText` anymore.

Furthermore, they don't support the `helperText` at all anymore as this is a pure UI concern which should be handled by their child.

If you've implemented a custom child component for `<ReferenceInput>` of `<ReferenceArrayInput>`, you must now display the `error` in your component.

```diff
const MySelectIpnut = ({
    // ...
-   meta: { helperText }
+   meta: { error }
}) => (
    if (error) {
        // ReferenceInput couldn't check referenced records, and therefore the choices list is empty
        // display a custo merror message here.
    }
);
```

## `helperText` Is Handled The Same Way In All Components

Somewhat related to the previous point, some components (such as `<SelectArrayInput>`) used to accept a `helperText` prop in their `meta` prop. They now receive it directly in their props.

Besides, all components now display their error or their helper text, but not both at the same time.

This has no impact unless you used to set the `helperText` manually in `<SelectArrayInput>`:

```diff
const Postedit = props =>
  <Edit {...props}>
      <SimpleForm>
          // ...
         <SelectArrayInput
            label="Tags"
            source="categories"
-           meta={{ helperText: 'Select categories' }}
+           helperText="Select categories"
            choices={[
             { id: 'music', name: 'Music' },
             { id: 'photography', name: 'Photo' },
             { id: 'programming', name: 'Code' },
             { id: 'tech', name: 'Technology' },
             { id: 'sport', name: 'Sport' },
            ]}
           />
      </SimpleForm>
  </Edit>
```

## Form Inputs Are Now `filled` And `dense` By Default

To better match the [Material Design](https://material.io/components/text-fields/) specification, react-admin defaults to the *filled* variant for form inputs, and uses a *dense* margin to allow more compact forms. This will change the look and feel of existing forms built with `<SimpleForm>`, `<TabbedForm>`, and `<Filter>`. If you want your forms to look just like before, you need to set the `variant` and `margin` props as follows: 

```diff
// for SimpleForm
const PostEdit = props =>
    <Edit {...props}>
        <SimpleForm
+           variant="standard"
+           margin="normal"
        >
            // ...
        </SimpleForm>
    </Edit>;
// for TabbedForm
const PostEdit = props =>
    <Edit {...props}>
        <TabbedForm
+           variant="standard"
+           margin="normal"
        >
            <FormTab label="Identity>
                // ...
            </FormTab>
        </TabbedForm>
    </Edit>;
// for Filter
const PostFilter = props => 
-   <Filter>
+   <Filter variant="standard">
        // ...
    </Filter>;
```

## `<Form>` `defaultValue` Prop Was Renamed To `initialValues`

This is actually to be consistent with the underlying form library ([final-form](https://final-form.org/docs/react-final-form/getting-started))

```diff
// for SimpleForm
const PostEdit = props =>
    <Edit {...props}>
        <SimpleForm
-           defaultValue={{ stock: 0 }}
+           initialValues={{ stock: 0 }}
        >
            // ...
        </SimpleForm>
    </Edit>;
// for TabbedForm
const PostEdit = props =>
    <Edit {...props}>
        <TabbedForm
-           defaultValue={{ stock: 0 }}
+           initialValues={{ stock: 0 }}
        >
            <FormTab label="Identity>
                // ...
            </FormTab>
        </TabbedForm>
    </Edit>;
```

## Prefilling Some Fields Of A `<Create>` Page Needs Different URL Syntax

We've described how to pre-fill some fields in the create form in an [Advanced Tutorial](https://marmelab.com/blog/2018/07/09/react-admin-tutorials-form-for-related-records.html). In v2, you had to pass all the fields to be pre-filled as search parameters. In v3, you have to pass a single `source` search parameter containing a stringified object:

```jsx
const AddNewCommentButton = ({ record }) => (
    <Button
        component={Link}
        to={{
            pathname: "/comments/create",
-           search: `?post_id=${record.id}`,
+           search: `?source=${JSON.stringify({ post_id: record.id })}`,
        }}
        label="Add a comment"
    >
        <ChatBubbleIcon />
    </Button>
);
```

That's what the `<CloneButton>` does in react-admin v3:

```jsx
export const CloneButton = ({
    basePath = '',
    label = 'ra.action.clone',
    record = {},
    icon = <Queue />,
    ...rest
}) => (
    <Button
        component={Link}
        to={{
            pathname: `${basePath}/create`,
            search: stringify({ source: JSON.stringify(omitId(record)) }),
        }}
        label={label}
        onClick={stopPropagation}
        {...sanitizeRestProps(rest)}
    >
        {icon}
    </Button>
);
```

## The `<AutocompleteInput>` And `<AutocompleteArrayInput>` Components No Longer Support Certain Props

We rewrote the `<AutocompleteInput>` and `<AutocompleteArrayInput>` components from scratch using [downshift](https://github.com/downshift-js/downshift), while the previous version was based on [react-autosuggest](https://react-autosuggest.js.org/). The new components are more robust and more future-proof, and their API didn't change.

There are three breaking changes in the new `<AutocompleteInput>` and `<AutocompleteArrayInput>` components:

- The `inputValueMatcher` prop is gone. We removed a feature many found confusing: the auto-selection of an item when it was matched exactly. So react-admin no longer selects anything automatically, therefore the `inputValueMatcher` prop is obsolete.

```diff
<AutocompleteInput
    source="role"
-   inputValueMatcher={() => null}
/>
<AutocompleteArrayInput
    source="role"
-   inputValueMatcher={() => null}
/>
```
 
- Specific [`react-autosuggest` props](https://github.com/moroshko/react-autosuggest#props) (like `onSuggestionsFetchRequested`, `theme`, or `highlightFirstSuggestion`) are no longer supported, because the component now passes extra props to a `<Downshift>` component.
 
```diff
<AutocompleteInput
    source="role"
-   highlightFirstSuggestion={true}
/>
<AutocompleteArrayInput
    source="role"
-   highlightFirstSuggestion={true}
/>
```

- The `suggestionComponent` prop is gone.

Instead, the new `<AutocompleteInput>` and `<AutocompleteArrayInput>` components use the `optionText` prop, like all other inputs accepting choices. However, if you pass a React element as the `optionText`, you must now also specify the new `matchSuggestion` prop. This is required because the inputs use the `optionText` by default to filter suggestions. This function receives the current filter and a choice, and should return a boolean indicating whether this choice matches the filter.

```diff
<AutocompleteInput
    source="role"
-   suggestionComponent={MyComponent}
+   optionText={<MyComponent />}
+   matchSuggestion={matchSuggestion}
/>

<AutocompleteArrayInput
    source="role"
-   suggestionComponent={MyComponent}
+   optionText={<MyComponent />}
+   matchSuggestion={matchSuggestion}
/>
```
 
Besides, some props which were applicable to both components did not make sense for the `<AutocompleteArrayInput>` component:

- `allowEmpty`: As the `<AutocompleteArrayInput>` deals with arrays, it does not make sense to add an empty choice. This prop is no longer accepted and will be ignored.
- `limitChoicesToValue`: As the `<AutocompleteArrayInput>` deals with arrays and only accepts unique items, it does not make sense to show only the already selected items. This prop is no longer accepted and will be ignored.

```diff
<AutocompleteArrayInput
    source="role"
-   allowEmpty={true}
-   limitChoicesToValue={true}
/>
```

## New DataProviderContext Requires Custom App Modification

The new dataProvider-related hooks (`useQuery`, `useMutation`, `useDataProvider`, etc.) grab the `dataProvider` instance from a new React context. If you use the `<Admin>` component, your app will continue to work and there is nothing to do, as `<Admin>` now provides that context. But if you use a Custom App, you'll need to set the value of that new `DataProvider` context:

```diff
-import { TranslationProvider, Resource } from 'react-admin';
+import { TranslationProvider, DataProviderContext, Resource } from 'react-admin';

const App = () => (
    <Provider
        store={createAdminStore({
            authProvider,
            dataProvider,
            i18nProvider,
            history,
        })}
    >
        <TranslationProvider>
+           <DataProviderContext.Provider value={dataProvider}>
                <ThemeProvider>
                    <Resource name="posts" intent="registration" />
                    ...
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <Typography variant="h6" color="inherit">
                                My admin
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <ConnectedRouter history={history}>
                        <Switch>
                            <Route exact path="/" component={Dashboard} />
                            <Route exact path="/posts" render={(routeProps) => <PostList hasCreate resource="posts" {...routeProps} />} />
                            <Route exact path="/posts/create" render={(routeProps) => <PostCreate resource="posts" {...routeProps} />} />
                            <Route 
                                exact 
                                path="/posts/:id" 
                                render={(routeProps) => (
                                    <PostEdit 
                                        hasShow 
                                        resource="posts" 
                                        id={decodeURIComponent((routeProps.match).params.id)}
                                        {...routeProps} 
                                    />
                                )} 
                            />
                            <Route 
                                exact 
                                path="/posts/:id/show" 
                                render={(routeProps) => (
                                    <PostShow 
                                        hasEdit 
                                        resource="posts" 
                                        id={decodeURIComponent((routeProps.match).params.id)}
                                        {...routeProps} 
                                    />
                                )} 
                            />
                            ...
                        </Switch>
                    </ConnectedRouter>
                </ThemeProvider>
+           </DataProviderContext.Provider>
        </TranslationProvider>
    </Provider>
);
```

Note that if you were unit testing controller components, you'll probably need to add a mock `dataProvider` via `<DataProviderContext>` in your tests, too.

## Custom `<Notification>` Components Must Emit UndoEvents

The undo feature is partially implemented in the `Notification` component. If you've overridden that component, you'll have to add a call to `undoableEventEmitter` in case of confirmation and undo:

```diff
// in src/MyNotification.js
import * as React from "react";
import { connect } from 'react-redux';
import compose from 'lodash/flowRight';
import classnames from 'classnames';
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles, createStyles } from "@material-ui/core";
import {
    complete,
    undo,
    translate,
    getNotification,
    hideNotification,
    Button,
+   undoableEventEmitter,
} from 'react-admin';

const styles = theme =>
  createStyles({
    confirm: {
      backgroundColor: theme.palette.background.default
    },
    warning: {
      backgroundColor: theme.palette.error.light
    },
    undo: {
      color: theme.palette.primary.light
    }
  });

class Notification extends React.Component {
    state = {
        open: false,
    };
    componentWillMount = () => {
        this.setOpenState(this.props);
    };
    componentWillReceiveProps = nextProps => {
        this.setOpenState(nextProps);
    };

    setOpenState = ({ notification }) => {
        this.setState({
            open: !!notification,
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    handleExited = () => {
        const { notification, hideNotification, complete } = this.props;
        if (notification && notification.undoable) {
            complete();
+           undoableEventEmitter.emit('end', { isUndo: false });
        }
        hideNotification();
    };

    handleUndo = () => {
        const { undo } = this.props;
        undo();
+       undoableEventEmitter.emit('end', { isUndo: true });
    };

    render() {
        const {
            undo,
            complete,
            classes,
            className,
            type,
            translate,
            notification,
            autoHideDuration,
            hideNotification,
            ...rest
        } = this.props;
        const {
            warning,
            confirm,
            undo: undoClass, // Rename classes.undo to undoClass in this scope to avoid name conflicts
            ...snackbarClasses
        } = classes;
        return (
            <Snackbar
                open={this.state.open}
                message={
                    notification &&
                    notification.message &&
                    translate(notification.message, notification.messageArgs)
                }
                autoHideDuration={
                    (notification && notification.autoHideDuration) ||
                    autoHideDuration
                }
                disableWindowBlurListener={
                    notification && notification.undoable
                }
                onExited={this.handleExited}
                onClose={this.handleRequestClose}
                ContentProps={{
                    className: classnames(
                        classes[(notification && notification.type) || type],
                        className
                    ),
                }}
                action={
                    notification && notification.undoable ? (
                        <Button
                            color="primary"
                            className={undoClass}
                            size="small"
-                           onClick={undo}
+                           onClick={this.handleUndo}
                        >
                            {translate('ra.action.undo')}
                        </Button>
                    ) : null
                }
                classes={snackbarClasses}
                {...rest}
            />
        );
    }
}

const mapStateToProps = state => ({
  notification: getNotification(state)
});

export default compose(
  translate,
  withStyles(styles),
  connect(
    mapStateToProps,
    {
      complete,
      hideNotification,
      undo
    }
  )
)(Notification);
```

## No More Tree Packages in Core

The `ra-tree` and `ra-tree-ui-material-ui` packages were removed in v3. The v2 version performed poorly, and we don't want to delay v3 to reimplement the Tree packages.

If you were using these packages just for displaying a tree, you'll have to reimplement a basic tree widget, taking the Tags list from the Simple example as an inspiration. If you were using these packages for creating and updating a tree, we recommend that you wait until the core team or another community member publishes a Tree package compatible with v3.
