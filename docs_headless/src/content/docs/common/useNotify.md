---
title: "useNotify"
---

This hook returns a function that displays a notification at the bottom of the page.

![Notification](../img/notification.webp)

## Usage

```jsx
import { useNotify } from 'ra-core';

const NotifyButton = () => {
    const notify = useNotify();
    const handleClick = () => {
        notify(`Comment approved`, { type: 'success' });
    }
    return <button onClick={handleClick}>Notify</button>;
};
```


Here are more examples of `notify` calls: 

```js
// notify an error
notify(`This is an error`, { type: 'error' });
// notify a warning
notify(`This is a warning`, { type: 'warning' });
// pass translation arguments
notify('item.created', { type: 'info', messageArgs: { resource: 'post' } });
// send an undoable notification
notify('Element updated', { type: 'info', undoable: true });
```

## Parameters

The hook takes no argument and returns a callback. The callback takes 2 arguments:

| Name      | Required | Type     | Default | Description                                        |
| --------- | -------- | -------- | ------- | -------------------------------------------------- |
| `message` | Required | `string` | -       | The message to display (a string, or a React node) |
| `options` |          | `object` | -       | The options                                        |

The `options` is an object that can have the following properties:

| Name               | Type      | Default | Description                                                                                                                                                                                         |
| ------------------ | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autoHideDuration` | `number   | null`   | `4000`                                                                                                                                                                                              | Duration (in milliseconds) after which the notification hides. Set it to `null` if the notification should not be dismissible. |
| `messageArgs`      | `object`  | -       | options to pass to the `translate` function (because notification messages are translated if your admin has an `i18nProvider`). It is useful for inserting variables into the translation.          |
| `multiLine`        | `boolean` | -       | Set it to `true` if the notification message should be shown in more than one line.                                                                                                                 |
| `undoable`         | `boolean` | -       | Set it to `true` if the notification should contain an "undo" button                                                                                                                                |
| `type`             | `string`  | `info`  | The notification type (`info`, `success`, `error` or `warning` - the default is `info`)                                                                                                             |


## `autoHideDuration`

You can define a custom delay for hiding a given notification.

```jsx
import { useNotify } from 'ra-core';

const LogoutButton = () => {
    const notify = useNotify();
    const logout = useLogout();

    const handleClick = () => {
        logout().then(() => {
            notify('Form submitted successfully', { autoHideDuration: 5000 });
        });
    };

    return <button onClick={handleClick}>Logout</button>;
};
```


## `messageArgs`

`useNotify` calls [the `translate` function](../i18n/useTranslate.md) to translate the notification message. You often need to pass variables to the `translate` function. The `messageArgs` option allows you to do that.

For instance, if you want to display a notification message like "Post 123 created", you need to pass the post id to the translation function. 

```jsx
notify('post.created', { messageArgs: { id: 123 } });
```

Then, in your translation files, you can use the `id` variable:

```jsx
{
    "post": {
        "created": "Post %{id} created"
    }
}
```

`messageArgs` also let you define a default translation using the `_` key:

```jsx
notify('post.created', { messageArgs: { _: 'Post created' } });
```

Finally, `messageArgs` lets you define a `smart_count` variable, which is useful for [pluralization](../i18n/useTranslate.md#using-pluralization-and-interpolation):

```jsx
notify('post.created', { messageArgs: { smart_count: 2 } });
```

`translate` uses the `smart_count` value to choose the right translation in the `post.created` key:

```jsx
{
    "post": {
        "created": "One post created |||| %{smart_count} posts created"
    }
}
```

## `multiLine`

You can display a notification message on multiple lines.

```jsx
notify(
    'This is a very long message that will be displayed on multiple lines',
    { multiLine: true }
);
```

## `type`

This option lets you choose the notification type. It can be `info`, `success`, `warning` or `error`. The default is `info`.

```jsx
notify('This is an info', { type: 'info' });
notify('This is a success', { type: 'success' });
notify('This is a warning', { type: 'warning' });
notify('This is an error', { type: 'error' });
```

## `undoable`

When using `useNotify` as a side effect for an `undoable` mutation, you MUST set the `undoable` option to `true`, otherwise the "undo" button will not appear, and the actual update will never occur.

```jsx
import * as React from 'react';
import { useNotify, EditBase, Form } from 'ra-core';

const PostEdit = () => {
    const notify = useNotify();

    const onSuccess = () => {
        notify('Changes saved`', { undoable: true });
    };

    return (
        <EditBase mutationMode="undoable" mutationOptions={{ onSuccess }}>
            <Form>
                ...
            </Form>
        </EditBase>
    );
}
```

## Custom Notification Content

You may want a notification message that contains HTML or other React components. To do so, you can pass a React node as the first argument of the `notify` function.

```tsx
import { useSubscribe } from "@react-admin/ra-realtime";
import { useNotify, useDataProvider } from "ra-core";

export const ConnectionWatcher = () => {
  const notify = useNotify();
  const dataProvider = useDataProvider();
  useSubscribe("connectedUsers", (event) => {
    if (event.type === "connected") {
      dataProvider
        .getOne("agents", { id: event.payload.agentId })
        .then(({ data }) => {
          notify(
            <div className="notification info">
                Agent ${data.firstName} ${data.lastName} just logged in
            </div>
          );
        });
    }
    if (event.type === "disconnected") {
      dataProvider
        .getOne("agents", { id: event.payload.agentId })
        .then(({ data }) => {
          notify(
            <div className="notification info">
                Agent ${data.firstName} ${data.lastName} just logged out
            </div>
          );
        });
    }
  });
  return null;
};
```

Note that if you use this ability to pass a React node, the message will not be translated - you'll have to translate it yourself using [`useTranslate`](../i18n/useTranslate.md).

## Closing The Notification

If you have custom actions in your notification element, you can leverage the `useCloseNotification` hook to close the notification programmatically:

```tsx
import { useCheckForApplicationUpdate, useCloseNotification, useNotify } from 'ra-core';

export const CheckForApplicationUpdate = () => {
    const notify = useNotify();

    const onNewVersionAvailable = () => {
        // autoHideDuration is set to null to disable the auto hide feature
        notify(<ApplicationUpdateNotification />, { autoHideDuration: null });
    };

    useCheckForApplicationUpdate({ onNewVersionAvailable, ...rest });
    return null;
};

const ApplicationUpdateNotification = ({ reset }: { reset:() => void }) => {
    const closeNotification = useCloseNotification();

    return (
        <div className="notification-content">
            <span>A new application version is available. Refresh your browser tab to update</span>
            <button
                onClick={() => {
                    closeNotification();
                }}
            >
                Dismiss
            </button>
        </div>
    );
};
```