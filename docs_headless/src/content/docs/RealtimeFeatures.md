---
title: Real-time Setup
---

`@react-admin/ra-core-ee` provides hooks and components for collaborative applications where several people work in parallel. It supports:

- publishing and subscribing to real-time events,
- updating views when another user pushes a change,
- notifying end users of events, and
- preventing data loss when two editors work on the same resource concurrently with locks.

## Installation

The realtime features require a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription. Once subscribed, follow the [instructions to get access to the private npm repository](https://react-admin-ee.marmelab.com/setup).

You can then install the npm package providing the realtime features using your favorite package manager:

```sh
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

This package supports various realtime infrastructures ([Mercure](https://mercure.rocks/), [API Platform](https://api-platform.com/docs/admin/real-time-mercure/#real-time-updates-with-mercure), [supabase](https://supabase.com/), [Socket.IO](https://socket.io/), [Ably](https://ably.com/), and many more) thanks to the same _adapter_ approach as for CRUD methods. In fact, the `dataProvider` is used to implement the realtime communication (see the [Data Provider Requirements](#data-provider-requirements) section for more information).

## Features

### Publish/Subscribe

At its core, the realtime features rely on a **pub/sub mechanism** to send and receive events. Events are sent to a topic, and all subscribers to this topic receive the event.

```tsx
import { usePublish, useSubscribe } from '@react-admin/ra-core-ee';

// on the publisher side
const [publish] = usePublish();
publish(topic, event);

// on the subscriber side
useSubscribe(topic, callback);
```

Use the following hooks to publish and subscribe to real-time events:

- [`usePublish`](./usePublish.md)
- [`useSubscribe`](./useSubscribe.md)
- [`useSubscribeCallback`](./useSubscribeCallback.md)

`@react-admin/ra-core-ee` goes beyond generic events and provides hooks to subscribe to [CRUD events](#crud-events), i.e. changes on records and record lists:

- [`useSubscribeToRecord`](./useSubscribeToRecord.md)
- [`useSubscribeToRecordList`](./useSubscribeToRecordList.md)

For example, `useSubscribeToRecord` lets you display a warning in an Edit view when someone else modifies the same record:

```tsx {16-25}
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
    return open ? (
        <div className="flex flex-col gap-4">
            <p>
                Post Updated by {author}
            </p>
            <p>
                Your changes and their changes may conflict. What do you
                want to do?
            </p>
            <div className="flex gap-4">
                <button onClick={handleClose}>Keep my changes</button>
                <button onClick={refresh}>
                    Get their changes (and lose mine)
                </button>
            </div>
        </div>
    ) : null;
};

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            {/* Inputs... */}
            <WarnWhenUpdatedBySomeoneElse />
        </SimpleForm>
    </Edit>
);
```

### Live Updates

When a user edits a resource, you can propagate these changes in real time so that other users working on the same resource see the changes automatically. This works whether they are in a list, a show view, or an edit view.

Live updates leverage the following components and hooks:

- [`<ListLiveUpdate>`](./ListLiveUpdate.md)
- [`useGetListLive`](./useGetListLive.md)
- [`useGetOneLive`](./useGetOneLive.md)

For instance, include a `<ListLiveUpdate>` within a `<List>` to have a list refreshing automatically when an element is added, updated, or deleted:

```tsx {2, 7}
import { List } from '@/components/admin/list';
import { ListLiveUpdate } from '@react-admin/ra-core-ee';

