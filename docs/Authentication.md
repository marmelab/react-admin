---
layout: default
title: "Authentication"
---

# Authentication

![Logout button](./img/login.gif)

Admin-on-rest lets you secure your admin app with the authentication strategy of your choice. Since there are many different possible strategies (Basic Auth, JWT, OAuth, etc.), admin-on-rest simply provides hooks to execute your own authentication code.

By default, an admin-on-rest app doesn't require authentication. But if the REST API ever returns a 401 (Unauthorized) or a 403 (Forbidden) response, then the user is redirected to the `/login` route. You have nothing to do - it's already built in.

## Authentication Configuration

You can configure authentication in the `<Admin>` component, by passing an object as the `authentication` prop:

```js
const authentication = {
    // structure described below
};

<Admin authentication={authentication}>
    ...
</Admin>
```

This `authentication` object allows to configure the login and logout HTTP calls, the credentials check made during navigation, and the Login and Logout components. Read on to see that in detail.

## Configuring the Auth Client

By default, the `/login` route renders a special component called `Login`, which displays a login form asking for username and password.

![Default Login Form](./img/login-form.png)

What this form does upon submission depends on the `authClient` method of the `authentication` object. This method receives authentication requests `(type, params)`, and should return a Promise. `Login` calls `authClient` with the `AUTH_LOGIN` type, and `{ login, password }` as parameters. It's the ideal place to authenticate the user, and store their credentials.

For instance, to query an authentication route via HTTPS and store the response (a token) in local storage, configure `authClient` as follows:

```js
import { AUTH_LOGIN } from 'admin-on-rest';

const authentication = {
    authClient(type, params) {
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
                localStorage.setItem('token', token)
            });
        }
        return Promise.resolve();
    }
}
```

**Tip**: It's a good idea to store credentials in `localStorage`, to avoid reconnection when opening a new browser tab. But this makes your application [open to XSS attacks](http://www.redotheweb.com/2015/11/09/api-security.html), so you'd better double down on security, and add an `httpOnly` cookie on the server side, too.

When the `authClient` Promise resolves, the login form redirects to the previous page, or to the admin index if the user just arrived.

## Sending Credentials to the REST API

To use the credentials when calling REST API routes, you need to configure the `httpClient` passed as second parameter to `simpleRestClient` or `jsonServerRestClient`, as explained in the [REST client documentation](RestClients.html#adding-custom-headers).

For instance, to pass the token obtained during login as an `Authorization` header, configure the REST client as follows:

```js
import { simpleRestClient, fetchUtils, Admin, Resource } from 'admin-on-rest';
const httpClient = (url, options) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token')
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
}
const restClient = simpleRestClient('http://localhost:3000', httpClient);

<Admin restClient={restClient}>
   ...
</Admin>
```

If you have a custom REST client, don't forget to add credentials yourself.

## Adding a Logout Button

If you provide an `authClient` method to the `authentication` prop, admin-on-rest will display a logout button in the sidebar. When the user clicks on the logout button, this calls the `authClient` with the `AUTH_LOGOUT` type. When resolved, the user gets redirected to the login page.

For instance, to remove the token from local storage upon logout:

```js
import { AUTH_LOGIN, AUTH_LOGOUT } from 'admin-on-rest';

const authentication = {
    authClient(type, params) {
        if (type === AUTH_LOGIN) {
            // ...
        }
        if (type === AUTH_LOGOUT) {
            localStorage.removeItem('token');
        }
        return Promise.resolve();
    }
};
```

![Logout button](./img/logout.gif)

The `authClient` is also a good place to notify the authentication API that the user credentials are no longer valid after logout.

## Checking Credentials During Navigation

Admin-on-rest redirects to the login page whenever a REST response uses a 403 status code. But that's usually not enough, because admin-on-rest keeps data on the client side, and could display stale data while contacting the server - even after the credentials are no longer valid.

That means you need a way to check credentials during navigation. That's the purpose of the `checkCredentials` method of the `authentication` object. It's a kind of middleware function that is called by the router before every page change, so it's the ideal place to check for credentials.

For instance, to check for the existence of the token in local storage:

```js
const authentication = {
    authClient(type, params) { /* ... */ },
    checkCredentials(nextState, replace) {
        if (!localStorage.getItem('token')) {
            replace({
                pathname: '/login',
                state: { nextPathname: nextState.location.pathname },
            });
        }
    },
}
```

**Tip**: The `replace` function is passed by the router ; it allows to redirect the user if the check fails. Passing `state.nextPathname` allows the `Login` form to redirect to the page required by the user after authentication.

**Tip**: You can override the `checkCredentials` in `<Resource>` components, to implement different checks for different resources:

```js
import { checkCredentialsForPowerUser, checkCredentials } from './credentials';

const App = () => (
    <Admin>
        <Resource name="customers" checkCredentials={checkCredentials} list={CustomersList} />
        <Resource name="bank_accounts" checkCredentials={checkCredentialsForPowerUser} list={AccountsList} />
    </Admin>
);
```

## Customizing The Login and Logout Components

Using `authClient` and `checkCredentials` is enough to implement a full-featured authorization system if the authentication relies on a username and password.

?B?u?t??w?h?a?t??i?f??y?o?u??w?a?n?t??t?o??u?s?e??a?n??e?m?a?i?l??i?n?s?t?e?a?d??o?f??a??u?s?e?r?n?a?m?e????W?h?a?t??i?f??y?o?u??w?a?n?t??t?o??u?s?e??a??S?i?n?g?l?e?-?S?i?g?n?-?O?n??(?S?S?O?)??w?i?t?h??a??t?h?i?r?d?-?p?a?r?t?y??a?u?t?h?e?n?t?i?c?a?t?i?o?n??s?e?r?v?i?c?e?????W?h?a?t??i?f??y?o?u??w?a?n?t??t?o??u?s?e??t?w?o?-?f?a?c?t?o?r??a?u?t?h?e?n?t?i?c?a?t?i?o?n???

For all these cases, it's up to you to implement your own `LoginPage` component, which will be displayed under the `/login` route instead of the default username/password form. You can customize the `LoginPage` component via the `authentication` object. You can do the same with the `LogoutButton` component:

```js
import MyLoginPage from './MyLoginPage';
import MyLogoutButton from './MyLogoutButton';

const authentication = {
    LoginPage: MyLoginPage,
    LogoutButton: MyLogoutButton,
    checkCredentials(nextState, replace) {
        if (!localStorage.getItem('token')) {
            replace({
                pathname: '/login',
                state: { nextPathname: nextState.location.pathname },
            });
        }
    },
}
```

**Tip**: When customizing `LoginPage` and `LogoutButton`, you no longer need the `authClient` method, since it is only passed to the default `Login` and `Logout` components.

**Tip**: If you want to use Redux and Saga to handle credentials and authorization, you will need to register  [custom reducers](./AdminResource.html#customreducers) and [custom sagas](./AdminResource.html#customsagas) in the `<Admin>` component.
