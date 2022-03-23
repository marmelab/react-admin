---
layout: default
title: "The Create Component"
---

# `<Create>`

The `<Create>` component prepares the form submit handler, renders the page title and actions. It is not responsible for rendering the actual form - that's the job of its child component (usually a form component, like [`<SimpleForm>`](./SimpleForm.md)). This form component uses its children ([`<Input>`](./Inputs.md) components) to render each form input.

![post creation form](./img/create-view.png)

The `<Create>` component creates a `RecordContext` with an empty object `{}` by default. It also creates a `CreateContext`containing a `save` callback, which calls `dataProvider.create()`.

You can customize the `<Create>` component using the following props:

* [`actions`](#actions): override the actions toolbar with a custom component
* [`aside`](#aside-component): component to render aside to the main content
* `children`: the components that render the form
* `className`: passed to the root component
* [`component`](#component): overrides the root component
* [`mutationOptions`](#mutationoptions): options for the `dataProvider.create()` call
* [`record`](#record): initialize the form with a record
* [`sx`](#sx-css-api): Override the styles
* [`title`](#page-title): override the page title
* [`transform`](#transform): transform the form data before calling `dataProvider.create()`

## `actions`

You can replace the list of default actions by your own element using the `actions` prop:

```jsx
import * as React from "react";
import Button from '@mui/material/Button';
import { TopToolbar, Create } from 'react-admin';

const PostCreateActions = () => (
    <TopToolbar>
        {/* Add your custom actions */}
        <Button color="primary" onClick={customAction}>Custom Action</Button>
    </TopToolbar>
);

export const PostCreate = () => (
    <Create actions={<PostCreateActions />}>
        ...
    </Create>
);
```

## `aside`

![Aside component](./img/aside.png)

You may want to display additional information on the side of the form. Use the `aside` prop for that, passing the component of your choice:

{% raw %}
```jsx
const Aside = () => (
    <Box sx={{ width: '200px', margin: '1em' }}>
        <Typography variant="h6">Instructions</Typography>
        <Typography variant="body2">
            Posts will only be published once an editor approves them
        </Typography>
    </Box>
);

const PostCreate = () => (
    <Create aside={<Aside />}>
       // ...
    </Create>
);
```
{% endraw %}

## `component`

By default, the `<Create>` view render the main form inside a MUI `<Card>` element. The actual layout of the form depends on the `Form` component you're using (`<SimpleForm>`, `<TabbedForm>`, or a custom form component).

Some form layouts also use `Card`, in which case the user ends up seeing a card inside a card, which is bad UI. To avoid that, you can override the main page container by passing a `component` prop :

```jsx
// use a div as root component
const PostCreate = () => (
    <Create component="div">
        ...
    </Create>
);

// use a custom component as root component 
const PostCreate = () => (
    <Create component={MyComponent}>
        ...
    </Create>
);
```

The default value for the `component` prop is `Card`.

## `mutationOptions`

You can customize the options you pass to react-query's `useMutation` hook, e.g. to override success or error side effects, by setting the `mutationOptions` prop.

Let's see an example with the success side effect. By default, when the save action succeeds, react-admin shows a notification, and redirects to another page. You can override this behavior and pass custom success side effects by providing a `mutationOptions` prop with an `onSuccess` key:

```jsx
import * as React from 'react';
import { useNotify, useRedirect, Create, SimpleForm } from 'react-admin';

const PostCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = () => {
        notify(`Changes saved`);
        redirect('/posts');
    };

    return (
        <Create mutationOptions={{ onSuccess }}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Create>
    );
}
```

The default `onSuccess` function is:

```js
(data) => {
    notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
    redirect('edit', resource, data.id, data);
}
```

**Tip**: If you want to have different success side effects based on the button clicked by the user (e.g. if the creation form displays two submit buttons, one to "save and redirect to the list", and another to "save and display an empty form"), you can set the `mutationOptions` prop on the `<SaveButton>` component, too.

Similarly, you can override the failure side effects with an `onError` option. By default, when the save action fails at the dataProvider level, react-admin shows an error notification.

```jsx
import * as React from 'react';
import { useNotify, Create, SimpleForm } from 'react-admin';

const PostCreate = () => {
    const notify = useNotify();

    const onError = (error) => {
        notify(`Could not create post: ${error.message}`);
    };

    return (
        <Create mutationOptions={{ onError }}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Create>
    );
}
```

The `onError` function receives the error from the `dataProvider.create()` call. It is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviderWriting.md#error-format)).

The default `onError` function is:

```jsx
(error) => {
    notify(typeof error === 'string' ? error : error.message || 'ra.notification.http_error', { type: 'warning' });
}
```

**Tip**: If you want to have different failure side effects based on the button clicked by the user, you can set the `mutationOptions` prop on the `<SaveButton>` component, too.

## `record`

The `record` prop allows to initialize the form with non-empty values. It is exposed for consistency with the `<Edit>` component, but if you need default values, you should use the `defautValues` prop on the Form element instead.

## `sx`: CSS API

The `<Create>` components accept the usual `className` prop, but you can override many class names injected to the inner components by React-admin thanks to the `sx` property (as most MUI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following keys:

| Rule name               | Description                                                                          |
|-------------------------|--------------------------------------------------------------------------------------|
| `& .RaCreate-main`      | Applied to the main container                                                        |
| `& .RaCreate-noActions` | Applied to the main container when `actions` prop is `false`                         |
| `& .RaCreate-card`      | Applied to the child component inside the main container (MUI's `Card` by default)   |

To override the style of all instances of `<Create>` components using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaCreate` key.

## `title`

By default, the title for the `Create` view is "Create [resource_name]".

You can customize this title by specifying a custom `title` prop:

```jsx
export const PostCreate = () => (
    <Create title="New post">
        ...
    </Create>
);
```

The `title` value can be a string or a React element.

## `transform`

To transform a record after the user has submitted the form but before the record is passed to `dataProvider.create()`, use the `transform` prop. It expects a function taking a record as argument, and returning a modified record. For instance, to add a computed field upon creation:

```jsx
export const UserCreate = (props) => {
    const transform = data => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
    });
    return (
        <Create {...props} transform={transform}>
            ...
        </Create>
    );
}
```

The `transform` function can also return a `Promise`, which allows you to do all sorts of asynchronous calls (e.g. to the `dataProvider`) during the transformation.

**Tip**: If you want to have different transformations based on the button clicked by the user (e.g. if the creation form displays two submit buttons, one to "save", and another to "save and notify other admins"), you can set the `transform` prop on the `<SaveButton>` component, too. See [Altering the Form Values Before Submitting](./EditTutorial.md#altering-the-form-values-before-submitting) for an example.

## Redirection After Submission

By default, submitting the form in the `<Create>` view redirects to the `<Edit>` view.

You can customize the redirection by overriding the `onSuccess` callback in the `mutationOptions`, and leveraging [the `useRedirect` hook](./useRedirect.md). For instance, to redirect to the `<Show>` view after edition:

{% raw %}
```jsx
import * as React from 'react';
import { useNotify, useRedirect, Create, SimpleForm } from 'react-admin';

const PostEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data) => {
        notify(`Changes saved`);
        redirect('show', 'posts', data.id);
    };

    return (
        <Create mutationOptions={{ onSuccess }}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

## Changing The Notification Message

Once the `dataProvider` returns successfully after save, users see a generic notification ("Element created"). You can customize this message by passing a custom success side effect function in [the `mutationOptions` prop](#mutationoptions):

```jsx
import * as React from 'react';
import { useNotify, useRedirect, Create, SimpleForm } from 'react-admin';

const PostCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data) => {
        notify(`Post created successfully`); // default message is 'ra.notification.created'
        redirect('edit', 'posts', data.id, data);
    };

    return (
        <Create mutationOptions={{ onSuccess }}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Create>
    );
}
```

You can do the same for error notifications, by passing a custom `onError`  callback.

**Tip**: The notification message will be translated.

## Prefilling the Form

You sometimes need to pre-populate a record based on a *related* record. For instance, to create a comment related to an existing post. 

By default, the `<Create>` view starts with an empty `record`. However, if the `location` object (injected by [react-router-dom](https://reacttraining.com/react-router/web/api/location)) contains a `record` in its `state`, the `<Create>` view uses that `record` instead of the empty object. That's how the `<CloneButton>` works under the hood.

That means that if you want to create a link to a creation form, presetting *some* values, all you have to do is to set the location `state`. `react-router-dom` provides the `<Link>` component for that:

{% raw %}
```jsx
import * as React from 'react';
import { Datagrid } from 'react-admin';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CreateRelatedCommentButton = ({ record }) => (
    <Button
        component={Link}
        to={{
            pathname: '/comments/create',
            state: { record: { post_id: record.id } },
        }}
    >
        Write a comment for that post
    </Button>
);

export default PostList = () => (
    <List>
        <Datagrid>
            ...
            <CreateRelatedCommentButton />
        </Datagrid>
    </List>
)
```
{% endraw %}

**Tip**: To style the button with the main color from the MUI theme, use the `Link` component from the `react-admin` package rather than the one from `react-router-dom`.

**Tip**: The `<Create>` component also watches the "source" parameter of `location.search` (the query string in the URL) in addition to `location.state` (a cross-page message hidden in the router memory). So the `CreateRelatedCommentButton` could also be written as:

{% raw %}
```jsx
import * as React from "react";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const CreateRelatedCommentButton = ({ record }) => (
    <Button
        component={Link}
        to={{
            pathname: '/comments/create',
            search: `?source=${JSON.stringify({ post_id: record.id })}`,
        }}
    >
        Write a comment for that post
    </Button>
);
```
{% endraw %}

Should you use the location `state` or the location `search`? The latter modifies the URL, so it's only necessary if you want to build cross-application links (e.g. from one admin to the other). In general, using the location `state` is a safe bet.
