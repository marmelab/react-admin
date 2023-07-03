---
layout: default
title: "The Show Component"
---

# `<Show>`

The `<Show>` component handles the logic of the Show page:

- it calls `useShowController` to fetch the record from the dataProvider via `dataProvider.getOne()`,
- it computes the default page title
- it creates a `ShowContext` and a `RecordContext`,
- it renders the page layout with the correct title and actions
- it renders its child component (a show layout component like `<SimpleShowLayout>`) in a Material UI `<Card>`

## Usage

Here is the minimal code necessary to display a view to show a post:

{% raw %}
```jsx
// in src/posts.jsx
import * as React from "react";
import { Show, SimpleShowLayout, TextField, DateField, RichTextField } from 'react-admin';

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="teaser" />
            <RichTextField source="body" />
            <DateField label="Publication date" source="published_at" />
        </SimpleShowLayout>
    </Show>
);

// in src/App.jsx
import * as React from "react";
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

import { PostShow } from './posts';

const App = () => (
    <Admin dataProvider={jsonServerProvider('https://jsonplaceholder.typicode.com')}>
        <Resource name="posts" show={PostShow} />
    </Admin>
);
```
{% endraw %}

That's enough to display the post show view:

![post show view](./img/post-show.png)

## Props

* [`actions`](#actions): override the actions toolbar with a custom component
* [`aside`](#aside): aside element
* `className`: passed to the root component
* [`children`](#layout): the components that render the record fields
* [`component`](#component): overrides the root component
* [`disableAuthentication`](#disableauthentication): disable the authentication check
* [`emptyWhileLoading`](#loading-state)
* [`queryOptions`](#queryoptions): options to pass to the react-query client
* [`sx`](#sx-css-api): Override the styles
* [`title`](#title)

## Layout

`<Show>` doesn't render any field by default - it delegates this to its children. Show layout components grab the `record` from the `RecordContext` and render them on screen.

React-admin provides 2 show layout components:

- [`<SimpleShowLayout>`](./SimpleShowLayout.md) displays fields with a label in a single column
- [`<TabbedShowLayout>`](./TabbedShowLayout.md) displays a list of tabs, each tab rendering a stack of fields with a label

To use an alternative layout, switch the `<Show>` child component:

```diff
export const PostShow = () => (
    <Show>
-       <SimpleShowLayout>
+       <TabbedShowLayout>
+           <TabbedShowLayout.Tab label="Main>
                <TextField source="title" />
                <TextField source="teaser" />
                <RichTextField source="body" />
                <DateField label="Publication date" source="created_at" />
+           </TabbedShowLayout.Tab>
-       </SimpleShowLayout>
+       </TabbedShowLayout>
    </Show>
);
```

You can also pass a React element as child, to build a custom layout. Check [Building a custom Show Layout](./ShowTutorial.md#building-a-custom-layout) for more details.

## `title`

By default, the title for the Show view is "[resource_name] #[record_id]".

You can customize this title by specifying a custom `title` prop:

```jsx
export const PostShow = () => (
    <Show title="Post view">
        ...
    </Show>
);
```

More interestingly, you can pass a component as `title`. React-admin clones this component, which can access the current record via `useRecordContext`. This allows to customize the title according to the current record:

```jsx
import { useRecordContext, Show } from 'react-admin';

const PostTitle = () => {
    const record = useRecordContext();
    // the record can be empty while loading
    if (!record) return null;
    return <span>Post "{record.title}"</span>;
};

export const PostShow = () => (
    <Show title={<PostTitle />}>
        ...
    </Show>
);
```

## `actions`

By default, `<Show>` includes an action toolbar with an `<EditButton>` if the `<Resource>` declared an `edit` component. You can replace the list of default actions by your own component using the `actions` prop:

```jsx
import Button from '@mui/material/Button';
import { EditButton, TopToolbar } from 'react-admin';

const PostShowActions = () => (
    <TopToolbar>
        <EditButton />
        {/* Add your custom actions */}
        <Button color="primary" onClick={customAction}>Custom Action</Button>
    </TopToolbar>
);

export const PostShow = () => (
    <Show actions={<PostShowActions />}>
        ...
    </Show>
);
```

## `aside`

You can pass an aside element to the `<Show>` component. It will be rendered on the right side of the page, below the actions toolbar.

The aside component renders in the same `RecordContext` as the `Show` child component. That means you can display details of the current `record` in the aside component by calling `useRecordContext`:

{% raw %}
```jsx
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    RichTextField,
    useRecordContext
} from 'react-admin';

export const PostShow = () => (
    <Show aside={<Aside />}>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="teaser" />
            <RichTextField source="body" />
            <DateField label="Publication date" source="published_at" />
        </SimpleShowLayout>
    </Show>
);

const Aside = () => {
    const record = useRecordContext();
    return (
        <div style={{ width: 200, margin: '1em' }}>
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
{% endraw %}

**Tip**: Always test the record is defined before using it, as react-admin starts rendering the UI before the `dataProvider.getOne()` call is over.

## `queryOptions`

`<Show>` accepts a `queryOptions` prop to pass options to the react-query client. 

This can be useful e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.getOne()` call.

{% raw %}
```jsx
import { Show } from 'react-admin';

export const PostShow = () => (
    <Show queryOptions={{ meta: { foo: 'bar' }}}>
        ...
    </Show>
);
```
{% endraw %}

With this option, react-admin will call `dataProvider.getOne()` on mount with the ` meta: { foo: 'bar' }` option.

You can also use the `queryOptions` prop to override the default error side effect. By default, when the `dataProvider.getOne()` call fails at the dataProvider level, react-admin shows an error notification and refreshes the page.

You can override this behavior and pass custom side effects by providing a custom `queryOptions` prop:

```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, Show, SimpleShowLayout } from 'react-admin';

const PostShow = props => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onError = (error) => {
        notify(`Could not load post: ${error.message}`, { type: 'error' });
        redirect('/posts');
        refresh();
    };

    return (
        <Show queryOptions={{ onError }} {...props}>
            <SimpleShowLayout>
                ...
            </SimpleShowLayout>
        </Show>
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

## `component`

By default, the Show view renders the main content area inside a Material UI `<Card>`. The actual layout of the record fields depends on the Show Layout component you're using (`<SimpleShowLayout>`, `<TabbedShowLayout>`, or a custom layout component).

You can override the main area container by passing a `component` prop:

{% raw %}
```jsx
import { Box } from '@mui/material';

const ShowWrapper = ({ children }) => (
    <Box sx={{ margin: 2, border: 'solid 1px grey' }}>
        {children}
    </Box>
);

// use a ShowWrapper as root component
const PostShow = props => (
    <Show component={ShowWrapper} {...props}>
        ...
    </Show>
);
```
{% endraw %}

## `disableAuthentication`

By default, the `<Show>` component will automatically redirect the user to the login page if the user is not authenticated. If you want to disable this behavior and allow anonymous access to a show page, set the `disableAuthentication` prop to `true`.

{% raw %}
```jsx
const PostShow = () => (
    <Show disableAuthentication>
        ...
    </Show>
);
```
{% endraw %}

## `sx`: CSS API

The `<Show>` component accepts the usual `className` prop but you can override many class names injected to the inner components by React-admin thanks to the `sx` property (as most Material UI components, see their [documentation about it](https://mui.com/material-ui/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name        | Description                                                   |
|------------------| ------------------------------------------------------------- |
| `& .RaShow-main` | Applied to the main container                                 |
| `& .RaShow-card` | Applied to the `<Card>` element                               |

Here's an example of how to override the default styles:

{% raw %}
```jsx
const PostShow = () => (
    <Show 
        sx={{
            backgroundColor: 'yellow',
            '& .RaShow-main': {
                backgroundColor: 'red',
            },
        }}
    >
            ...
    </Show>
);
```
{% endraw %}

To override the style of all instances of `<Show>` using the [Material UI style overrides](https://mui.com/material-ui/customization/theme-components/#theme-style-overrides), use the `RaShow` key.

## Loading State

Default layout components (`<SimpleShowLayout>` and `<TabbedshowLayout>`) return null when the record is loading. If you use a custom layout component instead, you'll have to handle the case where the `record` is not yet defined.

That means that the following will fail on load with a "ReferenceError: record is not defined" error:

```jsx
import { Show, useRecordContext } from 'react-admin';
import { Card } from '@mui/material';

const PostTitle = () => {
    const record = useRecordContext();
    return <span>{record.title}</span>;
};

const PostShow = () => (
    <Show>
        <Card>
            <div>Title: <PostTitle /></div>
        </Card>
    </Show>
);
```

You can handle this case by calling the [`useShowContext`](./useShowContext.md) hook to get the loading state:

```jsx
import { useShowContext, useRecordContext } from 'react-admin';

const PostTitle = () => {
    const record = useRecordContext();
    const { isLoading } = useShowContext();
    if (!isLoading) return null;
    return <span>{record.title}</span>;
};
```

But this can be cumbersome, as you need to do it in every field component.

The `<Show emptyWhileLoading>` prop provides a convenient shortcut for that use case. When enabled, `<Show>` won't render its child until `record` is defined. 

```diff
const PostTitle = () => {
    const record = useRecordContext();
    return <span>{record.title}</span>;
};

const PostShow = () => (
-   <Show>
+   <Show emptyWhileLoading>
        <Card>
            <div>Title: <PostTitle /></div>
        </Card>
    </Show>
);
```

## Displaying Fields Depending On User Permissions

If you want to display some fields only to users with specific permissions, use the [`usePermissions`](./usePermissions.md) hook and JSX conditions to show or hide fields.

Here's an example inside a `Show` view with a `SimpleShowLayout` and a custom `actions` component:

{% raw %}
```jsx
import TopToolbar from '@mui/material/TopToolbar';
import Button from '@mui/material/Button';
import { Show, SimpleShowLayout, RichTextField, NumberField, usePermissions, EditButton, DeleteButton } from 'react-admin';

const PostShowActions = () => {
    const { permissions } = usePermissions(); 
    return (
        <TopToolbar>
            <EditButton />
            {permissions === 'admin' && <DeleteButton />}
        </TopToolbar>
    );
}

export const PostShow = () => {
    const { permissions } = usePermissions();
    return (
        <Show actions={<PostShowActions />}>
            <SimpleShowLayout>
                <TextField source="title" />
                <RichTextField source="body" />
                {permissions === 'admin' &&
                    <NumberField source="nb_views" />
                }
            </SimpleShowLayout>
        </Show>
    );
}
```
{% endraw %}

This also works inside a `<TabbedShowLayout>`, and you can hide a `TabbedShowLayout.Tab` completely:

{% raw %}
```jsx
import { Show, TabbedShowLayout, TextField } from 'react-admin';

export const UserShow = () => {
    const { permissions } = usePermissions();
    return (
        <Show>
            <TabbedShowLayout>
                <TabbedShowLayout.Tab label="user.form.summary">
                    {permissions === 'admin' && <TextField source="id" />}
                    <TextField source="name" />
                </TabbedShowLayout.Tab>
                {permissions === 'admin' &&
                    <TabbedShowLayout.Tab label="user.form.security">
                        <TextField source="role" />
                    </TabbedShowLayout.Tab>}
            </TabbedShowLayout>
        </Show>
    );
}
```
{% endraw %}

For more details about permissions, check out the [authProvider documentation](./Authentication.md).

## Adding `meta` To The DataProvider Call

Use [the `queryOptions` prop](#queryoptions) to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.getOne()` call.

{% raw %}
```jsx
import { Show } from 'react-admin';

export const PostShow = () => (
    <Show queryOptions={{ meta: { foo: 'bar' }}}>
        ...
    </Show>
);
```
{% endraw %}

## Live Updates 

If you want to subscribe to live updates on the record (topic: `resource/[resource]/[id]`), use [the `<ShowLive>` component](./ShowLive.md) instead.

```diff
-import { Show, SimpleShowLayout, TextField } from 'react-admin';
+import { SimpleShowLayout, TextField } from 'react-admin';
+import { ShowLive } from '@react-admin/ra-realtime';

const PostShow = () => (
-   <Show>
+   <ShowLive>
        <SimpleShowLayout>
            <TextField source="title" />
        </SimpleShowLayout>
-   </Show>
+   </ShowLive>
);
```

It shows a notification and refreshes the page when the record is updated by another user. Also, it displays a warning when the record is deleted by another user.

## API

* [`<Show>`]
* [`<ShowActions>`]
* [`<SimpleShowLayout>`]
* [`<Tab>`]
* [`<TabbedShowLayout>`]
* [`useRecordContext`]
* [`useResourceContext`]
* [`useShowContext`]
* [`useShowController`]

[`<Show>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/Show.tsx
[`<ShowActions>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/ShowActions.tsx
[`<SimpleShowLayout>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/SimpleShowLayout.tsx
[`<Tab>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/Tab.tsx
[`<TabbedShowLayout>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/detail/TabbedShowLayout.tsx
[`<WithRecord>`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/record/WithRecord.tsx
[`useRecordContext`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/record/useRecordContext.ts
[`useResourceContext`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/core/useResourceContext.ts
[`useShowContext`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/show/useShowContext.tsx
[`useShowController`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/show/useShowController.ts
