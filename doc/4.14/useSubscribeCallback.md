---
layout: default
title: "useSubscribeCallback"
---

# `useSubscribeCallback`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> hook gets a callback to subscribe to events on a topic and optionally unsubscribe on unmount.

This is useful to start a subscription from an event handler, like a button click.

<video controls autoplay playsinline muted loop>
  <source src="./img/useSubscribeCallback.webm" type="video/webm"/>
  <source src="./img/useSubscribeCallback.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

The following component subscribes to the `backgroundJobs/recompute` topic on click, and displays the progress of the background job:

{% raw %}
```jsx
import { useState, useCallback } from 'react';
import { useDataProvider } from 'react-admin';
import { Button, Card, Alert, AlertTitle, LinearProgress } from '@mui/material';
import { useSubscribeCallback } from '@react-admin/ra-realtime';

const LaunchBackgroundJob = () => {
    const dataProvider = useDataProvider();
    const [progress, setProgress] = useState(0);
    const callback = useCallback(
        (event, unsubscribe) => {
            setProgress(event.payload?.progress || 0);
            if (event.payload?.progress === 100) {
                unsubscribe();
            }
        },
        [setProgress]
    );
    const subscribe = useSubscribeCallback(
        'backgroundJobs/recompute',
        callback
    );

    return (
        <div>
            <Button
                onClick={() => {
                    subscribe();
                    dataProvider.recompute();
                }}
            >
                Launch recompute
            </Button>
            {progress > 0 && (
                <Card sx={{ m: 2, maxWidth: 400 }}>
                    <Alert severity={progress === 100 ? 'success' : 'info'}>
                        <AlertTitle>
                            Recompute{' '}
                            {progress === 100 ? 'complete' : 'in progress'}
                        </AlertTitle>
                        <LinearProgressWithLabel value={progress} />
                    </Alert>
                </Card>
            )}
        </div>
    );
};
```
{% endraw %}

## Parameters

| Prop       | Required | Type       | Default | Description                                                        |
| ---------- | -------- | ---------- | ------- | ------------------------------------------------------------------ |
| `topic`    | Optional | `string`   | -       | The topic to subscribe to. When empty, no subscription is created. |
| `callback` | Optional | `function` | -       | The callback to execute when an event is received.                 |
| `options`  | Optional | `object`   | -       | Options to modify the subscription / unsubscription behavior.      |

## `callback`

Whenever an event is published on the `topic` passed as the first argument, the function passed as the second argument will be called with the event as a parameter.

```jsx
const subscribe = useSubscribeCallback('backgroundJobs/recompute', event => {
    if (event.type === 'progress') {
        setProgress(event.payload.progress);
    }
});

// later
subscribe();
```

**Tip**: Memoize the callback using `useCallback` to avoid unnecessary subscriptions/unsubscriptions.

```jsx
const callback = useCallback(
    event => {
        if (event.type === 'progress') {
            setProgress(event.payload.progress);
        }
    },
    [setProgress]
);
```

The callback function receives an `unsubscribe` callback as its second argument. You can call it to unsubscribe from the topic after receiving a specific event.

```jsx
const subscribe = useSubscribeCallback(
    'backgroundJobs/recompute',
    (event, unsubscribe) => {
        if (event.type === 'completed') {
            setProgress(100);
            unsubscribe();
        }
    }
);
```

## `options`

The `options` object can contain the following properties:

-   `enabled`: Whether to subscribe or not. Defaults to `true`
-   `once`: Whether to unsubscribe after the first event. Defaults to `false`.
-   `unsubscribeOnUnmount`: Whether to unsubscribe on unmount. Defaults to `true`.

You can use the `once` option to subscribe to a topic only once, and then unsubscribe.

For instance, the following component subscribes to the `backgroundJobs/recompute` topic on click, displays a notification when the background job is complete, then unsubscribes:

```jsx
import { useDataProvider, useNotify } from 'react-admin';
import { useSubscribeCallback } from '@react-admin/ra-realtime';

const LaunchBackgroundJob = () => {
    const dataProvider = useDataProvider();
    const notify = useNotify();

    const subscribe = useSubscribeCallback(
        'backgroundJobs/recompute',
        event =>
            notify('Recompute complete: %{summary}', {
                type: 'success',
                messageArgs: {
                    summary: event.payload?.summary,
                },
            }),
        {
            unsubscribeOnUnmount: false, // show the notification even if the user navigates away
            once: true, // unsubscribe after the first event
        }
    );

    return (
        <button
            onClick={() => {
                subscribe();
                dataProvider.recompute();
            }}
        >
            Launch background job
        </button>
    );
};
```

<video controls autoplay playsinline muted loop>
  <source src="./img/useSubscribeOnceCallback.webm" type="video/webm"/>
  <source src="./img/useSubscribeOnceCallback.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


You can use the `unsubscribeOnUnmount` option to keep the subscription alive after the component unmounts.

This can be useful when you want the subscription to persist across multiple pages.

```jsx
const subscribe = useSubscribeCallback(
    'backgroundJobs/recompute',
    event => setProgress(event.payload?.progress || 0),
    {
        unsubscribeOnUnmount: false, // don't unsubscribe on unmount
    }
);
```

## `topic`

The first argument of `useSubscribeCallback` is the topic to subscribe to. It can be an arbitrary string.

```jsx
const subscribe = useSubscribeCallback('backgroundJobs/recompute', event => {
    // ...
});

// later
subscribe();
```
