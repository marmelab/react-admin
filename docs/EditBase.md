---
layout: default
title: "The EditBase Component"
storybook_path: ra-core-controller-editbase--default-title
---

# `<EditBase>`

`<EditBase>` is a headless variant of [`<Edit>`](./Edit.md): it fetches a record based on the URL, prepares a form submit handler, and renders its children inside an [`EditContext`](./useEditContext.md). Use it to build a custom edition page layout.

Contrary to [`<Edit>`](./Edit.md), it does not render the page layout, so no title, no actions, and no `<Card>`.

`<EditBase>` relies on the [`useEditController`](./useEditController.md) hook.

## Usage

Use `<EditBase>` to create a custom Edition view, with exactly the content you add as child and nothing else (no title, Card, or list of actions as in the `<Edit>` component). 

```jsx
import { EditBase, SelectInput, SimpleForm, TextInput, Title } from "react-admin";
import { Card, CardContent, Container } from "@mui/material";

export const BookEdit = () => (
    <EditBase>
        <Container>
            <Title title="Book Edition" />
            <Card>
                <CardContent>
                    <SimpleForm>
                        <TextInput source="title" />
                        <TextInput source="author" />
                        <SelectInput source="availability" choices={[
                            { id: "in_stock", name: "In stock" },
                            { id: "out_of_stock", name: "Out of stock" },
                            { id: "out_of_print", name: "Out of print" },
                        ]} />
                    </SimpleForm>
                </CardContent>
            </Card>
        </Container>
    </EditBase>
);
```

## Props

| Prop                     | Required | Type                                                     | Default | Description
|--------------------------|----------|----------------------------------------------------------|---------|--------------------------------------------------------
| `authLoading`            | Optional | `ReactNode`                                              |         | The component to render while checking for authentication and permissions
| `children`               | Optional | `ReactNode`                                              |         | The components rendering the record fields
| `render`                 | Optional | `(props: EditControllerResult<RecordType>) => ReactNode` |         | Alternative to children, a function that takes the EditController context and renders the form
| `disable Authentication` | Optional | `boolean`                                                |         | Set to `true` to disable the authentication check
| `id`                     | Optional | `string`                                                 |         | The record identifier. If not provided, it will be deduced from the URL
| `mutationMode`           | Optional | `undoable`                                               |         | The mutation mode
| `mutationOptions`        | Optional | `ReactNode`                                              |         | The options to pass to the `useUpdate` hook
| `offline`                | Optional | `ReactNode`                                              |         | The component to render when there is no connectivity and the record isn't in the cache
| `queryOptions`           | Optional | `object`                                                 |         | The options to pass to the `useGetOne` hook
| `transform`              | Optional | `string`                                                 |         | Transform the form data before calling `dataProvider.update()`

## `authLoading`

By default, `<EditBase>` renders nothing while checking for authentication and permissions. You can provide your own component via the `authLoading` prop:

```jsx
import { EditBase } from 'react-admin';

export const PostEdit = () => (
    <EditBase authLoading={<p>Checking for permissions...</p>}>
        ...
    </EditBase>
);
```

## `children`

`<EditBase>` renders its children wrapped by a `RecordContext`, so you can use any component that depends on such a context to be defined - including all [Inputs components](./Inputs.md).

For instance, to display several fields in a single line, you can use Material UI’s `<Grid>` component:

{% raw %}
```jsx
import { EditBase, Form, DateInput, ReferenceInput, SaveButton, TextInput } from 'react-admin';
import { Grid } from '@mui/material';

const BookEdit = () => (
    <EditBase>
        <Form>
            <Grid container spacing={2} sx={{ margin: 2 }}>
                <Grid item xs={12} sm={6}>
                    <TextInput label="Title" source="title" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ReferenceInput label="Author" source="author_id" reference="authors">
                        <TextInput source="name" />
                    </ReferenceInput>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DateInput label="Publication Date" source="published_at" />
                </Grid>
                <Grid item xs={12}>
                    <SaveButton />
                </Grid>
            </Grid>
        </Form>
    </EditBase>
);
```
{% endraw %}

## `disableAuthentication`

