---
layout: default
title: "RBAC"
---

# Role-Based Access Control (RBAC)

Building up on react-admin's [Access Control features](./Permissions.md#access-control), react-admin RBAC provides an implementation for `authProvider.canAccess()` to manage roles and fine-grained permissions, and exports alternative react-admin [components](#components) that use these permissions.

<video controls="controls" style="max-width: 96%">
    <source src="./img/ra-rbac.mp4" type="video/mp4" />
</video>

The RBAC features are part of [ra-rbac](https://react-admin-ee.marmelab.com/documentation/ra-rbac), an [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" alt="React Admin Enterprise Edition icon" /> package. Test them live in the [Enterprise Edition Storybook](https://react-admin.github.io/ra-enterprise/?path=/story/ra-rbac-full-app--full-app).

## At a Glance

RBAC relies on an array of roles and permissions to determine what a user can do in a React-admin application. You can define permissions for pages, fields, buttons, etc. These permissions use a serialization format that is easy to understand and to maintain. You can store them in a database, in a JSON file, or in your code.

Roles and permissions are used by `authProvider.canAccess()` to provide fine-grained access control to the entire app.

The above demo uses the following set of permissions:

```jsx
const roles = {
    accountant: [
        { action: ['list', 'show'], resource: 'products' },
        { action: 'read', resource: 'products.*' },
        { type: 'deny', action: 'read', resource: 'products.description' },
        { action: 'list', resource: 'categories' },
        { action: 'read', resource: 'categories.*' },
        { action: ['list', 'show'], resource: 'customers' },
        { action: 'read', resource: 'customers.*' },
        { action: '*', resource: 'invoices' },
    ],
    contentEditor: [
        {
            action: ['list', 'create', 'edit', 'delete', 'export'],
            resource: 'products',
        },
        { action: 'read', resource: 'products.*' },
        { type: 'deny', action: 'read', resource: 'products.stock' },
        { type: 'deny', action: 'read', resource: 'products.sales' },
        { action: 'write', resource: 'products.*' },
        { type: 'deny', action: 'write', resource: 'products.stock' },
        { type: 'deny', action: 'write', resource: 'products.sales' },
        { action: 'list', resource: 'categories' },
        { action: ['list', 'edit'], resource: 'customers' },
        { action: ['list', 'edit'], resource: 'reviews' },
    ],
    stockManager: [
        { action: ['list', 'edit', 'export'], resource: 'products' },
        { action: 'read', resource: 'products.*' },
        {
            type: 'deny',
            action: 'read',
            resource: 'products.description',
        },
        { action: 'write', resource: 'products.stock' },
        { action: 'write', resource: 'products.sales' },
        { action: 'list', resource: 'categories' },
    ],
    administrator: [{ action: '*', resource: '*' }],
};
```

## Installation

First, install the `@react-admin/ra-rbac` package:

```
npm install --save @react-admin/ra-rbac
# or
yarn add @react-admin/ra-rbac
```

**Tip**: ra-rbac is part of the [React-Admin Enterprise Edition](https://react-admin-ee.marmelab.com/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

Make sure you [enable auth features](https://marmelab.com/react-admin/Authentication.html#enabling-auth-features) by setting an `<Admin authProvider>`, and [disable anonymous access](https://marmelab.com/react-admin/Authentication.html#disabling-anonymous-access) by adding the `<Admin requireAuth>` prop. This will ensure that react-admin waits for the `authProvider` response before rendering anything.

## Concepts

### Permission

A *permission* is an object that represents a subset of the application. It is defined by a `resource` (usually a noun) and an `action` (usually a verb), with sometimes an additional `record`.

Here are a few examples of permissions:

- `{ action: "*", resource: "*" }`: allow everything
- `{ action: "read", resource: "*" }`: allow read actions on all resources
- `{ action: "read", resource: ["companies", "people"] }`: allow read actions on a subset of resources
- `{ action: ["read", "create", "edit", "export"], resource: "companies" }`: allow all actions except delete on companies
- `{ action: ["write"], resource: "game.score", record: { "id": "123" } }`: allow write action on the score of the game with id 123

**Tip**: When the `record` field is omitted, the permission is valid for all records.

### Action

An _action_ is a string, usually a verb, that represents an operation. Examples of actions include "read", "create", "edit", "delete", or "export".

React-admin already does page-level access control with actions like "list", "show", "edit", "create", and "delete". RBAC checks additional actions in its components:

| Action   | Description                      | Used In                                                                                                                                                                                                                                                                                                |
| -------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `list`   | Allow to access the List page    | [`<List>`](./List.md#access-control), [`<ListButton>`](./Buttons.md#listbutton), [`<Menu.ResourceItem>`](./Menu.md#access-control)                                                                                                                                                                     |
| `show`   | Allow to access the Show page    | [`<Show>`](./Show.md), [`<ShowButton>`](./Buttons.md#showbutton), [`<DataTable>`](./DataTable.md#access-control), [`<Datagrid>`](./Datagrid.md#access-control), [`<Edit>`](./Edit.md)                                                                                                                  |
| `create` | Allow to access the Create page  | [`<Create>`](./Create.md), [`<CreateButton>`](./Buttons.md#createbutton), [`<List>`](./List.md#access-control)                                                                                                                                                                                         |
| `edit`   | Allow to access the Edit page    | [`<Edit>`](./Edit.md), [`<EditButton>`](./Buttons.md#editbutton), [`<DataTable>`](./DataTable.md#access-control), [`<Datagrid>`](./Datagrid.md#access-control), [`<Show>`](./Show.md)                                                                                                                  |
| `delete` | Allow to delete data             | [`<DeleteButton>`](./Buttons.md#deletebutton), [`<BulkDeleteButton>`](./Buttons.md#bulkdeletebutton), [`<DataTable>`](./DataTable.md#access-control), [`<Datagrid>`](./Datagrid.md#access-control), [`<SimpleForm>`](./SimpleForm.md#access-control), [`<TabbedForm>`](./TabbedForm.md#access-control) |
| `export` | Allow to export data             | [`<ExportButton>`](./Buttons.md#exportbutton), [`<List>`](./List.md#access-control)                                                                                                                                                                                                                    |
| `clone`  | Allow to clone a record          | [`<CloneButton>`](./Buttons.md#clonebutton), [`<Edit>`](./Edit.md)                                                                                                                                                                                                                                     |
| `read`   | Allow to view a field (or a tab) | [`<Datagrid>`](./Datagrid.md#access-control), [`<SimpleShowLayout>`](./SimpleShowLayout.md#access-control), [`<TabbedShowLayout>`](./TabbedShowLayout.md#access-control)                                                                                                                               |
| `write`  | Allow to edit a field (or a tab) | [`<SimpleForm>`](./SimpleForm.md#access-control), [`<TabbedForm>`](./TabbedForm.md#access-control), [`<WizardForm>`](./WizardForm.md#enableaccesscontrol), [`<LongForm>`](./LongForm.md#enableaccesscontrol), [`<AccordionForm>`](./AccordionForm.md#enableaccesscontrol)                              |

**Tip:** Be sure not to confuse "show" and "read", or "edit" and "write", as they are not the same. The first operate at the page level, the second at the field level. A good mnemonic is to realize "show" and "edit" are named the same as the react-admin page they allow to control: the Show and Edit pages.

You can also add your own actions, and use them in your own components using [`useCanAccess`](./useCanAccess.md) or [`<CanAccess>`](./CanAccess.md).

### Role

A *role* is a string that represents a responsibility. Examples of roles include "admin", "reader", "moderator", and "guest". A user can have one or more roles.

### Role Definition

A *role definition* is an array of permissions. It lists the operations that a user with that role can perform.

Here are a few example role definitions:

```jsx
// the admin role has all the permissions
const adminRole = [
    { action: "*", resource: "*" }
];

// the reader role can only read content, not create, edit or delete it
const readerRole = [
    { action: "read", resource: "*" }
];

// fine-grained permissions on a per resource basis
const salesRole = [
    { action: ["read", "create", "edit", "export"], resource: "companies" },
    { action: ["read", "create", "edit"], resource: "people" },
    { action: ["read", "create", "edit", "export"], resource: "deals" },
    { action: ["read", "create"], resource: "comments" },,
    { action: ["read", "create"], resource: "tasks" },
    { action: ["write"], resource: "tasks.completed" },
];

// permissions can be restricted to a specific list of records, and are additive
const corrector123Role = [
    // can only grade the assignments assigned to him
    { action: ["read", "export", "edit", "grade"], resource: "assignments", record: { "supervisor_id": "123" } },
    // can see the general stats page
    { action: "read", resource: "stats" },
    // can see the profile of every corrector
    { action: ["read"], resource: "correctors" },
    // can edit his own profile
    { action: ["write"], resource: "correctors", record: { "id": "123" } },
];
```

**Tip**: The _order_ of permissions isn't significant. As soon as at least one permission grants access to an action on a resource, ra-rbac grant access to it - unless there is an [explicit deny](#explicit-deny).

### Pessimistic Strategy

RBAC components treat permissions in a pessimistic way: while permissions are loading, react-admin doesn't render the components that require permissions, assuming that these components are restricted by default. It's only when the `authProvider.canAccess()` has resolved that RBAC components render.

### Principle Of Least Privilege

A user with no permissions has access to nothing. By default, any restricted action is accessible to nobody. This is also called an "implicit deny".

To put it otherwise, only users with the right permissions can execute an action on a resource and a record.

Permissions are additive, each permission granting access to a subset of the application.

### Record-Level Permissions

By default, a permission applies to all records of a resource.

A permission can be restricted to a specific record or a specific set of records. Setting the `record` field in a permission restricts the application of that permissions to records matching that criteria (using [lodash `isMatch`](https://lodash.com/docs/4.17.15#isMatch)).

```jsx
// can view all users, without record restriction
const perm1 = { action: ['list', 'show'], resource: 'users' };
const perm2 = { action: 'read', resource: 'users.*' };
// can only edit field 'username' for user of id 123
const perm4 = { action: 'write', resource: 'users.username', record: { id: '123' } };
```

Only record-level components can perform record-level permissions checks. Below is the list of components that support them:

- [`<SimpleShowLayout>`](./SimpleShowLayout.md#access-control)
- [`<TabbedShowLayout>`](./TabbedShowLayout.md#access-control)
- [`<SimpleForm>`](./SimpleForm.md#access-control)
- [`<TabbedForm>`](./TabbedForm.md#access-control)

When you restrict permissions to a specific set of records, components that do not support record-level permissions (such as List Components) will ignore the record criteria and perform their checks at the resource-level only.

### Explicit Deny

Some users may have access to all resources but one. Instead of having to list all the resources they have access to, you can use a special permission with the "deny" type that explicitly denies access to a resource.

```jsx
const allProductsButStock = [
    { action: 'read', resource: 'products.*' },
    { type: 'deny', action: 'read', resource: 'products.stock' },
    { type: 'deny', action: 'read', resource: 'products.sales' },
];
// is equivalent to
const allProductsButStock = [
    { action: 'read', resource: 'products.thumbnail' },
    { action: 'read', resource: 'products.reference' },
    { action: 'read', resource: 'products.category_id' },
    { action: 'read', resource: 'products.width' },
    { action: 'read', resource: 'products.height' },
    { action: 'read', resource: 'products.price' },
    { action: 'read', resource: 'products.description' },
];
```

**Tip**: Deny permissions are evaluated first, no matter in which order the permissions are defined.

## Setup

Define role definitions in your application code, or fetch them from an API.

```jsx
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
```

The user roles and permissions should be returned upon login. The `authProvider` should store the permissions in memory, or in localStorage. This allows `authProvider.canAccess()` to read the permissions from localStorage.

```tsx
import { getPermissionsFromRoles } from '@react-admin/ra-rbac';
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
    // ...
};
```

Then, use these permissions in `authProvider.canAccess()`:

```tsx
import { canAccessWithPermissions } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    canAccess: async ({ resource, action, record }) => {
        const permissions = JSON.parse(localStorage.getItem('permissions'));
        // check if the user can access the resource and action
        return canAccessWithPermissions({ permissions, resource, action, record });
    },
};
```

**Tip**: If `canAccess` needs to call the server every time, check out [the Performance section](#performance) below.

## `getPermissionsFromRoles`

This function returns an array of user permissions based on a role definition, a list of roles, and a list of user permissions. It merges the permissions defined in `roleDefinitions` for the current user's roles (`userRoles`) with the extra `userPermissions`.

```jsx
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

This function takes an object as argument with the following fields:

-   `roleDefinitions`: a dictionary containing the role definition for each role
-   `userRoles` _(optional)_: an array of roles (admin, reader...) for the current user
-   `userPermissions` _(optional)_: an array of permissions for the current user

## `canAccessWithPermissions`

`canAccessWithPermissions` is a helper that facilitates the `authProvider.canAccess()` method implementation:

```tsx
import { canAccessWithPermissions } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    canAccess: async ({ action, resource, record }) => {    
        const permissions = JSON.parse(localStorage.getItem('permissions'));
        return canAccessWithPermissions({
            permissions,
            action,
            resource,
            record,
        });
    }
};
```

`canAccessWithPermissions` expects the `permissions` to be a flat array of permissions. It is your responsibility to fetch these permissions (usually during login). If the permissions are spread into several role definitions, you can merge them into a single array using the [`getPermissionsFromRoles`](#getpermissionsfromroles) function.

## Components

Ra-rbac provides alternative components to react-admin base components with RBAC support:

- Main
    - [`<Menu>`](./Menu.md#access-control)
- List
    - [`<List>`](./List.md#access-control)
    - [`<Datagrid>`](./Datagrid.md#access-control)
    - [`<ExportButton>`](./Buttons.md#exportbutton)
- Detail
    - [`<SimpleShowLayout>`](./SimpleShowLayout.md#access-control)
    - [`<TabbedShowLayout>`](./TabbedShowLayout.md#access-control)
    - [`<CloneButton>`](./Buttons.md#clonebutton)
- Form
    - [`<SimpleForm>`](./SimpleForm.md#access-control)
    - [`<TabbedForm>`](./TabbedForm.md#access-control)

In addition, the following components from te Enterprise edition have built-in RBAC support:

- [`<AccordionForm>`](./AccordionForm.md#access-control)
- [`<LongForm>`](./LongForm.md#access-control)
- [`<WizardForm>`](./WizardForm.md#access-control)

Here is an example of `<Datagrid>` with RBAC:

```tsx
import { 
    canAccessWithPermissions,
    List,
    Datagrid
} from '@react-admin/ra-rbac';
import {
    ImageField,
    TextField,
    ReferenceField,
    NumberField,
} from 'react-admin';

const authProvider = {
    // ...
    canAccess: async ({ action, record, resource }) =>
        canAccessWithPermissions({
            permissions: [
                { action: 'list', resource: 'products' },
                { action: 'read', resource: 'products.thumbnail' },
                { action: 'read', resource: 'products.reference' },
                { action: 'read', resource: 'products.category_id' },
                { action: 'read', resource: 'products.width' },
                { action: 'read', resource: 'products.height' },
                { action: 'read', resource: 'products.price' },
                { action: 'read', resource: 'products.description' },
                // { action: 'read', resource: 'products.stock' },
                // { action: 'read', resource: 'products.sales' },
                // { action: 'delete', resource: 'products' },
                { action: 'show', resource: 'products' },
            ],
            action,
            record,
            resource
        }),
};

const ProductList = () => (
    <List>
        {/* The datagrid has no bulk actions as the user doesn't have the 'delete' permission */}
        <Datagrid>
            <ImageField source="thumbnail" />
            <TextField source="reference" />
            <ReferenceField source="category_id" reference="categories">
                <TextField source="name" />
            </ReferenceField>
            <NumberField source="width" />
            <NumberField source="height" />
            <NumberField source="price" />
            <TextField source="description" />
            {/** These two columns are not visible to the user **/}
            <NumberField source="stock" />
            <NumberField source="sales" />
        </Datagrid>
    </List>
);
```

## Performance

`authProvider.canAccess()` can return a promise, which in theory allows to rely on the authentication server for permissions. The downside is that this slows down the app a great deal, as each page may contain dozens of calls to these methods.

In practice, your `authProvider` should use short-lived sessions, and refresh the permissions only when the session ends. JSON Web tokens (JWT) work that way.

Here is an example of an `authProvider` that stores the permissions in memory, and refreshes them only every 5 minutes:

```tsx
import { canAccessWithPermissions, getPermissionsFromRoles } from '@react-admin/ra-rbac';

let permissions; // memory cache
let permissionsExpiresAt = 0;
const getPermissions = () => {
    const request = new Request('https://mydomain.com/permissions', {
        headers: new Headers({
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
    });
    return fetch(request)
        .then(res => resp.json())
        .then(data => {
            permissions = data.permissions;
            permissionsExpiresAt = Date.now() + 1000 * 60 * 5; // 5 minutes
        });
};

let roleDefinitions; // memory cache
let rolesExpiresAt = 0;
const getRoles = () => {
    const request = new Request('https://mydomain.com/roles', {
        headers: new Headers({
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
    });
    return fetch(request)
        .then(res => resp.json())
        .then(data => {
            roleDefinitions = data.roles;
            rolesExpiresAt = Date.now() + 1000 * 60 * 5; // 5 minutes
        });
};

const authProvider = {
    login: ({ username, password }) => {
        const request = new Request('https://mydomain.com/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('token', JSON.stringify(data.token));
                localStorage.setItem('userRoles', JSON.stringify(data.roles));
            });
    },
    // ...
    canAccess: async ({ action, record, resource }) => {
        if (Date.now() > rolesExpiresAt) {
            await getRoles();
        }
        if (Date.now() > permissionsExpiresAt) {
            await getPermissions();
        }
        return canAccessWithPermissions({
            permissions: getPermissionsFromRoles({
                roleDefinitions,
                userPermissions: permissions,
                userRoles: localStorage.getItem('userRoles'),
            },
            action,
            record,
            resource,
        });
    },
};
```
