---
title: "<CreateBase>"
---

`<CreateBase>` is a headless component that prepares a form submit handler, and renders its children in a [`CreateContext`](./useCreateContext.md). Use it to build a custom creation page layout.

`<CreateBase>` relies on the [`useCreateController`](./useCreateController.md) hook.

## Usage

Use `<CreateBase>` to create a custom Creation view, with exactly the content you add as child and nothing else (no title, card, or list of actions). 

```jsx
import * as React from "react";
import { CreateBase, Form } from "ra-core";
import { TextInput } from './TextInput';
import { SelectInput } from './SelectInput';

export const BookCreate = () => ( 
    <CreateBase>
        <div>
            <h1>Book Creation</h1>
            <div>
                <Form>
                    <TextInput source="title" />
                    <TextInput source="author" />
                    <SelectInput source="availability" choices={[
                        { id: "in_stock", name: "In stock" },
                        { id: "out_of_stock", name: "Out of stock" },
                        { id: "out_of_print", name: "Out of print" },
                    ]} />
                </Form>
            </div>
        </div>
    </CreateBase>
);
```

## Props

You can customize the `<CreateBase>` component using the following props:

* [`children`](#children): the components that renders the form
* [`render`](#render): alternative to children, a function that takes the `CreateController` context and renders the form
* [`disableAuthentication`](#disableauthentication): disable the authentication check
* [`mutationMode`](#mutationmode): Switch to optimistic or undoable mutations (pessimistic by default)
* [`mutationOptions`](#mutationoptions): options for the `dataProvider.create()` call
* [`record`](#record): initialize the form with a record
* [`redirect`](#redirect): change the redirect location after successful creation
* [`resource`](#resource): override the name of the resource to create
* [`transform`](#transform): transform the form data before calling `dataProvider.create()`

## `children`

The `<CreateBase>` component will render its children inside a [`CreateContext`](./useCreateContext.md#return-value). Children can be any React node, but are usually a form component like the headless [`<Form>`](./Form.md) component.

```jsx
import { CreateBase, Form } from 'ra-core';
import { TextInput } from './TextInput';
import { DateInput } from './DateInput';

export const PostCreate = () => (
    <CreateBase>
        <Form>
            <TextInput source="title" />
            <TextInput source="author" />
            <DateInput source="published_at" defaultValue={new Date().toISOString().split('T')[0]} />
        </Form>
    </CreateBase>
);
```

**Tip**: Alternatively to `children`, you can pass a [`render`](#render) prop to `<CreateBase>`.

## `disableAuthentication`

By default, the `<CreateBase>` component will automatically redirect the user to the login page if the user is not authenticated. If you want to disable this behavior and allow anonymous access to a creation page, set the `disableAuthentication` prop to `true`.

```jsx
const PostCreate = () => (
    <CreateBase disableAuthentication>
        <Form>
            {/* form content */}
        </Form>
    </CreateBase>
);
```

## `mutationMode`

The `<CreateBase>` view exposes a Save button, which perform a "mutation" (i.e. it creates the data). React-admin offers three modes for mutations. The mode determines when the side effects (redirection, notifications, etc.) are executed:

* `pessimistic` (default): The mutation is passed to the dataProvider first. When the dataProvider returns successfully, the mutation is applied locally, and the side effects are executed.
* `optimistic`: The mutation is applied locally and the side effects are executed immediately. Then the mutation is passed to the dataProvider. If the dataProvider returns successfully, nothing happens (as the mutation was already applied locally). If the dataProvider returns in error, the page is refreshed and an error notification is shown.
* `undoable`: The mutation is applied locally and the side effects are executed immediately. Then a notification is shown with an undo button. If the user clicks on undo, the mutation is never sent to the dataProvider, and the page is refreshed. Otherwise, after a 5 seconds delay, the mutation is passed to the dataProvider. If the dataProvider returns successfully, nothing happens (as the mutation was already applied locally). If the dataProvider returns in error, the page is refreshed and an error notification is shown.

By default, pages using `<CreateBase>` use the `pessimistic` mutation mode as the new record identifier is often generated on the backend. However, should you decide to generate this identifier client side, you can change the `mutationMode` to either `optimistic` or `undoable`:

```jsx
const PostCreate = () => (
    <CreateBase mutationMode="optimistic" transform={data => ({ id: generateId(), ...data })}>
        <Form>
            {/* form content */}
        </Form>
    </CreateBase>
);
```

And to make the record creation undoable:

```jsx
const PostCreate = () => (
    <CreateBase mutationMode="undoable" transform={data => ({ id: generateId(), ...data })}>
        <Form>
            {/* form content */}
        </Form>
    </CreateBase>
);
```

## `mutationOptions`

You can customize the options you pass to react-query's `useMutation` hook, e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.create()` call.

```jsx
import { CreateBase, Form } from 'ra-core';

const PostCreate = () => (
    <CreateBase mutationOptions={{ meta: { foo: 'bar' } }}>
        <Form>
            {/* form content */}
        </Form>
    </CreateBase>
);
```

You can also use `mutationOptions` to override success or error side effects, by setting the `mutationOptions` prop. Refer to the [useMutation documentation](https://tanstack.com/query/v5/docs/react/reference/useMutation) in the react-query website for a list of the possible options.

Let's see an example with the success side effect. By default, when the save action succeeds, react-admin shows a notification, and redirects to the new record edit page. You can override this behavior and pass custom success side effects by providing a `mutationOptions` prop with an `onSuccess` key:

```jsx
import * as React from 'react';
import { useNotify, useRedirect, CreateBase, Form } from 'ra-core';

const PostCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (data) => {
        notify(`Changes saved`);
        redirect(`/posts/${data.id}`);
    };

    return (
        <CreateBase mutationOptions={{ onSuccess }}>
            <Form>
                {/* form content */}
            </Form>
        </CreateBase>
    );
}
```

Similarly, you can override the failure side effects with an `onError` option. By default, when the save action fails at the dataProvider level, react-admin shows an error notification.

```jsx
import * as React from 'react';
import { useNotify, CreateBase, Form } from 'ra-core';

const PostCreate = () => {
    const notify = useNotify();

    const onError = (error) => {
        notify(`Could not create post: ${error.message}`);
    };

    return (
        <CreateBase mutationOptions={{ onError }}>
            <Form>
                {/* form content */}
            </Form>
        </CreateBase>
    );
}
```

## `record`

The `record` prop allows to initialize the form with non-empty values. It is exposed for consistency with the EditBase component, but if you need default values, you should use the `defaultValues` prop on the Form element instead.

```jsx
const PostCreate = () => (
    <CreateBase record={{ title: 'Default title' }}>
        <Form>
            {/* form content */}
        </Form>
    </CreateBase>
);
```

## `redirect`

By default, submitting the form in the `<CreateBase>` view redirects to the Edit view.

You can customize the redirection by setting the `redirect` prop to one of the following values:

* `'edit'`: redirect to the Edit view (the default)
* `'list'`: redirect to the List view
* `'show'`: redirect to the Show view
* `false`: do not redirect
* A function `(resource, id, data) => string` to redirect to different targets depending on the record

```jsx
const PostCreate = () => (
    <CreateBase redirect="list">
        <Form>
            {/* form content */}
        </Form>
    </CreateBase>
);
```

Note that the `redirect` prop is ignored if you set [the `mutationOptions` prop](#mutationoptions). See that prop for how to set a different redirection path in that case.

## `render`

Alternatively to `children`, you can pass a `render` prop to `<CreateBase>`. It will receive the [`CreateContext`](./useCreateContext.md#return-value) as its argument, and should return a React node.

This allows to inline the render logic for the create page.

```jsx
import { CreateBase, Form } from 'ra-core';
import { TextInput } from './TextInput';
import { DateInput } from './DateInput';

const PostCreate = () => (
    <CreateBase render={({ save, saving }) => (
        <div>
            <h1>Create new Post</h1>
            <Form onSubmit={save}>
                <TextInput source="title" />
                <TextInput source="teaser" multiline />
                <TextInput source="body" multiline />
                <DateInput source="published_at" defaultValue={new Date().toISOString().split('T')[0]} />
                <button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </Form>
        </div>
    )} />
);
```

**Tip**: When receiving a `render` prop, the `<CreateBase>` component will ignore the `children` prop.

## `resource`

Components based on `<CreateBase>` are often used as `<Resource create>` props, and therefore rendered when the URL matches `/[resource]/create`. The `<CreateBase>` component generates a call to `dataProvider.create()` using the resource name from the URL by default.

You can decide to use a `<CreateBase>` component in another path, or embedded in a page using another resource name (e.g. in a Dialog). In that case, you can explicitly set the `resource` name:

```jsx
const PostCreate = () => (
    <CreateBase resource="posts">
        <Form>
            {/* form content */}
        </Form>
    </CreateBase>
);
```

## `transform`

To transform a record after the user has submitted the form but before the record is passed to `dataProvider.create()`, use the `transform` prop. It expects a function taking a record as argument, and returning a modified record. For instance, to add a computed field upon creation:

```jsx
export const UserCreate = () => {
    const transform = data => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
    });
    return (
        <CreateBase transform={transform}>
            <Form>
                {/* form content */}
            </Form>
        </CreateBase>
    );
}
```

The `transform` function can also return a `Promise`, which allows you to do all sorts of asynchronous calls (e.g. to the `dataProvider`) during the transformation.

## Security

The `<CreateBase>` component requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the `disableAuthentication` prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<CreateBase>` will only render if the user has the "create" access to the related resource.

For instance, for the `<PostCreate>`page below:

```tsx
import { CreateBase, Form } from 'ra-core';
import { TextInput } from './TextInput';

// Resource name is "posts"
const PostCreate = () => (
    <CreateBase>
        <Form>
            <TextInput source="title" />
            <TextInput source="author" />
            <TextInput source="published_at" />
        </Form>
    </CreateBase>
);
```

`<CreateBase>` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "create", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./CoreAdmin.md#accessdenied).

**Note**: Access control is disabled when you use the [`disableAuthentication`](#disableauthentication) prop.

## Prefilling the Form

You sometimes need to pre-populate a record based on a *related* record. For instance, to create a comment related to an existing post.

By default, the `<CreateBase>` view starts with an empty `record`. However, if the `location` object (injected by [react-router-dom](https://reactrouter.com/6.28.0/start/concepts#locations)) contains a `record` in its `state`, the `<CreateBase>` view uses that `record` instead of the empty object. That's how create buttons with pre-filled data work.

That means that if you want to create a link to a creation form, presetting *some* values, all you have to do is to set the `state` when navigating to the create route:

```jsx
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecordContext } from 'ra-core';

const CreateRelatedCommentButton = () => {
    const record = useRecordContext();
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate('/comments/create', {
            state: { record: { post_id: record.id } }
        });
    };

    return (
        <button onClick={handleClick}>
            Create Related Comment
        </button>
    );
};
```

**Tip**: The `<CreateBase>` component also watches the "source" parameter of `location.search` (the query string in the URL) in addition to `location.state` (a cross-page message hidden in the router memory). So the `CreateRelatedCommentButton` could also be written as:

```jsx
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecordContext } from 'ra-core';

const CreateRelatedCommentButton = () => {
    const record = useRecordContext();
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/comments/create?source=${JSON.stringify({ post_id: record.id })}`);
    };

    return (
        <button onClick={handleClick}>
            Create Related Comment
        </button>
    );
};
```

Should you use the location `state` or the location `search`? The latter modifies the URL, so it's only necessary if you want to build cross-application links (e.g. from one admin to the other). In general, using the location `state` is a safe bet.

And if you want to prefill the form with constant values, use the `defaultValues` prop on the Form component.

You can detect prefilled values by leveraging the [`useRecordFromLocation`](./useRecordFromLocation.md) hook:

```jsx
import { CreateBase, Form, useRecordFromLocation } from 'ra-core';
import { TextInput } from './TextInput';

const PostCreate = () => {
    const recordFromLocation = useRecordFromLocation();
    
    return (
        <CreateBase>
            {recordFromLocation && (
                <div 
                    style={{
                        padding: '12px 16px',
                        backgroundColor: '#e3f2fd',
                        border: '1px solid #2196f3',
                        borderRadius: '4px',
                        marginBottom: '16px',
                        color: '#0d47a1'
                    }}
                >
                    Some fields have been pre-filled from the referring page.
                </div>
            )}
            <Form>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <TextInput source="title" />
                    <TextInput source="author" />
                    <TextInput source="post_id" />
                </div>
            </Form>
        </CreateBase>
    );
};
```