By default, the `<EditBase>` component will automatically redirect the user to the login page if the user is not authenticated. If you want to disable this behavior and allow anonymous access to a show page, set the `disableAuthentication` prop to `true`.

```jsx
import { EditBase } from 'react-admin';

const PostEdit = () => (
    <EditBase disableAuthentication>
        ...
    </EditBase>
);
```

## `id`

By default, `<EditBase>` deduces the identifier of the record to show from the URL path. So under the `/posts/123/show` path, the `id` prop will be `123`. You may want to force a different identifier. In this case, pass a custom `id` prop.

```jsx
import { EditBase } from 'react-admin';

export const PostEdit = () => (
    <EditBase id="123">
        ...
    </EditBase>
);
```

**Tip**: Pass both a custom `id` and a custom `resource` prop to use `<EditBase>` independently of the current URL. This even allows you to use more than one `<EditBase>` component in the same page.

## `mutationMode`

The `<EditBase>` component exposes a save method, which perform a "mutation" (i.e. they alter the data). React-admin offers three modes for mutations. The mode determines when the side effects (redirection, notifications, etc.) are executed:

* `pessimistic`: The mutation is passed to the dataProvider first. When the dataProvider returns successfully, the mutation is applied locally, and the side effects are executed.
* `optimistic`: The mutation is applied locally and the side effects are executed immediately. Then the mutation is passed to the dataProvider. If the dataProvider returns successfully, nothing happens (as the mutation was already applied locally). If the dataProvider returns in error, the page is refreshed and an error notification is shown.
* `undoable` (default): The mutation is applied locally and the side effects are executed immediately. Then a notification is shown with an undo button. If the user clicks on undo, the mutation is never sent to the dataProvider, and the page is refreshed. Otherwise, after a 5 seconds delay, the mutation is passed to the dataProvider. If the dataProvider returns successfully, nothing happens (as the mutation was already applied locally). If the dataProvider returns in error, the page is refreshed and an error notification is shown.

By default, pages using `<EditBase>` use the `undoable` mutation mode. This is part of the "optimistic rendering" strategy of react-admin ; it makes user interactions more reactive.

You can change this default by setting the `mutationMode` prop - and this affects both the Save and Delete buttons. For instance, to remove the ability to undo the changes, use the `optimistic` mode:

```jsx
import { EditBase } from 'react-admin';

const PostEdit = () => (
    <EditBase mutationMode="optimistic">
        // ...
    </EditBase>
);
```

And to make the Save action blocking, and wait for the dataProvider response to continue, use the `pessimistic` mode:

```jsx
import { EditBase } from 'react-admin';

const PostEdit = () => (
    <EditBase mutationMode="pessimistic">
        // ...
    </EditBase>
);
```

## `mutationOptions`

`<EditBase>` calls `dataProvider.update()` via react-query's `useMutation` hook. You can customize the options you pass to this hook, e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.update()` call.

{% raw %}

```jsx
import { EditBase, SimpleForm } from 'react-admin';

const PostEdit = () => (
    <EditBase mutationOptions={{ meta: { foo: 'bar' } }}>
        <SimpleForm>
            ...
        </SimpleForm>
    </EditBase>
);
```

{% endraw %}

