---
layout: default
title: "Permissions"
---

# Permissions

By default, react-admin apps don't check user permissions. They only require users to be logged in for the list, create, edit, and show pages if there is an `authProvider`.

However, some applications may require fine-grained permissions to enable or disable access to certain features. Since there are many possible strategies (single role, multiple roles or rights, ACLs, etc.), react-admin delegates the permission logic to the `authProvider`.

Should you need to customize a page according to users permissions, you can get the permissions from the `authProvider` through the [`usePermissions()`](./usePermissions.md) hook.

## Permissions In The `authProvider`

It's the responsibility of `authProvider.getPermissions()` to return the user permissions. These permissions can take the shape you want:

- a string (e.g. `'admin'`),
- an array of roles (e.g. `['post_editor', 'comment_moderator', 'super_admin']`)
- an object with fine-grained permissions (e.g. `{ postList: { read: true, write: false, delete: false } }`)
- or even a function

The format of permissions is free because react-admin never actually uses the permissions itself. It's up to you to use them in your code to hide or display content, redirect the user to another page, or display warnings. 

React-admin is agnostic to the permissions format, but it provides an implementation for the most common permissions format: [role-based access control (RBAC)](./AuthRBAC.md). If you want to use RBAC, the `authProvider.getPermissions()` method should return an array of permissions objects.

```tsx
const authProvider = {
    // ...
    getPermissions: () => Promise.resolve([
        { action: ["read", "create", "edit", "export"], resource: "companies" },
        { action: ["read", "create", "edit"], resource: "people" },
        { action: ["read", "create", "edit", "export"], resource: "deals" },
        { action: ["read", "create"], resource: "comments" },,
        { action: ["read", "create"], resource: "tasks" },
        { action: ["write"], resource: "tasks.completed" },
    ])
};
```

Check the [RBAC chapter](./AuthRBAC.md) for more details on how to use role-based access control.

Following is an example where the `authProvider` stores the user's permissions in `localStorage` upon authentication, and returns these permissions when called with `getPermissions`:

{% raw %}
```jsx
// in src/authProvider.js
import decodeJwt from 'jwt-decode';

export default {
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
            .then(({ token }) => {
                const decodedToken = decodeJwt(token);
                localStorage.setItem('token', token);
                localStorage.setItem('permissions', decodedToken.permissions);
            });
    },
    checkError: (error) => { /* ... */ },
    checkAuth: () => {
        return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('permissions');
        return Promise.resolve();
    },
    getIdentity: () => { /* ... */ },
    getPermissions: () => {
        const role = localStorage.getItem('permissions');
        return role ? Promise.resolve(role) : Promise.reject();
    }
};
```
{% endraw %}

## Getting User Permissions

If you need to check the permissions in any of the default react-admin views or in custom page, you can use the [`usePermissions()`](./usePermissions.md) hook:

Here is an example of a `Create` view with a conditional Input based on permissions:

{% raw %}
```jsx
export const UserCreate = () => {
    const { permissions } = usePermissions();
    return (
        <Create>
            <SimpleForm
                defaultValue={{ role: 'user' }}
            >
                <TextInput source="name" validate={[required()]} />
                {permissions === 'admin' &&
                    <TextInput source="role" validate={[required()]} />}
            </SimpleForm>
        </Create>
    )
}
```
{% endraw %}

It works in custom pages too:

```jsx
// in src/MyPage.js
import * as React from "react";
import { Card } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import { usePermissions } from 'react-admin';

const MyPage = () => {
    const { permissions } = usePermissions();
    return (
        <Card>
            <CardContent>Lorem ipsum sic dolor amet...</CardContent>
            {permissions === 'admin' &&
                <CardContent>Sensitive data</CardContent>
            }
        </Card>
    );
}
```

**Tip**: If you use RBAC, use [the `<IfCanAccess>` component](./IfCanAccess.md) to fetch permissions, and render its children only if the user has the required permissions.

```jsx
import { IfCanAccess } from '@react-admin/ra-rbac';

const MyPage = () => (
    <Card>
        <CardContent>Lorem ipsum sic dolor amet...</CardContent>
        <IfCanAccess action="read" resource="sensitive_data">
            <CardContent>Sensitive data</CardContent>
        </IfCanAccess>
    </Card>
);
```

## Restricting Access to Resources or Views

Permissions can be useful to restrict access to resources or their views. To do so, you must pass a function as a child of the `<Admin>` component. React-admin will call this function with the permissions returned by the `authProvider`. Note that you can only provide one of such function child.

```jsx
export const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        {permissions => (
            <>
                {/* Restrict access to the edit view to admin only */}
                <Resource
                    name="customers"
                    list={VisitorList}
                    edit={permissions === 'admin' ? VisitorEdit : null}
                    icon={VisitorIcon}
                />
                {/* Only include the categories resource for admin users */}
                {permissions === 'admin'
                    ? <Resource name="categories" list={CategoryList} edit={CategoryEdit} icon={CategoryIcon} />
                    : null}
            </>
        )}
    </Admin>
);
```

