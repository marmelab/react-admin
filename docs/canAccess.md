---
layout: default
title: "The canAccess helper"
---

# `canAccess`

This helper function, part of [the ra-rbac module](https://marmelab.com/ra-enterprise/modules/ra-rbac)<img class="icon" src="./img/premium.svg" />, can check if the current permissions allow the user to execute an action on a resource (and optionally a record). It requires the `permissions` array, so it must be used in conjunction with `usePermissions`.

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

You don't have to provide an `action` if you just want to know whether users can access any screen of the resource. This is useful to leverage `canAccess` in an `<Admin>` component children function:

```tsx
import { Admin, ListGuesser, EditGuesser } from 'react-admin';
import { Resource, canAccess } from '@react-admin/ra-rbac';
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

**Tip**: Instead of calling `usePermissions` and `canAccess`, you can call [the `useCanAccess` hook](./useCanAccess.md).