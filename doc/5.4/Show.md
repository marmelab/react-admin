---
layout: default
title: "The Show Component"
---

# `<Show>`

The `<Show>` component is a page component that renders a single record. 

![post show view](./img/post-show.png)

`<Show>` handles the logic of the Show page:

- it calls `useShowController` to fetch the record from the dataProvider via `dataProvider.getOne()`,
- it computes the default page title
- it creates a `ShowContext` and a [`RecordContext`](./useRecordContext.md),
- it renders the page layout with the correct title and actions
- it renders its child component (a show layout component like [`<SimpleShowLayout>`](./SimpleShowLayout.md) or [`<TabbedShowLayout>`](./TabbedShowLayout.md)) in a Material UI `<Card>`


## Usage

Here is the minimal code necessary to display a view to show a post:

```jsx
// in src/posts.jsx
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
```

Components using `<Show>` can be used as the `show` prop of a `<Resource>` component:

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

That's enough to display the post show view above.

## Props

| Prop             | Required | Type              | Default | Description
|------------------|----------|-------------------|---------|--------------------------------------------------------
| `children`       | Required | `ReactNode`       |         | The components rendering the record fields
| `actions`        | Optional | `ReactElement`    |         | The actions to display in the toolbar
| `aside`          | Optional | `ReactElement`    |         | The component to display on the side of the list
| `className`      | Optional | `string`          |         | passed to the root component
| `component`      | Optional | `Component`       | `Card`  | The component to render as the root element
| `disable Authentication` | Optional | `boolean` |         | Set to `true` to disable the authentication check
| `empty WhileLoading` | Optional | `boolean`     |         | Set to `true` to return `null` while the show is loading
| `id`             | Optional | `string | number` |         | The record id. If not provided, it will be deduced from the URL
| `queryOptions`   | Optional | `object`          |         | The options to pass to the `useQuery` hook
| `resource`       | Optional | `string`          |         | The resource name, e.g. `posts`
| `sx`             | Optional | `object`          |         | Override or extend the styles applied to the component
| `title`          | Optional | `string | ReactElement | false` |   | The title to display in the App Bar

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

You can pass an aside element to the `<Show>` component. It will be rendered on the right side of the page, below the action toolbar.

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

## `children`

`<Show>` doesn't render any field by default - it delegates this to its children, called "Show layout components". These components read the `record` from the [`RecordContext`](./useRecordContext.md) and render its fields.

React-admin provides 2 built-in show layout components:

- [`<SimpleShowLayout>`](./SimpleShowLayout.md) displays fields with a label in a single column
- [`<TabbedShowLayout>`](./TabbedShowLayout.md) displays a list of tabs, each tab rendering a stack of fields with a label

To use an alternative layout, switch the `<Show>` child component:

```diff
export const PostShow = () => (
    <Show>
-       <SimpleShowLayout>
+       <TabbedShowLayout>
+           <TabbedShowLayout.Tab label="Main">
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

**Tip**: Use [`<ShowGuesser>`](./ShowGuesser.md) instead of `<Show>` to let react-admin guess the fields to display based on the dataProvider response.

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
const PostShow = () => (
    <Show component={ShowWrapper}>
        ...
    </Show>
);
```
{% endraw %}

## `disableAuthentication`

By default, the `<Show>` component will automatically redirect the user to the login page if the user is not authenticated. If you want to disable this behavior and allow anonymous access to a show page, set the `disableAuthentication` prop to `true`.

```jsx
const PostShow = () => (
    <Show disableAuthentication>
        ...
    </Show>
);
```

## `emptyWhileLoading`

By default, `<Show>` renders its child component even before the `dataProvider.getOne()` call returns. If you use `<SimpleShowLayout>` or `<TabbedShowLayout>`, this isn't a problem as these components only render when the record has been fetched. 

But if you use a custom child component that expects the record context to be defined, your component will throw an error. For instance, the following will fail on load with a "ReferenceError: data is not defined" error:

```jsx
import { Show, useShowContext } from 'react-admin';
import { Stack, Typography } from '@mui/icons-material/Star';

const SimpleBookShow = () => {
    const { record } = useShowContext();
    return (
        <Typography>
            <i>{record.title}</i>, by {record.author} ({record.year})
        </Typography>
    );
}

const BookShow = () => (
    <Show>
        <SimpleBookShow />
    </Show>
);
```

You can handle this case by getting the `isPending` variable from the [`useShowContext`](./useShowContext.md) hook:

```jsx
const SimpleBookShow = () => {
    const { record, isPending } = useShowContext();
    if (isPending) return null;
    return (
        <Typography>
            <i>{record.title}</i>, by {record.author} ({record.year})
        </Typography>
    );
}
```

The `<Show emptyWhileLoading>` prop provides a convenient shortcut for that use case. When enabled, `<Show>` won't render its child until `data` is defined.

```diff
const BookShow = () => (
-   <Show>
+   <Show emptyWhileLoading>
        <SimpleBookShow />
    </Show>
);
```

## `id`

By default, `<Show>` deduces the identifier of the record to show from the URL path. So under the `/posts/123/show` path, the `id` prop will be `123`. You may want to force a different identifier. In this case, pass a custom `id` prop.

```jsx
export const PostShow = () => (
    <Show id="123">
        ...
    </Show>
);
```

**Tip**: Pass both a custom `id` and a custom `resource` prop to use `<Show>` independently of the current URL. This even allows you to use more than one `<Show>` component in the same page.

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

{% raw %}
```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, Show, SimpleShowLayout } from 'react-admin';

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
        <Show queryOptions={{ onError }}>
            <SimpleShowLayout>
                ...
            </SimpleShowLayout>
        </Show>
    );
}
```
{% endraw %}

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

