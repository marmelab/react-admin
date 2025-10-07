---
title: "useUnlock"
---

`useUnlock` is a low-level hook that returns a callback to call `dataProvider.unlock()`, leveraging react-query's `useMutation`.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

```tsx
const [unlock, { isLoading, error }] = useUnlock(
    resource,
    { id, identity, meta },
    options
);
```

The payload is an object with the following properties:

-   `id`: the record id (e.g. `123`)
-   `identity`: an identifier (string or number) corresponding to the identity of the locker (e.g. `'julien'`). This usually comes from `authProvider.getIdentity()`
-   `meta`: an object that will be forwarded to the dataProvider (optional)

The optional `options` argument is passed to react-query's `useMutation` hook.