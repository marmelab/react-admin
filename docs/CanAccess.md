---
layout: default
title: "CanAccess"
---

# `CanAccess`

This component calls the `authProvider.canAccess()` method on mount for a provided resource and action (and optionally a record). It will only display its children when users are authorized.

## Usage

```jsx
import { CanAccess, Edit, SimpleForm } from 'react-admin';

const UserEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="lastName">
                <TextInput source="firstName">
                <CanAccess action="edit" resource="users.role">
                    <SelectInput source="role" choices={['admin', 'user']}>
                </CanAccess>
            </SimpleForm>
        </Edit>
    )
};
```

`<CanAccess>` will call the `authProvider.canAccess` method with the following parameters: `{ action: "edit", resource: "users.role", record: {} }` where `record` will be the currently edited record.

## Parameters

`<CanAccess>` expects the following props:

| Name           | Required | Type           | Default                               | Description |
| -------------- | -------- | -------------- | --------------------- | --- |
| `action`       | Required | `string`       | -                     | The action to check, e.g. 'read', 'list', 'export', 'delete', etc. |
| `resource`     | Optional | `string`       | ResourceContext value | The resource to check, e.g. 'users', 'comments', 'posts', etc. |
| `record`       | Optional | `object`       | RecordContext value   | The record to check. If passed, the child only renders if the user has access to that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }` |
| `loading`      | Optional | `ReactElement` | -                     | The element displayed while the `canAccess` call is pending |
| `unauthorized` | Optional | `ReactElement` | -                     | The element displayed when users don't have access to the resource |


