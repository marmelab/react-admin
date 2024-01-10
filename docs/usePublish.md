---
layout: default
title: "usePublish"
---

# `usePublish`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> hook returns a callback to publish an event on a topic. The callback returns a promise that resolves when the event is published.

`usePublish` calls `dataProvider.publish()` to publish the event. It leverages react-query's `useMutation` hook to provide a callback.

**Note**: Events should generally be published by the server, in reaction to an action by an end user. They should seldom be published directly by the client. This hook is provided mostly for testing purposes, but you may use it in your own custom components if you know what you're doing.

## Usage

`usePublish` returns a callback with the following signature:

```jsx
const publish = usePublish();
publish(topic, event, options);
```

For instance, in a chat application, when a user is typing a message, the following component publishes a `typing` event to the `chat/[channel]` topic:

```jsx
import { useInput, useGetIdentity } from 'react-admin';
import { usePublish } from '@react-admin/ra-realtime';

const MessageInput = ({ channel }) => {
    const [publish, { isLoading }] = usePublish();
    const { id, field, fieldState } = useInput({ source: 'message' });
    const { identity } = useGetIdentity();

    const handleUserInput = event => {
        publish(`chat/${channel}`, {
            type: 'typing',
            payload: { user: identity },
        });
    };

    return (
        <label htmlFor={id}>
            Type your message
            <input id={id} {...field} onInput={handleUserInput} />
        </label>
    );
};
```

The event format is up to you. It should at least contain a `type` property and may contain a `payload` property. The `payload` property can contain any data you want to send to the subscribers.

Some hooks and components in this package are specialized to handle "CRUD" events, which are events with a `type` property set to `created`, `updated` or `deleted`. For instance:

```js
{
    topic: `resource/${resource}/id`,
    event: {
        type: 'deleted',
        payload: { ids: [id]},
    },
}
```

See the [CRUD events](./RealtimeDataProvider.md#crud-events) section for more details.

## Return Value

`usePublish` returns an array with the following values:

-   `publish`: The callback to publish an event to a topic.
-   `state`: The state of the mutation ([see react-query documentation](https://tanstack.com/query/v3/docs/react/reference/useMutation)). Notable properties:
    -   `isLoading`: Whether the mutation is loading.
    -   `error`: The error if the mutation failed.
    -   `data`: The published event if the mutation succeeded.

```jsx
const [publish, { isLoading, error, data }] = usePublish();
```

## Callback Parameters

The `publish` callback accepts the following parameters:

-   `topic`: The topic to publish the event on.
-   `event`: The event to publish. It must contain a `type` property.
-   `options`: `useMutation` options ([see react-query documentation](https://tanstack.com/query/v3/docs/react/reference/useMutation)). Notable properties:
    -   `onSuccess`: A callback to call when the event is published. It receives the published event as its first argument.
    -   `onError`: A callback to call when the event could not be published. It receives the error as its first argument.
    -   `retry`: Whether to retry on failure. Defaults to `0`.

```jsx
const [publish] = usePublish();
publish(
    'chat/general',
    {
        type: 'message',
        payload: { user: 'John', message: 'Hello!' },
    },
    {
        onSuccess: event => console.log('Event published', event),
        onError: error => console.log('Could not publish event', error),
        retry: 3,
    }
);
```
