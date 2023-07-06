---
layout: default
title: "useSubscribeToRecord"
---

# `useSubscribeToRecord`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> hook is a specialized version of [`useSubscribe`](./useSubscribe.md) that subscribes to events concerning a single record.

<video controls autoplay playsinline muted loop>
  <source src="./img/useSubscribeToRecord.webm" type="video/webm"/>
  <source src="./img/useSubscribeToRecord.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

The hook expects a callback function as its only argument, as it guesses the record and resource from the current context. The callback will be executed whenever an event is published on the `resource/[resource]/[recordId]` topic.

For instance, the following component displays a dialog when the record is updated by someone else:

```tsx
import { useState } from 'react';
import { useEditContext, useFormContext } from 'react-admin';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { useSubscribeToRecord } from '@react-admin/ra-realtime';

const WarnWhenUpdatedBySomeoneElse = () => {
    const [open, setOpen] = useState(false);
    const [author, setAuthor] = useState<string | null>(null);
    const handleClose = () => {
        setOpen(false);
    };
    const { refetch } = useEditContext();
    const refresh = () => {
        refetch();
        handleClose();
    };
    const {
        formState: { isDirty },
    } = useFormContext();

    useSubscribeToRecord((event: Event) => {
        if (event.type === 'edited') {
            if (isDirty) {
                setOpen(true);
                setAuthor(event.payload.user);
            } else {
                refetch();
            }
        }
    });

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Post Updated by {author}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Your changes and their changes may conflict. What do you
                    want to do?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Keep my changes</Button>
                <Button onClick={refresh}>
                    Get their changes (and lose mine)
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="title" fullWidth />
            <TextInput source="body" fullWidth multiline />
            <WarnWhenUpdatedBySomeoneElse />
        </SimpleForm>
    </Edit>
);
```

`useSubscribeToRecord` reads the current resource and record from the `ResourceContext` and `RecordContext` respectively. In the example above, the notification is displayed when the app receives an event on the `resource/books/123` topic.

Just like `useSubscribe`, `useSubscribeToRecord` unsubscribes from the topic when the component unmounts.

**Tip**: In the example above, `<Show>` creates the `RecordContext`- that's why the `useSubscribeToRecord` hook is used in its child component instead of in the `<BookShow>` component.

You can provide the resource and record id explicitly if you are not in such contexts:

```jsx
useSubscribeToRecord(event => { /* ... */ }, 'posts', 123);
```

**Tip**: If your reason to subscribe to events on a record is to keep the record up to date, you should use [the `useGetOneLive` hook](./useGetOneLive.md) instead.

## Parameters

| Prop       | Required | Type       | Default | Description                                                                             |
| ---------- | -------- | ---------- | ------- | --------------------------------------------------------------------------------------- |
| `callback` | Required | `function` | -       | The callback to execute when an event is received.                                      |
| `resource` | Optional | `string`   | -       | The resource to subscribe to. Defaults to the resource in the `ResourceContext`.        |
| `recordId` | Optional | `string`   | -       | The record id to subscribe to. Defaults to the id of the record in the `RecordContext`. |
| `options`  | Optional | `object`   | -       | The subscription options.                                                               |

## `callback`

Whenever an event is published on the `resource/[resource]/[recordId]` topic, the function passed as the first argument will be called with the event as a parameter.

```tsx
const [open, setOpen] = useState(false);
const [author, setAuthor] = useState<string | null>(null);
const { refetch } = useEditContext();
const {
    formState: { isDirty },
} = useFormContext();
useSubscribeToRecord((event: Event) => {
    if (event.type === 'edited') {
        if (isDirty) {
            setOpen(true);
            setAuthor(event.payload.user);
        } else {
            refetch();
        }
    }
});
```

**Tip**: Memoize the callback using `useCallback` to avoid unnecessary subscriptions/unsubscriptions.

```tsx
const [open, setOpen] = useState(false);
const [author, setAuthor] = useState<string | null>(null);
const { refetch } = useEditContext();
const {
    formState: { isDirty },
} = useFormContext();

const handleEvent = useCallback(
    (event: Event) => {
        if (event.type === 'edited') {
            if (isDirty) {
                setOpen(true);
                setAuthor(event.payload.user);
            } else {
                refetch();
            }
        }
    },
    [isDirty, refetch, setOpen, setAuthor]
);

useSubscribeToRecord(handleEvent);
```

Just like for `useSubscribe`, the callback function receives an `unsubscribe` callback as its second argument. You can call it to unsubscribe from the topic after receiving a specific event.

```tsx
useSubscribeToRecord((event: Event, unsubscribe) => {
    if (event.type === 'deleted') {
        // do something
        unsubscribe();
    }
    if (event.type === 'edited') {
        if (isDirty) {
            setOpen(true);
            setAuthor(event.payload.user);
        } else {
            refetch();
        }
    }
});
```

## `options`

The `options` object can contain the following properties:

-   `enabled`: Whether to subscribe or not. Defaults to `true`
-   `once`: Whether to unsubscribe after the first event. Defaults to `false`.
-   `unsubscribeOnUnmount`: Whether to unsubscribe on unmount. Defaults to `true`.

See [`useSubscribe`](./useSubscribe.md) for more details.

## `recordId`

The record id to subscribe to. By default, `useSubscribeToRecord` builds the topic it subscribes to using the id of the record in the `RecordContext`. But you can override this behavior by passing a record id as the third argument.

```jsx
// will subscribe to the 'resource/posts/123' topic
useSubscribeToRecord(event => { /* ... */ }, 'posts', 123);
```

Note that if you pass a null record id, the hook will not subscribe to any topic.

## `resource`

The resource to subscribe to. By default, `useSubscribeToRecord` builds the topic it subscribes to using the resource in the `ResourceContext`. But you can override this behavior by passing a resource name as the second argument.

```jsx
// will subscribe to the 'resource/posts/123' topic
useSubscribeToRecord(event => { /* ... */ }, 'posts', 123);
```

Note that if you pass an empty string as the resource name, the hook will not subscribe to any topic.
