---
layout: default
title: "useSubscribe"
---

# `useSubscribe`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> hook subscribes to the events from a topic on mount (and unsubscribe on unmount).

<video controls autoplay playsinline muted loop>
  <source src="./img/useSubscribe.webm" type="video/webm"/>
  <source src="./img/useSubscribe.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

The following component subscribes to the `messages/{channelName}` topic and displays a badge with the number of unread messages:

```jsx
import { useState, useCallback } from 'react';
import { Badge, Typography } from '@mui/material';
import { useSubscribe } from '@react-admin/ra-realtime';

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
        <Badge badgeContent={nbMessages} color="primary">
            <Typography># {name}</Typography>
        </Badge>
    ) : (
        <Typography># {name}</Typography>
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

```jsx
useSubscribe(`messages/${name}`, event => {
    if (event.type === 'created') {
        setNbMessages(count => count + 1);
    }
});
```

**Tip**: Memoize the callback using `useCallback` to avoid unnecessary subscriptions/unsubscriptions.

```jsx
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

```jsx
import { useState, useCallback } from 'react';
import { LinearProgress } from '@mui/material';
import { useSubscribe } from '@react-admin/ra-realtime';

const JobProgress = ({ jobId }) => {
    const [progress, setProgress] = useState(0);
    const [color, setColor] = useState('primary');
    const callback = useCallback(
        (event, unsubscribe) => {
            if (event.type === 'progress') {
                setProgress(event.payload.progress);
            }
            if (event.type === 'completed') {
                setColor('success');
                unsubscribe();
            }
        },
        [setColor]
    );
    useSubscribe(`jobs/${jobId}`, callback);
    return (
        <LinearProgress variant="determinate" value={progress} color={color} />
    );
};
```

<video controls autoplay playsinline muted loop>
  <source src="./img/useSubscribeUnsubscribe.webm" type="video/webm"/>
  <source src="./img/useSubscribeUnsubscribe.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## `options`

The `options` object can contain the following properties:

-   `enabled`: Whether to subscribe or not. Defaults to `true`
-   `once`: Whether to unsubscribe after the first event. Defaults to `false`.
-   `unsubscribeOnUnmount`: Whether to unsubscribe on unmount. Defaults to `true`.

You can use the `once` option to subscribe to a topic only once, and then unsubscribe.

For instance, the following component subscribes to the `office/restart` topic and changes the message when the office is open, then unsubscribes from the topic:

```jsx
import { useState } from 'react';
import { useSubscribe } from '@react-admin/ra-realtime';

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
  <source src="./img/useSubscribeOnce.webm" type="video/webm"/>
  <source src="./img/useSubscribeOnce.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## `topic`

The first argument of `useSubscribe` is the topic to subscribe to. It can be an arbitrary string.

```jsx
useSubscribe('messages', event => {
    // ...
});
```

If you want to subscribe to CRUD events, instead of writing the topic manually like `resource/[resource]`, you can use the `useSubscribeToRecord` or `useSubscribeToRecordList` hooks.