---
title: "<EditBase>"
---

`<EditBase>` is a headless coFor instance, to display several fields in a single line, you can use native HTML layout:ponent that fetches a record based on the URL, prepares a form submit handler, and renders its children inside an [`EditContext`](./useEditContext.md). Use it to build a custom edition page layout.

`<EditBase>` relies on the [`useEditController`](./useEditController.md) hook.

## Usage

Use `<EditBase>` to create a custom Edition view, with exactly the content you add as child and nothing else (no title, card, or list of actions as in the Edit component).

```jsx
import * as React from "react";
import { EditBase, Form } from "ra-core";
import { TextInput } from './TextInput';
import { SelectInput } from './SelectInput';

export const BookEdit = () => (
    <EditBase>
        <div>
            <h1>Book Edition</h1>
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
    </EditBase>
);
```

## Props

| Prop             | Required | Type              | Default | Description
|------------------|----------|-------------------|---------|--------------------------------------------------------
| `children`       | Optional | `ReactNode`       |         | The components rendering the record fields
| `render`         | Optional | `(props: EditControllerResult<RecordType>) => ReactNode`       |         | Alternative to children, a function that takes the EditController context and renders the form
| `disable Authentication` | Optional | `boolean` |         | Set to `true` to disable the authentication check
| `id`             | Optional | `string`          |         | The record identifier. If not provided, it will be deduced from the URL
| `loading`        | Optional | `ReactNode`       |         | The component to render while checking for authentication and permissions
| `mutationMode`   | Optional | `undoable`       |         | The mutation mode
| `mutationOptions` | Optional | `ReactNode`       |         | The options to pass to the `useUpdate` hook
| `offline`        | Optional | `ReactNode`       |         | The component to render when there is no connectivity and the record isn't in the cache
| `queryOptions`   | Optional | `object`          |         | The options to pass to the `useGetOne` hook
| `transform`       | Optional | `string`          |         | Transform the form data before calling `dataProvider.update()`


## `children`

`<EditBase>` renders its children wrapped by a `RecordContext`, so you can use any component that depends on such a context to be defined, for example inputs leveraging the [`useInput`](../inputs/useInput.md) hook.

```jsx
import { EditBase, Form } from 'ra-core';
import { TextInput } from './TextInput';
import { DateInput } from './DateInput';

const BookEdit = () => (
    <EditBase>
        <Form>
            <div style={{ display: 'flex', gap: '1rem', margin: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <TextInput label="Title" source="title" />
                </div>
                <div style={{ flex: 1 }}>
                    <TextInput label="Author" source="author" />
                </div>
                <div style={{ flex: 1 }}>
                    <DateInput label="Publication Date" source="published_at" />
                </div>
            </div>
            <div style={{ margin: '1rem' }}>
                <button type="submit">Save</button>
            </div>
        </Form>
    </EditBase>
);
```

## `disableAuthentication`

By default, the `<EditBase>` component will automatically redirect the user to the login page if the user is not authenticated. If you want to disable this behavior and allow anonymous access to a show page, set the `disableAuthentication` prop to `true`.

```jsx
import { EditBase, Form } from 'ra-core';

const PostEdit = () => (
    <EditBase disableAuthentication>
        <Form>
            {/* form content */}
        </Form>
    </EditBase>
);
```

## `id`

By default, `<EditBase>` deduces the identifier of the record to show from the URL path. So under the `/posts/123/show` path, the `id` prop will be `123`. You may want to force a different identifier. In this case, pass a custom `id` prop.

```jsx
import { EditBase, Form } from 'ra-core';

export const PostEdit = () => (
    <EditBase id="123">
        <Form>
            {/* form content */}
        </Form>
    </EditBase>
);
```

**Tip**: Pass both a custom `id` and a custom `resource` prop to use `<EditBase>` independently of the current URL. This even allows you to use more than one `<EditBase>` component in the same page.

## `loading`

By default, `<EditBase>` renders nothing while checking for authentication and permissions. You can provide your own component via the `loading` prop:

