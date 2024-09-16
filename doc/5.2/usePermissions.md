---
layout: default
title: "usePermissions"
---

# `usePermissions`

You might want to check user permissions inside a [custom page](./CustomRoutes.md). That's the purpose of the `usePermissions()` hook, which calls the `authProvider.getPermissions()` method on mount, and returns the result when available.

## Usage

```jsx
// in src/MyPage.js
import * as React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { usePermissions } from 'react-admin';

const MyPage = () => {
    const { isPending, permissions } = usePermissions();
    return isPending
        ? (<div>Waiting for permissions...</div>)
        : (
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
import * as React from "react";
import { Route } from 'react-router-dom';
import MyPage from './MyPage';

export default [
    <Route exact path="/baz" component={MyPage} />,
];
```

## Loading State

The `usePermissions` hook is optimistic: it doesn't block rendering during the `authProvider` call. In the above example, the `MyPage` component renders even before getting the response from the `authProvider`. To avoid a blink in the interface while the `authProvider` is answering, use the `isPending` return value of `usePermissions()`:

```jsx
const MyPage = () => {
    const { isPending, permissions } = usePermissions();
    if (isPending) return null;
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

## Refreshing permissions

Permissions are loaded when the app loads and then cached. If your application requires permissions to be refreshed, for example after a change modifying user permissions, you can use `refetch` function to trigger reload.

{% raw %}
```jsx
const GrantAdminPermissionsButton = () => {
    const record = useRecordContext();
    const [ update ] = useUpdate();
    const { refetch } = usePermissions();

    const handleClick = () => {
        update(
            "users",
            { id: record.id, data: { admin: true }, previousData: record },
            { onSuccess: refetch },
        );
    }

    return (
        <Button onClick={handleClick}>
            Make user an admin
        </Button>
    )
}
```
{% endraw %}

## RBAC

When using [the ra-rbac module](https://react-admin-ee.marmelab.com/documentation/ra-rbac)<img class="icon" src="./img/premium.svg" />, the `usePermissions` hook returns an array of permissions.

```jsx
import { usePermissions } from "react-admin";

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve([
        { action: "read", resource: "*" },
        { action: ["read", "write"], resource: "users", record: { "id": "123" } },
    ])
};

const { isPending, permissions } = usePermissions();
// {
//      isPending: false,
//      permissions: [
//          { action: "read", resource: "*" },
//          { action: ["read", "write"], resource: "users", record: { "id": "123" } },
//      ],
// };
```

`usePermissions` is used internally by most `ra-rbac` components, but you will probably not need to use it directly as react-admin provides [high-level RBAC components](./AuthRBAC.md#components).