const PostList = () => (
    <List>
        ...other children
        <ListLiveUpdate />
    </List>
);
```

<video controls autoplay playsinline muted loop class="w-full aspect-600/220">
  <source src="https://react-admin-ee.marmelab.com/assets/useSubscribeToRecordList.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

### Locks

Last but not least, the Realtime package provides a **lock mechanism** to prevent two users from editing the same resource at the same time.

<video controls autoplay playsinline muted loop class="w-full aspect-600/258">
  <source src="https://react-admin-ee.marmelab.com/assets/locks-demo.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

A user can lock a resource, either by voluntarily asking for a lock or by editing a resource. When a resource is locked, other users can't edit it. When the lock is released, other users can edit the resource again.

This feature leverages the following utilities:

- [`<LockOnMount>`](./LockOnMount.md)
- [`<LockStatusBase>`](./LockStatusBase.md)
- [`<WithLocks>`](./WithLocks.md)
- [`useLock`](./useLock.md)
- [`useUnlock`](./useUnlock.md)
- [`useGetLock`](./useGetLock.md)
- [`useGetLockLive`](./useGetLockLive.md)
- [`useGetLocks`](./useGetLocks.md)
- [`useGetLocksLive`](./useGetLocksLive.md)
- [`useLockOnCall`](./useLockOnCall.md)
- [`useLockOnMount`](./useLockOnMount.md)

For example, the following form locks a ticket record when the user focuses on the message input. If another user has already locked the ticket, the form inputs are disabled:

```tsx
import { Form, useCreate, useGetIdentity, useRecordContext } from 'ra-core';
import { useGetLockLive } from '@react-admin/ra-core-ee';
import { TextInput, SelectInput } from 'your-ra-ui-library';

export const NewMessageForm = () => {
    const [create, { isLoading: isCreating }] = useCreate();
    const record = useRecordContext();

    const { data: lock } = useGetLockLive('tickets', { id: record.id });
    const { identity } = useGetIdentity();
    const isFormDisabled = lock && lock.identity !== identity?.id;

    const [doLock] = useLockOnCall({ resource: 'tickets' });
    const handleSubmit = (values: any) => {
        /* ... */
    };

    return (
        <Form onSubmit={handleSubmit}>
            <TextInput
                source="message"
                multiline
                onFocus={() => {
                    doLock();
                }}
                disabled={isFormDisabled}
            />
            <SelectInput
                source="status"
                choices={statusChoices}
                disabled={isFormDisabled}
            />
            <button type="submit" disabled={isCreating || isFormDisabled}>
                Submit
            </button>
        </Form>
    );
};
```

## Data Provider Requirements

To enable real-time features, the `dataProvider` must implement three new methods:

- `subscribe(topic, callback)`
- `unsubscribe(topic, callback)`
- `publish(topic, event)` (optional - publication is often done server-side)

These methods should return an empty Promise resolved when the action was acknowledged by the real-time bus.

In addition, to support the lock features, the `dataProvider` must implement 4 more methods:

- `lock(resource, { id, identity, meta })`
- `unlock(resource, { id, identity, meta })`
- `getLock(resource, { id, meta })`
- `getLocks(resource, { meta })`

### Supabase Adapter

The `@react-admin/ra-core-ee` package contains a function augmenting a regular (API-based) `dataProvider` with real-time methods based on the capabilities of [Supabase](https://supabase.com/docs/guides/realtime).

This adapter subscribes to [Postgres Changes](https://supabase.com/docs/guides/realtime/extensions/postgres-changes), and transforms the events into the format expected by `@react-admin/ra-core-ee`.

```tsx
import {
    addRealTimeMethodsBasedOnSupabase,
    ListLiveUpdate,
} from '@react-admin/ra-core-ee';
import { supabaseDataProvider } from 'ra-supabase';
import { createClient } from '@supabase/supabase-js';
import { CoreAdmin, Resource, ListBase } from 'ra-core';

const supabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
);

const dataProvider = supabaseDataProvider({
    instanceUrl: process.env.SUPABASE_URL,
    apiKey: process.env.SUPABASE_ANON_KEY,
    supabaseClient,
});

const realTimeDataProvider = addRealTimeMethodsBasedOnSupabase({
    dataProvider,
    supabaseClient,
});

export const App = () => {
    return (
        <CoreAdmin dataProvider={realTimeDataProvider}>
            <Resource name="sales" list={SaleList} />
        </CoreAdmin>
    );
};

const SaleList = () => (
    <List>
        {/* List view */}
        <ListLiveUpdate />
    </List>
);
```

:::tip
Realtime features are not enabled in Supabase by default, you need to enable them. This can be done either from the [Replication](https://app.supabase.com/project/_/database/replication) section of your Supabase Dashboard, or by running the following SQL query with the [SQL Editor](https://app.supabase.com/project/_/sql):
:::

```sql
begin;