By default, `<Show>` operates on the current `ResourceContext` (defined at the routing level), so under the `/posts/1/show` path, the `resource` prop will be `posts`. You may want to force a different resource. In this case, pass a custom `resource` prop, and it will override the `ResourceContext` value.

```jsx
export const UsersShow = () => (
    <Show resource="users">
        ...
    </Show>
);
```

**Tip**: Pass both a custom `id` and a custom `resource` prop to use `<Show>` independently of the current URL. This even allows you to use more than one `<Show>` component in the same page.

## `sx`: CSS API

The `<Show>` component accepts the usual `className` prop, but you can override many class names injected to the inner components by React-admin thanks to the `sx` property (see [the `sx` documentation](./SX.md) for syntax and examples). This property accepts the following subclasses:

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

To override the style of all instances of `<Show>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaShow` key.

## `title`

By default, the title for the Show view is "[resource_name] [record representation]". Check the [`<Resource recordRepresentation>`](./Resource.md#recordrepresentation) prop for more details.

You can customize this title by specifying a custom `title` string:

```jsx
export const PostShow = () => (
    <Show title="Post view">
        ...
    </Show>
);
```

More interestingly, you can pass an element as `title`. This element can access the current record via `useRecordContext`. This allows to customize the title according to the current record:

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

Finally, you can also pass `false` to disable the title:

```jsx
export const PostShow = () => (
    <Show title={false}>
        ...
    </Show>
);
```

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
    const { isPending } = useShowContext();
    if (!isPending) return null;
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

## Navigating Through Records

The [`<PrevNextButtons`](./PrevNextButtons.md) renders a navigation with two buttons, allowing users to navigate through records without leaving a `<Show>` view. 

<video controls autoplay playsinline muted loop>
  <source src="./img/prev-next-buttons-show.webm" type="video/webm" />
  <source src="./img/prev-next-buttons-show.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

The following code is an example of how you can use it:

```tsx
export const PostShow = () => (
    <Show
        actions={
            <TopToolbar>
                <PrevNextButtons linkType="show"/>
            </TopToolbar>
        }
    >
    ...
    </Show>
);
```

**Tips:** If you want the `<PrevNextButtons>` to link to the `<Show>` view, you have to set the `linkType` to `show`. See [the `<PrevNextButtons linkType>` prop](./PrevNextButtons.md#linktype).

## Controlled Mode

`<show>` deduces the resource and the record id from the URL. This is fine for a detail page, but if you need to embed the details of a record in another page, you probably want to define these parameters yourself. 

In that case, use the [`resource`](#resource) and [`id`](#id) props to set the show parameters regardless of the URL.

```jsx
import { Show, SelectField, SimpleShowLayout, TextField } from "react-admin";

export const BookShow = ({ id }) => (
    <Show resource="books" id={id}>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="author" />
            <SelectField source="availability" choices={[
                { id: "in_stock", name: "In stock" },
                { id: "out_of_stock", name: "Out of stock" },
                { id: "out_of_print", name: "Out of print" },
            ]} />
        </SimpleShowLayout>
    </Show>
);
```

## Headless Version

Besides fetching a record, `<Show>` renders the default detail page layout (title, actions, a Material UI `<Card>`) and its children. If you need a custom detail layout, you may prefer [the `<ShowBase>` component](./ShowBase.md), which only renders its children in a [`ShowContext`](./useShowContext.md).

```jsx
import { ShowBase, SelectField, SimpleShowLayout, TextField, Title } from "react-admin";
import { Card, CardContent, Container } from "@mui/material";

export const BookShow = () => (
    <ShowBase>
        <Container>
            <Title title="Book Detail" />
            <Card>
                <CardContent>
                    <SimpleShowLayout>
                        <TextField source="title" />
                        <TextField source="author" />
                        <SelectField source="availability" choices={[
                            { id: "in_stock", name: "In stock" },
                            { id: "out_of_stock", name: "Out of stock" },
                            { id: "out_of_print", name: "Out of print" },
                        ]} />
                    </SimpleShowLayout>
                </CardContent>
            </Card>
        </Container>
    </ShowBase>
);
```

In the previous example, `<SimpleShowLayout>` grabs the record from the `ShowContext`.

If you don't need the `ShowContext`, you can use [the `useShowController` hook](./useShowController.md), which does the same data fetching as `<ShowBase>` but lets you render the content.

```tsx
import { useShowController, SelectField, SimpleShowLayout, TextField, Title } from "react-admin";
import { Card, CardContent, Container } from "@mui/material";

export const BookShow = () => {
    const { record } = useShowController();
    return (
        <Container>
            <Title title={`Edit book ${record?.title}`} />
            <Card>
                <CardContent>
                    <SimpleShowLayout record={record}>
                        <TextField source="title" />
                        <TextField source="author" />
                        <SelectField source="availability" choices={[
                            { id: "in_stock", name: "In stock" },
                            { id: "out_of_stock", name: "Out of stock" },
                            { id: "out_of_print", name: "Out of print" },
                        ]} />
                    </SimpleShowLayout>
                </CardContent>
            </Card>
        </Container>
    );
};
```

## Security

The `<Show>` component requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](#disableauthentication) prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<Show>`  will only render if the user has the "show" access to the related resource.

For instance, for the `<PostShow>`page below:

```tsx
import { Show, SimpleShowLayout, TextField } from 'react-admin';

// Resource name is "posts"
const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="published_at" />
        </SimpleShowLayout>
    </Show>
);
```

`<Show>` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "show", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./Admin.md#accessdenied).

**Note**: Access control is disabled when you use [the `disableAuthentication` prop](#disableauthentication).