---
title: "getPermissionsFromRoles"
---

**Tip**: `ra-core-ee` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

This function returns an array of user permissions based on a role definition, a list of roles, and a list of user permissions. It merges the permissions defined in `roleDefinitions` for the current user's roles (`userRoles`) with the extra `userPermissions`.

```ts
import { getPermissionsFromRoles } from '@react-admin/ra-core-ee';

// static role definitions (usually in the app code)
const roleDefinitions = {
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

const permissions = getPermissionsFromRoles({    
    roleDefinitions,
    // roles of the current user (usually returned by the server upon login)
    userRoles: ['reader'],
    // extra permissions for the current user (usually returned by the server upon login)
    userPermissions: [
        { action: 'list', resource: 'sales'},
    ],
});
// permissions = [
//  { action: ['list', 'show', 'export'], resource: '*' },
//  { action: 'read', resource: 'posts.*' },
//  { action: 'read', resource: 'comments.*' },
//  { action: 'list', resource: 'sales' },
// ];
```

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
| `roleDefinitions` | Required | `Record<string, Permission>` | A dictionary containing the role definition for each role
| `userRoles` | Optional | `Array<string>` | An array of roles (admin, reader...) for the current user
| `userPermissions` | Optional | `Array<Permission>` | An array of permissions for the current user

