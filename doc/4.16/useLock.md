---
layout: default
title: "useLock"
---

# `useLock`

`useLock` is a low-level [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> hook that returns a callback to call `dataProvider.lock()`, leveraging react-query's `useMutation`.

## Usage

```jsx
import { useLock } from '@react-admin/ra-realtime';

const [lock, { isLoading, error }] = useLock(
    resource,
    { id, identity, meta },
    options
);
```

## Parameters

The first parameter is a resource string (e.g. `'posts'`).

The second is a payload - an object with the following properties:

-   `id`: the record id (e.g. `123`)
-   `identity`: an identifier (string or number) corresponding to the identity of the locker (e.g. `'julien'`). This usually comes from `authProvider.getIdentity()`.
-   `meta`: an object that will be forwarded to the dataProvider (optional)

The optional `options` argument is passed to react-query's `useMutation` hook.

## Utility Hooks

For most use cases, you won't need to call the `useLock` hook directly. Instead, you should use the [`useLockOnMount`](./useLockOnMount.md) or [`useLockOnCall`](./useLockOnCall.md) orchestration hooks, which are responsible for calling `useLock` and `useUnlock`.
