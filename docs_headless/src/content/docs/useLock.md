---
title: "useLock"
---

**Tip**: `ra-core-ee` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

`useLock` is a low-level hook that returns a callback to call `dataProvider.lock()`, leveraging react-query's `useMutation`.

```tsx
const [lock, { isLoading, error }] = useLock(
    resource,
    { id, identity, meta },
    options
);
```

The payload is an object with the following properties:

-   `id`: the record id (e.g. `123`)
-   `identity`: an identifier (string or number) corresponding to the identity of the locker (e.g. `'julien'`). This usually comes from `authProvider.getIdentity()`.
-   `meta`: an object that will be forwarded to the dataProvider (optional)

The optional `options` argument is passed to react-query's `useMutation` hook.

For most use cases, you won't need to call the `useLock` hook directly. Instead, you should use the `useLockOnMount` or `useLockOnCall` orchestration hooks, which are responsible for calling `useLock` and `useUnlock`.