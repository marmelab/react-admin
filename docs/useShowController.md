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
    const {
        defaultTitle, // the translated title based on the resource, e.g. 'Post #123'
        error,  // error returned by dataProvider when it failed to fetch the record. Useful if you want to adapt the view instead of just showing a notification using the `onError` side effect.
        isFetching, // boolean that is true while the record is being fetched, and false once the record is fetched
        isLoading, // boolean that is true until the record is available for the first time
        record, // record fetched via dataProvider.getOne() based on the id from the location
        refetch, // callback to refetch the record via dataProvider.getOne()
        resource, // the resource name, deduced from the location. e.g. 'posts'
    } = useShowController();

    if (isLoading) {
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

`useShowController` expects one parameter argument. It's an object with the following attributes: 

| Name             | Required | Type              | Default | Description
|------------------|----------|-------------------|---------|--------------------------------------------------------
| `disable Authentication` | Optional | `boolean` |         | Set to `true` to disable the authentication check.
| `id`             | Optional | `string`          |         | The record identifier. If not provided, it will be deduced from the URL.
| `queryOptions`   | Optional | `object`          |         | The options to pass to the [`useQuery`](./Actions.md#usequery-and-usemutation) hook.
| `resource`       | Optional | `string`          |         | The resource name, e.g. `posts`

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
        isLoading,
        record,
    } = useShowController({ queryOptions: { onError } });

    if (isLoading) {
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
