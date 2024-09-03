---
layout: default
title: "useCanAccessCallback"
---

# `useCanAccessCallback`

This hook calls the authProvider.canAccess() method using react-query for a provided resource and action (and optionally a record).

## Usage

`useCanAccessCallback` returns a function that takes an object `{ action, resource, record }` as argument. This function returns an object with the following properties:

- `canAccess`: a boolean determining whether the user has access to the resource.
- `error`: the error that might have occurred.

```jsx
import { useCanAccessCallback, useRecordContext, useDataProvider, Button } from 'react-admin';

const ResetViewsButton = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const checkAccess = useCanAccessCallback();
    const resetViews = () => {
        const { canAccess, error } = checkAccess({ action: 'resetViews', resource: 'users', record });

        if (canAccess) {
            dataProvider.resetViews('users', { id: record.id });
        }
    }
    return <Button onClick={resetViews} label="Reset Views" />;
};
```

```jsx
const permissions = [
    { action: ["read", "create", "edit", "resetViews"], resource: "posts" },
    { action: ["read", "create", "edit", "delete"], resource: "users" },
];
const authProvider= {
    // ...
    canAccess: ({ resource, action, record }) => {
        const permission = permissions.find(p => {
            if (p.resource !== resource) return false;
            if (p.action.includes(action)) return false;
            return true;
        })
    },
};
```

## Parameters

`useCanAccessCallback` callback expects a single parameter object with the following properties:

| Name | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `resource` | Required | `string` | - | The resource to check, e.g. 'users', 'comments', 'posts', etc. |
| `action` | Required | `string` | - | The action to check, e.g. 'read', 'list', 'export', 'delete', etc. |
| `record` | Optional | `object` | - | The record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }` |

