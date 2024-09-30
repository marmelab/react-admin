---
layout: default
title: "useRequireAccess"
---

# `useRequireAccess`

This hook calls the `authProvider.canAccess()` method on mount for a provided resource and action (and optionally a record). If users don't have access, it will redirect them to the [`/unauthorized`](./Admin.md#unauthorized) page. If `authProvider.canAccess()` throws an error, it will redirect them to the [`/authentication-error`](./Admin.md#authenticationerror) page.

## Usage

`useRequireAccess` takes an object `{ action, resource, record }` as argument. It returns an object describing the state of the request. As calls to the `authProvider` are asynchronous, the hook returns a `isPending` state in addition to the `canAccess` key.

```jsx
import { useRequireAccess, useRecordContext, DeleteButton } from 'react-admin';

const DeleteUserButton = () => {
    const record = useRecordContext();
    const { isPending } = useRequireAccess({ action: 'delete', resource: 'users', record });
    if (isPending) return null;
    return <DeleteButton record={record} resource="users" />;
};
```

```jsx
const permissions = [
    { action: ["read", "create", "edit", "export"], resource: "companies" },
    { action: ["read", "create", "edit", "delete"], resource: "users" },
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

