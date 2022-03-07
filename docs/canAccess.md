---
layout: default
title: "The canAccess helper"
---

# `canAccess`

This helper function, part of [the ra-rbac module](https://marmelab.com/ra-rbac)<img class="icon" src="./img/premium.svg" />, can check if the current permissions allow the user to execute an action on a resource (and optionally a record). It requires the `permissions` array, so it must be used in conjunction with `usePermissions`.

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

**Tip**: Instead of calling `usePermissions` and `canAccess`, you can call [the `useCanAccess` hook](./useCanAccess.md).