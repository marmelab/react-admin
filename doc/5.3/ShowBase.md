---
layout: default
title: "The ShowBase Component"
---

# `<ShowBase>`

`<ShowBase>` is a headless variant of [`<Show>`](./Show.md). It fetches the record from the data provider via `dataProvider.getOne()`, puts it in a [`ShowContext`](./useShowContext.md), and renders its child. Use it to build a custom show page layout.

Contrary to [`<Show>`](./Show.md), it does not render the page layout, so no title, no actions, and no `<Card>`.

`<ShowBase>` relies on the [`useShowController`](./useShowController.md) hook.

## Usage

Use `<ShowBase>` instead of `<Show>` when you want a completely custom page layout, without the default actions and title.

```jsx
// in src/posts.jsx
import * as React from "react";
import { ShowBase } from 'react-admin';

const PostShow = () => (
    <ShowBase resource="posts">
        <Grid container>
            <Grid item xs={8}>
                <SimpleShowLayout>
                    ...
                </SimpleShowLayout>
            </Grid>
            <Grid item xs={4}>
                Show instructions...
            </Grid>
        </Grid>
        <div>
            Post related links...
        </div>
    </ShowBase>
);
```

Components using `<ShowBase>` can be used as the `show` prop of a `<Resource>` component:

```jsx
// in src/App.jsx
import { Admin, Resource } from 'react-admin';

import { dataProvider } from './dataProvider';
import { PostShow } from './posts';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" show={PostShow} />
    </Admin>
);
```

**Tip**: See [`useShowController`](./useShowController.md) for a completely headless version of this component.

## Props

| Prop             | Required | Type              | Default | Description
|------------------|----------|-------------------|---------|--------------------------------------------------------
| `children`       | Required | `ReactNode`       |         | The components rendering the record fields
| `disable Authentication` | Optional | `boolean` |         | Set to `true` to disable the authentication check
| `empty WhileLoading` | Optional | `boolean`     |         | Set to `true` to return `null` while the list is loading
| `id`             | Optional | `string`          |         | The record identifier. If not provided, it will be deduced from the URL
| `queryOptions`   | Optional | `object`          |         | The options to pass to the `useQuery` hook
| `resource`       | Optional | `string`          |         | The resource name, e.g. `posts`

## `children`

`<ShowBase>` renders its children wrapped by a `RecordContext`, so you can use any component that depends on such a context to be defined - including all [Field components](./Fields.md).

For instance, to display several fields in a single line, you can use Material UI’s `<Grid>` component:

{% raw %}
```jsx
import { ShowBase, TextField, DateField, ReferenceField, WithRecord } from 'react-admin';
import { Grid } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const BookShow = () => (
    <ShowBase emptyWhileLoading>
        <Grid container spacing={2} sx={{ margin: 2 }}>
            <Grid item xs={12} sm={6}>
                <TextField label="Title" source="title" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <ReferenceField label="Author" source="author_id" reference="authors">
                    <TextField source="name" />
                </ReferenceField>
            </Grid>
            <Grid item xs={12} sm={6}>
                <DateField label="Publication Date" source="published_at" />
            </Grid>
            <Grid item xs={12} sm={6}>
                <WithRecord label="Rating" render={record => <>
                    {[...Array(record.rating)].map((_, index) => <StarIcon key={index} />)}
                </>} />
            </Grid>
        </Grid>
    </ShowBase>
);
```
{% endraw %}

## `disableAuthentication`

By default, the `<ShowBase>` component will automatically redirect the user to the login page if the user is not authenticated. If you want to disable this behavior and allow anonymous access to a show page, set the `disableAuthentication` prop to `true`.

```jsx
const PostShow = () => (
    <ShowBase disableAuthentication>
        ...
    </ShowBase>
);
```

## `emptyWhileLoading`

By default, `<ShowBase>` renders its child component even before the `dataProvider.getOne()` call returns. If you use `<SimpleShowLayout>` or `<TabbedShowLayout>`, this isn't a problem as these components only render when the record has been fetched. But if you use a custom child component that expects the record context to be defined, your component will throw an error.

The `<ShowBase emptyWhileLoading>` prop provides a convenient shortcut for that use case. When enabled, `<ShowBase>` won't render its child until the record is loaded.

```jsx
const BookShow = () => (
    <ShowBase emptyWhileLoading>
        ...
    </ShowBase>
);
```

## `id`

By default, `<ShowBase>` deduces the identifier of the record to show from the URL path. So under the `/posts/123/show` path, the `id` prop will be `123`. You may want to force a different identifier. In this case, pass a custom `id` prop.

```jsx
export const PostShow = () => (
    <ShowBase id="123">
        ...
    </ShowBase>
);
```

**Tip**: Pass both a custom `id` and a custom `resource` prop to use `<ShowBase>` independently of the current URL. This even allows you to use more than one `<ShowBase>` component in the same page.

## `queryOptions`

`<ShowBase>` accepts a `queryOptions` prop to pass options to the react-query client. 

This can be useful e.g. to override the default error side effect. By default, when the `dataProvider.getOne()` call fails at the dataProvider level, react-admin shows an error notification and refreshes the page.

You can override this behavior and pass custom side effects by providing a custom `queryOptions` prop:

```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, ShowBase, SimpleShowLayout } from 'react-admin';

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
            <SimpleShowLayout>
                ...
            </SimpleShowLayout>
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

## `resource`

By default, `<ShowBase>` operates on the current `ResourceContext` (defined at the routing level), so under the `/posts/1/show` path, the `resource` prop will be `posts`. You may want to force a different resource. In this case, pass a custom `resource` prop, and it will override the `ResourceContext` value.

```jsx
export const UsersShow = () => (
    <ShowBase resource="users">
        ...
    </ShowBase>
);
```

**Tip**: Pass both a custom `id` and a custom `resource` prop to use `<ShowBase>` independently of the current URL. This even allows you to use more than one `<ShowBase>` component in the same page.

## Security

The `<ShowBase>` component requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](./Show.md#disableauthentication) prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<ShowBase>`  will only render if the user has the "show" access to the related resource.

For instance, for the `<PostShow>`page below:

```tsx
import { ShowBase, SimpleShowLayout, TextField } from 'react-admin';

// Resource name is "posts"
const PostShow = () => (
    <ShowBase>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="published_at" />
        </SimpleShowLayout>
    </ShowBase>
);
```

`<ShowBase>` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "show", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./Admin.md#accessdenied).

**Note**: Access control is disabled when you use [the `disableAuthentication` prop](./Show.md#disableauthentication).
