---
layout: default
title: "The canAccess helper"
---

# `canAccess`

This helper function, part of [the ra-rbac module](https://marmelab.com/ra-enterprise/modules/ra-rbac)<img class="icon" src="./img/premium.svg" />, can check if the current permissions allow the user to execute an action on a resource (and optionally a record). It requires the user `permissions` array, so it must be used in conjunction with `usePermissions`.

## Usage

`canAccess` expects an object `{ permissions, resource, action, record }` as parameter, and returns a boolean.

```tsx
import { usePermissions, EditButton  } from 'react-admin';
import { canAccess } from '@react-admin/ra-rbac';

const PostEditButton = () => {
    const { isLoading, permissions } = usePermissions();
    if (isLoading) return null;
    if (canAccess({ permissions, action: "edit", resource: "posts" })) {
        return <EditButton />;
    } else {
        return null;
    }
};
```

With the following permissions:

```jsx
console.log(await authProvider.getPermissions())
// [
//      { action: ['read', 'edit', 'create', 'delete'], resource: 'posts' },
// ]
```

The `PostEditButton` component will render the `<EditButton>`.

**Tip**: `canAccess` is mostly useful when you already have the permissions at hand. If you need to fetch the permissions every time you call `canAccess`, prefer using [the `useCanAccess` hook](./useCanAccess.md) or [the `<IfCanAccess>` component](./IfCanAccess.md) instead.

## Parameters

`canAccess` expects a single parameter object with the following properties:

| Name | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `permissions` | Required | `Permissions[]` | - | The permissions array, as returned by the `usePermissions` hook. |
| `resource` | Required | `string` | - | The resource to check, e.g. 'users', 'comments', 'posts', etc. |
| `action` | Optional | `string` | - | The action to check, e.g. 'read', 'list', 'export', 'delete', etc. |
| `record` | Optional | `object` | - | The record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }` |

## `action`

Specify the action you want to check. 

```tsx
const permissions = [
    { resource: 'posts', action: ['read', 'edit', 'create'] },
];
canAccess({ permissions, resource: 'posts', action: 'read' }); // true
canAccess({ permissions, resource: 'posts', action: 'edit' }); // true
canAccess({ permissions, resource: 'posts', action: 'create' }); // true
canAccess({ permissions, resource: 'posts', action: 'delete' }); // false
canAccess({ permissions, resource: 'posts', action: 'export' }); // false
```

You don't have to provide an `action` if you just want to know whether users can access the CRUD pages of a resource. This is useful to leverage `canAccess` in an `<Admin>` component children function:

```tsx
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import { canAccess } from '@react-admin/ra-rbac';
import { dataProvider } from './dataProvider';

const authProvider = {
    checkAuth: () => Promise.resolve(),
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () =>
        Promise.resolve([
            { action: 'list', resource: 'products' },
            { action: 'edit', resource: 'categories' },
        ]),
};

export const MyApp = () => (
    <Admin authProvider={authProvider} dataProvider={dataProvider}>
        {(permissions: Permissions) => (
            <>
                {canAccess({ permissions, resource: 'products' }) ? (
                    <Resource name="products" list={ListGuesser} />
                ) : null}
                {canAccess({ permissions, resource: 'categories' }) ? (
                    <Resource name="categories" list={ListGuesser} edit={EditGuesser} />
                ) : null}
                {canAccess({ permissions, resource: 'commands' }) ? (
                    <Resource name="commands" list={ListGuesser} />
                ) : null}
            </>
        )}
    </Admin>
);
```

In this example, users will see the products list and will be able to click on its category link to edit the category. However, they won't see the categories list nor the commands list.

Note that [ra-rbac's `<Resource>` component](./AuthRBAC.md#resource) does this check automatically, so you don't actually need to use `canAccess` in this case.

```tsx
import { Admin, ListGuesser, EditGuesser } from 'react-admin'; // do not import Resource here
import { Resource } from '@react-admin/ra-rbac';
import { dataProvider } from './dataProvider';

export const MyApp = () => (
    <Admin authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="products" list={ListGuesser} />
        <Resource name="categories" list={ListGuesser} edit={EditGuesser} />
        <Resource name="commands" list={ListGuesser} />
    </Admin>
);
```

## `permissions`

The `permissions` parameter must contain the permissions of the current user. It is usually retrieved using the `usePermissions` hook:

```jsx
const { permissions } = usePermissions();
if (canAccess({ permissions, action: "edit", resource: "posts" })) {
    return <EditButton />;
} else {
    return null;
}
```

When the `permissions` is null (e.g. if the `usePermissions` hook is still loading), `canAccess` always returns `false`.

## `resource`

The `resource` parameter is the resource you want to check. It can be the name of a resource, or the name of a resource field, depending on the granularity you need.

```tsx
const ProductList = () => {
    const { isLoading, permissions } = usePermissions();
    if (isLoading) return null;
    return (
        <List>
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

## `record`

RBAC allows to specify [record-level permissions](./AuthRBAC.md#record-level-permissions). These permissions are checked when you specify the `record` prop.

```tsx
const permissions = [
    { resource: 'posts', action: 'read', record: { id: 1 } },
];

canAccess({
    permissions,
    resource: 'posts',
    action: 'read',
    record: { id: 1, title: 'Lorem Ipsum' },
}); // true

canAccess({
    permissions,
    resource: 'posts',
    action: 'read',
    record: { id: 2, title: 'Sit Dolor Amet' },
}); // false
```

## Hiding Columns in a Datagrid

`canAccess` is useful to hide restricted elements in the admin, e.g. to hide columns in a datagrid:

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

const ProductList = () => {
    const { isLoading, permissions } = usePermissions();
    if (isLoading) return null;
    return (
        <List>
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

**Tip**: Ra-rbac actually proposes a `<Datagrid>` component that hides columns depending on permissions. Check [the RBAC documentation](./AuthRBAC.md) for details.
