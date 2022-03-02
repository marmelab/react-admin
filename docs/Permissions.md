---
layout: default
title: "Permissions"
---

# Permissions

Some applications may require fine-grained permissions to enable or disable access to certain features. Since there are many possible strategies (single role, multiple roles or rights, ACLs, etc.), react-admin delegates the permission logic to `authProvider.getPermissions()`.

By default, a react-admin app only requires users to be logged in for the list, create, edit, and show pages. However, should you need to customize the views according to the users permissions, you can call the [`usePermissions()`](./usePermissions.md) hook to grab them. This works for custom pages too.

## User Permissions

React-admin calls the `authProvider.getPermissions()` whenever it needs the user permissions. These permissions can take the shape you want:

- a string (e.g. `'admin'`),
- an array of roles (e.g. `['post_editor', 'comment_moderator', 'super_admin']`)
- an object with fine-grained permissions (e.g. `{ postList: { read: true, write: false, delete: false } }`)
- or even a function

The format of permissions is free because react-admin never actually uses the permissions itself. It's up to you to use them in your code to hide or display content, redirect the user to another page, or display warnings. 

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

If you need to check the permissions in any of the default react-admin views or in custom page, you can use the [`usePermissions()`](#usepermissions-hook) hook:

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


## Restricting Access to Resources or Views

Permissions can be useful to restrict access to resources or their views. To do so, you must pass a function as a child of the `<Admin>`  component. React-admin will call this function with the permissions returned by the `authProvider`. Note that you can only provide one of such function child.

```jsx
<Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
>
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
```

Note that the function may return as many fragments as you need.

**Tip**: Even if that's possible, be careful when completely excluding a resource (like with the `categories` resource in this example) as it will prevent you to reference this resource in the other resource views, too.

## Restricting Access to Fields and Inputs

You might want to display some fields or inputs only to users with specific permissions. You can use the `usePermissions` hook for that.

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
    );
}
```
{% endraw %}

This also works inside an `Edit` view with a `TabbedForm`, and you can even hide a `FormTab` completely:

{% raw %}
```jsx
export const UserEdit = () => {
    const { permissions } = usePermissions();
    return (
        <Edit title={<UserTitle />}>
            <TabbedForm defaultValue={{ role: 'user' }}>
                <FormTab label="user.form.summary">
                    {permissions === 'admin' && <TextInput disabled source="id" />}
                    <TextInput source="name" validate={required()} />
                </FormTab>
                {permissions === 'admin' &&
                    <FormTab label="user.form.security">
                        <TextInput source="role" validate={required()} />
                    </FormTab>}
            </TabbedForm>
        </Edit>
    );
};
```
{% endraw %}

What about the `List` view, the `Datagrid`, `SimpleList`? It works there, too. And in the next example, the `permissions` prop is passed down to a custom `filters` selector.

```jsx
import * as React from 'react';
import { List, Datagrid, ShowButton, TextField, TextInput }  from 'react-admin';

const getUserFilters = (permissions) => ([
    <TextInput label="user.list.search" source="q" alwaysOn />,
    <TextInput source="name" />,
    permissions === 'admin' ? <TextInput source="role" /> : null,
].filter(filter => filter !== null));

export const UserList = () => {
    const { permissions } = usePermissions();
    return (
        <List filters={getUserFilters(permissions)}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" />
                {permissions === 'admin' && <TextField source="role" />}
                {permissions === 'admin' && <EditButton />}
                <ShowButton />
            </Datagrid>
        </List>
    );
};
```

## Restricting Access to a Menu

What if you want to check the permissions inside a [custom menu](./Admin.md#menu)? Much like getting permissions inside a custom page, you'll have to use the `usePermissions` hook:

```jsx
// in src/myMenu.js
import * as React from "react";
import { MenuItemLink, usePermissions } from 'react-admin';

const Menu = ({ onMenuClick }) => {
    const { permissions } = usePermissions();
    return (
        <div>
            <MenuItemLink to="/posts" primaryText="Posts" onClick={onMenuClick} />
            <MenuItemLink to="/comments" primaryText="Comments" onClick={onMenuClick} />
            {permissions === 'admin' &&
                <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuClick} />
            }
        </div>
    );
}
```

## Role-Based Access Control

If you need a more complex permissions with roles and groups, principle of least privilege, record-level permissions, explicit deny and more, check the next section for the [Role-Based Access Control](./AuthRBAC.md).
