---
layout: default
title: "RBAC"
---

# Role-Based Access Control (RBAC)

React-admin Enterprise Edition contains [the ra-rbac module](https://marmelab.com/ra-enterprise/modules/ra-rbac)<img class="icon" src="./img/premium.svg" />, which adds fine-grained permissions to your admin. This module extends the `authProvider` and adds replacement for many react-admin components that use these permissions.

<video controls="controls" style="max-width: 96%">
    <source src="./img/ra-rbac.mp4" type="video/mp4" />
</video>

Test it live in the [Enterprise Edition Storybook](https://storybook.ra-enterprise.marmelab.com/?path=/story/ra-rbac-full-app--full-app).

You can define permissions for pages, fields, buttons, etc. Roles and permissions are managed by the `authProvider`, which means you can use any data source you want (including an ActiveDirectory server).

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

```
npm install --save @react-admin/ra-rbac
# or
yarn add @react-admin/ra-rbac
```

Make sure you [enable auth features](https://marmelab.com/react-admin/Authentication.html#enabling-auth-features) by setting an `<Admin authProvider>`, and [disable anonymous access](https://marmelab.com/react-admin/Authentication.html#disabling-anonymous-access) by adding the `<Admin requireAuth>` prop. This will ensure that react-admin waits for the `authProvider` response before rendering anything.

**Tip**: ra-rbac is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

## Concepts

### Pessimistic Strategy

React-admin treats permissions in an optimistic way: While it fetches permissions from the authProvider, react-admin renders all components. If the authProvider returns a limited set of permissions, users may briefly see content they don't have access to.

Ra-rbac takes the opposite strategy: while permissions are loading, react-admin doesn't render the components that require permissions, assuming that these components are restricted by default.

It's only when ra-rbac is sure that the user has the right permissions that it renders the content.

### Principle Of Least Privilege

A user with no permissions has access to nothing. By default, any restricted action is accessible to nobody. This is also called an "implicit deny".

To put it otherwise, only users with the right permissions can execute an action on a resource and a record.

Permissions are additive, each permission granting access to a subset of the application.

### Roles And Permissions

A *permission* is an object that represents a subset of the application. It is defined by a `resource` (usually a noun) and an `action` (usually a verb), with sometimes an additional `record`.

Here are a few examples of permissions:

- `{ action: "*", resource: "*" }`: allow everything
- `{ action: "read", resource: "*" }`: allow read actions on all resources
- `{ action: ["read", "create", "edit", "export"], resource: "companies" }`: allow all actions except delete on companies
- `{ action: ["write"], resource: "game.score", record: { "id": "123" } }`: allow to change the score on a particular game

**Tip**: When the `record` field is omitted, the permission is valid for all records.

A *role* is a string that represents a responsibility. Examples of roles include "admin", "reader", "moderator", and "guest". A user can have one or more roles.

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

The RBAC system relies on *permissions* only. It's the `authProvider`'s responsibility to map roles to permissions. See the [`authProvider` Methods](#authprovider-methods) section for details.

### Record-Level Permissions

By default, a permission applies to all records of a resource.

A permission can be restricted to a specific record or a specific set of records. Setting the `record` field in a permission restricts the application of that permissions to records matching that criteria (using [lodash `isMatch`](https://lodash.com/docs/4.17.15#isMatch)).

```jsx
// can read all users, without record restriction
const perm1 = { action: "read", resource: "users" };
// can write only user of id 123
const perm2 = { action: "write", resource: "users", record: { "id": "123" } };
// can access only comments by user of id 123
const perm3 = { action: "*", resource: "comments", record: { "user_id": "123" } };
```

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

## `authProvider` Methods

Ra-rbac builds up on react-admin's `authProvider` API. It precises the return format of the `getPermissions()` method which must return a promise for an array of permissions objects.

```jsx
const authProvider = {
    // ...
    getPermissions: () => Promise.resolve([
        { action: ["read", "write"], resource: "users", record: { "id": "123" } },
    ])
};
```

For every restricted resource, ra-rbac calls `authProvider.getPermissions()` to get the permissions.

In practice, most auth providers get the permissions as a response from the login query, and store these permissions in memory or localStorage. When a component calls `authProvider.getPermissions()`, the auth provider only needs to read from that local copy of the permissions.

`authProvider.getPermissions()` doesn't return roles - only permissions. Usually, the role definitions are committed with the application code, as a constant. The roles of the current user are fetched at login, and the permissions are computed from the roles and the role definitions.

You can use the `getPermissionsFromRoles` helper in the `authProvider` to compute the permissions that the user has based on their permissions. This function takes an object as argument with the following fields:

-   `roleDefinitions`: a static object containing the role definitions for each role
-   `userRoles` _(optional)_: an array of roles (admin, reader...) for the current user
-   `userPermissions` _(optional)_: an array of permissions for the current user, to be added to the permissions computed from the roles

Here is an example `authProvider` implementation following this pattern:

```tsx
import { getPermissionsFromRoles } from '@react-admin/ra-rbac';

const roleDefinitions = {
    admin: [{ action: '*', resource: '*' }],
    reader: [{ action: 'read', resource: '*' }],
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
                // data is like
                // {
                //     "id": 123,
                //     "fullName": "John Doe",
                //     "permissions": [
                //          { action: ["read", "write"], resource: "users", record: { id: "123" } },
                //      ]
                //     "roles": ["admin", "reader"],
                // }
                const permissions = getPermissionsFromRoles({
                    roleDefinitions,
                    userPermissions: data.permissions,
                    userRoles: data.roles,
                });
                localStorage.setItem(
                    'permissions',
                    JSON.stringify(permissions)
                );
            });
    },
    // ...
    getPermissions: () => {
        const permissions = JSON.parse(localStorage.getItem('permissions'));
        return Promise.resolve(permissions);
    },
};
```

**Tip**: If you have to rely on the server for roles and permissions, check out [the Performance section](#performance) below.

## Hooks

Ra-rbac provides hooks to enable or disable features based on roles and permissions.

- [`usePermissions()`](./usePermissions.md) returns the current permissions.
- [`useCanAccess()`](./useCanAccess.md) returns a boolean indicating whether the user has access to the given resource.

## Components

Ra-rbac provides alternative components to react-admin base components. These alternative components include role-based access control and are as follows:

- Main
    - [`<Resource>`](#resource)
    - [`<Menu>`](#menu)
- List
    - [`<List>`](#list)
    - [`<ListActions>`](#listactions)
    - [`<Datagrid>`](#datagrid)
- Detail
    - [`<Edit>`](#edit)
    - [`<Show>`](#show)
    - [`<SimpleShowLayout>`](#simpleshowlayout)
    - [`<Tab>`](#tab)
- Form
    - [`<SimpleForm>`](#simpleform)
    - [`<TabbedForm>`](#tabbedform)
    - [`<FormTab>`](#formtab)
    - [`<AccordionForm>`](#accordionform)
    - [`<AccordionSection>`](#accordionsection)
    - [`<LongForm>`](#longform)
    - [`<WizardForm>`](#wizardform)

## `<AccordionForm>`

Alternative to react-admin's [`<AccordionForm>`](https://marmelab.com/react-admin/AccordionForm.html) that adds RBAC control to the accordions, the inputs, and the delete button.

This component is provided by the `@react-admin/ra-enterprise` package.

{% raw %}
```tsx
import { Edit, TextInput } from 'react-admin';
import { AccordionForm } from '@react-admin/ra-enterprise';

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve([
        { action: ['list', 'edit'], resource: 'products' },
        { action: 'write', resource: 'products.reference' },
        { action: 'write', resource: 'products.width' },
        { action: 'write', resource: 'products.height' },
        // 'products.description' is missing
        { action: 'write', resource: 'products.thumbnail' },
        // 'products.image' is missing
        // note that the panel with the name 'description' will be displayed
        { action: 'write', resource: 'products.panel.description' },
        // note that the panel with the name 'images' will be displayed
        { action: 'write', resource: 'products.panel.images' },
        // 'products.panel.stock' is missing
    ]),
};

const ProductEdit = () => (
    <Edit>
        <AccordionForm>
            <AccordionForm.Panel label="Description" name="description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                {/* not displayed */}
                <TextInput source="description" />
            </AccordionForm.Panel>
            <AccordionForm.Panel label="Images" name="images">
                {/* not displayed */}
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </AccordionForm.Panel>
            {/* not displayed */}
            <AccordionForm.Panel label="Stock" name="stock">
                <TextInput source="stock" />
            </AccordionForm.Panel>
            {/* delete button not displayed */}
        </AccordionForm>
    </Edit>
);
```
{% endraw %}

**Tip**: You must add a `name` prop to the `<AccordionForm.Panel>` so you can reference it in the permissions.
Then, to allow users to access a particular `<AccordionForm.Panel>`, update the permissions definition as follows: `{ action: 'write', resource: '{RESOURCE}.panel.{NAME}' }`, where `RESOURCE` is the resource name, and `NAME` the name you provided to the `<FormTab>`.

For instance, to allow users access to the following tab `<AccordionForm.Panel label="Description" name="description">` in `products` resource, add this line in permissions: `{ action: 'write', resource: 'products.panel.description' }`.

`<AccordionForm.Panel>` also only renders the child inputs for which the user has the 'write' permissions.

## `<AccordionSection>`

Replacement for the default `<AccordionSection>` that only renders a section if the user has the right permissions. `<AccordionSection>` also only renders the child inputs for which the user has the 'write' permissions. This component is provided by the `@react-admin/ra-enterprise` package.

{% raw %}
```tsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { AccordionSection } from '@react-admin/ra-enterprise';

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve([
        { action: ['list', 'edit'], resource: 'products' },
        { action: 'write', resource: 'products.reference' },
        { action: 'write', resource: 'products.width' },
        { action: 'write', resource: 'products.height' },
        // 'products.description' is missing
        { action: 'write', resource: 'products.thumbnail' },
        // 'products.image' is missing
        // note that the section with the name 'description' will be displayed
        { action: 'write', resource: 'products.section.description' },
        // note that the section with the name 'images' will be displayed
        { action: 'write', resource: 'products.section.images' },
        // 'products.section.stock' is missing
    ]),
};

const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <AccordionSection label="Description" name="description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                // not displayed
                <TextInput source="description" />
            </AccordionSection>
            <AccordionSection label="Images" name="images">
                // not displayed
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </AccordionSection>
            // not displayed
            <AccordionSection label="Stock" name="stock">
                <TextInput source="stock" />
            </AccordionSection>
        </SimpleForm>
    </Edit>
);
```
{% endraw %}


Add a `name` prop to the `<AccordionSection>` so you can reference it in the permissions.
Then, to allow users to access a particular `<AccordionSection>`, update the permissions definition as follows: `{ action: 'write', resource: '{RESOURCE}.section.{NAME}' }`, where `RESOURCE` is the resource name, and `NAME` the name you provided to the `<AccordionSection>`.

For instance, to allow users access to the following tab `<AccordionSection label="Description" name="description">` in `products` resource, add this line in permissions: `{ action: 'write', resource: 'products.section.description' }`.

## `<Datagrid>`

Alternative to react-admin's `<Datagrid>` that adds RBAC control to columns

To see a column, the user must have the permission to read the resource column:

```jsx
{ action: "read", resource: `${resource}.${source}` }
```

Also, the `rowClick` prop is automatically set depending on the user props:

- "edit" if the user has the permission to edit the resource
- "show" if the user doesn't have the permission to edit the resource but has the permission to show it
- empty otherwise

```jsx
import { ImageField, TextField, ReferenceField, NumberField } from 'react-admin';
import { List, Datagrid } from '@react-admin/ra-rbac';

const authProvider= {
    // ...
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: "list", resource: "products" },
            { action: "read", resource: "products.thumbnail" },
            { action: "read", resource: "products.reference" },
            { action: "read", resource: "products.category_id" },
            { action: "read", resource: "products.width" },
            { action: "read", resource: "products.height" },
            { action: "read", resource: "products.price" },
            { action: "read", resource: "products.description" },
        ]
    }),
};

const ProductList = () => (
    <List>
        <Datagrid> {/* ra-rbac Datagrid */}
            <ImageField source="thumbnail" />
            <TextField source="reference" />
            <ReferenceField source="category_id" reference="categories">
                <TextField source="name" />
            </ReferenceField>
            <NumberField source="width" />
            <NumberField source="height" />
            <NumberField source="price" />
            <TextField source="description" />
            {/* these two columns are not visible to the user */}
            <NumberField source="stock" />
            <NumberField source="sales" />
        </Datagrid>
    </List>
);
```

## `<Edit>`

Replacement for react-admin's `<Edit>` that adds RBAC control to actions.

- Users must have the 'show' permission on the resource and record to see the `<ShowButton>`.
- Users must have the 'clone' permission on the resource and record to see the `<CloneButton>`.

```jsx
import { Edit } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: ['list', 'edit', 'clone'], resource: 'products' },
        ],
    }),
};

export const PostEdit = () => (
    <Edit>
        ...
    </Edit>
);
// user will see the clone button but not the show button
```

## `<List>`

Replacement for react-admin's `<List>` that adds RBAC control to actions and bulk actions.

- Users must have the 'create' permission on the resource to see the `<CreateButton>`.
- Users must have the 'export' permission on the resource to see the `<ExportButton>` and the `<BulkExportButton>`.
- Users must have the 'delete' permission on the resource to see the `<BulkExportButton>`.

```jsx
import { List } from '@react-admin/ra-rbac';

const authProvider = {
     // ...
     getPermissions: () => Promise.resolve({
          permissions: [
                { action: 'list', resource: 'products' },
                { action: 'create', resource: 'products' },
                { action: 'delete', resource: 'products' },
                // action 'export' is missing
          ],
      }),
};

export const PostList = () => (
    <List>
        ...
    </List>
);
// user will see the following actions on top of the list:
// - create
// user will see the following bulk actions upon selection:
// - delete
```

**Tip**: This `<List>` component relies on [the `<ListActions>` component](#listactions) below.

## `<ListActions>`

Replacement for react-admin's `<ListAction>` that adds RBAC control to actions.

- Users must have the 'create' permission on the resource to see the `<CreateButton>`.
- Users must have the 'export' permission on the resource to see the `<ExportButton>`.

```jsx
import { List } from 'react-admin';
import { ListActions } from '@react-admin/ra-rbac';

export const PostList = () => (
    <List actions={<ListActions />}>
        ...
    </List>
);
```

## `<LongForm>`

Alternative to react-admin's [`<LongForm>`](https://marmelab.com/react-admin/LongForm.html) that adds RBAC control to the delete button, hides sections users don't have access to, and renders inputs based on permissions. Part of the `@react-admin/ra-enterprise` package.

{% raw %}
```tsx
import { LongForm } from '@react-admin/ra-enterprise';

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve([
        { action: ['list', 'edit'], resource: 'products' },
        /* sections */
        { action: 'write', resource: 'products.section.description' },
        { action: 'write', resource: 'products.section.images' },
        // 'products.section.stock' is missing

        /* inputs */
        { action: 'write', resource: 'products.reference' },
        { action: 'write', resource: 'products.width' },
        { action: 'write', resource: 'products.height' },
        // 'products.description' is missing
        // 'products.image' is missing
        { action: 'write', resource: 'products.thumbnail' },
    ]),
};

const ProductEdit = () => (
    <Edit>
        <LongForm>
            <LongForm.Section name="description" label="Description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                {/* not displayed */}
                <TextInput source="description" />
            </LongForm.Section>
            <LongForm.Section name="images" label="Images">
                {/* not displayed */}
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </LongForm.Section>
            {/* not displayed */}
            <LongForm.Section name="stock" label="Stock">
                <TextInput source="stock" />
            </LongForm.Section>
            {/* delete button not displayed */}
        </LongForm>
    </Edit>
);
```

{% endraw %}

**Tip**: You must add a `name` prop to the `<LongForm.Section>` so you can reference it in the permissions.
Then, to allow users to access a particular `<LongForm.Section>`, update the permissions definition as follows: `{ action: 'write', resource: '{RESOURCE}.section.{NAME}' }`, where `RESOURCE` is the resource name, and `NAME` the name you provided to the `<LongForm.Section>`.

For instance, to allow users access to the following tab `<LongForm.Section label="Description" name="description">` in `products` resource, add this line in permissions: `{ action: 'write', resource: 'products.section.description' }`.

`<LongForm.Section>` also only renders the child inputs for which the user has the 'write' permissions.

## `<Menu>`

A replacement for react-admin's `<Menu>` component, which only displays the menu items that the current user has access to (using the `list` action).

Pass this menu to a `<Layout>`, and pass that layout to the `<Admin>` component to use it.

```jsx
import { Admin, Resource, ListGuesser, Layout, LayoutProps } from 'react-admin';
import { Menu } from '@react-admin/ra-rbac';

import * as posts from './posts';
import * as comments from './comments';
import * as users from './users';

import dataProvider from './dataProvider';
const authProvider= {
    // ...
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: "*", resource: "posts" },
            { action: "*", resource: "comments" },
        ]
    }),
};

const CustomLayout = props => <Layout {...props} menu={Menu} />;

const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider} layout={CustomLayout}>
        <Resource name="posts" {...posts} />
        <Resource name="comments" {...comments} />
        {/* the user won't see the Users menu */}
        <Resource name="users" {...users} />
    </Admin>
);
```

## `<Resource>`

To restrict access to Create, Edit, List and Show views for your resources, use the `<Resource>` component from ra-rbac rather than the one from react-admin:

```jsx
import { Admin } from 'react-admin';
import { Resource } from '@react-admin/ra-rbac';
import { UserList, UserEdit, UserShow, UserCreate } from './users';
import { CommentList, CommentEdit, CommentCreate, CommentShow } from './comments';

import dataProvider from './dataProvider';
import authProvider from './authProvider';

const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="users" list={UserList} edit={UserEdit} show={UserShow} create={UserCreate} />
        <Resource name="comments" list={CommentList} edit={CommentEdit} create={CommentCreate} show={CommentShow} />
    </Admin>
);
```

Ra-rbac's `<Resource>` relies on the following actions:

- `list` to enable the list view
- `show` to enable the show view
- `create` to enable the create view
- `edit` to enable the edit view

**Tip**: When using ra-rbac's `<Resource>`, the `permissions` injected to `<List>`, `<Edit>` and `<Show>` component are the merged permissions of the user and the user's roles (as returned by `usePermission`). This makes the use of `canAccess` more straightforward. Here is the Datagrid example from the `canAccess` section above, revisited for an application using ra-rbac's `<Resource>`:

```jsx
import { List, Datagrid, TextField } from 'react-admin';
import { usePermissions, canAccess } from '@react-admin/ra-rbac';

const authProvider = {
    checkAuth: () => Promise.resolve(),
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: ['list', 'read_price'], resource: 'products' },
        ],
    }),
};

const ProductList = () => {
    const { permissions } = usePermissions();
        return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="reference" />
                <TextField source="width" />
                <TextField source="height" />
                {canAccess({
                    permissions,
                    action: 'read_price',
                    resource: 'products',
                }) && <TextField source="price" />}
                {/* this column will not render */}
                {canAccess({
                    permissions,
                    action: 'read_stock',
                    resource: 'products',
                }) && <TextField source="stock" />}
            </Datagrid>
        </List>
    );
}
```

## `<Show>`

Replacement for react-admin's `<Show>` that adds RBAC control to actions.

Users must have the 'edit' permission on the resource and record to see the `<EditButton>`.

```jsx
import { ShowProps } from 'react-admin';
import { Show } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: ['list', 'show', 'edit'], resource: 'products' },
        ],
    }),
};

export const PostShow = () => (
    <Show>
        ...
    </Show>
);
// user will see the edit action on top of the Show view
```

To control the appearance of individual fields, use [the `<SimpleShowLayout>` component](#simpleshowlayout) from ra-enterprise.

## `<SimpleForm>`

Alternative to react-admin's `<SimpleForm>` that adds RBAC control to inputs

To see an input, the user must have the permission to write the resource field:

```js
{ action: "write", resource: `${resource}.${source}` }
```

`<SimpleForm>` also renders the delete button only if the user has the 'delete' permission.

```jsx
import { Edit, TextInput } from 'react-admin';
import { SimpleForm } from '@react-admin/ra-rbac';

const authProvider= {
    // ...
    getPermissions: () => Promise.resolve({
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

```js
{ action: "read", resource: `${resource}.${source}` }
```

```jsx
import { ShowProps } from 'react-admin';
import { SimpleShowLayout } from '@react-admin/ra-rbac';

const authProvider= {
    // ...
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: ['list', 'show'], resource: 'products' },
            { action: 'read', resource: 'products.reference' },
            { action: 'read', resource: 'products.width' },
            { action: 'read', resource: 'products.height' },
            // 'products.description' is missing
            // 'products.image' is missing
            { action: 'read', resource: 'products.thumbnail' },
            // 'products.stock' is missing
        ]
    }),
};

const ProductShow = () => (
    <Show>
        <SimpleShowLayout> {/* <-- RBAC SimpleShowLayout */}
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

`<TabbedShowLayout>` shows only the tabs for which users have read permissions, using the `[resource].tab.[tabName]` string as resource identifier. `<TabbedShowLayout.Tab>` shows only the child fields for which users have the read permissions, using the `[resource].[source]` string as resource identifier.

```jsx
import { Show, TextField } from 'react-admin';
import { TabbedShowLayout } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve([
        // crud
        { action: ['list', 'show'], resource: 'products' },
        // tabs ('products.tab.stock' is missing)
        { action: 'read', resource: 'products.tab.description' },
        { action: 'read', resource: 'products.tab.images' },
        // fields ('products.description' and 'products.image' are missing)
        { action: 'read', resource: 'products.reference' },
        { action: 'read', resource: 'products.width' },
        { action: 'read', resource: 'products.height' },
        { action: 'read', resource: 'products.thumbnail' },
    ]),
};

const ProductShow = () => (
    <Show>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="Description" name="description">
                <TextField source="reference" />
                <TextField source="width" />
                <TextField source="height" />
                {/* the description field is not displayed */}
                <TextField source="description" />
            </TabbedShowLayout.Tab>
            {/* the stock tab is not displayed */}
            <TabbedShowLayout.Tab label="Stock" name="stock">
                <TextField source="stock" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Images" name="images">
                {/* the images field is not displayed */}
                <TextField source="image" />
                <TextField source="thumbnail" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);
```

You must add a `name` prop to the `<TabbedShowLayout.Tab>` so you can reference it in the permissions.
Then, to allow users to access a particular `<TabbedShowLayout.Tab>`, update the permissions definition as follows: `{ action: 'read', resource: '{RESOURCE}.tab.{NAME}' }`, where `RESOURCE` is the resource name, and `NAME` the name you provided to the `<TabbedShowLayout.Tab>`.

For instance, to allow users access to the following tab `<TabbedShowLayout.Tab label="description">` in `products` resource, add this line in permissions: `{ action: 'read', resource: 'products.tab.description' }`.

## `<TabbedForm>`

`<TabbedForm>` shows only the tabs for which users have write permissions, using the `[resource].tab.[tabName]` string as resource identifier. It also renders the delete button only if the user has a permission for the `delete` action in the current resource. `<TabbedForm.Tab>` shows only the child inputs for which users have the write permissions, using the `[resource].[source]` string as resource identifier.


```tsx
import { Edit, TextInput } from 'react-admin';
import { TabbedForm } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve([
        // crud (the delete action is missing)
        { action: ['list', 'edit'], resource: 'products' },
        // tabs ('products.tab.stock' is missing)
        { action: 'write', resource: 'products.tab.description' },
        { action: 'write', resource: 'products.tab.images' },
        // fields ('products.description' and 'products.image' are missing)
        { action: 'write', resource: 'products.reference' },
        { action: 'write', resource: 'products.width' },
        { action: 'write', resource: 'products.height' },
        { action: 'write', resource: 'products.thumbnail' },
    ]),
};

const ProductEdit = () => (
    <Edit>
        <TabbedForm>
            <TabbedForm.Tab label="Description" name="description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                {/* the description input is not displayed */}
                <TextInput source="description" />
            </TabbedForm.Tab>
            {/* the stock tab is not displayed */}
            <TabbedForm.Tab label="Stock" name="stock">
                <TextInput source="stock" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Images" name="images">
                {/* the images input is not displayed */}
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </TabbedForm.Tab>
            {/* the delete button is not displayed */}
        </TabbedForm>
    </Edit>
);
```

You must add a `name` prop to the `<TabbedForm.Tab>` so you can reference it in the permissions. Then, to allow users to access a particular `<TabbedForm.Tab>`, update the permissions definition as follows: `{ action: 'write', resource: '{RESOURCE}.tab.{NAME}' }`, where `RESOURCE` is the resource name, and `NAME` the name you provided to the `<TabbedForm.Tab>`.

For instance, to allow users access to the following tab `<TabbedForm.Tab label="Description" name="description">` in `products` resource, add this line in permissions: `{ action: 'write', resource: 'products.tab.description' }`.

## `<WizardForm>`

Alternative to react-admin's `<WizardForm>` that adds RBAC control to hide steps users don't have access to. `<WizardForm.Step>` also only renders the child inputs for which the user has the 'write' permissions.

This component is provided by the `@react-admin/ra-enterprise` package.

{% raw %}
```tsx
import { WizardForm } from '@react-admin/ra-enterprise';

const authProvider = {
    checkAuth: () => Promise.resolve(),
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () =>Promise.resolve([
        // 'delete' is missing
        { action: ['list', 'edit'], resource: 'products' },
        { action: 'write', resource: 'products.reference' },
        { action: 'write', resource: 'products.width' },
        { action: 'write', resource: 'products.height' },
        // 'products.description' is missing
        { action: 'write', resource: 'products.thumbnail' },
        // 'products.image' is missing
        // note that the step with the name 'description' will be displayed
        { action: 'write', resource: 'products.step.description' },
        // note that the step with the name 'images' will be displayed
        { action: 'write', resource: 'products.step.images' },
        // 'products.step.stock' is missing
    ]),
};

const ProductCreate = () => (
    <Create>
        <WizardForm>
            <WizardForm.Step name="description" label="Description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                {/* Won't be displayed */}
                <TextInput source="description" />
            </WizardForm.Step>
            <WizardForm.Step name="images" label="Images">
                {/* Won't be displayed */}
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </WizardForm.Step>
            {/* Won't be displayed */}
            <WizardForm.Step name="stock" label="Stock">
                <TextInput source="stock" />
            </WizardForm.Step>
            {/* Delete button won't be displayed */}
        </WizardForm>
    </Create>
);
```
{% endraw %}

**Tip**: You must add a `name` prop to the `<WizardForm.Step>` so you can reference it in the permissions.
Then, to allow users to access a particular `<WizardForm.Step>`, update the permissions definition as follows: `{ action: 'write', resource: '{RESOURCE}.step.{NAME}' }`, where `RESOURCE` is the resource name, and `NAME` the name you provided to the `<WizardForm.Step>`.

For instance, to allow users access to the following tab `<WizardForm.Step label="Description" name="description">` in `products` resource, add this line in permissions: `{ action: 'write', resource: 'products.step.description' }`.

## Performance

`authProvider.getPermissions()` can return a promise, which in theory allows to rely on the authentication server for permissions. The downside is that this slows down the app a great deal, as each page may contain dozens of calls to these methods.

To compensate for that, `usePermissions` uses a stale-while-revalidate approach, and after the initial call to `authProvider.getPermissions()`, it will return the permissions from the cache, and refresh them in the background.

In practice, your `authProvider` should use short-lived sessions, and refresh the permissions only when the session ends. JSON Web tokens (JWT) work that way.

Here is an example of an `authProvider` that stores the permissions in memory, and refreshes them only every 5 minutes:

```jsx
let permissions; // memory cache
let permissionsExpiresAt = 0;
const getPermissions = () => {
    const request = new Request('https://mydomain.com/permissions', {
            headers: new Headers({ 'Authorization': `Bearer ${localStorage.getItem('token')}` }),
        });
        return fetch(request)
            .then(res => resp.json())
            .then(data => {
                permissions = data.permissions;
                permissionsExpiresAt = Date.now() + 1000 * 60 * 5; // 5 minutes
            });
}

const authProvider = {
    login: ({ username, password }) =>  {
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
            });
    },
    // ...
    getPermissions: () => {
        return Date.now() > permissionsExpiresAt ? getPermissions() : permissions;
    },
};
```
