---
layout: default
title: "useCanAccessRecordSources"
---

# `useCanAccessRecordSources`

This hook calls the authProvider.canAccess() method using react-query for a provided resource, action and sources (and optionally a record). It allows to check the access permissions of multiple record properties.

## Usage

`useCanAccessRecordSources` takes an object `{ action, resource, record, sources }` as argument. The `source` parameter is an array of the record properties names for which to check the access permission. In addition to react-query result properties, it returns a `canAccess` object that has a property for each provided source determining whether the user has access to it.

```jsx
import { useCanAccessRecordSources, SimpleList } from 'react-admin';

const UserList = ({ record }) => {
    const { isPending, canAccess } = useCanAccessRecordSources({
        action: 'delete',
        resource: 'users',
        record,
        sources: ['id', 'name', 'email']
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

`useCanAccessRecordSources` expects a single parameter object with the following properties:

| Name | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `resource` | Required | `string` | - | The resource to check, e.g. 'users', 'comments', 'posts', etc. |
| `action` | Required | `string` | - | The action to check, e.g. 'read', 'list', 'export', 'delete', etc. |
| `record` | Optional | `object` | - | The record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }` |
| `sources` | Optional | `string[]` | - | An array of the record properties names for which to check access |

