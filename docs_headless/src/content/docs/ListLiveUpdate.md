---
title: 'ListLiveUpdate'
---

`<ListLiveUpdate>` refreshes its parent `ListContext` (e.g in a [`<ListBase>`](./ListBase.md)) when a record is created, updated, or deleted. It therefore displays up-to-date data in real-time.

This feature requires a valid is an [Enterprise Edition](https://react-admin-ee.marmelab.com) subscription. 

## Installation

```bash
npm install @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

Add the `<ListLiveUpdate>` in your `<ListBase>` children:

```tsx {11}
import { ListBase, RecordsIterator } from 'ra-core';
import { ListLiveUpdate } from '@react-admin/ra-core-ee';

const PostList = () => (
    <ListBase>
        <ul>
            <RecordsIterator
                render={record => <li>{record.title} - {record.views}</li>}
            />
        </ul>
        <ListLiveUpdate />
    </ListBase>
);
```

To trigger a refresh of `<ListLiveUpdate>`, the API has to publish an event containing at least the following data:

```js
{
    topic : '/resource/{resource}',
    event: {
        type: '{deleted || created || updated}',
        payload: { ids: [{listOfRecordIdentifiers}]},
    }
}
```

This also works with [`<ReferenceManyFieldBase>`](./ReferenceManyFieldBase.md) or [`<ReferenceArrayFieldBase>`](./ReferenceArrayFieldBase.md):

```tsx
import { ShowBase, RecordsIterator } from 'ra-core';
import { ReferenceManyFieldBase, ListLiveUpdate } from '@react-admin/ra-core-ee';

const AuthorShow = () => (
    <ShowBase>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Other author details here */}
            <ReferenceManyFieldBase
                reference="books"
                target="author_id"
                label="Books"
            >
                <ul>
                    <RecordsIterator
                        render={record => <li>{record.title}</li>}
                    />
                </ul>
                <ListLiveUpdate />
            </ReferenceManyFieldBase>
        </div>
    </ShowBase>
);
```

## Props

| Prop              | Required | Type       | Default | Description                                                                |
| ----------------- | -------- | ---------- | ------- | -------------------------------------------------------------------------- |
| `onEventReceived` | Optional | `function` | -       | A function that allows to customize side effects when an event is received |

## `onEventReceived`

The `<ListLiveUpdate>` allows you to customize the side effects triggered when it receives a new event, by passing a function to the `onEventReceived` prop:

```tsx
import { ListBase, RecordsIterator, useNotify, useRefresh } from 'ra-core';
import { ReferenceManyFieldBase, ListLiveUpdate } from '@react-admin/ra-core-ee';

const PostList = () => {
    const notify = useNotify();
    const refresh = useRefresh();

    const handleEventReceived = (event) => {
        const count = get(event, 'payload.ids.length', 1);
        notify(`${count} items updated by another user`);
        refresh();
    };

    return (
        <ListBase>
            <ul>
                <RecordsIterator
                    render={record => <li>{record.title} - {record.views}</li>}
                />
            </ul>
            <ListLiveUpdate onEventReceived={handleEventReceived} />
        </ListBase>
    );
};
```
