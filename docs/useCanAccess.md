---
layout: default
title: "useCanAccess"
---

# `useCanAccess`

This hook calls the `authProvider.canAccess()` method on mount for a provided resource and action (and optionally a record). It returns an object containing a `canAccess` boolean set to `true` if users have access to the resource and action. 

## Usage

`useCanAccess` takes an object `{ action, resource, record }` as argument. It returns an object describing the state of the request. As calls to the `authProvider` are asynchronous, the hook returns a `isPending` state in addition to the `canAccess` key.

```jsx
import { useCanAccess, useRecordContext, DeleteButton } from 'react-admin';

const DeleteUserButton = () => {
    const record = useRecordContext();
    const { isPending, canAccess, error } = useCanAccess({ action: 'delete', resource: 'users', record });
    if (isPending || !canAccess) return null;
    if (error) return <div>{error.message}</div>
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

const { canAccess: canUseCompanyResource } = useCanAccess({
    resource: 'companies',
}); // canUseCompanyResource is true
const { canAccess: canUseCompanyResourceFromWildcard } = useCanAccess({
    resource: 'companies',
    action: '*',
}); // canUseCompanyResourceFromWildcard is true
const { canAccess: canReadCompanies } = useCanAccess({ action: "read", resource: "companies" }); // canReadCompanies is true
const { canAccess: canCreatePeople } = useCanAccess({ action: "create", resource: "people" }); // canCreatePeople is true
const { canAccess: canExportPeople } = useCanAccess({ action: "export", resource: "people" }); // canExportPeople is false
const { canAccess: canEditDeals } = useCanAccess({ action: "edit", resource: "deals" }); // canEditDeals is true
const { canAccess: canDeleteComments } = useCanAccess({ action: "delete", resource: "tasks" }); // canDeleteComments is true
const { canAccess: canReadSales } = useCanAccess({ action: "read", resource: "sales" }); // canReadSales is false
const { canAccess: canReadSelfSales } = useCanAccess({ action: "read", resource: "sales" }, { id: "123" }); // canReadSelfSales is true
```

## Parameters

`useCanAccess` expects a single parameter object with the following properties:

| Name | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `resource` | Required | `string` | - | The resource to check, e.g. 'users', 'comments', 'posts', etc. |
| `action` | Required | `string` | - | The action to check, e.g. 'read', 'list', 'export', 'delete', etc. |
| `record` | Optional | `object` | - | The record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }` |