```jsx
import { EditBase, Form } from 'ra-core';

export const PostEdit = () => (
    <EditBase loading={<p>Checking for permissions...</p>}>
        <Form>
            {/* form content */}
        </Form>
    </EditBase>
);
```

## `mutationMode`

The `<EditBase>` component exposes a save method, which perform a "mutation" (i.e. they alter the data). React-admin offers three modes for mutations. The mode determines when the side effects (redirection, notifications, etc.) are executed:

* `pessimistic`: The mutation is passed to the dataProvider first. When the dataProvider returns successfully, the mutation is applied locally, and the side effects are executed.
* `optimistic`: The mutation is applied locally and the side effects are executed immediately. Then the mutation is passed to the dataProvider. If the dataProvider returns successfully, nothing happens (as the mutation was already applied locally). If the dataProvider returns in error, the page is refreshed and an error notification is shown.
* `undoable` (default): The mutation is applied locally and the side effects are executed immediately. Then a notification is shown with an undo button. If the user clicks on undo, the mutation is never sent to the dataProvider, and the page is refreshed. Otherwise, after a 5 seconds delay, the mutation is passed to the dataProvider. If the dataProvider returns successfully, nothing happens (as the mutation was already applied locally). If the dataProvider returns in error, the page is refreshed and an error notification is shown.

By default, pages using `<EditBase>` use the `undoable` mutation mode. This is part of the "optimistic rendering" strategy of react-admin ; it makes user interactions more reactive.

You can change this default by setting the `mutationMode` prop - and this affects both the Save and Delete buttons. For instance, to remove the ability to undo the changes, use the `optimistic` mode:

```jsx
import { EditBase, Form } from 'ra-core';

const PostEdit = () => (
    <EditBase mutationMode="optimistic">
        <Form>
            {/* form content */}
        </Form>
    </EditBase>
);
```

And to make the Save action blocking, and wait for the dataProvider response to continue, use the `pessimistic` mode:

```jsx
import { EditBase, Form } from 'ra-core';

const PostEdit = () => (
    <EditBase mutationMode="pessimistic">
        <Form>
            {/* form content */}
        </Form>
    </EditBase>
);
```

## `mutationOptions`

`<EditBase>` calls `dataProvider.update()` via react-query's `useMutation` hook. You can customize the options you pass to this hook, e.g. to pass [a custom `meta`](../data-fetching/Actions.md#meta-parameter) to the `dataProvider.update()` call.

```jsx
import { EditBase, Form } from 'ra-core';

const PostEdit = () => (
    <EditBase mutationOptions={{ meta: { foo: 'bar' } }}>
        <Form>
            {/* form content */}
        </Form>
    </EditBase>
);
```

