---
layout: default
title: "useCanAccess"
---

# `useCanAccess`

This hook controls access to a resource and action (and, optionally, a record). It calls the `authProvider.canAccess()` method on mount and returns an object containing a `canAccess` boolean set to `true` if users can access the resource and action.

It is part of the [Access Control](./Permissions.md#access-control) mechanism in react-admin.

## Usage

`useCanAccess` takes an object `{ action, resource, record }` as argument. It returns an object describing the state of the request. As calls to the `authProvider` are asynchronous, the hook returns a `isPending` state in addition to the `canAccess` key.

```jsx
import { useCanAccess, useRecordContext, DeleteButton } from 'react-admin';

const DeleteUserButton = () => {
    const record = useRecordContext();
    const { isPending, canAccess, error } = useCanAccess({
        action: 'delete',
        resource: 'users',
        record
    });
    if (isPending || !canAccess) return null;
    if (error) return <div>{error.message}</div>
    return <DeleteButton record={record} resource="users" />;
};
```

## Parameters

`useCanAccess` expects a single parameter object with the following properties:

| Name | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `action` | Required | `string` | - | The action to check, e.g. 'read', 'list', 'export', 'delete', etc. |
| `resource` | Options | `string` | ResourceContext value | The resource to check, e.g. 'users', 'comments', 'posts', etc. |
| `record` | Optional | `object` | RecordContext value | The record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }` |

## Callback Version

`useCanAccessCallback` allows to check access to a resource and action on an event instead of on mount. It returns a `checkAccess` async function that you can call in an event handler. 

The `checkAccess` function expects an argument with the shape `{ action, resource, record }`. This function resolves to a boolean indicating whether users can access the provided resource and action.

```jsx
import { Datagrid, List, TextField, useCanAccessCallback } from 'react-admin';

export const UserList = () => {
    const checkAccess = useCanAccessCallback();
    const handleRowClick = async (id: Identifier, resource: string, record: Record) => {
        try {
            const canAccess = await checkAccess({ resource: 'users', action: 'edit', record });
            return canAccess ? "edit" : "show";
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <List>
            <Datagrid onClick={handleRowClick}>
                <TextField source="id" />
                <TextField source="name" />
                <TextField source="email" />
            </Datagrid>
        </List>
    );
};
```

## Multiple Resources

`useCanAccessResources` can check the access to several resources in parallel (e.g. all the columns of a `<Datagrid>`) instead of just one for `useCanAccess`.

It takes an object `{ action, resources, record }` as argument. The `resources` parameter is an array of resource names for which to check the access permission. In addition to react-query result properties, it returns a `canAccess` object with a property for each provided resource, determining whether the user can access it.

```jsx
import { useCanAccessResources, SimpleList } from 'react-admin';

const UserList = () => {
    const { isPending, canAccess } = useCanAccessResources({
        action: 'delete',
        resources: ['users.id', 'users.name', 'users.email'],
    });
    if (isPending) {
        return null;
    }
    return (
        <SimpleList
             primaryText={record => canAccess['users.name'] ? record.name : ''}
             secondaryText={record => canAccess['users.email'] ? record.email : ''}
             tertiaryText={record => canAccess['users.id'] ? record.id : ''}
         />
    );
};
```

## Logout on Failure

`useRequireAccess` is an alternative to `useCanAccess` that logs out the user if the access check fails. It takes the same parameters as `useCanAccess`.

For instance, here's how you can protect a [custom route](./CustomRoutes.md) for editing users settings:

```tsx
import { useRequireAccess } from 'react-admin';

export export const SettingsPage = () => {
    const { isPending } = useRequireAccess({
        action: 'edit',
        resource: 'settings',
    });
    if (isPending) return null;
    return <p>Protected content</p>;
};
```
