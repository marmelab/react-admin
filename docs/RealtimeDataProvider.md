---
layout: default
title: "Realtime DataProvider Requirements"
---

# Realtime DataProvider Requirements

`ra-realtime` provides helper functions to add real-time capabilities to an existing data provider if you use the following real-time backends:

-  [Supabase](#supabase)
-  [API Platform](#api-platform)
-  [Mercure](#mercure)

For other backends, you'll need to write your own implementation. Check the [Writing a custom adapter](#writing-a-custom-adapter) section below for more information.

## Realtime Methods & Signature

To enable real-time features, the `dataProvider` must implement three new methods:

-   `subscribe(topic, callback)`
-   `unsubscribe(topic, callback)`
-   `publish(topic, event)` (optional - publication is often done server-side)

These methods should return an empty Promise resolved when the action was acknowledged by the real-time bus.

In addition, to support the lock features, the `dataProvider` must implement 4 more methods:

-   `lock(resource, { id, identity, meta })`
-   `unlock(resource, { id, identity, meta })`
-   `getLock(resource, { id, meta })`
-   `getLocks(resource, { meta })`

## Supabase

The `ra-realtime` package contains a function augmenting a regular (API-based) `dataProvider` with real-time methods based on the capabilities of [Supabase](https://supabase.com/docs/guides/realtime). 

This adapter subscribes to [Postgres Changes](https://supabase.com/docs/guides/realtime/extensions/postgres-changes), and transforms the events into the format expected by `ra-realtime`.

```jsx
import { createClient } from '@supabase/supabase-js';
import { supabaseDataProvider } from 'ra-supabase';
import { addRealTimeMethodsBasedOnSupabase, ListLive } from '@react-admin/ra-realtime';
import { Admin, Resource, Datagrid, TextField, EmailField } from 'react-admin';

const supabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

const dataProvider = supabaseDataProvider({
    instanceUrl: process.env.SUPABASE_URL,
    apiKey: process.env.SUPABASE_ANON_KEY,
    supabaseClient
});

const realTimeDataProvider = addRealTimeMethodsBasedOnSupabase({
    dataProvider,
    supabaseClient,
});

export const App = () => (
    <Admin dataProvider={realTimeDataProvider}>
        <Resource name="sales" list={SaleList} />
    </Admin>
);

const SaleList = () => (
    <ListLive>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="first_name" />
            <TextField source="last_name" />
            <EmailField source="email" />
        </Datagrid>
    </ListLive>
);
```

**Tip:** Realtime features are not enabled in Supabase by default, you need to enable them. This can be done either from the [Replication](https://app.supabase.com/project/_/database/replication) section of your Supabase Dashboard, or by running the following SQL query with the [SQL Editor](https://app.supabase.com/project/_/sql):

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

| Prop              | Required | Type             | Default | Description                                              |
| ----------------- | -------- | ---------------- | ------- | -------------------------------------------------------- |
| `dataProvider`    | Required | `DataProvider`   | -       | The base dataProvider to augment with realtime methods   |
| `supabaseClient`  | Required | `SupabaseClient` | -       | The Supabase JS Client                                   |

**Tip**: You may choose to sign your own tokens to customize claims that can be checked in your RLS policies. In order to use these custom tokens with `addRealTimeMethodsBasedOnSupabase`, you must pass an `apikey` field in both Realtime's `headers` and `params` when creating the `supabaseClient`. Please follow the instructions from the [Supabase documentation](https://supabase.com/docs/guides/realtime/extensions/postgres-changes#custom-tokens) for more information about how to do so.

## API-Platform

The `ra-realtime` package contains a function augmenting a regular (API-based) `dataProvider` with real-time methods based on the capabilities of [API-Platform](https://api-platform.com/). Use it as follows:

```jsx
import { Datagrid, EditButton, ListProps } from 'react-admin';
import {
    HydraAdmin,
    ResourceGuesser,
    FieldGuesser,
    hydraDataProvider,
} from '@api-platform/admin';
import {
    ListLive,
    addRealTimeMethodsBasedOnApiPlatform,
} from '@react-admin/ra-realtime';

const dataProvider = hydraDataProvider('https://localhost:8443');
const dataProviderWithRealtime = addRealTimeMethodsBasedOnApiPlatform(
    // The original dataProvider (should be a hydra data provider passed by API-Platform)
    dataProvider,
    // The API-Platform Mercure Hub URL
    'https://localhost:1337/.well-known/mercure',
    // JWT token to authenticate against the API-Platform Mercure Hub
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdfX0.obDjwCgqtPuIvwBlTxUEmibbBf0zypKCNzNKP7Op2UM',
    // The topic URL used by API-Platform (without a slash at the end)
    'https://localhost:8443'
);

const App = () => (
    <HydraAdmin
        entrypoint="https://localhost:8443"
        dataProvider={dataProviderWithRealtime}
    >
        <ResourceGuesser name="greetings" list={GreetingsList} />
    </HydraAdmin>
);


// Example for connecting a list of greetings
const GreetingsList = () => (
    <ListLive>
        <Datagrid>
            <FieldGuesser source="name" />
            <EditButton />
        </Datagrid>
    </ListLive>
);
```

## Mercure

The `ra-realtime` package contains a function augmenting a regular (API-based) `dataProvider` with real-time methods based on [a Mercure hub](https://mercure.rocks/). Use it as follows:

```jsx
import { addRealTimeMethodsBasedOnMercure } from '@react-admin/ra-realtime';

const dataProviderWithRealtime = addRealTimeMethodsBasedOnMercure(
    // original dataProvider
    dataProvider,
    // Mercure hub URL
    'http://path.to.my.api/.well-known/mercure',
    // JWT token to authenticate against the Mercure Hub
    'eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdLCJzdWJzY3JpYmUiOlsiKiJdfX0.SWKHNF9wneXTSjBg81YN5iH8Xb2iTf_JwhfUY5Iyhsw'
);

const App = () => (
    <Admin dataProvider={dataProviderWithRealtime}>{/* ... */}</Admin>
);
```

## Writing a Custom Adapter

If you're using another transport for real-time messages (WebSockets, long polling, GraphQL subscriptions, etc.), you'll have to implement `subscribe`, `unsubscribe`, and `publish` yourself in your `dataProvider`. As an example, here is an implementation using a local variable, that `ra-realtime` uses in tests:

```jsx
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
            subscription =>
                subscription.topic !== topic ||
                subscription.subscriptionCallback !== subscriptionCallback
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
            subscription =>
                topic === subscription.topic &&
                subscription.subscriptionCallback(event)
        );
        return Promise.resolve({ data: null });
    },
};
```

You can check the behavior of the real-time components by using the default console logging provided in `addRealTimeMethodsInLocalBrowser`.

## Topic And Event Format

You've noticed that all the `dataProvider` real-time methods expect a `topic` as the first argument. A `topic` is just a string, identifying a particular real-time channel. Topics can be used e.g. to dispatch messages to different rooms in a chat application or to identify changes related to a particular record.

Most `ra-realtime` components deal with CRUD logic, so `ra-realtime` subscribes to special topics named `resource/[name]` and `resource/[name]/[id]`. For your own events, use any `topic` you want.

The `event` is the name of the message sent from publishers to subscribers. An `event` should be a JavaScript object with a `type` and a `payload` field.

Here is an example event:

```js
{
    type: 'created',
    payload: 'New message',
}
```

For CRUD operations, `ra-realtime` expects events to use the types 'created', 'updated', and 'deleted'.

## CRUD Events

Ra-realtime has deep integration with react-admin, where most of the logic concerns Creation, Update or Deletion (CRUD) of records. To enable this integration, your real-time backend should publish the following events:

-   when a new record is created:

```js
{
    topic: `resource/${resource}`,
    event: {
        type: 'created',
        payload: { ids: [id]},
    },
}
```

-   when a record is updated:

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

-   when a record is deleted:

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

## Lock Format

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

-   `resource`: the resource name (e.g. `'posts'`)
-   `params`: an object containing the following
    -   `id`: the record id (e.g. `123`)
    -   `identity`: an identifier (string or number) corresponding to the identity of the locker (e.g. `'julien'`). This could be an authentication token for instance.
    -   `meta`: an object that will be forwarded to the dataProvider (optional)

## Locks Based On A Lock Resource

The `ra-realtime` package offers a function augmenting a regular (API-based) `dataProvider` with locks methods based on a `locks` resource.

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

Here is how to use it in your react-admin application:

```jsx
import { Admin } from 'react-admin';
import { addLocksMethodsBasedOnALockResource } from '@react-admin/ra-realtime';

const dataProviderWithLocks = addLocksMethodsBasedOnALockResource(
    dataProvider // original dataProvider
);

const App = () => (
    <Admin dataProvider={dataProviderWithLocks}>{/* ... */}</Admin>
);
```

## Calling the `dataProvider` Methods Directly

Once you've set a real-time `dataProvider` in your `<Admin>`, you can call the real-time methods in your React components via the `useDataProvider` hook.

For instance, here is a component displaying messages posted to the 'messages' topic in real time:

```jsx
import React, { useState } from 'react';
import { useDataProvider, useNotify } from 'react-admin';

const MessageList = () => {
    const notify = useNotify();
    const [messages, setMessages] = useState([]);
    const dataProvider = useDataProvider();

    useEffect(() => {
        const callback = event => {
            // event is like
            // {
            //     topic: 'messages',
            //     type: 'created',
            //     payload: 'New message',
            // }
            setMessages(messages => [...messages, event.payload]);
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

```jsx
import React from 'react';
import { useDataProvider, useNotify } from 'react-admin';

const SendMessageButton = () => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const handleClick = () => {
        dataProvider
            .publish('messages', { type: 'created', payload: 'New message' })
            .then(() => notify('Message sent'));
    };

    return <Button onClick={handleClick}>Send new message</Button>;
};
```

**Tip**: You should not need to call `publish()` directly very often. Most real-time backends publish events in reaction to a change in the data. So the previous example is fictive. In reality, a typical `<SendMessageButton>` would simply call `dataProvider.create('messages')`, and the API would create the new message AND publish the 'created' event to the real-time bus.
