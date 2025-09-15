---
title: "<ShowBase>"
---

`<ShowBase>` fetches the record from the data provider via `dataProvider.getOne()`, puts it in a [`ShowContext`](./useShowContext.md), and renders its child. Use it to build a custom show page layout.

As a headless component, it does not render any layout by default.

`<ShowBase>` relies on the [`useShowController`](./useShowController.md) hook.

## Usage

Use `<ShowBase>` instead of `<Show>` when you want a completely custom page layout, without the default actions and title.

```jsx
// in src/posts.jsx
import * as React from "react";
import { ShowBase } from 'ra-core';

const PostShow = () => (
    <ShowBase resource="posts">
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 2 }}>
                <div>
                    ...
                </div>
            </div>
            <div style={{ flex: 1 }}>
                Show instructions...
            </div>
        </div>
        <div>
            Post related links...
        </div>
    </ShowBase>
);
```

Components using `<ShowBase>` can be used as the `show` prop of a `<Resource>` component:

```jsx
// in src/App.jsx
import { CoreAdmin, Resource } from 'ra-core';

import { dataProvider } from './dataProvider';
import { PostShow } from './posts';

const App = () => (
    <CoreAdmin dataProvider={dataProvider}>
        <Resource name="posts" show={PostShow} />
    </CoreAdmin>
);
```

**Tip**: See [`useShowController`](./useShowController.md) for a completely headless version of this component.

## Props

| Prop                     | Required | Type                                                     | Default | Description
|--------------------------|----------|----------------------------------------------------------|---------|--------------------------------------------------------
| `authLoading`            | Optional | `ReactNode`                                              |         | The component to render while checking for authentication and permissions
| `children`               | Optional | `ReactNode`                                              |         | The components rendering the record fields
| `render`                 | Optional | `(props: ShowControllerResult<RecordType>) => ReactNode` |         | Alternative to children, a function that takes the ShowController context and renders the form
| `disable Authentication` | Optional | `boolean`                                                |         | Set to `true` to disable the authentication check
| `id`                     | Optional | `string`                                                 |         | The record identifier. If not provided, it will be deduced from the URL
| `offline`                | Optional | `ReactNode`                                              |         | The component to render when there is no connectivity and the record isn't in the cache
| `queryOptions`           | Optional | `object`                                                 |         | The options to pass to the `useQuery` hook
| `resource`               | Optional | `string`                                                 |         | The resource name, e.g. `posts`

## `authLoading`

By default, `<ShowBase>` renders nothing while checking for authentication and permissions. You can provide your own component via the `authLoading` prop:

```jsx
import { ShowBase } from 'ra-core';

export const PostShow = () => (
    <ShowBase authLoading={<p>Checking for permissions...</p>}>
        ...
    </ShowBase>
);
```

## `children`

`<ShowBase>` renders its children wrapped by a `RecordContext`, so you can use any component that depends on such a context to be defined.

For instance, to display several fields in a grid layout:

```jsx
import { ShowBase, ReferenceFieldBase, WithRecord } from 'ra-core';
import { TextField } from './TextField';
import { DateField } from './DateField';

const BookShow = () => (
    <ShowBase>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', margin: '1rem' }}>
            <div>
                <TextField label="Title" source="title" />
            </div>
            <div>
                <ReferenceFieldBase label="Author" source="author_id" reference="authors">
                    <TextField source="name" />
                </ReferenceFieldBase>
            </div>
            <div>
                <DateField label="Publication Date" source="published_at" />
            </div>
            <div>
                <WithRecord render={record => (
                    <span>
                        {record.rating >= 1 ? '⭐' : '☆'}
                        {record.rating >= 2 ? '⭐' : '☆'}
                        {record.rating >= 3 ? '⭐' : '☆'}
                        {record.rating >= 4 ? '⭐' : '☆'}
                        {record.rating >= 5 ? '⭐' : '☆'}
                    </span>
                )} />
            </div>
        </div>
    </ShowBase>
);
```

## `disableAuthentication`

By default, the `<ShowBase>` component will automatically redirect the user to the login page if the user is not authenticated. If you want to disable this behavior and allow anonymous access to a show page, set the `disableAuthentication` prop to `true`.

