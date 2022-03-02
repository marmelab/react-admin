---
layout: default
title: "usePermissions"
---

# `usePermissions`

You might want to check user permissions inside a [custom page](./Admin.md#adding-custom-pages). That's the purpose of the `usePermissions()` hook, which calls the `authProvider.getPermissions()` method on mount, and returns the result when available:

```jsx
// in src/MyPage.js
import * as React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { usePermissions } from 'react-admin';

const MyPage = () => {
    const { loading, permissions } = usePermissions();
    return loading
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

The `usePermissions` hook is optimistic: it doesn't block rendering during the `authProvider` call. In the above example, the `MyPage` component renders even before getting the response from the `authProvider`. To avoid a blink in the interface while the `authProvider` is answering, use the `loaded` return value of `usePermissions()`:

```jsx
const MyPage = () => {
    const { loaded, permissions } = usePermissions();
    return loaded ? (
        <Card>
            <CardContent>Lorem ipsum sic dolor amet...</CardContent>
            {permissions === 'admin' &&
                <CardContent>Sensitive data</CardContent>
            }
        </Card>
    ) : null;
}
```
