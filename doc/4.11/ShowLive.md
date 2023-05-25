---
layout: default
title: "ShowLive"
---

# `<ShowLive>`

`<ShowLive>` is an [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component that  renders a Show page. It shows a notification and refreshes the page when the record is updated by another user. Also, it displays a warning when the record is deleted by another user.

![ShowLive](./img/ShowLive.png)

## Usage

Use `<ShowLive>` instead of `<Show>`:

```jsx
import { SimpleShowLayout, TextField } from 'react-admin';
import { ShowLive } from '@react-admin/ra-realtime';

const PostShow = () => (
    <ShowLive>
        <SimpleShowLayout>
            <TextField source="title" />
        </SimpleShowLayout>
    </ShowLive>
);
```

To trigger the `<ShowLive>` updates, the API has to publish events containing at least the following:

```js
{
    topic : '/resource/{resource}/{recordIdentifier}',
    type: '{deleted || updated}',
    payload: { id: [{recordIdentifier}]},
}
```

`<ShowLive>` accepts the same props as `<Show>`. Refer to [the `<Show>` documentation](./Show.md) for more information.

## `onEventReceived`

The `<ShowLive>` allows you to customize the side effects triggered when it receives a new event, by passing a function to the `onEventReceived` prop:

```jsx
import { SimpleShowLayout, TextField, useRefresh } from 'react-admin';
import { ShowLive, EventType } from '@react-admin/ra-realtime';

const PostShow = () => {
    const notify = useNotify();

    const handleEventReceived = (event, { setDeleted }) => {
        if (event.type === EventType.Updated) {
            notify('Record updated');
            refresh();
        } else if (event.type === EventType.Deleted) {
            notify('Record deleted');
            setDeleted(true);
        }
    };

    return (
        <ShowLive onEventReceived={handleEventReceived}>
            <SimpleShowLayout>
                <TextField source="title" />
            </SimpleShowLayout>
        </ShowLive>
    );
};
```

The function passed to `onEventReceived` will be called with the event as its first argument and an object containing functions that will update the UI:

-   `setDeleted`: If set to `true`, the edit view will show a message to let users know this record has been deleted.
