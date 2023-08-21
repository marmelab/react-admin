---
layout: default
title: "The UpdateButton Component"
---

# `<UpdateButton>`

This component allows to create a button that updates a record by calling the [`useUpdate hook`](./useUpdate.md).

<video controls playsinline muted loop poster="./img/updatebutton.png" >
  <source src="./img/updatebutton.webm" type="video/webm" />
  <source src="./img/updatebutton.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Usage

Use `<UpdateButton>` inside the actions toolbar of the [`Edit`](./Edit.md#actions) or [`Show`](./Show.md#actions) views.

{% raw %}
```jsx
import { Edit, SimpleForm, TextInput, TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton label="Reset views" data={{ views: 0 }} />
    </TopToolbar>
);

export const PostEdit = () => (
    <Edit actions={<PostEditActions>}>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="body" />
        </SimpleForm>
    </Edit>
);
```
{% endraw %}

## Props

`<UpdateButton>` accepts the following props:

| Prop             | Required | Type        | Default    | Description                                              |
| ---------------- | -------- | ----------- | ---------- | -------------------------------------------------------- |
| `data`           | Required | `object`    |            | The data used to update the record                       |
| `mutationMode`   | Optional | `string`    | `undoable` | Mutation mode (`'undoable'`, `'pessimistic'` or `'optimistic'`) |
| `confirmTitle`   | Optional | `ReactNode` | `ra.message.bulk_update_title` | The title of the confirmation dialog when `mutationMode` is not `undoable` |
| `confirmContent` | Optional | `ReactNode` | `ra.message.bulk_update_content` | The content of the confirmation dialog when `mutationMode` is not `undoable` |
| `mutationOptions` | Optional | `Object`  |        | The react-query mutation options |

`<UpdateButton>` also accepts the [Button props](./Buttons.md#button).

## `data`

The data used to update the record. Passed to the `dataProvider.update` method. This prop is required.

{% raw %}
```tsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton label="Reset views" data={{ views: 0 }} />
    </TopToolbar>
);
```
{% endraw %}

## `mutationMode`

The mutation mode determines when the side effects (redirection, notifications, etc.) are executed:

- `pessimistic`: The mutation is passed to the dataProvider first. When the dataProvider returns successfully, the mutation is applied locally, and the side effects are executed. 
- `optimistic`: The mutation is applied locally and the side effects are executed immediately. Then the mutation is passed to the dataProvider. If the dataProvider returns successfully, nothing happens (as the mutation was already applied locally). If the dataProvider returns in error, the page is refreshed and an error notification is shown. 
- `undoable` (default): The mutation is applied locally and the side effects are executed immediately. Then a notification is shown with an undo button. If the user clicks on undo, the mutation is never sent to the dataProvider, and the page is refreshed. Otherwise, after a 5 seconds delay, the mutation is passed to the dataProvider. If the dataProvider returns successfully, nothing happens (as the mutation was already applied locally). If the dataProvider returns in error, the page is refreshed and an error notification is shown.

By default, the `<UpdateButton>` uses the `undoable` mutation mode. This is part of the "optimistic rendering" strategy of react-admin ; it makes user interactions more reactive. 

You can change this default by setting the `mutationMode` prop. For instance, to remove the ability to undo the changes, use the `optimistic` mode:

{% raw %}
```jsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton label="Reset views" data={{ views: 0 }} mutationMode="optimistic" />
    </TopToolbar>
);
```
{% endraw %}

And to make the action blocking, and wait for the dataProvider response to continue, use the `pessimistic` mode:

{% raw %}
```jsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton label="Reset views" data={{ views: 0 }} mutationMode="pessimistic" />
    </TopToolbar>
);
```
{% endraw %}


**Tip**: When using any other mode than `undoable`, the `<UpdateButton>` displays a confirmation dialog before calling the dataProvider. 

## `confirmTitle`

Only used when `mutationMode` is either `optimistic` or `pessimistic` to change the confirmation dialog title:

{% raw %}
```jsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton
            label="Reset views"
            data={{ views: 0 }}
            mutationMode="optimistic"
            confirmTitle="Reset views"
        />
    </TopToolbar>
);
```
{% endraw %}

## `confirmContent`

Only used when `mutationMode` is either `optimistic` or `pessimistic` to change the confirmation dialog content:

{% raw %}
```jsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton
            label="Reset views"
            data={{ views: 0 }}
            mutationMode="optimistic"
            confirmContent="Do you really want to reset the views?"
        />
    </TopToolbar>
);
```
{% endraw %}

## `mutationOptions`

`<UpdateButton>` calls `dataProvider.update()` via react-query's `useMutation` hook. You can customize the options you pass to this hook, e.g. to pass [a custom `meta`](./Actions.md#meta-parameter) to the `dataProvider.update()` call.

{% raw %}
```jsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton
            label="Reset views"
            data={{ views: 0 }}
            mutationOptions={{ meta: { foo: 'bar' } }}
        />
    </TopToolbar>
);
```
{% endraw %}

You can also use `mutationOptions` to override success or error side effects, by setting the `mutationOptions` prop. Refer to the [useMutation documentation](https://tanstack.com/query/v3/docs/react/reference/useMutation) in the react-query website for a list of the possible options.

Let's see an example with the success side effect. By default, when the action succeeds, react-admin shows a notification, and refreshes the view. You can override this behavior and pass custom success side effects by providing a `mutationOptions` prop with an `onSuccess` key:

{% raw %}
```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onSuccess = () => {
        notify(`Changes saved`);
        redirect('/posts');
        refresh();
    };

    return (
        <TopToolbar>
            <UpdateButton
                label="Reset views"
                data={{ views: 0 }}
                mutationOptions={{ onSuccess }}
            />
        </TopToolbar>
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
    refresh();
}
```

**Tip**: When you use `mutationMode="pessimistic"`, the `onSuccess` function receives the response from the `dataProvider.update()` call, which is the edited record (see [the dataProvider documentation for details](./DataProviderWriting.md#response-format)). You can use that response in the success side effects: 

{% raw %}
```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onSuccess = (data) => {
        notify(`Changes to post "${data.title}" saved`);
        redirect('/posts');
        refresh();
    };

    return (
        <TopToolbar>
            <UpdateButton
                label="Reset views"
                data={{ views: 0 }}
                mutationOptions={{ onSuccess }}
            />
        </TopToolbar>
    );
}
```
{% endraw %}

Similarly, you can override the failure side effects with an `onError` option. By default, when the save action fails at the dataProvider level, react-admin shows a notification error.

{% raw %}
```jsx
import * as React from 'react';
import { useNotify, useRefresh, useRedirect, TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onError = (error) => {
        notify(`Could not edit post: ${error.message}`);
        redirect('/posts');
        refresh();
    };

    return (
        <TopToolbar>
            <UpdateButton
                label="Reset views"
                data={{ views: 0 }}
                mutationOptions={{ onError }}
            />
        </TopToolbar>
    );
}
```
{% endraw %}

The `onError` function receives the error from the `dataProvider.update()` call. It is a JavaScript Error object (see [the dataProvider documentation for details](./DataProviderWriting.md#error-format)).

The default `onError` function is:

```jsx
(error) => {
    notify(typeof error === 'string' ? error : error.message || 'ra.notification.http_error', { type: 'error' });
}
```

## `sx`

The sx prop lets you style the component and its children using Material-ui's [sx syntax](https://mui.com/system/the-sx-prop/).

{% raw %}
```jsx
import { TopToolbar, UpdateButton } from 'react-admin';

const PostEditActions = () => (
    <TopToolbar>
        <UpdateButton label="Reset views" data={{ views: 0 }} sx={{ width: 500 }} />
    </TopToolbar>
);
```
{% endraw %}
