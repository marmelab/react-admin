---
layout: default
title: "useCanAccess"
---

# `useCanAccess`

This hook, part of [the ra-rbac module](https://marmelab.com/ra-enterprise/modules/ra-rbac)<img class="icon" src="./img/premium.svg" />, calls the `authProvider.getPermissions()` to get the role definitions, then checks whether the requested action and resource are allowed for the current user. 

## Usage

`useCanAccess` takes an object `{ action, resource, record }` as argument. It returns an object describing the state of the RBAC request. As calls to the `authProvider` are asynchronous, the hook returns a `loading` state in addition to the `canAccess` key.

```jsx
import { useCanAccess } from '@react-admin/ra-rbac';
import { useRecordContext, DeleteButton } from 'react-admin';

const DeleteUserButton = () => {
    const record = useRecordContext();
    const { isLoading, canAccess } = useCanAccess({ action: 'delete', resource: 'users', record });
    if (isLoading || !canAccess) return null;
    return <DeleteButton record={record} resource="users" />;
};
```

When checking if a user can access a resource, ra-rbac grabs the permissions corresponding to his roles. If at least one of these permissions allows him to access the resource, the user is granted access. Otherwise, the user is denied.

```jsx
const authProvider= {
    // ...
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: ["read", "create", "edit", "export"], resource: "companies" },
            { action: ["read", "create", "edit"], resource: "people" },
            { action: ["read", "create", "edit", "export"], resource: "deals" },
            { action: ["read", "create"], resource: "comments" },
            { action: ["read", "create", "edit", "delete"], resource: "tasks" },
            { action: ["read", "write"], resource: "sales", record: { "id": "123" } },
        ],
    }),
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

**Tip**: The *order* of permissions as returned by the `authProvider` isn't significant. As soon as at least one permission grants access to an action on a resource, the user will be able to perform it.

**Tip**: `useCanAccess` is asynchronous, because it calls `usePermissions` internally. If you have to use `useCanAccess` several times in a component, the rendered result will "blink" as the multiple calls to `authProvider.getPermissions()` resolve. To avoid that behavior, you can use the `usePermissions` hook once, then call [the `canAccess` helper](./canAccess.md). 

## Parameters

`useCanAccess` expects a single parameter object with the following properties:

| Name | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `resource` | Required | `string` | - | The resource to check, e.g. 'users', 'comments', 'posts', etc. |
| `action` | Required | `string` | - | The action to check, e.g. 'read', 'list', 'export', 'delete', etc. |
| `record` | Optional | `object` | - | The record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }` |

