---
layout: default
title: "useLogout"
---

# `useLogout`

`useLogout()` returns a callback that logs the user out by calling `authProvider.logout()`.

## Usage

Use it to build a custom Logout button and use it in a custom UserMenu, like the following: 

```jsx
// in src/MyLayout.js
import * as React from 'react';
import { forwardRef } from 'react';
import { AppBar, Layout, UserMenu, useLogout } from 'react-admin';
import { MenuItem } from '@mui/material';
import ExitIcon from '@mui/icons-material/PowerSettingsNew';

// It's important to pass the ref to allow Material UI to manage the keyboard navigation
const MyLogoutButton = forwardRef((props, ref) => {
    const logout = useLogout();
    const handleClick = () => logout();
    return (
        <MenuItem
            onClick={handleClick}
            ref={ref}
            // It's important to pass the props to allow Material UI to manage the keyboard navigation
            {...props}
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

const MyAppBar = () => <AppBar userMenu={<UserMenu />} />;

const MyLayout = ({ children }) => (
    <Layout appBar={MyAppBar}>
        {children}
    </Layout>
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
