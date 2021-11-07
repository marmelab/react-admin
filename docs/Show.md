---
layout: default
title: "The Show Component"
---

# `<Show>`

The `<Show>` component handles the headless logic of the Show page:

- it calls `useShowcontroller` to fetch the record from the data provider via `dataProvider.getOne()`,
- it creates a `ShowContext` and a `RecordContext`,
- it computes the default page title
- it renders the page layout with the correct title and actions
- it renders its child component (a show layout component like `<SimpleShowLayout>`)

## Usage

Here is the minimal code necessary to display a view to show a post:

{% raw %}
```jsx
// in src/posts.js
import * as React from "react";
import { Show, SimpleShowLayout, TextField, DateField, RichTextField } from 'react-admin';

export const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="teaser" />
            <RichTextField source="body" />
            <DateField label="Publication date" source="created_at" />
        </SimpleShowLayout>
    </Show>
);

// in src/App.js
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

Here are all the props accepted by the `<Show>` component:

* [`actions`](#actions)
* `className` is passed to the root component
* [`children`](#layout) is the component that renders the record fields
* [`component`](#root-component)
* [`emptyWhileLoading`](#loading-state)
* [`onFailure`](#failure-side-effects)
* [`title`](#page-title)

## Layout

`<Show>` doesn't render any field by default - it delegates this to its child. Show layout components grab the `record` from the `RecordContext` and render them on screen.

React-admin provides 2 show layout coponents:

- [`<SimpleShowLayout>`](./SimpleShowLayout.md) displays fields with a label in a single column
- [`<TabbedShowLayout>`](./TabbedShowLayout.md) displays a list of tabs, each tab rendering a stack of fields with a label

To use an alternative layout, switch the `<Show>` child component:

```diff
export const PostShow = () => (
    <Show>
-       <SimpleShowLayout>
+       <TabbedShowLayout>
+           <Tab label="Main>
                <TextField source="title" />
                <TextField source="teaser" />
                <RichTextField source="body" />
                <DateField label="Publication date" source="created_at" />
+           </Tab>
-       </SimpleShowLayout>
+       </TabbedShowLayout>
    </Show>
);
```

You can also pass React elements as child, so as to build a custom layout. Chec [Building a custom Show Layout](./ShowTutorial.md#building-a-custom-layout) for more details.

## Page Title

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

## Actions

By default, `<Show>` includes an action toolbar with an `<EditButton>` if the `<Resource>` declared an `edit` component. You can replace the list of default actions by your own component using the `actions` prop:

```jsx
import Button from '@material-ui/core/Button';
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

## Failure Side Effects

By default, when the `dataProvider.getOne()` call fails at the dataProvider level, react-admin shows an error notification and  refreshes the page.

You can override this behavior and pass custom side effects by providing a function as `onFailure` prop:

```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, Show, SimpleShowLayout } from 'react-admin';

const PostShow = props => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onFailure = (error) => {
        notify(`Could not load post: ${error.message}`, { type: 'warning' });
        redirect('/posts');
        refresh();
    };

    return (
        <Show onFailure={onFailure} {...props}>
            <SimpleShowLayout>
                ...
            </SimpleShowLayout>
        </Show>
    );
}
```

The `onFailure` function receives the error from the dataProvider call (`dataProvider.getOne()`), which is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviders.md#error-format)).

The default `onFailure` function is:

```jsx
(error) => {
    notify('ra.notification.item_doesnt_exist', { type: 'warning' });
    redirect('list', basePath);
    refresh();
}
```

## Loading State

Default layout components (`<SimpleShowLayout>` and `<TabbedshowLayout>`) return null when the record is loading. If you use a custom layout component instead, you'll have to handle the case where the `record` is not yet defined.

That means that the following will fail on load with a "ReferenceError: record is not defined" error:

```jsx
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

You can handle this case by calling the `useShowContext` hook to get the loading state:

```jsx
const PostTitle = () => {
    const record = useRecordContext();
    const { loaded } = useShowContext();
    if (!loaded) return null;
    return <span>{record.title}</span>;
};
```

But this can be cumbersome, as you need to do it in every field component.

The `<Show emptyWhileLoading>` prop provides a convenient shorcut for that use case. When enabled, `<Show>` won't render its child until `record` is defined. 

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

## Root Component

By default, the Show view renders the main content area inside a `<div>`. The actual layout of the record fields depends on the Show Layout component you're using (`<SimpleShowLayout>`, `<TabbedShowLayout>`, or a custom layout component).

You can override the main area container by passing a `component` prop:

```jsx
import { Card } from '@mui/material';

// use a Card as root component
const PostShow = props => (
    <Show component={Card} {...props}>
        ...
    </Show>
);
```

## CSS API

The `<Show>` component accepts the usual `className` prop but you can override many class names injected to the inner components by React-admin thanks to the `classes` property (as most Material UI components, see their [documentation about it](https://material-ui.com/customization/components/#overriding-styles-with-classes)). This property accepts the following keys:

| Rule name   | Description                                                                                |
| ----------- | ------------------------------------------------------------------------------------------ |
| `root`      | Alternative to using `className`. Applied to the root element                              |
| `main`      | Applied to the main container                                                              |
| `noActions` | Applied to the main container when `actions` prop is `false`                               |
| `card`      | Applied to the child component inside the main container (Material UI's `Card` by default) |

To override the style of all instances of `<Show>` using the [material-ui style overrides](https://material-ui.com/customization/globals/#css), use the `RaShow` key.

## Displaying Fields Depending On User Permissions

If you to display some fields only to users with specific permissions, use the `usePermissions` hook and JSX conditions to show/hide fields.

Here's an example inside a `Show` view with a `SimpleShowLayout` and a custom `actions` component:

{% raw %}
```jsx
import TopToolbar from '@material-ui/core/TopToolbar';
import Button from '@material-ui/core/Button';
import { usePermissions, EditButton, DeleteButton } from 'react-admin';

const PostShowActions = () => {
    const permissions = usePermissions(); 
    return (
        <TopToolbar>
            <EditButton />
            {permissions === 'admin' && <DeleteButton />}
        </TopToolbar>
    );
}

export const PostShow = ({ permissions, ...props }) => {
    const permissions = usePermissions();
    return (
        <Show actions={<PostShowActions />} {...props}>
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

This also works inside a `TabbedShowLayout`, and you can hide a `Tab` completely:

{% raw %}
```jsx
export const UserShow = () => {
    const permissions = usePermissions();
    return (
        <Show>
            <TabbedShowLayout>
                <Tab label="user.form.summary">
                    {permissions === 'admin' && <TextField source="id" />}
                    <TextField source="name" />
                </Tab>
                {permissions === 'admin' &&
                    <Tab label="user.form.security">
                        <TextField source="role" />
                    </Tab>}
            </TabbedShowLayout>
        </Show>
    );
}
```
{% endraw %}

For more details about permissions, check out the [authProvider documentation](./Authentication.md#authorization).