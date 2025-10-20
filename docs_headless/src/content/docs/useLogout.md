---
title: "useLogout"
---

`useLogout()` returns a callback that logs the user out by calling `authProvider.logout()`.

## Usage

Use it to build a custom Logout button and use it in a custom UserMenu, like the following: 

```jsx
// in src/MyLayout.js
import * as React from 'react';
import { useLogout } from 'ra-core';

const MyLogoutButton = (props) => {
    const logout = useLogout();
    const handleClick = () => logout();
    return (
        <button
            onClick={handleClick}
            {...props}
        >
            Logout
        </button>
    );
};

const MyUserMenu = () => (
    <div className="user-menu">
        <MyLogoutButton />
    </div>
);

const MyAppBar = () => (
    <header className="app-bar">
        <MyUserMenu />
    </header>
);

const MyLayout = ({ children }) => (
    <div className="layout">
        <MyAppBar />
        <main>{children}</main>
    </div>
);

export default MyLayout;
```

Then pass the layout to your admin:

```jsx
// in src/App.js
import * as React from "react";
import { CoreAdmin } from 'ra-core';

import MyLayout from './MyLayout';

const App = () => (
    <CoreAdmin layout={MyLayout} authProvider={authProvider}>
    ...
    </CoreAdmin>
);
```
