---
layout: default
title: "useNotify"
---

# `useNotify`

This hook returns a function that displays a notification at the bottom of the page.

```jsx
import { useNotify } from 'react-admin';

const NotifyButton = () => {
    const notify = useNotify();
    const handleClick = () => {
        notify(`Comment approved`, { type: 'success' });
    }
    return <button onClick={handleClick}>Notify</button>;
};
```

The callback takes 2 arguments:
- The message to display
- an `options` object with the following keys:
    - `type`: The notification type (`info`, `success` or `warning` - the default is `info`)
    - `messageArgs`: options to pass to the `translate` function (because notification messages are translated if your admin has an `i18nProvider`). It is useful for inserting variables into the translation.
    - `undoable`: Set it to `true` if the notification should contain an "undo" button
    - `autoHideDuration`: Duration (in milliseconds) after which the notification hides. Set it to `0` if the notification should not be dismissible.
    - `multiLine`: Set it to `true` if the notification message should be shown in more than one line.

Here are more examples of `useNotify` calls: 

```js
// notify a warning
notify(`This is a warning`, { type: 'warning' });
// pass translation arguments
notify('item.created', { type: 'info', messageArgs: { resource: 'post' } });
// send an undoable notification
notify('Element updated', { type: 'info', undoable: true });
```

## `undoable` Option

When using `useNotify` as a side effect for an `undoable` mutation, you MUST set the `undoable` option to `true`, otherwise the "undo" button will not appear, and the actual update will never occur.

```jsx
import * as React from 'react';
import { useNotify, Edit, SimpleForm } from 'react-admin';

const PostEdit = () => {
    const notify = useNotify();

    const onSuccess = () => {
        notify('Changes saved`', { undoable: true });
    };

    return (
        <Edit mutationMode="undoable" onSuccess={onSuccess}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Edit>
    );
}
```

## `autoHideDuration` Option

You can define a custom delay for hiding a given notification.

```jsx
import { useNotify } from 'react-admin';

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

To change the default delay for all notifications, check [the Theming documentation](./Theming.md#notifications).