---
layout: default
title: "useLogout"
---

# `useLogout`

Just like `useLogin()`, `useLogout()` returns a callback that you can use to call `authProvider.logout()`. Use it to build a custom Logout button and use it in a custom UserMenu, like the following: 

```jsx
// in src/MyLayout.js
import * as React from 'react';
import { forwardRef } from 'react';
import { AppBar, Layout, UserMenu, useLogout } from 'react-admin';
import { MenuItem } from '@mui/material';
import ExitIcon from '@mui/icons-material/PowerSettingsNew';

const MyLogoutButton = forwardRef((props, ref) => {
    const logout = useLogout();
    const handleClick = () => logout();
    return (
        <MenuItem
            onClick={handleClick}
            ref={ref}
        >
            <ExitIcon /> Logout
        </MenuItem>
    );
});

const MyUserMenu = () => (
    <UserMenu>
        <MyLogoutButton />
    </UserMenu>
);

const MyAppBar = () => (
    <AppBar userMenu={<UserMenu />} />
);

const MyLayout = () => (
    <Layout appBar={MyAppBar} />
);

export default MyLayout;
```

Then pass the layout to you admin:

```jsx
// in src/App.js
import * as React from "react";
import { Admin } from 'react-admin';

import MyLayout from './MyLayout';

const App = () => (
    <Admin layout={MyLayout} authProvider={authProvider}>
    ...
    </Admin>
);
```
