---
title: "canAccessWithPermissions"
---

`canAccessWithPermissions` is a helper function that facilitates the implementation of [Access Control](./Permissions.md#access-control) policies based on an underlying list of user roles and permissions.

It is a builder block to implement the `authProvider.canAccess()` method,  which is called by ra-core to check whether the current user has the right to perform a given action on a given resource or record.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

`canAccessWithPermissions` is a pure function that you can call from your `authProvider.canAccess()` implementation.

```tsx
import { canAccessWithPermissions } from '@react-admin/ra-core-ee';

const authProvider = {
    // ...
    canAccess: async ({ action, resource, record }) => {    
        const permissions = myGetPermissionsFunction();
        return canAccessWithPermissions({
            permissions,
            action,
            resource,
            record,
        });
    }
    // ...
};
```

The `permissions` parameter must be an array of permissions. A *permission* is an object that represents access to a subset of the application. It is defined by a `resource` (usually a noun) and an `action` (usually a verb), with sometimes an additional `record`.

Here are a few examples of permissions:

- `{ action: "*", resource: "*" }`: allow everything
- `{ action: "read", resource: "*" }`: allow read actions on all resources
- `{ action: "read", resource: ["companies", "people"] }`: allow read actions on a subset of resources
- `{ action: ["read", "create", "edit", "export"], resource: "companies" }`: allow all actions except delete on companies
- `{ action: ["write"], resource: "game.score", record: { "id": "123" } }`: allow write action on the score of the game with id 123

:::tip
When the `record` field is omitted, the permission is valid for all records.
:::

In most cases, the permissions are derived from user roles, which are fetched at login and stored in memory or in localStorage. Check the [`getPermissionsFromRoles`](./getPermissionsFromRoles.md) function to merge the permissions from multiple roles into a single flat array of permissions.

## Parameters

This function takes an object as argument with the following fields:

| Name | Optional | Type | Description
| - | - | - | - |
| `permissions` | Required | `Array<Permission>` | An array of permissions for the current user
| `action` | Required | `string` | The action for which to check users has the execution right
| `resource` | Required | `string` | The resource for which to check users has the execution right
| `record` | Required | `string` | The record for which to check users has the execution right

`canAccessWithPermissions` expects the `permissions` to be a flat array of permissions. It is your responsibility to fetch these permissions (usually during login). If the permissions are spread into several role definitions, you can merge them into a single array using the [`getPermissionsFromRoles`](#getpermissionsfromroles) function.

## Building RBAC

The following example shows how to implement Role-based Access Control (RBAC) in `authProvider.canAccess()` using `canAccessWithPermissions` and `getPermissionsFromRoles`. The role permissions are defined in the code, and the user roles are returned by the authentication endpoint. Additional user permissions can also be returned by the authentication endpoint.

The `authProvider` stores the permissions in `localStorage`, so that returning users can access their permissions without having to log in again.

```tsx
// in roleDefinitions.ts
export const roleDefinitions = {
    admin: [
        { action: '*', resource: '*' }
    ],
    reader: [
        { action: ['list', 'show', 'export'], resource: '*' },
        { action: 'read', resource: 'posts.*' },
        { action: 'read', resource: 'comments.*' },
    ],
    accounting: [
        { action: '*', resource: 'sales' },
    ],
};

// in authProvider.ts
import { canAccessWithPermissions, getPermissionsFromRoles } from '@react-admin/ra-core-ee';
import { roleDefinitions } from './roleDefinitions';

const authProvider = {
    login: async ({ username, password }) => {
        const request = new Request('https://mydomain.com/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        const response = await fetch(request);
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
        const { user: { roles, permissions }} = await response.json();
        // merge the permissions from the roles with the extra permissions
        const permissions = getPermissionsFromRoles({
            roleDefinitions,
            userPermissions,
            userRoles
        });
        localStorage.setItem('permissions', JSON.stringify(permissions));
    },
    canAccess: async ({ action, resource, record }) => {    
        const permissions = JSON.parse(localStorage.getItem('permissions'));
        return canAccessWithPermissions({
            permissions,
            action,
            resource,
            record,
        });
    }
    // ...
};
```
