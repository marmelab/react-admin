---
layout: default
title: "LockStatus"
---

# `<LockStatus>`

`<LockStatus>` is a component that displays the lock status of the current record. It allows to visually indicate whether the record is locked or not, by the current user or not, and provides an easy way to lock or unlock the record.

<video controls autoplay playsinline muted loop>
  <source src="https://registry.marmelab.com/assets/LockStatus.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## Usage

Use `<LockStatus>` e.g. in a toolbar, to let the user know the lock status of the current record:

{% raw %}
```tsx
import { Toolbar, SaveButton } from 'react-admin';
import { LockStatus } from '@react-admin/ra-realtime';

const CustomToolbar = () => {
    return (
        <Toolbar>
            <SaveButton sx={{ mr: 1 }} />
            <LockStatus />
        </Toolbar>
    );
};
```
{% endraw %}

You can also use it in a DataTable to show the lock status of each record:

```tsx
import { List, DataTable } from 'react-admin';
import { LockStatus } from '@react-admin/ra-realtime';

const PostList = () => {
    return (
        <List>
            <DataTable>
                <DataTable.Col source="id" />
                <DataTable.Col source="title" />
                <DataTable.Col source="headline" />
                <DataTable.Col source="author" />
                <DataTable.Col label="Lock">
                    <LockStatus hideWhenUnlocked />
                </DataTable.Col>
            </DataTable>
        </List>
    );
};
```

**Tip:** You can use the `hideWhenUnlocked` prop to hide the lock status when the record is not locked. This is useful to avoid showing too many lock icons in the DataTable when most records are not locked.

## Props

| Name                    | Required | Type         | Default Value                     | Description                                                                                   |
| ----------------------- | -------- | ------------ | --------------------------------- | --------------------------------------------------------------------------------------------- |
| `hideWhenUnlocked`      | No       | `boolean`    | -                                 | Set to true to hide the lock status when the record is not locked.                            |
| `identity`              | No       | `Identifier` | From `AuthProvider.getIdentity()` | An identifier for the user who owns the lock.                                                 |
| `resource`              | No       | `string`     | From `ResourceContext`            | The resource name (e.g. `'posts'`).                                                           |
| `id`                    | No       | `Identifier` | From `RecordContext`              | The record id (e.g. `123`).                                                                   |
| `meta`                  | No       | `object`     | -                                 | Additional metadata forwarded to the dataProvider `lock()`, `unlock()` and `getLock()` calls. |
| `lockMutationOptions`   | No       | `object`     | -                                 | `react-query` mutation options, used to customize the lock side-effects.                      |
| `unlockMutationOptions` | No       | `object`     | -                                 | `react-query` mutation options, used to customize the unlock side-effects.                    |
| `queryOptions`          | No       | `object`     | -                                 | `react-query` query options, used to customize the lock query side-effects.                   |

## Customizing the Tooltip Messages

You can customize the tooltip messages displayed by `<LockStatus>` by overriding the following i18n keys in your translations:
-  `ra-realtime.locks.status.locked_by_you`: The tooltip message when the record is locked by the current user.
-  `ra-realtime.locks.status.locked_by_another_user`: The tooltip message when the record is locked by another user.
-  `ra-realtime.locks.status.unlocked`: The tooltip message when the record is unlocked.