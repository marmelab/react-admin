---
title: "useSubscribe"
---

Subscribe to the events from a topic on mount (and unsubscribe on unmount).

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com//assets/useSubscribe.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

The following component subscribes to the `messages/{channelName}` topic and displays a badge with the number of unread messages:

```tsx
import { useState, useCallback } from 'react';
import { useSubscribe } from '@react-admin/ra-core-ee';

const ChannelName = ({ name }) => {
    const [nbMessages, setNbMessages] = useState(0);

    const callback = useCallback(
        event => {
            if (event.type === 'created') {
                setNbMessages(count => count + 1);
            }
        },
        [setNbMessages]
    );

    useSubscribe(`messages/${name}`, callback);

    return nbMessages > 0 ? (
        <p>#{name} ({nbMessages} new messages)</p>
    ) : (
        <p>#{name}</p>
    );
};
```

## Parameters

| Prop       | Required | Type       | Default | Description                                                        |
| ---------- | -------- | ---------- | ------- | ------------------------------------------------------------------ |
| `topic`    | Optional | `string`   | -       | The topic to subscribe to. When empty, no subscription is created. |
| `callback` | Optional | `function` | -       | The callback to execute when an event is received.                 |
| `options`  | Optional | `object`   | -       | Options to modify the subscription / unsubscription behavior.      |

## `callback`

This function will be called with the event as its first argument, so you can use it to update the UI.

```tsx
useSubscribe(`messages/${name}`, event => {
    if (event.type === 'created') {
        setNbMessages(count => count + 1);
    }
});
```

**Tip**: Memoize the callback using `useCallback` to avoid unnecessary subscriptions/unsubscriptions.

```tsx
const callback = useCallback(
    event => {
        if (event.type === 'created') {
            setNbMessages(count => count + 1);
        }
    },
    [setNbMessages]
);
useSubscribe(`messages/${name}`, callback);
```

The callback function receives an `unsubscribe` callback as its second argument. You can call it to unsubscribe from the topic after receiving a specific event.

```tsx
import { useState, useCallback } from 'react';
import { useSubscribe } from '@react-admin/ra-core-ee';

const JobProgress = ({ jobId }) => {
    const [progress, setProgress] = useState(0);
    const callback = useCallback(
        (event, unsubscribe) => {
            if (event.type === 'progress') {
                setProgress(event.payload.progress);
            }
            if (event.type === 'completed') {
                unsubscribe();
            }
        },
        [setColor]
    );
    useSubscribe(`jobs/${jobId}`, callback);
    return (
        <div>{progress}%</div>
    );
};
```

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com//assets/useSubscribeUnsubscribe.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## `options`

The `options` object can contain the following properties:

-   `enabled`: Whether to subscribe or not. Defaults to `true`
-   `once`: Whether to unsubscribe after the first event. Defaults to `false`.
-   `unsubscribeOnUnmount`: Whether to unsubscribe on unmount. Defaults to `true`.

You can use the `once` option to subscribe to a topic only once, and then unsubscribe.

For instance, the following component subscribes to the `office/restart` topic and changes the message when the office is open, then unsubscribes from the topic:

```tsx
import { useState } from 'react';
import { useSubscribe } from '@react-admin/ra-core-ee';

const OfficeClosed = () => {
    const [state, setState] = useState('closed');

    useSubscribe('office/restart', () => setState('open'), { once: true });

    return (
        <div>
            {state === 'closed'
                ? 'Sorry, the office is closed for maintenance.'
                : 'Welcome! The office is open.'}
        </div>
    );
};
```

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com//assets/useSubscribeOnce.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## `topic`

The first argument of `useSubscribe` is the topic to subscribe to. It can be an arbitrary string.

```tsx
useSubscribe('messages', event => {
    // ...
});
```

If you want to subscribe to CRUD events, instead of writing the topic manually like `resource/[resource]`, you can use the `useSubscribeToRecord` or `useSubscribeToRecordList` hooks.