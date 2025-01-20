---
layout: default
title: "useShowController"
---

# `useShowController`

`useShowController` contains the headless logic of the [`<Show>`](./Show.md) component. It's useful to create a custom Show view. It's also the base hook when building a custom view with another UI kit than Material UI. 

`useShowController` reads the resource name and id from the resource context and browser location, fetches the record from the data provider via `dataProvider.getOne()`, computes the default page title, and returns them. Its return value matches the [`ShowContext`](./useShowContext.md) shape. 

`useShowController` is used internally by [`<Show>`](./Show.md) and [`<ShowBase>`](./ShowBase.md). If your Show view uses react-admin components like `<TextField>`, prefer [`<ShowBase>`](./ShowBase.md) to `useShowController` as it takes care of creating a `<ShowContext>`.

## Usage

You can use `useShowController` to create your own custom Show view, like this one:

```jsx
import { useShowController, RecordContextProvider, SimpleShowLayout } from 'react-admin';

const PostShow = () => {
    const { defaultTitle, error, isPending, record } = useShowController();

    if (isPending) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error!</div>;
    }
    return (
        <RecordContextProvider value={record}>
            <h1>{defaultTitle}</h1>
            <SimpleShowLayout>
                <TextField source="title" />
                ...
            </SimpleShowLayout>
        </RecordContextProvider>
    );
};
```

This custom Show view has no action buttons - it's up to you to add them in pure React.

**Tip**: Use [`<ShowBase>`](./ShowBase.md) instead of `useShowController` if you need a component version of that hook.

## Parameters

`useShowController` accepts an object with the following keys, all optional: 

* [`disableAuthentication`](#disableauthentication): Boolean, set to `true` to disable the authentication check.
* [`id`](#id): Record identifier. If not provided, it will be deduced from the URL.
* [`queryOptions`](#queryoptions): Options object to pass to the [`useQuery`](./Actions.md#usequery-and-usemutation) hook.
* [`resource`](#resource): Resource name, e.g. `posts`


## `disableAuthentication`

By default, the `useShowController` hook will automatically redirect the user to the login page if the user is not authenticated. If you want to disable this behavior and allow anonymous access to a show page, set the `disableAuthentication` prop to `true`.

```jsx
import { useShowController } from 'react-admin';

const PostShow = () => {
    const { record } = useShowController({ disableAuthentication: true });

    return (
        <div>
            <h1>{record.title}</h1>
            <p>{record.body}</p>
        </div>
    );
};
```

## `id`

By default, `useShowController` reads the record id from the browser location. But by passing an `id` prop, you can run the controller logic on an arbitrary record id:

```jsx
const Post1234Show = () => {
    const { record } = useShowController({ id: 1234 });

    return (
        <div>
            <h1>{record.title}</h1>
            <p>{record.body}</p>
        </div>
    );
};
```

## `queryOptions`

`useShowController` accepts a `queryOptions` prop to pass options to the react-query client. 

This can be useful e.g. to override the default error side effect. By default, when the `dataProvider.getOne()` call fails at the dataProvider level, react-admin shows an error notification and refreshes the page.

You can override this behavior and pass custom side effects by providing a custom `queryOptions` prop:

```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, ShowBase, SimpleShowLayout } from 'react-admin';

const PostShow = props => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onError = (error) => {
        notify(`Could not load post: ${error.message}`, { type: 'error' });
        redirect('/posts');
        refresh();
    };

    const {
        defaultTitle,
        error,
        isPending,
        record,
    } = useShowController({ queryOptions: { onError } });

    if (isPending) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error!</div>;
    }
    return (
        <RecordContextProvider value={record}>
            <h1>{defaultTitle}</h1>
            <SimpleShowLayout>
                <TextField source="title" />
                ...
            </SimpleShowLayout>
        </RecordContextProvider>
    );
}
```

The `onError` function receives the error from the dataProvider call (`dataProvider.getOne()`), which is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviderWriting.md#error-format)).

The default `onError` function is:

```js
(error) => {
    notify('ra.notification.item_doesnt_exist', { type: 'error' });
    redirect('list', resource);
    refresh();
}
```

## `resource`

By default, `useShowController` reads the resource name from the resource context. But by passing a `resource` prop, you can run the controller logic on an arbitrary resource:

```jsx
const PostShow = () => {
    const { record } = useShowController({ resource: 'posts'; id: 1234 });
    return (
        <div>
            <h1>{record.title}</h1>
            <p>{record.body}</p>
        </div>
    );
};
```

## Return Value

`useShowController` returns an object with the following keys:

```jsx
const {
    defaultTitle, // Translated title based on the resource, e.g. 'Post #123'
    isPending, // Boolean, true until the record is available
    isFetching, // Boolean, true while the record is being fetched, and false once done fetching
    isLoading, // Boolean, true until the record is available for the first time
    record, // Either the record fetched via dataProvider.getOne() based on the id from the location, a cached version of the record (see also the Caching documentation page) or undefined 
    refetch, // Callback to refetch the record via dataProvider.getOne()
    resource, // The resource name, deduced from the location. e.g. 'posts'
    error, // Error returned by dataProvider when it failed to fetch the record. Useful if you want to adapt the view instead of just showing a notification using the onError side effect.
} = useShowController();
```

## Controlled Mode

By default, `useShowController` reads the resource name from the resource context, and the record id from the browser location.

But by passing `resource` and `id` props, you can run the controller logic outside these contexts:

```jsx
import { useShowController } from 'react-admin';
import ShowView from './ShowView';

const MyShow = () => {
    const controllerProps = useShowController({ resource: 'posts', id: 1234 });
    return <ShowView {...controllerProps} />;
};
```

## Security

`useShowController` requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](./Show.md#disableauthentication) prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `useShowController` will only render if the user has the "show" access to the related resource.

For instance, for the `<PostShow>` page below:

```tsx
import { useShowController, SimpleShowLayout, TextField } from 'react-admin';

const PostShow = ({ id }) => {
  const { isPending, error, data } = useShowController({ resource: 'posts', id })
  if (error) return <div>Error!</div>;
  if (isPending) return <div>Loading...</div>;
  return (
      <SimpleShowLayout record={data}>
        <TextField source="title" />
        <TextField source="author" />
        <TextField source="published_at" />
      </SimpleShowLayout>
  );
}
```

`useShowController` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "show", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./Admin.md#accessdenied).

**Note**: Access control is disabled when you use [the `disableAuthentication` prop](./Show.md#disableauthentication).