Note that the function may return as many fragments as you need.

**Tip**: If you use RBAC, you won't need to check permissions manually as above. Just use [`ra-rbac`'s `<Resource>` component](./AuthRBAC.md#resource), which will do it for you.

```jsx
import { Admin } from 'react-admin';
import { Resource } from '@react-admin/ra-rbac';

export const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="customers" list={VisitorList} edit={VisitorEdit} icon={VisitorIcon} />
        <Resource name="categories" list={CategoryList} edit={CategoryEdit} icon={CategoryIcon} />
    </Admin>
);
```

## Restricting Access to Form Inputs

You might want to display some inputs only to users with specific permissions. You can use the `usePermissions` hook for that.

Here is an example of a `Create` view with a conditional Input based on permissions:

{% raw %}
```jsx
import { usePermissions, Create, SimpleForm, TextInput } from 'react-admin';

export const UserCreate = () => {
    const { permissions } = usePermissions();
    return (
        <Create>
            <SimpleForm>
                <TextInput source="name" />
                {permissions === 'admin' &&
                    <TextInput source="role" />}
            </SimpleForm>
        </Create>
    );
}
```
{% endraw %}

**Note**: `usePermissions` is asynchronous, which means that `permissions` will always be `undefined` on mount. Once the `authProvider.getPermissions()` promise is resolved, `permissions` will be set to the value returned by the promise, and the component will re-render. This may cause surprises when using `permissions` in props that are not reactive, e.g. `defaultValue`:

```jsx
import { usePermissions, Create, SimpleForm, TextInput } from 'react-admin';

export const UserCreate = () => {
    const { permissions } = usePermissions();
    return (
        <Create>
            <SimpleForm>
                <TextInput source="name" defaultValue={
                    // this doesn't work: the defaultValue will always be 'user' 
                    permissions === 'admin' ? 'admin' : 'user'
                } />
            </SimpleForm>
        </Create>
    );
}
```

In `react-hook-form`, `defaultValue` is only used on mount - changing its value after the initial render doesn't change the default value. The solution is to delay the rendering of the input until the permissions are resolved:

```jsx
import { usePermissions, Create, SimpleForm, TextInput } from 'react-admin';

export const UserCreate = () => {
    const { isLoading, permissions } = usePermissions();
    return (
        <Create>
            <SimpleForm>
                {!isLoading && <TextInput source="name" defaultValue={
                    permissions === 'admin' ? 'admin' : 'user'
                } />}
            </SimpleForm>
        </Create>
    );
}
```

**Tip**: If you use RBAC, use [`ra-rbac`'s `<SimpleForm>` component](./AuthRBAC.md#simpleform) instead. It renders its children only if the user has the required permissions.

```jsx
import { Create, TextInput } from 'react-admin';
import { SimpleForm } from '@react-admin/ra-rbac';

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="role" />
        </SimpleForm>
    </Create>
);
```

## Restricting Access to Columns In  a List

You can use `usePermissions` to hide some columns in a `Datagrid`. 

```jsx
import * as React from 'react';
import { usePermissions, List, Datagrid, ShowButton, TextField }  from 'react-admin';

export const UserList = () => {
    const { permissions } = usePermissions();
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="name" />
                {permissions === 'admin' && <TextField source="role" />}
            </Datagrid>
        </List>
    );
};
```

**Tip**: If you use RBAC, use [`ra-rbac`'s `<Datagrid>` component](./AuthRBAC.md#datagrid), which will render a column only if the user has the permissions for it.

```jsx
import * as React from 'react';
import { List, ShowButton, TextField, TextInput }  from 'react-admin';
import { Datagrid } from '@react-admin/ra-rbac';

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="role" />
        </Datagrid>
    </List>
);
```

## Restricting Access to a Menu

What if you want to check the permissions inside a [custom menu](./Admin.md#menu)? Much like getting permissions inside a custom page, you'll have to use the `usePermissions` hook:

```jsx
// in src/myMenu.js
import * as React from "react";
import { Menu, usePermissions } from 'react-admin';

const MyMenu = ({ onMenuClick }) => {
    const { permissions } = usePermissions();
    return (
        <Menu>
            <Menu.Item to="/posts" primaryText="Posts" onClick={onMenuClick} />
            <Menu.Item to="/comments" primaryText="Comments" onClick={onMenuClick} />
            {permissions === 'admin' &&
                <Menu.Item to="/custom-route" primaryText="Miscellaneous" onClick={onMenuClick} />
            }
        </Menu>
    );
}
```

**Tip**: If you use RBAC, use [`ra-rbac`'s `<Menu>` component](./AuthRBAC.md#menu), which will render a menu item only if the user has the permissions for it.

## Role-Based Access Control

If you need a more complex permissions with roles and groups, principle of least privilege, record-level permissions, explicit deny and more, check the next section for the [Role-Based Access Control](./AuthRBAC.md).
