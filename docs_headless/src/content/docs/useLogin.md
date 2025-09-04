---
title: "useLogin"
---

This hook returns a callback allowing to call `authProvider.login()`. It's used in Login forms.

## Usage

Here is how to build a custom Login page based on email rather than username:

```jsx
// in src/MyLoginPage.js
import * as React from 'react';
import { useState } from 'react';
import { useLogin, useNotify } from 'ra-core';

const MyLoginPage = ({ theme }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = e => {
        e.preventDefault();
        // will call authProvider.login({ email, password })
        login({ email, password }).catch(() =>
            notify('Invalid email or password')
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                name="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
        </form>
    );
};

export default MyLoginPage;
```

Then pass the custom Login form to `<CoreAdmin>`, as follows:

```jsx
// in src/App.js
import * as React from "react";
import { CoreAdmin } from 'ra-core';

import MyLoginPage from './MyLoginPage';

const App = () => (
    <CoreAdmin loginPage={MyLoginPage} authProvider={authProvider}>
    ...
    </CoreAdmin>
);
```
