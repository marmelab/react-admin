---
layout: default
title: "Authorization"
---

# Authorization

Some applications may require to determine what level of access a particular authenticated user should have to secured resources. Since there are many different possible strategies (single role, multiple roles or rights, etc.), admin-on-rest simply provides hooks to execute your own authorization code.

By default, an admin-on-rest app doesn't require authorization. However, if needed, it will rely on the `authClient` introduced in the [Authentication](./Authentication.html) section.

## Configuring the Auth Client

A call to the `authClient` with the `AUTH_GET_PERMISSIONS` type will be made each time a component requires to check the user's permissions.

Following is an example where the `authClient` stores the user's role upon authentication, and returns it when called for a permissions check:

```jsx
// in src/authClient.js
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'admin-on-rest';
import decodeJwt from 'jwt-decode';

export default (type, params) => {
    if (type === AUTH_LOGIN) {
        const { username, password } = params;
        const request = new Request('https://mydomain.com/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
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
                localStorage.setItem('role', decodedToken.role);
            });
    }
    if (type === AUTH_LOGOUT) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        return Promise.resolve();
    }
    if (type === AUTH_ERROR) {
        // ...
    }
    if (type === AUTH_CHECK) {
        return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    }
    if (type === AUTH_GET_PERMISSIONS) {
        const role = localStorage.getItem('role');
        return Promise.resolve(role);
    }

    return Promise.reject('Unkown method');
};
```

## Restricting Access To Resources or Views

It's possible to restrict access to resources or their views inside the `Admin` component. To do so, you must specify a function as the `Admin` only child. This function will be called with the permissions returned by the `authClient`.

{% raw %}
```jsx
<Admin
    restClient={restClient}
    authClient={authClient}
>
    {permissions => [
        // Restrict access to the edit and remove views to admin only
        <Resource
            name="customers"
            list={VisitorList}
            edit={permissions === 'admin' ? VisitorEdit : null}
            remove={permissions === 'admin' ? VisitorDelete : null}
            icon={VisitorIcon}
        />,
        // Only include the categories resource for admin users
        permissions === 'admin'
            ? <Resource name="categories" list={CategoryList} edit={CategoryEdit} remove={Delete} icon={CategoryIcon} />
            : null,
    ]}
</Admin>
```
{% endraw %}

Note that the function returns an array of React elements. This is required to avoid having to wrap them in a container element which would prevent the `Admin` from working.

**Tip** Even if that's possible, be careful when completely excluding a resource (like with the `categories` resource in this example) as it will prevent you to reference them in the other resource views, too.

## Restricting Access To Fields And Inputs

You might want to display some fields, inputs or filters only to users with specific permissions. Just like for resources, pass a function as only child of the component, instead of a set of Fields and Inputs.

Here's an example inside a `Create` view with a `SimpleForm` and a custom `Toolbar`:

{% raw %}
```jsx
const UserCreateToolbar = ({ permissions, ...props }) =>
    <Toolbar {...props}>
        <SaveButton
            label="user.action.save_and_show"
            redirect="show"
            submitOnEnter={true}
        />
        {permissions === 'admin' &&
            <SaveButton
                label="user.action.save_and_add"
                redirect={false}
                submitOnEnter={false}
                raised={false}
            />}
    </Toolbar>;

export const UserCreate = ({ ...props }) =>
    <Create {...props}>
        {permissions =>
            <SimpleForm
                toolbar={<UserCreateToolbar permissions={permissions} />}
                defaultValue={{ role: 'user' }}
            >
                <TextInput source="name" validate={[required]} />
                {permissions === 'admin' &&
                    <TextInput source="role" validate={[required]} />}
            </SimpleForm>}
    </Create>;
```
{% endraw %}

This also works inside an `Edition` view with a `TabbedForm`, and you can hide a `FormTab` completely:

{% raw %}
```jsx
export const UserEdit = ({ ...props }) =>
    <Edit title={<UserTitle />} {...props}>
        {permissions =>
            <TabbedForm defaultValue={{ role: 'user' }}>
                <FormTab label="user.form.summary">
                    {permissions === 'admin' && <DisabledInput source="id" />}
                    <TextInput source="name" validate={required} />
                </FormTab>
                {permissions === 'admin' &&
                    <FormTab label="user.form.security">
                        <TextInput source="role" validate={required} />
                    </FormTab>}
            </TabbedForm>}
    </Edit>;
```
{% endraw %}

What about the `List` view, the `DataGrid`, `SimpleList` and `Filter` components? It works there, too.

