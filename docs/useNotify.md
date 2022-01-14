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
- an `options` object with the following keys
    - The `type` of the notification (`info`, `success` or `warning` - the default is `info`)
    - A `messageArgs` object to pass to the `translate` function (because notification messages are translated if your admin has an `i18nProvider`). It is useful for inserting variables into the translation.
    - An `undoable` boolean. Set it to `true` if the notification should contain an "undo" button
    - An `autoHideDuration` number. Set it to `0` if the notification should not be dismissible.
    - A `multiLine` boolean. Set it to `true` if the notification message should be shown in more than one line.

Here are more examples of `useNotify` calls: 

```js
// notify a warning
notify(`This is a warning`, 'warning');
// pass translation arguments
notify('item.created', { type: 'info', messageArgs: { resource: 'post' } });
// send an undoable notification
notify('Element updated', { type: 'info', undoable: true });
```

**Tip**: When using `useNotify` as a side effect for an `undoable` mutation, you MUST set the `undoable` option to `true`, otherwise the "undo" button will not appear, and the actual update will never occur.

```jsx
import * as React from 'react';
import { useNotify, Edit, SimpleForm } from 'react-admin';

const PostEdit = () => {
    const notify = useNotify();

    const onSuccess = () => {
        notify('Changes saved`', { undoable: true });
    };

    return (
        <Edit mutationMode="undoable" mutationOptions={{ onSuccess }}>
            <SimpleForm>
                ...
            </SimpleForm>
        </Edit>
    );
}
```