-- remove the supabase_realtime publication
drop
  publication if exists supabase_realtime;

-- re-create the supabase_realtime publication with no tables
create publication supabase_realtime;

commit;

-- add a table to the publication
alter
  publication supabase_realtime add table sales;
alter
  publication supabase_realtime add table contacts;
alter
  publication supabase_realtime add table contactNotes;
```

Have a look at the Supabase [Replication Setup](https://supabase.com/docs/guides/realtime/extensions/postgres-changes#replication-setup) documentation section for more info.

`addRealTimeMethodsBasedOnSupabase` accepts the following parameters:

| Prop             | Required | Type             | Default | Description                                            |
| ---------------- | -------- | ---------------- | ------- | ------------------------------------------------------ |
| `dataProvider`   | Required | `DataProvider`   | -       | The base dataProvider to augment with realtime methods |
| `supabaseClient` | Required | `SupabaseClient` | -       | The Supabase JS Client                                 |

:::tip Custom Tokens
You may choose to sign your own tokens to customize claims that can be checked in your RLS policies. In order to use these custom tokens with `addRealTimeMethodsBasedOnSupabase`, you must pass `apikey` in both Realtime's `headers` and `params` when creating the `supabaseClient`.

Please follow the instructions from the [Supabase documentation](https://supabase.com/docs/guides/realtime/extensions/postgres-changes#custom-tokens) for more information about how to do so.
:::

### API-Platform Adapter

The `@react-admin/ra-core-ee` package contains a function augmenting a regular (API-based) `dataProvider` with real-time methods based on the capabilities of [API-Platform](https://api-platform.com/). Use it as follows:

```tsx
import { ListBase } from 'ra-core';
import {
    HydraAdmin,
    ResourceGuesser,
    FieldGuesser,
    hydraDataProvider,
} from '@api-platform/admin';
import {
    ListLiveUpdate,
    addRealTimeMethodsBasedOnApiPlatform,
} from '@react-admin/ra-core-ee';

const dataProvider = hydraDataProvider({
    entrypoint: 'https://localhost',
});
const realTimeDataProvider = addRealTimeMethodsBasedOnApiPlatform(
    // The original dataProvider (should be a hydra data provider passed by API-Platform)
    dataProvider,
    // The API-Platform Mercure Hub URL
    'https://localhost/.well-known/mercure',
    // JWT token to authenticate against the API-Platform Mercure Hub
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdfX0.obDjwCgqtPuIvwBlTxUEmibbBf0zypKCNzNKP7Op2UM',
    // The topic URL used by API-Platform (without a slash at the end)
    'https://localhost',
);

const App = () => {
    return (
        <HydraAdmin
            entrypoint="https://localhost"
            dataProvider={realTimeDataProvider}
        >
            <ResourceGuesser name="greetings" list={GreetingsList} />
        </HydraAdmin>
    );
};

// Example for connecting a list of greetings
const GreetingsList = () => <ListBase>{/* List view */}</ListBase>;
```

The `addRealTimeMethodsBasedOnApiPlatform` function also accepts an optional 5th argument allowing to customize the `transformTopicFromRaRealtime` function (responsible for transforming the `topic` argument from the `Admin` into a valid Mercure topic for Api Platform).

```ts
import { hydraDataProvider } from '@api-platform/admin';
import { addRealTimeMethodsBasedOnApiPlatform } from '@react-admin/ra-core-ee';

const dataProvider = hydraDataProvider({
    entrypoint: 'https://localhost',
});

function myTransformTopicFromRaRealtime(topic: string): string {
    const [_basename, _resourcePrefix, resource, ...id] = topic.split('/');
    if (!id || id.length === 0) {
        return `/${resource}/{id}`;
    }
    const originId = id[2];
    return `/${resource}/${originId}`;
}

