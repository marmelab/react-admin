---
layout: default
title: "usePermissions"
---

# `usePermissions`

You might want to check user permissions inside a [custom page](./Admin.md#adding-custom-pages). That's the purpose of the `usePermissions()` hook, which calls the `authProvider.getPermissions()` method on mount, and returns the result when available.

## Usage

```jsx
// in src/MyPage.js
import * as React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { usePermissions } from 'react-admin';

const MyPage = () => {
    const { isLoading, permissions } = usePermissions();
    return isLoading
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

The `usePermissions` hook is optimistic: it doesn't block rendering during the `authProvider` call. In the above example, the `MyPage` component renders even before getting the response from the `authProvider`. To avoid a blink in the interface while the `authProvider` is answering, use the `isLoading` return value of `usePermissions()`:

```jsx
const MyPage = () => {
    const { isLoading, permissions } = usePermissions();
    if (isLoading) return null;
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

## RBAC

[The ra-rbac module](https://marmelab.com/ra-rbac)<img class="icon" src="./img/premium.svg" /> provides an alternative implementation of the `usePermissions` hook. It returns an array of permissions, resulting in the merge of the user permissions and the permissions from the user roles.

```jsx
import { usePermissions } from "@react-admin/ra-rbac";

const authProvider = {
    // ...
    getPermissions: () => Promise.resolve({
        permissions: [
            { action: ["read", "write"], resource: "users", record: { "id": "123" } },
        ],
        roles: ["reader"],
    }),
    getRoles: () => Promise.resolve({
        admin: [
            { action: "*", resource: "*" }
        ],
        reader: [
            { action: "read", resource: "*" }
        ]
    })
};

const { isLoading, permissions } = usePermissions();
// {
//      isLoading: false,
//      permissions: [
//          { action: "read", resource: "*" },
//          { action: ["read", "write"], resource: "users", record: { "id": "123" } },
//      ],
// };
```

`usePermissions` is used internally by most `ra-rbac` components, but you will probably not need to use it directly.

