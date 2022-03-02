---
layout: default
title: "RBAC"
---

# Role-Based Access Control (RBAC)

React-admin Enterprise Edition contains [the ra-rbac module](https://marmelab.com/ra-rbac)<img class="icon" src="./img/premium.svg" />, which adds fine-grained permissions to your admin. This module extends the `authProvider` and adds replacement for many react-admin components that use these permissions.

<video controls="controls" style="max-width: 100%">
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

Ra-rbac builds up on react-admin's `authProvider` API. It precises the return format of the `getPermissions()` method, and requires a new `getRoles()` method.

- `getPermissions()` must return a promise for object containing `permissions` (an array of permissions) and `roles` (an array of roles).
- `getRoles()` must return a promise for an object containing role definition.

```jsx
const authProvider = {
    // ...
    getPermissions: () => Promise.resolve({
        "permissions": [
            { action: ["read", "write"], resource: "users", record: { "id": "123" } },
        ],
        "roles": ["reader"],
    }),
    getRoles: () => Promise.resolve({
        "admin": [
            { action: "*", resource: "*" }
        ],
        "reader": [
            { action: "read", resource: "*" }
        ]
    })
};
```

For every restricted resource, ra-rbac calls `authProvider.getPermissions()` to get the user roles and permissions. If `getPermissions()` returns at least one role, ra-rbac also calls `authProvider.getRoles()` to get the role definitions. It then merges permissions and role definitions to build up the user permissions.

For the example dataProvider above, this translates to the following set of permissions:

- `{ action: "read", resource: "*" }` (from the `reader` role)
- `{ action: ["read", "write"], resource: "users", record: { "id": "123" } }` (from the `permissions` key)

In practice, the roles and permissions are usually returned upon login rather than in the `authProvider` code. The authProvider stores the roles and permissions in memory or localStorage. The `authProvider.getPermissions()` and `authProvider.getRoles()` methods only retrieve the roles and permissions from localStorage. 

```jsx
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
                localStorage.setItem('permissions', JSON.stringify(data.permissions));
                localStorage.setItem('roles', JSON.stringify(data.roles));
            });
    },
    // ...
    getPermissions: () => {
        return JSON.parse(localStorage.getItem("permissions"));
    },
    getRoles: () => {
        return JSON.parse(localStorage.getItem("roles"));
    },
};
```

**Tip**: If you have to rely on the server for roles and permissions, check out [the Performance section](#performance) below.

## `useCanAccess`

This hook calls the `authProvider.getPermissions()` and `authProvider.getRoles()` to get the role definitions, then checks whether the requested action and resource are allowed for the current user. 

`useCanAccess` takes an object `{ action, resource, record }` as argument. It returns an object describing the state of the RBAC request. As calls to the `authProvider` are asynchronous, the hook returns a `loading` state in addition to the `canAccess` key.

```jsx
import { useCanAccess } from '@react-admin/ra-rbac';
import { DeleteButton } from 'react-admin';

const DeleteUserButton = ({ record }) => {
    const { loading, canAccess } = useCanAccess({ action: 'delete', resource: 'users', record });
    if (loading || !canAccess) return null;
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

const { canAccess: canReadCompanies } = useCanAccess({ action: "read", resource: "companies" }); // canReadCompanies is true
const { canAccess: canCreatePeople } = useCanAccess({ action: "create", resource: "people" }); // canCreatePeople is true
const { canAccess: canExportPeople } = useCanAccess({ action: "export", resource: "people" }); // canExportPeople is false
const { canAccess: canEditDeals } = useCanAccess({ action: "edit", resource: "deals" }); // canEditDeals is true
const { canAccess: canDeleteComments } = useCanAccess({ action: "delete", resource: "tasks" }); // canDeleteComments is true
const { canAccess: canReadSales } = useCanAccess({ action: "read", resource: "sales" }); // canReadSales is false
const { canAccess: canReadSelfSales } = useCanAccess({ action: "read", resource: "sales" }, { id: "123" }); // canReadSelfSales is true
```

**tip**: The *order* of permissions as returned by the `authProvider` isn't significant. As soon as at least one permission grants access to an action on a resource, the user will be able to perform it.

## `usePermissions`

This replacement for [react-admin's `usePermissions`](https://marmelab.com/react-admin/Authentication.html#usepermissions-hook) returns an array of permissions, resulting in the merge of the user permissions and the permissions from the user roles.

```jsx
import { usePermissions } from "@react-admin/ra-rbac";

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: ["read", "write"], resource: "users", record: { "id": "123" } },
        ],
        roles: ["reader"],
    }),
    getRoles: () => Promise.resolve({
        admin: [
            { action: "*", resource: "*" }
        ],
        reader: [
            { action: "read", resource: "*" }
        ]
    })
};

const { loading, permissions } = usePermissions();
// {
//      loading: false,
//      permissions: [
//          { action: "read", resource: "*" },
//          { action: ["read", "write"], resource: "users", record: { "id": "123" } },
//      ],
// };
```

`usePermissions` is asynchronous and returns an empty permissions array on mount. Only after calls to `authProvider` is `usePermissions` able to return the permissions array.

`usePermissions` is used internally by most ra-rbac components, but you will probably not need to use it directly.

## `canAccess`

This helper function can check if the current permissions allow the user to execute an action on a resource (and optionally a record). It requires the `permissions` array, so it must be used in conjunction with `usePermissions`.

`canAccess` expects an object `{ permissions, resource, action, record }` as parameter, and returns a boolean.

```jsx
canAccess({
    permissions: [
        { action: 'read', resource: 'user' },
        { action: ['read', 'edit', 'create', 'delete'], resource: 'posts' },
    ],
    action: "edit",
    resource: "posts"
}); // true
```

`canAccess` is very useful to hide restricted elements in the admin, e.g. to hide columns in a datagrid:

```jsx
import { List, Datagrid, TextField } from 'react-admin';
import { canAccess } from '@react-admin/ra-rbac';

const authProvider = {
    checkAuth: () => Promise.resolve(),
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: 'list', resource: 'products' },
            { action: 'read', resource: 'products.price' },
        ],
    }),
};

const ProductList = (props) => {
    const { loading, permissions } = usePermissions();
    if (loading) return null;
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="reference" />
                <TextField source="width" />
                <TextField source="height" />
                {canAccess({
                    permissions,
                    action: 'read',
                    resource: 'products.price',
                }) && <TextField source="price" />}
                {/* this column will not render */}
                {canAccess({
                    permissions,
                    action: 'read',
                    resource: 'products.stock',
                }) && <TextField source="stock" />}
            </Datagrid>
        </List>
    );
};
```

**Tip**: Ra-rbac actually proposes a `<Datagrid>` component that hides columns depending on permissions. Check out [the `<Datagrid>` component](#datagrid) below.  

## `<WithPermissions>`

This component relies on the `authProvider` to render its child only if the user has the right permissions. It accepts the following props:

- `action` (string, required): the action to check, e.g. 'read', 'list', 'export', 'delete', etc.
- `resource` (string required): the resource to check, e.g. 'users', 'comments', 'posts', etc.
- `record` (object, optional): the record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }`

Additional props are passed down to the child element. 

```jsx
import { WithPermissions } from '@react-admin/ra-rbac';
import { DeleteButton, EditButton, ShowButton } from 'react-admin';

const RecordToolbar = ({ resource }) => (
    <Toolbar>
        <WithPermissions action="edit" resource={resource}>
            <EditButton />
        </WithPermissions>
        <WithPermissions action="show" resource={resource}>
            <ShowButton />
        </WithPermissions>
        <WithPermissions action="delete" resource={resource}>
            <DeleteButton />
        </WithPermissions>
    </Toolbar>
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
import { canAccess } from '@react-admin/ra-rbac';

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

const ProductList = ({ permissions, ...props }) => (
    <List {...props}>
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
```

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

const CustomLayout = (props: LayoutProps) => <Layout {...props} menu={Menu} />;

const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider} layout={CustomLayout}>
        <Resource name="posts" {...posts} />
        <Resource name="comments" {...comments} />
        {/* the user won't see the Users menu */}
        <Resource name="users" {...users} />
    </Admin>
);
```

## Performance

`authProvider.getPermissions()` and `authProvider.getRoles()` can return promises, which in theory allows to rely on the authentication server for permissions. The downside is that this slows down the app a great deal, as each page may contain dozens of calls to these methods.

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

let roles; // memory cache
let rolesExpiresAt = 0; 
const getRoles = () => {
    const request = new Request('https://mydomain.com/roles', {
            headers: new Headers({ 'Authorization': `Bearer ${localStorage.getItem('token')}` }),
        });
        return fetch(request)
            .then(res => resp.json())
            .then(data => {
                roles = data.roles;
                rolesExpiresAt = Date.now() + 1000 * 60 * 5; // 5 minutes
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
    getRoles: () => {
        return Date.now() > rolesExpiresAt ? getRoles() : roles;
    },
};
```

## List Components

### `<List>`

Replacement for react-admin's `<List>` that adds RBAC control to actions and bulk actions

Users must have the 'create' permission on the resource to see the `<CreateButton>`.
Users must have the 'export' permission on the resource to see the `<ExportButton>` and the `<BulkExportButton>`.
Users must have the 'delete' permission on the resource to see the `<BulkExportButton>`.

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

export const PostList = (props) => (
    <List {...props}>
        ...
    </List>
);
// user will see the following actions on top of the list:
// - create
// user will see the following bulk actions upon selection:
// - delete
```

**Tip**: This `<List>` component relies on [the `<ListActions>` component](#listactions) below.

### `<Datagrid>`

Alternative to react-admin's <Datagrid> that adds RBAC control to columns

To see a column, the user must have the permission to read the resource column:

```jsx
{ action: "read", resource: `${resource}.${source}` }.
```

Also, the `rowClick` prop is automatically set depending on the user props:

- "edit" if the user has the permission to edit the resource
- "show" if the user doesn't have the permission to edit the resource but has the permission to show it
- empty otherwise

```jsx
import { List, DatagridProps } from '@react-admin/ra-rbac';
import { Datagrid } from '@react-admin/ra-rbac';
import { ImageField, TextField, ReferenceField, NumberField } from 'react-admin';

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

const ProductList = (props: DatagridProps) => (
    <List {...props}>
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
            {
               // these two columns are not visible to the user
            }
            <NumberField source="stock" />
            <NumberField source="sales" />
        </Datagrid>
    </List>
);
```

### `<ListActions>`

Replacement for react-admin's ListAction that adds RBAC control to actions

Users must have the 'create' permission on the resource to see the CreateButton.
Users must have the 'export' permission on the resource to see the ExportButton.

```jsx
import { List } from 'react-admin';
import { ListActions } from '@react-admin/ra-rbac';

export const PostList = (props) => (
    <List actions={<ListActions />} {...props}>
        ...
    </List>
);
```

## Detail Components

### `<Edit>`

Replacement for react-admin's `<Edit>` that adds RBAC control to actions

Users must have the 'show' permission on the resource and record to see the ShowButton.
Users must have the 'clone' permission on the resource and record to see the CloneButton.

```jsx
import { EditProps } from 'react-admin';
import { Edit } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: ['list', 'edit', 'clone'], resource: 'products' },
        ],
    }),
};

export const PostEdit = (props: EditProps) => (
    <Edit {...props}>
        ...
    </Edit>
);
// user will see the clone button but not the show button
```

### `<Show>`

Replacement for react-admin's `<Show>` that adds RBAC control to actions

Users must have the 'edit' permission on the resource and record to see the EditButton.

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

export const PostShow = (props: ShowProps) => (
    <Show {...props}>
        ...
    </Show>
);
// user will see the edit action on top of the Show view
```

### `<SimpleShowLayout>`

Alternative to react-admin's `<SimpleShowLayout>` that adds RBAC control to fields

To see a column, the user must have the permission to read the resource column:

```
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

const ProductShow = (props: ShowProps) => (
    <Show {...props}>
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

### `<Tab>`

Replacement for the show `<Tab>` that only renders a tab if the user has the right permissions.

Add a `name` prop to the Tab to define the resource on which the user needs to have the 'read' permissions for.

`<Tab>` also only renders the child fields for which the user has the 'read' permissions.

```jsx
import { Show, TabbedShowLayout, TextField } from 'react-admin';
import { Tab } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: ['list', 'show'], resource: 'products' },
            { action: 'read', resource: 'products.reference' },
            { action: 'read', resource: 'products.width' },
            { action: 'read', resource: 'products.height' },
            // 'products.description' is missing
            { action: 'read', resource: 'products.thumbnail' },
            // 'products.image' is missing
            { action: 'read', resource: 'products.tab.description' },
            { action: 'read', resource: 'products.tab.images' },
            // 'products.tab.stock' is missing
        ],
    }),
};

const ProductShow = props => (
   <Show {...props}>
       <TabbedShowLayout>
           <Tab label="Description" name="description">
               <TextField source="reference" />
               <TextField source="width" />
               <TextField source="height" />
               {/* Not displayed */}
               <TextField source="description" />
           </Tab>
           <Tab label="Images" name="images">
               <TextField source="image" />
               {/* Not displayed */}
               <TextField source="thumbnail" />
           </Tab>
           {/* Not displayed */}
           <Tab label="Stock" name="stock">
               <TextField source="stock" />
           </Tab>
       </TabbedShowLayout>
   </Show>
);
```

## Form Components

### `<SimpleForm>`

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

const ProductEdit = props => (
    <Edit {...props}>
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

### `<TabbedForm>`

Alternative to react-admin's `<TabbedForm>` that adds RBAC control to the delete button.

Use in conjunction with [ra-rbac's `<FormTab>`](#formtab) to render inputs based on permissions.

```jsx
import { Edit, TextInput } from 'react-admin';
import { TabbedForm, FormTab } from '@react-admin/ra-rbac';

const authProvider = {
    checkAuth: () => Promise.resolve(),
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () =>Promise.resolve({
        permissions: [
            // 'delete' is missing
            { action: ['list', 'edit'], resource: 'products' },
            { action: 'write', resource: 'products.reference' },
            { action: 'write', resource: 'products.width' },
            { action: 'write', resource: 'products.height' },
            // 'products.description' is missing
            { action: 'write', resource: 'products.thumbnail' },
            // 'products.image' is missing
            { action: 'write', resource: 'products.tab.description' },
            { action: 'write', resource: 'products.tab.images' },
            // 'products.tab.stock' is missing
        ],
    }),
};

const ProductEdit = props => (
    <Edit {...props}>
        <TabbedForm>
            <FormTab label="Description" name="description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                {/* not displayed */}
                <TextInput source="description" />
            </FormTab>
            <FormTab label="Images" name="images">
                {/* not displayed */}
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </FormTab>
            {/* not displayed */}
            <FormTab label="Stock" name="stock">
                <TextInput source="stock" />
            </FormTab>
            {/*} delete button not displayed */}
        </TabbedForm>
    </Edit>
);
```

### `<FormTab>`

Replacement for the default `<FormTab>` that only renders a tab if the user has the right permissions.

Add a `name` prop to the `FormTab` to define the sub-resource that the user needs to have the right permissions for.

`<FormTab>` also only renders the child inputs for which the user has the 'write' permissions.

```jsx
import { Edit, TabbedForm, TextInput } from 'react-admin';
import { FormTab } from '@react-admin/ra-rbac';

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: ['list', 'edit'], resource: 'products' },
            { action: 'write', resource: 'products.reference' },
            { action: 'write', resource: 'products.width' },
            { action: 'write', resource: 'products.height' },
            // 'products.description' is missing
            { action: 'write', resource: 'products.thumbnail' },
            // 'products.image' is missing
            { action: 'write', resource: 'products.tab.description' },
            { action: 'write', resource: 'products.tab.images' },
            // 'products.tab.stock' is missing
        ],
    }),
};

const ProductEdit = props => (
    <Edit {...props}>
        <TabbedForm>
            <FormTab label="Description" name="description">
                <TextInput source="reference" />
                <TextInput source="width" />
                <TextInput source="height" />
                {/* not displayed */}
                <TextInput source="description" />
            </FormTab>
            <FormTab label="Images" name="images">
                {/* not displayed */}
                <TextInput source="image" />
                <TextInput source="thumbnail" />
            </FormTab>
            {/* not displayed */}
            <FormTab label="Stock" name="stock">
                <TextInput source="stock" />
            </FormTab>
        </TabbedForm>
    </Edit>
);
```
