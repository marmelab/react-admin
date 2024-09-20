---
layout: default
title: "useCanAccessResources"
---

# `useCanAccessResources`

This hook calls the `authProvider.canAccess()` method on mount for an array of resources, an action, and optionally a record. It's ideal for checking the access to several resources in parallel (e.g. all the columns of a `<Datagrid>`). 

`useCanAccessResources` returns an object containing a `canAccess` object, which is a map of the provided resources where the value is set to `true` when users have access to it. 

## Usage

`useCanAccessResources` takes an object `{ action, resources, record }` as argument. The `source` parameter is an array of the record properties names for which to check the access permission. In addition to react-query result properties, it returns a `canAccess` object that has a property for each provided source determining whether the user has access to it.

```jsx
import { useCanAccessResources, SimpleList } from 'react-admin';

const UserList = ({ record }) => {
    const { isPending, canAccess } = useCanAccessResources({
        action: 'delete',
        resource: ['users.id', 'users.name', 'users.email'],
        record,
    });
    if (isPending) {
        return null;
    }
    return (
        <SimpleList
             primaryText={record => canAccess.name ? record.name : ''}
             secondaryText={record => canAccess.email ? record.email : ''}
             tertiaryText={record => canAccess.id ? record.id : ''}
         />
    );
};
```

## Parameters

`useCanAccessResources` expects a single parameter object with the following properties:

| Name | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `resources` | Required | `string[]` | - | An array of the resources for which to check access, e.g `['users.id', 'users.title']` |
| `action` | Required | `string` | - | The action to check, e.g. 'read', 'list', 'export', 'delete', etc. |
| `record` | Optional | `object` | - | The record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }` |

