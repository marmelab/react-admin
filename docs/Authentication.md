---
layout: default
title: "Authentication"
---

# Authentication

![Logout button](./img/login.gif)

React-admin lets you secure your admin app with the authentication strategy of your choice. Since there are many different possible strategies (Basic Auth, JWT, OAuth, etc.), react-admin simply provides hooks to execute your own authentication code.

## The `authProvider`

By default, react-admin apps don't require authentication. To restrict access to the admin, pass an `authProvider` to the `<Admin>` component.

```jsx
// in src/App.js
import authProvider from './authProvider';

const App = () => (
    <Admin authProvider={authProvider}>
        ...
    </Admin>
);
```

What's an `authProvider`? Just like a `dataProvider`, an `authProvider` is a function that react-admin calls when needed, and that returns a Promise. The signature of an `authProvider` is:

```js
// in src/authProvider.js

// type is one of AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK, and AUTH_GET_PERMISSIONS 
const authProvider = (type, params) => Promise.resolve;

export default authProvider;
```

Let's see when react-admin calls the `authProvider`, and how to write one for your own authentication provider. 

## Login Configuration

Once an admin has an `authProvider`, react-admin enables a new page on the `/login` route, which displays a login form asking for username and password.

![Default Login Form](./img/login-form.png)

Upon submission, this form calls the `authProvider` with the `AUTH_LOGIN` type, and `{ login, password }` as parameters. It's the ideal place to authenticate the user, and store their credentials.

For instance, to query an authentication route via HTTPS and store the credentials (a token) in local storage, configure `authProvider` as follows:

```jsx
// in src/authProvider.js
import { AUTH_LOGIN } from 'react-admin';

const authProvider = (type, params) => {
    if (type === AUTH_LOGIN) {
        const { username, password } = params;
        const request = new Request('https://mydomain.com/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ token }) => {
                localStorage.setItem('token', token);
            });
    }
    return Promise.resolve();
}

export default authProvider;
```

Once the promise resolves, the login form redirects to the previous page, or to the admin index if the user just arrived.

**Tip**: It's a good idea to store credentials in `localStorage`, as in this example, to avoid reconnection when opening a new browser tab. But this makes your application [open to XSS attacks](http://www.redotheweb.com/2015/11/09/api-security.html), so you'd better double down on security, and add an `httpOnly` cookie on the server side, too.

## Sending Credentials to the API