{% raw %}
```jsx
const UserFilter = ({ ...props }) =>
    <Filter {...props}>
        {permissions => [
            <TextInput
                key="user.list.search"
                label="user.list.search"
                source="q"
                alwaysOn
            />,
            <TextInput key="name" source="name" />,
            permissions === 'admin' ? <TextInput source="role" /> : null,
        ]}
    </Filter>;

export const UserList = ({ ...props }) =>
    <List
        {...props}
        filters={<UserFilter />}
        sort={{ field: 'name', order: 'ASC' }}
    >
        {permissions =>
            <Responsive
                small={
                    <SimpleList
                        primaryText={record => record.name}
                        secondaryText={record =>
                            permissions === 'admin' ? record.role : null}
                    />
                }
                medium={
                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="name" />
                        {permissions === 'admin' && <TextField source="role" />}
                        {permissions === 'admin' && <EditButton />}
                        <ShowButton />
                    </Datagrid>
                }
            />}
    </List>;
```
{% endraw %}

Note that for the `Filter` component,  the function returns an array of React elements. This is required to avoid having to wrap them in a container element which would prevent the `Filter` from working.

## Restricting Access To Content In Custom Pages or Menus

What if you want to check the permissions inside a [Dashboard](./Admin.html#dashboard), a [custom page](./Admin.html#customroutes) or a [custom menu](./Admin.html#menu) ? Admin-on-rest provides two components for that: `WithPermission` and `SwitchPermissions`.

### WithPermission

The `WithPermission` component will only display its content if the user has the required permissions. Let's see an example with a custom menu where a custom page link should only be presented to admins:

{% raw %}
```jsx
// in src/Menu.js
import React from 'react';
import { MenuItemLink, WithPermission } from 'admin-on-rest';

export default ({ onMenuTap, logout }) => (
    <div>
        <MenuItemLink to="/posts" primaryText="Posts" onClick={onMenuTap} />
        <MenuItemLink to="/comments" primaryText="Comments" onClick={onMenuTap} />
        <WithPermission value="admin">
            <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuTap} />
        </WithPermission>
        {logout}
    </div>
);
```
{% endraw %}

The `WithPermission` component requires either a `value` with the permissions to check (could be a role, an array of roles, etc) or a `resolve` function.

An additional `exact` prop may be specified depending on your requirements. It determines whether the user must have **all** the required permissions or only some. If `false`, the default, we'll only check if the user has at least one of the required permissions.

You may bypass the default logic by specifying a function as the `resolve` prop. This function may return `true` or `false` directly or a promise resolving to either `true` or `false`. It will be called with an object having the following properties:

- `permissions`: the result of the `authClient` call.
- `value`: the value of the `value` prop if specified
- `exact`: the value of the `exact` prop if specified

An optional `loading` prop may be specified on the `WithPermission` component to pass a component to display while checking for permissions. It defaults to `null`.

**Tip**: Do not use the `WithPermission` component inside the others admin-on-rest components. It is only meant to be used in custom pages or components.

### SwitchPermissions

The `SwitchPermissions` component will display one of its `Permission` children depending on the permissions returned by the `authClient`. It accepts two optional props:

- `loading`: A component to display while checking for permissions. Defaults to `null`.
- `notFound`: A component to display when no match was found while checking the permissions. Default to `null`.

The `Permission` component requires either a `value` with the permissions to check (could be a role, an array of roles, etc) or a `resolve` function.

An additional `exact` prop may be specified depending on your requirements. It determines whether the user must have **all** the required permissions or only some. If `false`, the default, we'll only check if the user has at least one of the required permissions.

You may bypass the default logic by specifying a function as the `resolve` prop. This function may return `true` or `false` directly or a promise resolving to either `true` or `false`. It will be called with an object having the following properties:

- `permissions`: the result of the `authClient` call.
- `value`: the value of the `value` prop if specified
- `exact`: the value of the `exact` prop if specified

If multiple `Permission` match, only the first one will be displayed.

Here's an example inside a `DashBoard`:

```jsx
// in src/Dashboard.js
import React from 'react';
import BenefitsSummary from './BenefitsSummary';
import BenefitsDetailsWithSensitiveData from './BenefitsDetailsWithSensitiveData';
import { ViewTitle } from 'admin-on-rest/lib/mui';

export default () => (
    <Card>
        <ViewTitle title="Dashboard" />

        <SwitchPermissions>
            <Permission value="associate">
                <BenefitsSummary />
            </Permission>
            <Permission value="boss">
                <BenefitsDetailsWithSensitiveData />
            </Permission>
        </SwitchPermissions>
    </Card>
);
```

**Tip**: Do not use the `SwitchPermissions` component inside the others admin-on-rest components. It is only meant to be used in custom pages or components.

