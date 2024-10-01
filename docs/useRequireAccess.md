---
layout: default
title: "useRequireAccess"
---

# `useRequireAccess`

This hook calls the `authProvider.canAccess()` method on mount for a provided resource and action (and optionally a record). If users don't have access, it will redirect them to the [`/access-denied`](./Admin.md#accessdenied) page. If `authProvider.canAccess()` throws an error, it will redirect them to the [`/authentication-error`](./Admin.md#authenticationerror) page.

## Usage

`useRequireAccess` takes an object `{ action, resource, record }` as argument. It returns an object describing the state of the request. As calls to the `authProvider` are asynchronous, the hook returns a `isPending` state.

For instance, here's how you can protect a [custom route](./CustomRoutes.md) for editing users settings:

```jsx
import { useRequireAccess, useRecordContext, DeleteButton } from 'react-admin';

export export const SettingsPage = () => {
    const record = useRecordContext();
    const { isPending } = useRequireAccess({ action: 'edit', resource: 'settings', record });
    if (isPending) return null;
    return <p>Protected content</p>;
};
```

```jsx
const permissions = [
    { action: ["edit"], resource: "settings" },
];
const authProvider= {
    // ...
    canAccess: ({ resource, action, record }) => {
        return permissions.some(p => {
            if (p.resource !== resource) return false;
            if (!p.action.includes(action)) return false;
            return true;
        })
    },
};
```

## Parameters

`useRequireAccess` expects a single parameter object with the following properties:

| Name | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `resource` | Required | `string` | - | The resource to check, e.g. 'users', 'comments', 'posts', etc. |
| `action` | Required | `string` | - | The action to check, e.g. 'read', 'list', 'export', 'delete', etc. |
| `record` | Optional | `object` | - | The record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }` |

