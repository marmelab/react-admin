---
title: "usePermissions"
storybook_path: ra-core-auth-usepermissions--no-auth-provider
---

You might want to check user permissions inside a [custom page](../app-configuration/CustomRoutes.md). That's the purpose of the `usePermissions()` hook, which calls the `authProvider.getPermissions()` method on mount, and returns the result when available.

## Usage

```jsx
// in src/MyPage.js
import * as React from "react";
import { usePermissions } from 'ra-core';

const MyPage = () => {
    const { isPending, permissions } = usePermissions();
    return isPending
        ? (<div>Waiting for permissions...</div>)
        : (
            <div className="card">
                <div className="card-content">Lorem ipsum sic dolor amet...</div>
                {permissions === 'admin' &&
                    <div className="card-content">Sensitive data</div>
                }
            </div>
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
        <div className="card">
            <div className="card-content">Lorem ipsum sic dolor amet...</div>
            {permissions === 'admin' &&
                <div className="card-content">Sensitive data</div>
            }
        </div>
    );
}
```

## Refreshing permissions

Permissions are loaded when the app loads and then cached. If your application requires permissions to be refreshed, for example after a change modifying user permissions, you can use `refetch` function to trigger reload.

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
        <button onClick={handleClick}>
            Make user an admin
        </button>
    )
}
```
