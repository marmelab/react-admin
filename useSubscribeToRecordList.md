---
layout: default
title: "useSubscribeToRecordList"
---

# `useSubscribeToRecordList`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> hook is a  specialized version of [`useSubscribe`](./useSubscribe.md) that subscribes to events concerning a list of records.

<video controls autoplay playsinline muted loop>
  <source src="./img/useSubscribeToRecordList.webm" type="video/webm"/>
  <source src="./img/useSubscribeToRecordList.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

`useSubscribeToRecordList` expects a callback function as its first argument. It will be executed whenever an event is published on the `resource/[resource]` topic.

For instance, the following component displays notifications when a record is created, updated, or deleted by someone else:

```jsx
import React from 'react';
import { useNotify, useListContext } from 'react-admin';
import { useSubscribeToRecordList } from '@react-admin/ra-realtime';

const ListWatcher = () => {
    const notity = useNotify();
    const { refetch, data } = useListContext();
    useSubscribeToRecordList(event => {
        switch (event.type) {
            case 'created': {
                notity('New movie created');
                refetch();
                break;
            }
            case 'updated': {
                if (data.find(record => record.id === event.payload.ids[0])) {
                    notity(`Movie #${event.payload.ids[0]} updated`);
                    refetch();
                }
                break;
            }
            case 'deleted': {
                if (data.find(record => record.id === event.payload.ids[0])) {
                    notity(`Movie #${event.payload.ids[0]} deleted`);
                    refetch();
                }
                break;
            }
        }
    });
    return null;
};

const MovieList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="director" />
            <TextField source="year" />
        </Datagrid>
        <ListWatcher />
    </List>
);
```

## Parameters

| Prop       | Required | Type       | Default | Description                                                                      |
| ---------- | -------- | ---------- | ------- | -------------------------------------------------------------------------------- |
| `callback` | Required | `function` | -       | The callback function to execute when an event is published on the topic.        |
| `resource` | Optional | `string`   | -       | The resource to subscribe to. Defaults to the resource in the `ResourceContext`. |
| `options`  | Optional | `object`   | -       | The subscription options.                                                        |

## `callback`

Whenever an event is published on the `resource/[resource]` topic, the function passed as the first argument will be called with the event as a parameter.

```jsx
const notity = useNotify();
const { refetch, data } = useListContext();
useSubscribeToRecordList(event => {
    switch (event.type) {
        case 'created': {
            notity('New movie created');
            refetch();
            break;
        }
        case 'updated': {
            if (data.find(record => record.id === event.payload.ids[0])) {
                notity(`Movie #${event.payload.ids[0]} updated`);
                refetch();
            }
            break;
        }
        case 'deleted': {
            if (data.find(record => record.id === event.payload.ids[0])) {
                notity(`Movie #${event.payload.ids[0]} deleted`);
                refetch();
            }
            break;
        }
    }
});
```

**Tip**: Memoize the callback using `useCallback` to avoid unnecessary subscriptions/unsubscriptions.

```jsx
const notity = useNotify();
const { refetch, data } = useListContext();
const callback = useCallback(
    event => {
        switch (event.type) {
            case 'created': {
                notity('New movie created');
                refetch();
                break;
            }
            case 'updated': {
                if (data.find(record => record.id === event.payload.ids[0])) {
                    notity(`Movie #${event.payload.ids[0]} updated`);
                    refetch();
                }
                break;
            }
            case 'deleted': {
                if (data.find(record => record.id === event.payload.ids[0])) {
                    notity(`Movie #${event.payload.ids[0]} deleted`);
                    refetch();
                }
                break;
            }
        }
    },
    [data, refetch, notity]
);
useSubscribeToRecordList(callback);
```

Just like for `useSubscribe`, the callback function receives an `unsubscribe` callback as its second argument. You can call it to unsubscribe from the topic after receiving a specific event.

## `options`

The `options` object can contain the following properties:

-   `enabled`: Whether to subscribe or not. Defaults to `true`
-   `once`: Whether to unsubscribe after the first event. Defaults to `false`.
-   `unsubscribeOnUnmount`: Whether to unsubscribe on unmount. Defaults to `true`.

See [`useSubscribe`](./useSubscribe.md) for more details.

## `resource`

`useSubscribeToRecordList` reads the current resource from the `ResourceContext`. You can provide the resource explicitly if you are not in such a context:

```jsx
useSubscribeToRecordList(event => {
    if (event.type === 'updated') {
        notify('Post updated');
        refresh();
    }
}, 'posts');
```
