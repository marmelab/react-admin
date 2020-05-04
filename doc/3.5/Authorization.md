---
layout: default
title: "Authorization"
---

# Authorization

Some applications may require fine grained permissions to enable or disable access to certain features. Since there are many different possible strategies (single role, multiple roles or rights, ACLs, etc.), react-admin simply provides hooks to execute your own authorization code.

By default, a react-admin app doesn't check authorization. However, if needed, it will rely on the `authProvider` introduced in the [Authentication documentation](./Authentication.md) to do so. You should read that chapter first.

## Configuring the Auth Provider

Each time react-admin needs to determine the user permissions, it calls the `authProvider.getPermissions()` method. It's up to you to return the user permissions, be it a string (e.g. `'admin'`) or an array of roles (e.g. `['post_editor', 'comment_moderator', 'super_admin']`).

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
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('permissions');
        return Promise.resolve();
    },
    checkError: error => {
        // ...
    },
    checkAuth: () => {
        return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    },
    getPermissions: () => {
        const role = localStorage.getItem('permissions');
        return role ? Promise.resolve(role) : Promise.reject();
    }
};
```
{% endraw %}

## Restricting Access to Resources or Views

Permissions can be useful to restrict access to resources or their views. To do so, you must use a function as the `<Admin>` only child. React-admin will call this function with the permissions returned by the `authProvider`.

```jsx
<Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
>
    {permissions => [
        // Restrict access to the edit and remove views to admin only
        <Resource
            name="customers"
            list={VisitorList}
            edit={permissions === 'admin' ? VisitorEdit : null}
            icon={VisitorIcon}
        />,
        // Only include the categories resource for admin users
        permissions === 'admin'
            ? <Resource name="categories" list={CategoryList} edit={CategoryEdit} icon={CategoryIcon} />
            : null,
    ]}
</Admin>
```

Note that the function returns an array of React elements. This is required to avoid having to wrap them in a container element which would prevent the `Admin` from working.

**Tip**: Even if that's possible, be careful when completely excluding a resource (like with the `categories` resource in this example) as it will prevent you to reference this resource in the other resource views, too.

## Restricting Access to Fields and Inputs

You might want to display some fields or inputs only to users with specific permissions. By default, react-admin calls the `authProvider` for permissions for each resource routes, and passes them to the `list`, `edit`, `create`, and `show` components.

Here is an example of a `Create` view with a conditional Input based on permissions:

{% raw %}
```jsx
export const UserCreate = ({ permissions, ...props }) =>
    <Create {...props}>
        <SimpleForm
            defaultValue={{ role: 'user' }}
        >
            <TextInput source="name" validate={[required()]} />
            {permissions === 'admin' &&
                <TextInput source="role" validate={[required()]} />}
        </SimpleForm>
    </Create>;
```
{% endraw %}

This also works inside an `Edition` view with a `TabbedForm`, and you can even hide a `FormTab` completely:

{% raw %}
```jsx
export const UserEdit = ({ permissions, ...props }) =>
    <Edit title={<UserTitle />} {...props}>
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
    </Edit>;
```
{% endraw %}

What about the `List` view, the `DataGrid`, `SimpleList` and `Filter` components? It works there, too. And in the next example, the `permissions` prop is passed down to a custom `filters` component.

```jsx
const UserFilter = ({ permissions, ...props }) =>
    <Filter {...props}>
        <TextInput
            label="user.list.search"
            source="q"
            alwaysOn
        />
        <TextInput source="name" />
        {permissions === 'admin' && <TextInput source="role" />}
    </Filter>;

export const UserList = ({ permissions, ...props }) =>
    <List
        {...props}
        filters={props => <UserFilter permissions={permissions} {...props} />}
    >
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            {permissions === 'admin' && <TextField source="role" />}
            {permissions === 'admin' && <EditButton />}
            <ShowButton />
        </Datagrid>
    </List>;
```

## Restricting Access to the Dashboard

React-admin injects the permissions into the component provided as a [`dashboard`](./Admin.md#dashboard), too:

```jsx
// in src/Dashboard.js
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';

export default ({ permissions }) => (
    <Card>
        <Title title="Dashboard" />
        <CardContent>Lorem ipsum sic dolor amet...</CardContent>
        {permissions === 'admin'
            ? <CardContent>Sensitive data</CardContent>
            : null
        }
    </Card>
);
```

## `usePermissions()` Hook

You might want to check user permissions inside a [custom page](./Admin.md#customroutes). That's the purpose of the `usePermissions()` hook, which calls the `authProvider.getPermissions()` method on mount, and returns the result when available:

```jsx
// in src/MyPage.js
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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

export default MyPage;

// in src/customRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import MyPage from './MyPage';

export default [
    <Route exact path="/baz" component={MyPage} />,
];
```

The `usePermissions` hook is optimistic: it doesn't block rendering during the `authProvider` call. In the above example, the `MyPage` component renders even before getting the response from the `authProvider`. To avoid a blink in the interface while the `authProvider` is answering, use the `loaded` return value of `usePermissions()`:

```jsx
const MyPage = () => {
    const { loaded, permissions } = usePermissions();
    return loaded ? (
        <Card>
            <CardContent>Lorem ipsum sic dolor amet...</CardContent>
            {permissions === 'admin' &&
                <CardContent>Sensitive data</CardContent>
            }
        </Card>
    ) : null;
}
```

## Restricting Access to a Menu

What if you want to check the permissions inside a [custom menu](./Admin.md#menu)? Much like getting permissions inside a custom page, you'll have to use the `usePermissions` hook:

```jsx
// in src/myMenu.js
import React from 'react';
import { MenuItemLink, usePermissions } from 'react-admin';

const Menu = ({ onMenuClick, logout }) => {
    const { permissions } = usePermissions();
    return (
        <div>
            <MenuItemLink to="/posts" primaryText="Posts" onClick={onMenuClick} />
            <MenuItemLink to="/comments" primaryText="Comments" onClick={onMenuClick} />
            {permissions === 'admin' &&
                <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuClick} />
            }
            {logout}
        </div>
    );
}
```