You can also use `mutationOptions` to override success or error side effects, by setting the `mutationOptions` prop. Refer to the [useMutation documentation](https://tanstack.com/query/v5/docs/react/reference/useMutation) in the react-query website for a list of the possible options.

Let's see an example with the success side effect. By default, when the save action succeeds, react-admin shows a notification, and redirects to the list page. You can override this behavior and pass custom success side effects by providing a `mutationOptions` prop with an `onSuccess` key:

```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, EditBase, Form } from 'ra-core';

const PostEdit = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onSuccess = () => {
        notify(`Changes saved`);
        redirect('/posts');
        refresh();
    };

    return (
        <EditBase mutationOptions={{ onSuccess }}>
            <Form>
                {/* form content */}
            </Form>
        </EditBase>
    );
}
```

The default `onSuccess` function is:

```js
() => {
    notify('ra.notification.updated', {
        messageArgs: { smart_count: 1 },
        undoable: mutationMode === 'undoable'
    });
    redirect('list', resource, data.id, data);
}
```

**Tip**: If you just want to customize the redirect behavior, you can use [the `redirect` prop](#redirect) instead.

**Tip**: When you use `mutationMode="pessimistic"`, the `onSuccess` function receives the response from the `dataProvider.update()` call, which is the created/edited record (see [the dataProvider documentation for details](../data-fetching/DataProviderWriting.md#update)). You can use that response in the success side effects:


```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, EditBase, Form } from 'ra-core';

const PostEdit = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

  const onSuccess = (data) => {
        notify(`Changes to post "${data.title}" saved`);
        redirect('/posts');
        refresh();
    };

    return (
        <EditBase mutationOptions={{ onSuccess }} mutationMode="pessimistic">
            <Form>
                {/* form content */}
            </Form>
        </EditBase>
    );
}
```

Similarly, you can override the failure side effects with an `onError` option. By default, when the save action fails at the dataProvider level, react-admin shows a notification error.


```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, EditBase, Form } from 'ra-core';

const PostEdit = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onError = (error) => {
        notify(`Could not edit post: ${error.message}`);
        redirect('/posts');
        refresh();
    };

    return (
        <EditBase mutationOptions={{ onError }}>
            <Form>
                {/* form content */}
            </Form>
        </EditBase>
    );
}
```


The `onError` function receives the error from the `dataProvider.update()` call. It is a JavaScript Error object (see [the dataProvider documentation for details](../data-fetching/DataProviderWriting.md#error-format)).

The default `onError` function is:

```jsx
(error) => {
    notify(typeof error === 'string' ? error : error.message || 'ra.notification.http_error', { type: 'error' });
    if (mutationMode === 'undoable' || mutationMode === 'pessimistic') {
        refresh();
    }
}
```

## `offline`

By default, `<EditBase>` renders nothing when there is no connectivity and the record hasn't been cached yet. You can provide your own component via the `offline` prop:

```jsx
import { EditBase } from 'ra-core';

export const PostEdit = () => (
    <EditBase offline={<p>No network. Could not load the post.</p>}>
        ...
    </EditBase>
);
```

**Tip**: If the record is in the Tanstack Query cache but you want to warn the user that they may see an outdated version, you can use the `<IsOffline>` component:

```jsx
import { EditBase, IsOffline } from 'ra-core';

export const PostEdit = () => (
    <EditBase offline={<p>No network. Could not load the post.</p>}>
        <IsOffline>
            No network. The post data may be outdated.
        </IsOffline>
        ...
    </EditBase>
);
```

## `queryOptions`

`<EditBase>` accepts a `queryOptions` prop to pass options to the react-query client. 

This can be useful e.g. to override the default error side effect. By default, when the `dataProvider.getOne()` call fails at the dataProvider level, react-admin shows an error notification and refreshes the page.

You can override this behavior and pass custom side effects by providing a custom `queryOptions` prop:

```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, EditBase, Form } from 'ra-core';

const PostEdit = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onError = (error) => {
        notify(`Could not load post: ${error.message}`, { type: 'error' });
        redirect('/posts');
        refresh();
    };

    return (
        <EditBase queryOptions={{ onError }}>
            <Form>
                {/* form content */}
            </Form>
        </EditBase>
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

Alternatively, you can pass a `render` function prop instead of children. This function will receive the `EditContext` as argument. 

```jsx
import { EditBase, Form } from 'ra-core';
import { TextInput } from './TextInput';
import { DateInput } from './DateInput';

const BookEdit = () => (
    <EditBase render={({ isPending, error }) => {
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
        return (
            <Form>
                <div style={{ display: 'flex', gap: '1rem', margin: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <TextInput label="Title" source="title" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <TextInput label="Author" source="author" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <DateInput label="Publication Date" source="published_at" />
                    </div>
                </div>
                <div style={{ margin: '1rem' }}>
                    <button type="submit">Save</button>
                </div>
            </Form>
        );
    }}/>
);
```

## `resource`

By default, `<EditBase>` operates on the current `ResourceContext` (defined at the routing level), so under the `/posts/1/show` path, the `resource` prop will be `posts`. You may want to force a different resource. In this case, pass a custom `resource` prop, and it will override the `ResourceContext` value.

```jsx
import { EditBase, Form } from 'ra-core';

export const UsersEdit = () => (
    <EditBase resource="users">
        <Form>
            {/* form content */}
        </Form>
    </EditBase>
);
```

**Tip**: Pass both a custom `id` and a custom `resource` prop to use `<EditBase>` independently of the current URL. This even allows you to use more than one `<EditBase>` component in the same page.

## `transform`

To transform a record after the user has submitted the form but before the record is passed to `dataProvider.update()`, use the `transform` prop. It expects a function taking a record as argument, and returning a modified record. For instance, to add a computed field upon update:

```jsx
export const UserEdit = () => {
    const transform = data => ({
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
    });
    return (
        <EditBase transform={transform}>
            <Form>
                {/* form content */}
            </Form>
        </EditBase>
    );
}
```

The `transform` function can also return a `Promise`, which allows you to do all sorts of asynchronous calls (e.g. to the `dataProvider`) during the transformation.

## Security

The `<EditBase>` component requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the `disableAuthentication` prop.

If your `authProvider` implements [Access Control](../security/Permissions.md#access-control), `<EditBase>` will only render if the user has the "edit" access to the related resource.

For instance, for the `<PostEdit>`page below:

```tsx
import { EditBase, Form } from 'ra-core';
import { TextInput } from './TextInput';

// Resource name is "posts"
const PostEdit = () => (
    <EditBase>
        <Form>
            <TextInput source="title" />
            <TextInput source="author" />
            <TextInput source="published_at" />
        </Form>
    </EditBase>
);
```

`<EditBase>` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "edit", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](../app-configuration/CoreAdmin.md#accessdenied).

**Note**: Access control is disabled when you use the [`disableAuthentication`](#disableauthentication) prop.

## Prefilling the Form

You sometimes need to pre-populate the form changes to a record. For instance, to revert a record to a previous version, or to make some changes while letting users modify other fields as well.

By default, the `<EditBase>` view starts with the current `record`. However, if the `location` object (injected by [react-router-dom](https://reactrouter.com/6.28.0/start/concepts#locations)) contains a `record` in its `state`, the `<EditBase>` view uses that `record` to prefill the form.

That means that if you want to create a link to an edition view, modifying immediately *some* values, all you have to do is to set the `state` when navigating to the edit route:

```jsx
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecordContext } from 'ra-core';

const ApproveButton = () => {
    const record = useRecordContext();
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/posts/${record.id}`, {
            state: { record: { status: 'approved' } }
        });
    };

    return (
        <button onClick={handleClick}>
            Approve
        </button>
    );
};
```

**Tip**: The `<EditBase>` component also watches the "source" parameter of `location.search` (the query string in the URL) in addition to `location.state` (a cross-page message hidden in the router memory). So the `ApproveButton` could also be written as:

```jsx
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecordContext } from 'ra-core';

const ApproveButton = () => {
    const record = useRecordContext();
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/posts/${record.id}?source=${JSON.stringify({ status: 'approved' })}`);
    };

    return (
        <button onClick={handleClick}>
            Approve
        </button>
    );
};
```

Should you use the location `state` or the location `search`? The latter modifies the URL, so it's only necessary if you want to build cross-application links (e.g. from one admin to the other). In general, using the location `state` is a safe bet.

You can detect prefilled values by leveraging the [`useRecordFromLocation`](./useRecordFromLocation.md) hook:

```jsx
import { EditBase, Form, useRecordFromLocation } from 'ra-core';
import { TextInput } from './TextInput';

const PostEdit = () => {
    const recordFromLocation = useRecordFromLocation();
    
    return (
        <EditBase>
            {recordFromLocation && (
                <div 
                    style={{
                        padding: '12px 16px',
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '4px',
                        marginBottom: '16px',
                        color: '#856404'
                    }}
                >
                    Some fields have been pre-filled. You can modify them before saving.
                </div>
            )}
            <Form>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <TextInput source="title" />
                    <TextInput source="author" />
                    <TextInput source="status" />
                </div>
            </Form>
        </EditBase>
    );
};
```