const realTimeDataProvider = addRealTimeMethodsBasedOnApiPlatform(
    dataProvider,
    'https://localhost/.well-known/mercure',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdfX0.obDjwCgqtPuIvwBlTxUEmibbBf0zypKCNzNKP7Op2UM',
    'https://localhost',
    // Pass the custom transformTopicFromRaRealtime function here
    myTransformTopicFromRaRealtime,
);
```

### Mercure Adapter

The `@react-admin/ra-core-ee` package contains a function augmenting a regular (API-based) `dataProvider` with real-time methods based on [a Mercure hub](https://mercure.rocks/). Use it as follows:

```tsx
import { addRealTimeMethodsBasedOnMercure } from '@react-admin/ra-core-ee';
import { CoreAdmin } from 'ra-core';

const realTimeDataProvider = addRealTimeMethodsBasedOnMercure(
    // original dataProvider
    dataProvider,
    // Mercure hub URL
    'http://path.to.my.api/.well-known/mercure',
    // JWT token to authenticate against the Mercure Hub
    'eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdLCJzdWJzY3JpYmUiOlsiKiJdfX0.SWKHNF9wneXTSjBg81YN5iH8Xb2iTf_JwhfUY5Iyhsw',
);

const App = () => (
    <CoreAdmin dataProvider={realTimeDataProvider}>{/* ... */}</CoreAdmin>
);
```

## Writing a Custom Adapter

If you're using another transport for real-time messages (WebSockets, long polling, GraphQL subscriptions, etc.), you'll have to implement `subscribe`, `unsubscribe`, and `publish` yourself in your `dataProvider`. As an example, here is an implementation using a local variable, that `@react-admin/ra-core-ee` uses in tests:

```ts
let subscriptions = [];

const dataProvider = {
    // regular dataProvider methods like getList, getOne, etc,
    // ...
    subscribe: async (topic, subscriptionCallback) => {
        subscriptions.push({ topic, subscriptionCallback });
        return Promise.resolve({ data: null });
    },

    unsubscribe: async (topic, subscriptionCallback) => {
        subscriptions = subscriptions.filter(
            (subscription) =>
                subscription.topic !== topic ||
                subscription.subscriptionCallback !== subscriptionCallback,
        );
        return Promise.resolve({ data: null });
    },

    publish: (topic, event) => {
        if (!topic) {
            return Promise.reject(new Error('missing topic'));
        }
        if (!event.type) {
            return Promise.reject(new Error('missing event type'));
        }
        subscriptions.map(
            (subscription) =>
                topic === subscription.topic &&
                subscription.subscriptionCallback(event),
        );
        return Promise.resolve({ data: null });
    },
};
```

You can check the behavior of the real-time components by using the default console logging provided in `addRealTimeMethodsInLocalBrowser`.

### Topic And Event Format

You've noticed that all the `dataProvider` real-time methods expect a `topic` as the first argument. A `topic` is just a string, identifying a particular real-time channel. Topics can be used e.g. to dispatch messages to different rooms in a chat application or to identify changes related to a particular record.

Most realtime components deal with CRUD logic, so `@react-admin/ra-core-ee` subscribes to special topics named `resource/[name]` and `resource/[name]/[id]`. For your own events, use any `topic` you want.

The `event` is the name of the message sent from publishers to subscribers. An `event` should be a JavaScript object with a `type` and a `payload` field.

Here is an example event:

```js
{
    type: 'created',
    payload: 'New message',
}
```

For CRUD operations, `@react-admin/ra-core-ee` expects events to use the types 'created', 'updated', and 'deleted'.

### CRUD Events

Realtime features have deep integration with `ra-core`, where most of the logic concerns Creation, Update or Deletion (CRUD) of records. To enable this integration, your real-time backend should publish the following events:

- when a new record is created:

```js
{
    topic: `resource/${resource}`,
    event: {
        type: 'created',
        payload: { ids: [id]},
    },
}
```

- when a record is updated:

```js
{
    topic: `resource/${resource}/id`,
    event: {
        type: 'updated',
        payload: { ids: [id]},
    },
}
{
    topic: `resource/${resource}`,
    event: {
        type: 'updated',
        payload: { ids: [id]},
    },
}
```

- when a record is deleted:

```js
{
    topic: `resource/${resource}/id`,
    event: {
        type: 'deleted',
        payload: { ids: [id]},
    },
}
{
    topic: `resource/${resource}`,
    event: {
        type: 'deleted',
        payload: { ids: [id]},
    },
}
```

### Lock Format

A `lock` stores the record that is locked, the identity of the locker, and the time at which the lock was acquired. It is used to prevent concurrent editing of the same record. A typical lock looks like this:

```js
{
    resource: 'posts',
    recordId: 123,
    identity: 'julien',
    createdAt: '2023-01-02T21:36:35.133Z',
}
```

The `dataProvider.getLock()` and `dataProvider.getLocks()` methods should return these locks.

As for the mutation methods (`dataProvider.lock()`, `dataProvider.unlock()`), they expect the following parameters:

- `resource`: the resource name (e.g. `'posts'`)
- `params`: an object containing the following
    - `id`: the record id (e.g. `123`)
    - `identity`: an identifier (string or number) corresponding to the identity of the locker (e.g. `'julien'`). This could be an authentication token for instance.
    - `meta`: an object that will be forwarded to the dataProvider (optional)

### Locks Based On A Lock Resource

The `@react-admin/ra-core-ee` package offers a function augmenting a regular (API-based) `dataProvider` with locks methods based on a `locks` resource.

It will translate a `dataProvider.getLocks()` call to a `dataProvider.getList('locks')` call, and a `dataProvider.lock()` call to a `dataProvider.create('locks')` call.

The `lock` resource should contain the following fields:

```json
{
    "id": 123,
    "identity": "Toad",
    "resource": "people",
    "recordId": 18,
    "createdAt": "2020-09-29 10:20"
}
```

Please note that the `identity` and the `createdAt` formats depend on your API.

Here is how to use it in your `ra-core` application:

```tsx
import { CoreAdmin } from 'ra-core';
import { addLocksMethodsBasedOnALockResource } from '@react-admin/ra-core-ee';

