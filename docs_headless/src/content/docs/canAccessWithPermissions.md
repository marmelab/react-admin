---
title: "canAccessWithPermissions"
---

**Tip**: `ra-core-ee` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

`canAccessWithPermissions` is a helper function that facilitates the `authProvider.canAccess()` method implementation:

## Usage

The user roles and permissions should be returned upon login. The `authProvider` should store the permissions in memory, or in localStorage. This allows `authProvider.canAccess()` to read the permissions from localStorage.

```tsx
// in roleDefinitions.ts
export const roleDefinitions = {
    admin: [
        { action: '*', resource: '*' }
    ],
    reader: [
        { action: ['list', 'show', 'export'], resource: '*' }
        { action: 'read', resource: 'posts.*' }
        { action: 'read', resource: 'comments.*' }
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

## Parameters

This function takes an object as argument with the following fields:

| Name | Optional | Type | Description
| - | - | - | - |
| `permissions` | Required | `Array<Permission>` | An array of permissions for the current user
| `action` | Required | `string` | The action for which to check users has the execution right
| `resource` | Required | `string` | The resource for which to check users has the execution right
| `record` | Required | `string` | The record for which to check users has the execution right

`canAccessWithPermissions` expects the `permissions` to be a flat array of permissions. It is your responsibility to fetch these permissions (usually during login). If the permissions are spread into several role definitions, you can merge them into a single array using the [`getPermissionsFromRoles`](#getpermissionsfromroles) function.