Now that the user has logged in, you can use their credentials to communicate with the `dataProvider`. For that, you have to tweak, this time, the `dataProvider` function. As explained in the [Data providers documentation](DataProviders.md#adding-custom-headers), `simpleRestProvider` and `jsonServerProvider` take an `httpClient` as second parameter. That's the place where you can change request headers, cookies, etc.

For instance, to pass the token obtained during login as an `Authorization` header, configure the Data Provider as follows:

```jsx
import { fetchUtils, Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
}
const dataProvider = simpleRestProvider('http://localhost:3000', httpClient);

const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        ...
    </Admin>
);
```

Now the admin is secured: The user can be authenticatded and use their credentials to communicate with a secure API. 

If you have a custom REST client, don't forget to add credentials yourself.

## Logout Configuration

If you provide an `authProvider` prop to `<Admin>`, react-admin displays a logout button in the top bar (or in the menu on mobile). When the user clicks on the logout button, this calls the `authProvider` with the `AUTH_LOGOUT` type and removes potentially sensitive data from the Redux store. Then the user gets redirected to the login page.

So it's the responsibility of the `authProvider` to cleanup the current authentication data. For instance, if the authentication was a token stored in local storage, here the code to remove it:

```jsx
// in src/authProvider.js
import { AUTH_LOGIN, AUTH_LOGOUT } from 'react-admin';

export default (type, params) => {
    if (type === AUTH_LOGIN) {
        // ...
    }
    if (type === AUTH_LOGOUT) {
        localStorage.removeItem('token');
        return Promise.resolve();
    }
    return Promise.resolve();
};
```

![Logout button](./img/logout.gif)

The `authProvider` is also a good place to notify the authentication API that the user credentials are no longer valid after logout.

Note that the `authProvider` can return the url to which the user will be redirected once logged out. By default, this is the `/login` route.

## Catching Authentication Errors On The API

If the API requires authentication, and the user credentials are missing in the request or invalid, the API usually answers with an HTTP error code 401 or 403.

Fortunately, each time the API returns an error, react-admin calls the `authProvider` with the `AUTH_ERROR` type. Once again, it's up to you to decide which HTTP status codes should let the user continue (by returning a resolved promise) or log them out (by returning a rejected promise).

For instance, to redirect the user to the login page for both 401 and 403 codes:

```jsx
// in src/authProvider.js
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR } from 'react-admin';

export default (type, params) => {
    if (type === AUTH_LOGIN) {
        // ...
    }
    if (type === AUTH_LOGOUT) {
        // ...
    }
    if (type === AUTH_ERROR) {
        const status  = params.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            return Promise.reject();
        }
        return Promise.resolve();
    }
    return Promise.resolve();
};
```

Note that react-admin will call the `authProvider` with the `AUTH_LOGOUT` type before redirecting when you reject the promise and will use the url which may have been return by the call to `AUTH_LOGOUT`.

## Checking Credentials During Navigation

Redirecting to the login page whenever a REST response uses a 401 status code is usually not enough, because react-admin keeps data on the client side, and could display stale data while contacting the server - even after the credentials are no longer valid.

Fortunately, each time the user navigates, react-admin calls the `authProvider` with the `AUTH_CHECK` type, so it's the ideal place to validate the credentials.

For instance, to check for the existence of the token in local storage:

```jsx
// in src/authProvider.js
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';

export default (type, params) => {
    if (type === AUTH_LOGIN) {
        // ...
    }
    if (type === AUTH_LOGOUT) {
        // ...
    }
    if (type === AUTH_ERROR) {
        // ...
    }
    if (type === AUTH_CHECK) {
        return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    }
    return Promise.resolve();
};
```

If the promise is rejected, react-admin redirects by default to the `/login` page. You can override where to redirect the user by passing an argument with a `redirectTo` property to the rejected promise:

```jsx
// in src/authProvider.js
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';

export default (type, params) => {
    if (type === AUTH_LOGIN) {
        // ...
    }
    if (type === AUTH_LOGOUT) {
        // ...
    }
    if (type === AUTH_ERROR) {
        // ...
    }
    if (type === AUTH_CHECK) {
        return localStorage.getItem('token')
            ? Promise.resolve()
            : Promise.reject({ redirectTo: '/no-access' });
    }
    return Promise.resolve();
};
```

Note that react-admin will call the `authProvider` with the `AUTH_LOGOUT` type before redirecting. If you specify the `redirectTo` here, it will override the url which may have been return by the call to `AUTH_LOGOUT`.

**Tip**: For the `AUTH_CHECK` call, the `params` argument contains the `resource` name, so you can implement different checks for different resources:

```jsx
// in src/authProvider.js
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';

export default (type, params) => {
    if (type === AUTH_LOGIN) {
        // ...
    }
    if (type === AUTH_LOGOUT) {
        // ...
    }
    if (type === AUTH_ERROR) {
        // ...
    }
    if (type === AUTH_CHECK) {
        const { resource } = params;
        if (resource === 'posts') {
            // check credentials for the posts resource
        }
        if (resource === 'comments') {
            // check credentials for the comments resource
        }
    }
    return Promise.resolve();
};
```

**Tip**: In addition to `AUTH_LOGIN`, `AUTH_LOGOUT`, `AUTH_ERROR`, and `AUTH_CHECK`, react-admin calls the `authProvider` with the `AUTH_GET_PERMISSIONS` type to check user permissions. It's useful to enable or disable features on a per user basis. Read the [Authorization Documentation](./Authorization.md) to learn how to implement that type.

## Customizing The Login and Logout Components

Using `authProvider` is enough to implement a full-featured authorization system if the authentication relies on a username and password.

But what if you want to use an email instead of a username? What if you want to use a Single-Sign-On (SSO) with a third-party authentication service? What if you want to use two-factor authentication?

For all these cases, it's up to you to implement your own `LoginPage` component, which will be displayed under the `/login` route instead of the default username/password form, and your own `LogoutButton` component, which will be displayed in the sidebar. Pass both these components to the `<Admin>` component:

**Tip**: Use the `useLogin` and `useLogout` hooks in your custom `Login` and `Logout` components.

```jsx
// in src/MyLoginPage.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLogin } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';

const MyLoginPage = ({ theme }) => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const submit = (e) => {
        e.preventDefault();
        login({ email, password });
    }

    return (
        <ThemeProvider theme={theme}>
            <form onSubmit={submit}>
                <input name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} /> 
                <input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </form>
        </ThemeProvider>
    );
};

export default MyLoginPage;

// in src/MyLogoutButton.js
import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLogout } from 'react-admin';
import MenuItem from '@material-ui/core/MenuItem';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';

const MyLogoutButton = forwardRef((props, ref) => {
    const dispatch = useDispatch();
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

export default MyLogoutButton;

// in src/App.js
import MyLoginPage from './MyLoginPage';
import MyLogoutButton from './MyLogoutButton';

const App = () => (
    <Admin loginPage={MyLoginPage} logoutButton={MyLogoutButton} authProvider={authProvider}>
    ...
    </Admin>
);
```

**Tip**: By default, react-admin redirects the user to '/login' after they log out. This can be changed by passing the url to redirect to as parameter to the `logout()` function:

```diff
// in src/MyLogoutButton.js
// ...
-   const handleClick = () => logout();
+   const handleClick = () => logout('/custom-login');
```

## `useAuthenticated()` Hook

If you add [custom pages](./Actions.md), of if you [create an admin app from scratch](./CustomApp.md), you may need to secure access to pages manually. That's the purpose of the `useAuthenticated()` hook, which calls the `authProvider` with the `AUTH_CHECK` type on mount, and redirects to login if it returns a rejected Promise.

```jsx
// in src/MyPage.js
import { useAuthenticated } from 'react-admin';

const MyPage = () => {
    useAuthenticated(); // redirects to login if not authenticated
    return (
        <div>
            ...
        </div>
    )
};

export default MyPage;
```

If you call `useAuthenticated()` with a parameter, this parameter is passed to the `authProvider` call as second parameter. that allows you to add authentication logic depending on the context of the call:

```jsx
const MyPage = () => {
    useAuthenticated({ foo: 'bar' }); // calls authProvider(AUTH_CHECK, { foo: 'bar' })
    return (
        <div>
            ...
        </div>
    )
};
```

The `useAuthenticated` hook is optimistic: it doesn't block rendering during the `authProvider` call. In the above example, the `MyPage` component renders even before getting the response from the `authProvider`. If the call returns a rejected promise, the hook redirects to the login page, but the user may have seen the content of the `MyPage` component for a brief moment.

## `<Authenticated>` Component

The `<Authenticated>` component uses the `useAuthenticated()` hook, and renders its child component - unless the authentication check fails. Use it as an alternative to the `useAuthenticated()` hook when you can't use a hook, e.g. inside a `Route` `render` function:

```jsx
import { Authenticated } from 'react-admin';

const CustomRoutes = [
    <Route path="/foo" render={() =>
        <Authenticated>
            <Foo />
        </Authenticated>
    } />
];
const App = () => (
    <Admin customRoutes={customRoutes}>
        ...
    </Admin>
);
```

## `useAuthState()` Hook

To avoid rendering a component and force waiting for the `authProvider` response, use the `useAuthState()` hook instead of the `useAuthenticated()` hook. It returns an object with 3 properties:

- `loading`: `true` just after mount, while the `authProvider` is being called. `false` once the `authProvider` has answered
- `loaded`: the opposite of `loading`.
- `connected`: `undefined` while loading. then `true` or `false` depending on the `authProvider` response.


You can render different content depending on the authenticated status. 

```jsx
import { useAuthState } from 'react-admin';

const MyPage = () => {
    const { loading, authenticated } = useAuthState();
    if (loading) {
        return <Loading>;
    }
    if (authenticated) {
        return <AuthenticatedContent />;
    } 
    return <AnonymousContent />;
};
```