const dataProviderWithLocks = addLocksMethodsBasedOnALockResource(
    dataProvider, // original dataProvider
);

const App = () => (
    <CoreAdmin dataProvider={dataProviderWithLocks}>{/* ... */}</CoreAdmin>
);
```

## Calling the `dataProvider` Methods Directly

Once you've set a real-time `dataProvider`, you can call the real-time methods in your React components via the `useDataProvider` hook.

For instance, here is a component displaying messages posted to the 'messages' topic in real time:

```tsx
import React, { useState } from 'react';
import { useDataProvider, useNotify } from 'ra-core';

const MessageList = () => {
    const notify = useNotify();
    const [messages, setMessages] = useState([]);
    const dataProvider = useDataProvider();

    useEffect(() => {
        const callback = (event) => {
            // event is like
            // {
            //     topic: 'messages',
            //     type: 'created',
            //     payload: 'New message',
            // }
            setMessages((messages) => [...messages, event.payload]);
            notify('New message');
        };
        // subscribe to the 'messages' topic on mount
        dataProvider.subscribe('messages', callback);
        // unsubscribe on unmount
        return () => dataProvider.unsubscribe('messages', callback);
    }, [setMessages, notify, dataProvider]);

    return (
        <ul>
            {messages.map((message, index) => (
                <li key={index}>{message}</li>
            ))}
        </ul>
    );
};
```

And here is a button for publishing an event to the `messages` topic. All the subscribers to this topic will execute their callback:

```tsx
import React from 'react';
import { useDataProvider, useNotify } from 'ra-core';

const SendMessageButton = () => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const handleClick = () => {
        dataProvider
            .publish('messages', { type: 'created', payload: 'New message' })
            .then(() => notify('Message sent'));
    };

    return <button onClick={handleClick}>Send new message</button>;
};
```

**Tip**: You should not need to call `publish()` directly very often. Most real-time backends publish events in reaction to a change in the data. So the previous example is fictive. In reality, a typical `<SendMessageButton>` would simply call `dataProvider.create('messages')`, and the API would create the new message AND publish the 'created' event to the real-time bus.
