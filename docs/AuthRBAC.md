---
layout: default
title: "RBAC"
---

# Role-Based Access Control (RBAC)

Building up on react-admin's [Access Control features](./Permissions.md#access-control), react-admin RBAC provides an implementation for `authProvider.canAccess()` to manage roles and fine-grained permissions, and exports alternative react-admin components that use these permissions.

<video controls="controls" style="max-width: 96%">
    <source src="./img/ra-rbac.mp4" type="video/mp4" />
</video>

Test it live in the [Enterprise Edition Storybook](https://react-admin.github.io/ra-enterprise/?path=/story/ra-rbac-full-app--full-app).

The RBAC features are part of [ra-rbac](https://react-admin-ee.marmelab.com/documentation/ra-rbac), an [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> package.

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

| Action   | Description                      | Used In                                                                                                         |
| -------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `list`   | Allow to access the List page    | [`<List>`](#list), [`<ListButton>`](./Buttons.md#listbutton), [`<Menu.ResourceItem>`](#menu) |
| `show`   | Allow to access the Show page    | [`<Show>`](./Show.md), [`<ShowButton>`](./Buttons.md#showbutton), [`<Datagrid>`](#datagrid), [`<Edit>`](./Edit.md) |
| `create` | Allow to access the Create page  | [`<Create>`](./Create.md), [`<CreateButton>`](./Buttons.md#createbutton), [`<List>`](#list) |
| `edit`   | Allow to access the Edit page    | [`<Edit>`](./Edit.md), [`<EditButton>`](./Buttons.md#editbutton), [`<Datagrid>`](#datagrid), [`<Show>`](./Show.md) |
| `delete` | Allow to delete data             | [`<DeleteButton>`](./Buttons.md#deletebutton), [`<BulkDeleteButton>`](./Buttons.md#bulkdeletebutton), [`<Datagrid>`](#datagrid), [`<SimpleForm>`](#simpleform), [`<TabbedForm>`](#tabform) |
| `export` | Allow to export data             | [`<ExportButton>`](#exportbutton), [`<List>`](#list)                                       |
| `clone`  | Allow to clone a record          | [`<CloneButton>`](#clonebutton), [`<Edit>`](./Edit.md)                                   |
| `read`   | Allow to view a field (or a tab) | [`<Datagrid>`](#datagrid), [`<SimpleShowLayout>`](#simpleshowlayout), [`<TabbedShowLayout>`](#tabbedshowlayout) |
| `write`  | Allow to edit a field (or a tab) | [`<SimpleForm>`](#simpleform), [`<TabbedForm>`](#tabbedform), [`<WizardForm>`](./WizardForm.md#enableaccesscontrol), [`<LongForm>`](./LongForm.md#enableaccesscontrol), [`<AccordionForm>`](./AccordionForm.md#enableaccesscontrol) |

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

- [`<SimpleShowLayout>`](#simpleshowlayout)
- [`<TabbedShowLayout>`](#tabbedshowlayout)
- [`<SimpleForm>`](#simpleform)
- [`<TabbedForm>`](#tabbedform)

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

Define role definitions in your application code, or fetch them from the API.

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

Ra-rbac provides alternative components to react-admin base components. These alternative components include role-based access control and are as follows:

- Main
    - [`<Menu>`](#menu)
- List
    - [`<List>`](#list)
    - [`<ListActions>`](#listactions)
    - [`<Datagrid>`](#datagrid)
- Detail
    - [`<SimpleShowLayout>`](#simpleshowlayout)
    - [`<Tab>`](#tab)
    - [`<TabbedShowLayout>`](#tab)
- Form
    - [`<SimpleForm>`](#simpleform)
    - [`<TabbedForm>`](#tabbedform)
    - [`<FormTab>`](#formtab)

## `<Datagrid>`

Alternative to react-admin's `<Datagrid>` that adds RBAC control to columns.

-   Users must have the `'delete'` permission on the resource to see the `<BulkExportButton>`.
-   Users must have the `'read'` permission on a resource column to see it in the export:

```jsx
{ action: "read", resource: `${resource}.${source}` }.
// or
{ action: "read", resource: `${resource}.*` }.
```

Also, the `rowClick` prop is automatically set depending on the user props:

-   `"edit"` if the user has the permission to edit the resource
-   `"show"` if the user doesn't have the permission to edit the resource but has the permission to show it
-   empty otherwise

```tsx
import { canAccessWithPermissions, List, Datagrid } from '@react-admin/ra-rbac';
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
            ],
            action,
            record,
            resource
        }),
};

const ProductList = () => (
    <List>
        {/* ra-rbac Datagrid */}
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
            {/** these two columns are not visible to the user **/}
            <NumberField source="stock" />
            <NumberField source="sales" />
        </Datagrid>
    </List>
);
```

**Tip**: Adding the 'read' permission on the resource itself doesn't grant the 'read' permission on the columns. If you want a user to see all possible columns, add the 'read' permission on columns using a wildcard:

```jsx
{ action: "read", resource: "products.*" }.
```

## `<List>`

Replacement for react-admin's `<List>` that adds RBAC control to actions, and to the default export function.

-   Users must have the `'create'` permission on the resource to see the `<CreateButton>`.
-   Users must have the `'export'` permission on the resource to see the `<ExportButton>`.
-   Users must have the `'read'` permission on a resource column to see it in the export:

```jsx
{ action: "read", resource: `${resource}.${source}` }.
// 
{ action: "read", resource: `${resource}.*` }.
```

```tsx
import { List } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    canAccess: async () =>
        canAccessWithPermissions({
            permissions: [
                { action: 'list', resource: 'products' },
                { action: 'export', resource: 'products' },
                // actions 'create' and 'delete' are missing
                { action: 'read', resource: 'products.name' },
                { action: 'read', resource: 'products.description' },
                { action: 'read', resource: 'products.price' },
                { action: 'read', resource: 'products.category' },
                // resource 'products.stock' is missing
            ],
            action,
            resource,
            record
        }),
};

export const PostList = () => (
    <List exporter={exporter}>
        {/*...*/}
    </List>
);
// Users will see the Export action on top of the list, but not the Create action.
// Users will only see the authorized columns when clicking on the export button.
```

**Tip**: If you need a custom [`exporter`](./List.md#exporter), you can use `useExporterWithAccessControl` to apply access control to the exported records:

```tsx
import { List, useExporterWithAccessControl } from '@ra-enterprise/ra-rbac';
import { myExporter } from './myExporter';

export const PostList = () => {
    const exporter = useExporterWithAccessControl({ exporter: myExporter })
    return (
        <List exporter={exporter}>
            {/*...*/}
        </List>
    );
}

```

**Tip**: This `<List>` component relies on [the `<ListActions>` component](#listactions) below.

## `<ListActions>`

Replacement for react-admin's `<ListAction>` that adds RBAC control to actions

- Users must have the `'create'` permission on the resource to see the `<CreateButton>`.
- Users must have the `'export'` permission on the resource to see the `<ExportButton>`.

```jsx
import { List } from 'react-admin';
import { ListActions } from '@react-admin/ra-rbac';

export const PostList = () => <List actions={<ListActions />}>...</List>;
```

## `<ExportButton>`

Replacement for react-admin's [`<ExportButton>`](./Buttons.md#exportbutton) that checks users have the `'export'` permission before rendering. Use it if you want to provide your own `actions` to the `<List>`:

```tsx
import { CreateButton, List, TopToolbar } from 'react-admin';
import { ExportButton } from '@react-admin/ra-rbac';

const PostListActions = () => (
    <TopToolbar>
        <PostFilter context="button" />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

export const PostList = () => (
    <List actions={<PostListActions />}>
        {/* ... */}
    </List>
);
```

It accepts the following props in addition to the default [`<ExportButton>` props](./Buttons.md#props-8):

| Prop                 | Required | Type              | Default    | Description                                                            |
| -------------------- | -------- | ----------------- | ---------- | ---------------------------------------------------------------------- |
| `accessDenied`       | Optional | ReactNode         | null       | The content to display when users don't have the `'export'` permission |
| `action`             | Optional | String            | `"export"` | The action to call `authProvider.canAccess` with                       |
| `authorizationError` | Optional | ReactNode         | null       | The content to display when an error occurs while checking permission |

**Tip**: Don't forget to give read permissions on all the fields you want to allow in exports
```jsx
{ action: "read", resource: `${resource}.${source}` }.
// or
{ action: "read", resource: `${resource}.*` }.
```

## `<Menu>`

If you want to add custom pages to the menu, you can use `ra-rbac`'s `<Menu>` component. It will only display the menu item if the user has access to the specified action and resource.

```tsx
import { Menu } from '@react-admin/ra-rbac';

export const MyMenu = () => (
    <Menu>
        {/* Resource menu items already have access control built-in */}
        <Menu.ResourceItems />
        {/* For custom menu items, you can specify a resource and action */}
        <Menu.Item
            to="/products"
            primaryText="Products"
            resource="products"
            action="list"
        />
        {/* this menu item will render for all users */}
        <Menu.Item to="/preferences" primaryText="Preferences" />
    </Menu>
);
```

## `<SimpleForm>`

Alternative to react-admin's `<SimpleForm>` that shows/hides inputs based on roles and permissions.

To see an input, the user must have the permission to write the resource field:

```jsx
{ action: "write", resource: `${resource}.${source}` }
```

`<SimpleForm>` also renders the delete button only if the user has the 'delete' permission.

```tsx
import { Edit, TextInput } from 'react-admin';
import { SimpleForm } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    canAccess: async ({ action, record, resource }) =>
        canAccessWithPermissions({
            permissions: [
                // 'delete' is missing
                { action: ['list', 'edit'], resource: 'products' },
                { action: 'write', resource: 'products.reference' },
                { action: 'write', resource: 'products.width' },
                { action: 'write', resource: 'products.height' },
                // 'products.description' is missing
                { action: 'write', resource: 'products.thumbnail' },
                // 'products.image' is missing
            ]
            action,
            record,
            resource,
        }),
};

const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="reference" />
            <TextInput source="width" />
            <TextInput source="height" />
            {/* not displayed */}
            <TextInput source="description" />
            {/* not displayed */}
            <TextInput source="image" />
            <TextInput source="thumbnail" />
            {/* no delete button */}
        </SimpleForm>
    </Edit>
);
```

## `<SimpleShowLayout>`

Alternative to react-admin's `<SimpleShowLayout>` that adds RBAC control to fields

To see a column, the user must have the permission to read the resource column:

```jsx
{ action: "read", resource: `${resource}.${source}` }
// Or
{ action: "read", resource: `${resource}.*` }
```

```tsx
import { SimpleShowLayout } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    canAccess: async ({ action, record, resource }) =>
        canAccessWithPermissions({
            permissions: [
                { action: ['list', 'show'], resource: 'products' },
                { action: 'read', resource: 'products.reference' },
                { action: 'read', resource: 'products.width' },
                { action: 'read', resource: 'products.height' },
                // 'products.description' is missing
                // 'products.image' is missing
                { action: 'read', resource: 'products.thumbnail' },
                // 'products.stock' is missing
            ],
            action,
            record,
            resource,
        }),
};

const ProductShow = () => (
    <Show>
        <SimpleShowLayout>
            {/* <-- RBAC SimpleShowLayout */}
            <TextField source="reference" />
            <TextField source="width" />
            <TextField source="height" />
            {/* not displayed */}
            <TextField source="description" />
            {/* not displayed */}
            <TextField source="image" />
            <TextField source="thumbnail" />
            {/* not displayed */}
            <TextField source="stock" />
        </SimpleShowLayout>
    </Show>
);
```

## `<TabbedShowLayout>`

Replacement for react-admin's `<TabbedShowLayout>` that only renders a tab if the user has the right permissions.

Use it in conjunction with [`<TabbedShowLayout.Tab>`](#tabbedshowlayouttab) and add a `name` prop to the `Tab` to define the resource on which the user needs to have the 'read' permissions for.

**Tip:** [`<TabbedShowLayout.Tab>`](#tabbedshowlayouttab) also allows to only render the child fields for which the user has the 'read' permissions.

```tsx
import { Show, TextField } from 'react-admin';
import { TabbedShowLayout } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    canAccess: async ({ action, record, resource }) =>
        canAccessWithPermissions({
            permissions: [
                { action: ['list', 'show'], resource: 'products' },
                { action: 'read', resource: 'products.reference' },
                { action: 'read', resource: 'products.width' },
                { action: 'read', resource: 'products.height' },
                { action: 'read', resource: 'products.thumbnail' },
                { action: 'read', resource: 'products.tab.description' },
                // 'products.tab.stock' is missing
                { action: 'read', resource: 'products.tab.images' },
            ],
            action,
            record,
            resource,
        }),
};

const ProductShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="Description" name="description">
                <TextField source="reference" />
                <TextField source="width" />
                <TextField source="height" />
                <TextField source="description" />
            </TabbedShowLayout.Tab>
            {/* Tab Stock is not displayed */}
            <TabbedShowLayout.Tab label="Stock" name="stock">
                <TextField source="stock" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Images" name="images">
                <TextField source="image" />
                <TextField source="thumbnail" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```

## `<TabbedShowLayout.Tab>`

Replacement for react-admin's `<TabbedShowLayout.Tab>` that only renders a tab and its content if the user has the right permissions.

Add a `name` prop to the `Tab` to define the resource on which the user needs to have the 'read' permissions for.

`<TabbedShowLayout.Tab>` also only renders the child fields for which the user has the 'read' permissions.

```tsx
import { Show, TextField } from 'react-admin';
import { TabbedShowLayout } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    canAccess: async ({ action, record, resource }) =>
        canAccessWithPermissions({
            permissions: [
                { action: ['list', 'show'], resource: 'products' },
                { action: 'read', resource: 'products.reference' },
                { action: 'read', resource: 'products.width' },
                { action: 'read', resource: 'products.height' },
                // 'products.description' is missing
                { action: 'read', resource: 'products.thumbnail' },
                // 'products.image' is missing
                { action: 'read', resource: 'products.tab.description' },
                // 'products.tab.stock' is missing
                { action: 'read', resource: 'products.tab.images' },
            ],
            action,
            record,
            resource,
        }),
};

const ProductShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="Description" name="description">
                <TextField source="reference" />
                <TextField source="width" />
                <TextField source="height" />
                {/* Field Description is not displayed */}
                <TextField source="description" />
            </TabbedShowLayout.Tab>
            {/* Tab Stock is not displayed */}
            <TabbedShowLayout.Tab label="Stock" name="stock">
                <TextField source="stock" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Images" name="images">
                {/* Field Image is not displayed */}
                <TextField source="image" />
                <TextField source="thumbnail" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```

## `<TabbedForm>`

Replacement for react-admin's `<TabbedForm>` that adds RBAC control to the delete button (conditioned by the `'delete'` action) and only renders a tab if the user has the right permissions.

Use in conjunction with [`<TabbedForm.Tab>`](#tabbedformtab) and add a `name` prop to the `Tab` to define the resource on which the user needs to have the 'write' permissions for.

**Tip:** [`<TabbedForm.Tab>`](#tabbedformtab) also allows to only render the child inputs for which the user has the 'write' permissions.

```jsx
import { Edit, TextInput } from 'react-admin';
import { TabbedForm } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    canAccess: async ({ action, record, resource }) =>
        canAccessWithPermissions({
            permissions: [
                // action 'delete' is missing
                { action: ['list', 'edit'], resource: 'products' },
                { action: 'write', resource: 'products.reference' },
                { action: 'write', resource: 'products.width' },
                { action: 'write', resource: 'products.height' },
                { action: 'write', resource: 'products.thumbnail' },
                { action: 'write', resource: 'products.tab.description' },
                // tab 'stock' is missing
                { action: 'write', resource: 'products.tab.images' },
            ],
            action,
            record,
            resource,
        }),
};

const ProductEdit = () => (
    <Edit>
        <TabbedForm>
            <TabbedForm.Tab label="Description" name="description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                <TextInput source="description" />
            </TabbedForm.Tab>
            {/* the "Stock" tab is not displayed */}
            <TabbedForm.Tab label="Stock" name="stock">
                <TextInput source="stock" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Images" name="images">
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </TabbedForm.Tab>
            {/* the "Delete" button is not displayed */}
        </TabbedForm>
    </Edit>
);
```

## `<TabbedForm.Tab>`

Replacement for react-admin's `<TabbedForm.Tab>` that only renders a tab and its content if the user has the right permissions.

Add a `name` prop to the `Tab` to define the resource on which the user needs to have the 'write' permissions for.

`<TabbedForm.Tab>` also only renders the child inputs for which the user has the 'write' permissions.

```tsx
import { Edit, TextInput } from 'react-admin';
import { TabbedForm } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    canAccess: async ({ action, record, resource }) =>
        canAccessWithPermissions({
            permissions: [
                { action: ['list', 'edit'], resource: 'products' },
                { action: 'write', resource: 'products.reference' },
                { action: 'write', resource: 'products.width' },
                { action: 'write', resource: 'products.height' },
                // 'products.description' is missing
                { action: 'write', resource: 'products.thumbnail' },
                // 'products.image' is missing
                { action: 'write', resource: 'products.tab.description' },
                // 'products.tab.stock' is missing
                { action: 'write', resource: 'products.tab.images' },
            ],
            action,
            record,
            resource,
        })
};

const ProductEdit = () => (
    <Edit>
        <TabbedForm>
            <TabbedForm.Tab label="Description" name="description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                {/* Input Description is not displayed */}
                <TextInput source="description" />
            </TabbedForm.Tab>
            {/* Input Stock is not displayed */}
            <TabbedForm.Tab label="Stock" name="stock">
                <TextInput source="stock" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Images" name="images">
                {/* Input Image is not displayed */}
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Edit>
);
```

## `<CloneButton>`

Replacement for react-admin's [`<CloneButton>`](./Buttons.md#clonebutton) that checks users have the `'clone'` permission before rendering. Use it if you want to provide your own `actions` to the `<Edit>`:

```tsx
import { Edit, TopToolbar } from 'react-admin';
import { CloneButton } from '@react-admin/ra-rbac';

const PostEditActions = () => (
    <TopToolbar>
        <CloneButton />
    </TopToolbar>
);

export const PostEdit = () => (
    <Edit actions={<PostEditActions />}>
        {/* ... */}
    </Edit>
);
```

It accepts the following props in addition to the default `<CloneButton>` props:

| Prop                 | Required | Type              | Default    | Description                                                            |
| -------------------- | -------- | ----------------- | ---------- | ---------------------------------------------------------------------- |
| `accessDenied`       | Optional | ReactNode         | null       | The content to display when users don't have the `'clone'` permission  |
| `action`             | Optional | String            | `"clone"`  | The action to call `authProvider.canAccess` with                       |
| `authorizationError` | Optional | ReactNode         | null       | The content to display when an error occurs while checking permission |

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