You can also use `mutationOptions` to override success or error side effects, by setting the `mutationOptions` prop. Refer to the [useMutation documentation](https://tanstack.com/query/v5/docs/react/reference/useMutation) in the react-query website for a list of the possible options.

Let's see an example with the success side effect. By default, when the save action succeeds, react-admin shows a notification, and redirects to the list page. You can override this behavior and pass custom success side effects by providing a `mutationOptions` prop with an `onSuccess` key:

{% raw %}

```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, EditBase, SimpleForm } from 'react-admin';

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
            <SimpleForm>
                ...
            </SimpleForm>
        </EditBase>
    );
}
```

{% endraw %}

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

**Tip**: When you use `mutationMode="pessimistic"`, the `onSuccess` function receives the response from the `dataProvider.update()` call, which is the created/edited record (see [the dataProvider documentation for details](./DataProviderWriting.md#update)). You can use that response in the success side effects:

{% raw %}

```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, EditBase, SimpleForm } from 'react-admin';

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
            <SimpleForm>
                ...
            </SimpleForm>
        </EditBase>
    );
}
```

{% endraw %}

**Tip**: If you want to have different success side effects based on the button clicked by the user (e.g. if the creation form displays two submit buttons, one to "save and redirect to the list", and another to "save and display an empty form"), you can set the `mutationOptions` prop on [the `<SaveButton>` component](./SaveButton.md), too.

Similarly, you can override the failure side effects with an `onError` option. By default, when the save action fails at the dataProvider level, react-admin shows a notification error.

{% raw %}

```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, EditBase, SimpleForm } from 'react-admin';

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
            <SimpleForm>
                ...
            </SimpleForm>
        </EditBase>
    );
}
```

{% endraw %}

The `onError` function receives the error from the `dataProvider.update()` call. It is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviderWriting.md#error-format)).

The default `onError` function is:

```jsx
(error) => {
    notify(typeof error === 'string' ? error : error.message || 'ra.notification.http_error', { type: 'error' });
    if (mutationMode === 'undoable' || mutationMode === 'pessimistic') {
        refresh();
    }
}
```

**Tip**: If you want to have different failure side effects based on the button clicked by the user, you can set the `mutationOptions` prop on the `<SaveButton>` component, too.

## `offline`

By default, `<EditBase>` renders nothing when there is no connectivity and the record hasn't been cached yet. You can provide your own component via the `offline` prop:

```jsx
import { EditBase } from 'react-admin';

export const PostEdit = () => (
    <EditBase offline={<p>No network. Could not load the post.</p>}>
        ...
    </EditBase>
);
```

**Tip**: If the record is in the Tanstack Query cache but you want to warn the user that they may see an outdated version, you can use the `<IsOffline>` component:

```jsx
import { EditBase, IsOffline } from 'react-admin';

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
import { useNotify, useRefresh, useRedirect, EditBase, SimpleForm } from 'react-admin';

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
            <SimpleForm>
                ...
            </SimpleForm>
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

{% raw %}
```jsx
import { EditBase, Form, DateInput, ReferenceInput, SaveButton, TextInput } from 'react-admin';

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
                <Grid container spacing={2} sx={{ margin: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextInput label="Title" source="title" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ReferenceInput label="Author" source="author_id" reference="authors">
                            <TextInput source="name" />
                        </ReferenceInput>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DateInput label="Publication Date" source="published_at" />
                    </Grid>
                    <Grid item xs={12}>
                        <SaveButton />
                    </Grid>
                </Grid>
            </Form>
        );
    }}/>
);
```
{% endraw %}

## `resource`

By default, `<EditBase>` operates on the current `ResourceContext` (defined at the routing level), so under the `/posts/1/show` path, the `resource` prop will be `posts`. You may want to force a different resource. In this case, pass a custom `resource` prop, and it will override the `ResourceContext` value.

```jsx
import { EditBase } from 'react-admin';

export const UsersEdit = () => (
    <EditBase resource="users">
        ...
    </EditBase>
);
```

**Tip**: Pass both a custom `id` and a custom `resource` prop to use `<EditBase>` independently of the current URL. This even allows you to use more than one `<EditBase>` component in the same page.

## Security

The `<EditBase>` component requires authentication and will redirect anonymous users to the login page. If you want to allow anonymous access, use the [`disableAuthentication`](./Edit.md#disableauthentication) prop.

If your `authProvider` implements [Access Control](./Permissions.md#access-control), `<EditBase>`  will only render if the user has the "edit" access to the related resource.

For instance, for the `<PostEdit>`page below:

```tsx
import { EditBase, SimpleForm, TextInput } from 'react-admin';

// Resource name is "posts"
const PostEdit = () => (
    <EditBase>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="author" />
            <TextInput source="published_at" />
        </SimpleForm>
    </EditBase>
);
```

`<EditBase>` will call `authProvider.canAccess()` using the following parameters:

```jsx
{ action: "edit", resource: "posts" }
```

Users without access will be redirected to the [Access Denied page](./Admin.md#accessdenied).

**Note**: Access control is disabled when you use [the `disableAuthentication` prop](./Edit.md#disableauthentication).