```jsx
import { ShowBase } from 'ra-core';

const PostShow = () => (
    <ShowBase disableAuthentication>
        ...
    </ShowBase>
);
```

## `id`

By default, `<ShowBase>` deduces the identifier of the record to show from the URL path. So under the `/posts/123/show` path, the `id` prop will be `123`. You may want to force a different identifier. In this case, pass a custom `id` prop.

```jsx
import { ShowBase } from 'ra-core';

export const PostShow = () => (
    <ShowBase id="123">
        ...
    </ShowBase>
);
```

**Tip**: Pass both a custom `id` and a custom `resource` prop to use `<ShowBase>` independently of the current URL. This even allows you to use more than one `<ShowBase>` component in the same page.

## `offline`

By default, `<ShowBase>` renders nothing when there is no connectivity and the record hasn't been cached yet. You can provide your own component via the `offline` prop:

```jsx
import { ShowBase } from 'ra-core';

export const PostShow = () => (
    <ShowBase offline={<p>No network. Could not load the post.</p>}>
        ...
    </ShowBase>
);
```

**Tip**: If the record is in the Tanstack Query cache but you want to warn the user that they may see an outdated version, you can use the `<IsOffline>` component:

```jsx
import { ShowBase, IsOffline } from 'ra-core';

export const PostShow = () => (
    <ShowBase offline={<p>No network. Could not load the post.</p>}>
        <IsOffline>
            No network. The post data may be outdated.
        </IsOffline>
        ...
    </ShowBase>
);
```

## `queryOptions`

`<ShowBase>` accepts a `queryOptions` prop to pass options to the react-query client. 

This can be useful e.g. to override the default error side effect. By default, when the `dataProvider.getOne()` call fails at the dataProvider level, ra-core shows an error notification and refreshes the page.

You can override this behavior and pass custom side effects by providing a custom `queryOptions` prop:

```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, ShowBase } from 'ra-core';

const PostShow = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onError = (error) => {
        notify(`Could not load post: ${error.message}`, { type: 'error' });
        redirect('/posts');
        refresh();
    };

    return (
        <ShowBase queryOptions={{ onError }}>
                ...
        </ShowBase>
    );
}
```

The `onError` function receives the error from the dataProvider call (`dataProvider.getOne()`), which is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviderWriting.md#error-format)).

The default `onError` function is:

```jsx
(error) => {
    notify('ra.notification.item_doesnt_exist', { type: 'error' });
    redirect('list', resource);
    refresh();
}
```

## `render`

Alternatively, you can pass a `render` function prop instead of children. This function will receive the `ShowContext` as argument. 

```jsx
import { ShowBase } from 'ra-core';

const BookShow = () => (
    <ShowBase render={({ isPending, error, record }) => {
        if (isPending) {
            return <p>Loading...</p>;
        }

        if (error) {
            return (
                <p className="error">
                    {error.message}
                </p>
            );
        }
        return <p>{record.title}</p>;
    }}/>
);
```

## `resource`

By default, `<ShowBase>` operates on the current `ResourceContext` (defined at the routing level), so under the `/posts/1/show` path, the `resource` prop will be `posts`. You may want to force a different resource. In this case, pass a custom `resource` prop, and it will override the `ResourceContext` value.

```jsx
import { ShowBase } from 'ra-core';

export const UsersShow = () => (
    <ShowBase resource="users">
        ...
    </ShowBase>
);
```

**Tip**: Pass both a custom `id` and a custom `resource` prop to use `<ShowBase>` independently of the current URL. This even allows you to use more than one `<ShowBase>` component in the same page.

## Security

The `<ShowBase>` component requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](#disableauthentication) prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<ShowBase>`  will only render if the user has the "show" access to the related resource.

For instance, for the `<PostShow>`page below:

```tsx
import { ShowBase } from 'ra-core';
import { TextField } from './TextField';

// Resource name is "posts"
const PostShow = () => (
    <ShowBase>
        <TextField source="title" />
        <TextField source="author" />
        <TextField source="published_at" />
    </ShowBase>
);
```

`<ShowBase>` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "show", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./CoreAdmin.md#accessdenied).

**Note**: Access control is disabled when you use [the `disableAuthentication` prop](#disableauthentication).
