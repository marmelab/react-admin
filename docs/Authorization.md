---
layout: default
title: "Authorization"
---

# Authorization

Some applications may require to determine what level of access a particular authenticated user should have to secured resources. Since there are many different possible strategies (single role, multiple roles or rights, etc.), react-admin simply provides hooks to execute your own authorization code.

By default, a react-admin app doesn't require authorization. However, if needed, it will rely on the `authProvider` introduced in the [Authentication](./Authentication.md) section.

## Configuring the Auth Provider

A call to the `authProvider` with the `AUTH_GET_PERMISSIONS` type will be made each time a component requires to check the user's permissions.

Following is an example where the `authProvider` stores the user's role upon authentication, and returns it when called for a permissions check:

{% raw %}
```jsx
// in src/authProvider.js
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_GET_PERMISSIONS } from 'react-admin';
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
        return role ? Promise.resolve(role) : Promise.reject();
    }
    return Promise.reject('Unkown method');
};
```
{% endraw %}

## Restricting Access to Resources or Views

It's possible to restrict access to resources or their views inside the `Admin` component. To do so, you must specify a function as the `Admin` only child. This function will be called with the permissions returned by the `authProvider`.

{% raw %}
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
{% endraw %}

Note that the function returns an array of React elements. This is required to avoid having to wrap them in a container element which would prevent the `Admin` from working.

**Tip** Even if that's possible, be careful when completely excluding a resource (like with the `categories` resource in this example) as it will prevent you to reference them in the other resource views, too.

## Restricting Access to Fields and Inputs

You might want to display some fields or inputs only to users with specific permissions. Those permissions are retrieved for each route and will provided to your component as a `permissions` prop.

Each route will call the `authProvider` with the `AUTH_GET_PERMISSIONS` type and some parameters including the current location and route parameters. It's up to you to return whatever you need to check inside your component such as the user's role, etc.

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
                variant="flat"
            />}
    </Toolbar>;

export const UserCreate = ({ permissions, ...props }) =>
    <Create {...props}>
        <SimpleForm
            toolbar={<UserCreateToolbar permissions={permissions} />}
            defaultValue={{ role: 'user' }}
        >
            <TextInput source="name" validate={[required()]} />
            {permissions === 'admin' &&
                <TextInput source="role" validate={[required()]} />}
        </SimpleForm>
    </Create>;
```
{% endraw %}

**Tip** Note how the `permissions` prop is passed down to the custom `toolbar` component.

This also works inside an `Edition` view with a `TabbedForm`, and you can hide a `FormTab` completely:

{% raw %}
```jsx
export const UserEdit = ({ permissions, ...props }) =>
    <Edit title={<UserTitle />} {...props}>
        <TabbedForm defaultValue={{ role: 'user' }}>
            <FormTab label="user.form.summary">
                {permissions === 'admin' && <DisabledInput source="id" />}
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

What about the `List` view, the `DataGrid`, `SimpleList` and `Filter` components? It works there, too.

{% raw %}
```jsx
const UserFilter = ({ permissions, ...props }) =>
    <Filter {...props}>
        <TextInput
            label="user.list.search"
            source="q"
            alwaysOn
        />
        <TextInput source="name" />
        {permissions === 'admin' ? <TextInput source="role" /> : null}
    </Filter>;

export const UserList = ({ permissions, ...props }) =>
    <List
        {...props}
        filters={<UserFilter permissions={permissions} />}
        sort={{ field: 'name', order: 'ASC' }}
    >
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
        />
    </List>;
```
{% endraw %}

**Tip** Note how the `permissions` prop is passed down to the custom `filters` component.

## Restricting Access to Content Inside a Dashboard

The component provided as a [`dashboard`]('./Admin.md#dashboard) will receive the permissions in its props too:

{% raw %}
```jsx
// in src/Dashboard.js
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { ViewTitle } from 'react-admin';

export default ({ permissions }) => (
    <Card>
        <ViewTitle title="Dashboard" />
        <CardContent>Lorem ipsum sic dolor amet...</CardContent>
        {permissions === 'admin'
            ? <CardContent>Sensitive data</CardContent>
            : null
        }
    </Card>
);
```
{% endraw %}

## Restricting Access to Content Inside Custom Pages

You might want to check user permissions inside a [custom pages](./Admin.md#customroutes). You'll have to use the `WithPermissions` component for that. It will ensure the user is authenticated then call the `authProvider` with the `AUTH_GET_PERMISSIONS` type and the `authParams` you specify:

{% raw %}
```jsx
// in src/MyPage.js
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { ViewTitle, WithPermissions } from 'react-admin';
import { withRouter } from 'react-router-dom';

const MyPage = ({ permissions }) => (
    <Card>
        <ViewTitle title="My custom page" />
        <CardContent>Lorem ipsum sic dolor amet...</CardContent>
        {permissions === 'admin'
            ? <CardContent>Sensitive data</CardContent>
            : null
        }
    </Card>
)
const MyPageWithPermissions = ({ location, match }) => (
    <WithPermissions
        authParams={{ key: match.path, params: route.params }}
        // location is not required but it will trigger a new permissions check if specified when it changes
        location={location}
        render={({ permissions }) => <MyPage permissions={permissions} /> }
    />
);

export default MyPageWithPermissions;

// in src/customRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import Foo from './Foo';
import Bar from './Bar';
import Baz from './Baz';
import MyPageWithPermissions from './MyPage';

export default [
    <Route exact path="/foo" component={Foo} />,
    <Route exact path="/bar" component={Bar} />,
    <Route exact path="/baz" component={Baz} noLayout />,
    <Route exact path="/baz" component={MyPageWithPermissions} />,
];
```
{% endraw %}

## Restricting Access to Content in Custom Menu

What if you want to check the permissions inside a [custom menu](./Admin.md#menu) ? Much like getting permissions inside a custom page, you'll have to use the `WithPermissions` component:

{% raw %}
```jsx
// in src/myMenu.js
import React from 'react';
import { connect } from 'react-redux';
import { MenuItemLink, WithPermissions } from 'react-admin';

const Menu = ({ onMenuClick, logout, permissions }) => (
    <div>
        <MenuItemLink to="/posts" primaryText="Posts" onClick={onMenuClick} />
        <MenuItemLink to="/comments" primaryText="Comments" onClick={onMenuClick} />
        <WithPermissions
            render={({ permissions }) => (
                permissions === 'admin'
                    ? <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuClick} />
                    : null
            )}
        />
        {logout}
    </div>
);
```
{% endraw %}
