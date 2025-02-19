---
layout: default
title: "Writing An Auth Provider"
---

# Writing An Auth Provider

React-admin can use any authentication backend, but you have to write an adapter for it. This adapter is called an `authProvider`. The `authProvider` is a simple object with methods that react-admin calls to handle authentication and authorization.

## AuthProvider Interface Overview

React-admin expect an `authProvider` to implement the following methods:

```tsx
const authProvider = {
    // required methods
    async login(params) {/* ... */},
    async checkError(error) {/* ... */},
    async checkAuth(params) {/* ... */},
    async logout() {/* ... */},
    // optional methods
    async getIdentity() {/* ... */},
    async handleCallback() {/* ... */}, // for third-party authentication only
    async canAccess(params) {/* ... */}, // for authorization only
    async getPermissions() {/* ... */}, // for authorization only
};
```

**Tip**: If you're a TypeScript user, you can check that your `authProvider` is correct at compile-time using the `AuthProvider` type.

```tsx
import type { AuthProvider } from 'react-admin';

const authProvider: AuthProvider = {
    // ...
};
```

## Example

Here is a fictive but working implementation of an auth provider. It only accepts user "john" with password "123".

```tsx
const authProvider = {
    async login({ username, password }) {
        if (username !== 'john' || password !== '123') {
            throw new Error('Login failed');
        }
        localStorage.setItem('username', username);
    },
    async checkError(error) {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('username');
            throw new Error('Session expired');
        }
        // other error codes (404, 500, etc): no need to log out
    },
    async checkAuth() {
        if (!localStorage.getItem('username')) {
            throw new Error('Not authenticated');
        }
    },
    async logout() {
        localStorage.removeItem('username');
    },
    async getIdentity() {
        const username = localStorage.getItem('username');
        return { id: username, fullName: username };
    },
};
```

## Step-By-Step

If you have to implement your own auth provider, here is a step-by-step guide to get you started.

### `login`

Once an admin has an `authProvider`, react-admin enables a new page on the `/login` route, which displays a login form.

![Default Login Form](./img/login-form.png)

Upon submission, the login page calls the `authProvider.login()` method with the login data as parameter. React-admin expects this async method to return if the login data is correct, and to throw an error if it's not.

For instance, to query an authentication route via HTTPS and store the user credentials (a token) in local storage, configure the `authProvider` as follows:

```tsx
// in src/authProvider.js
const authProvider = {
    async login({ username, password })  {
        const request = new Request('https://mydomain.com/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        let response;
        try {
            response = await fetch(request);
        } catch (_error) {
            throw new Error('Network error');
        }
        if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
        }
        const auth = await response.json();
        localStorage.setItem('auth', JSON.stringify(auth));
    },
    // ...
};
```

Once the `login()` method returns, the login form redirects to the previous page, or to the admin index if the user just arrived.

If the `login()` method throws an Error, react-admin displays the error message to the user in a notification.

**Tip**: Storing credentials in `localStorage`, as in this example, avoids asking the user to log in again after a page refresh, or after a browser tab change. But this makes your application [open to XSS attacks](https://www.redotheweb.com/2015/11/09/api-security.html), so you'd better double down on security, and add an `httpOnly` cookie on the server side, too.

If the `login()` method returns an object with a `redirectTo` path, react-admin will redirect the user to that path after login. You can use this feature to redirect the user to a specific page, or to disable redirection by returning `false`.

```tsx
// in src/authProvider.js
const authProvider = {
    async login({ username, password })  {
        // ...
        return { redirectTo: false };
    },
    // ...
};
```

### `checkError`

When the user credentials are missing or become invalid, a secure API usually responds with an HTTP error code 401 or 403.

Fortunately, each time the `dataProvider` returns an error, react-admin calls `authProvider.checkError()` to check if the error is an authentication error. If this method throws an error itself, react-admin calls the `authProvider.logout()` method immediately, and redirects the user to the login page.

So it's up to you to decide which HTTP status codes should let the user continue (by returning a resolved promise) or log them out (by returning a rejected promise).

For instance, to log the user out for both 401 and 403 codes:

```tsx
const authProvider = {
    async checkError(error) {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            throw new Error();
        }
        // other error code (404, 500, etc): no need to log out
    },
    // ...
};
```

When `checkError()` throws an error, react-admin redirects to the `/login` page, or to the `error.redirectTo` url. That means you can override the default redirection as follows:

```tsx
const authProvider = {
    async checkError(error) {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            const error = new Error();
            error.redirectTo = '/credentials-required';
            throw error;
        }
    },
    // ...
};
```

It's possible to not log the user out, and to instead redirect them. You can do this by passing `error.logoutUser = false` along with an `error.redirectTo` url.

```tsx
const authProvider = {
    async checkError(error) {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            const error = new Error();
            error.redirectTo = '/credentials-required';
            error.logoutUser = false;
            throw error;
        }
    },
    // ...
};
```

When `checkError()` throws an error, react-admin displays a notification to the end user, unless the `error.message` is `false`. That means you can disable or customize the notification on error as follows:

```tsx
const authProvider = {
    async checkError(error) {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            const error = new Error();
            error.message = false;
            throw error;
        }
    },
    // ...
};
```

### `checkAuth`

Redirecting to the login page whenever a REST response uses a 401 status code is usually not enough. React-admin keeps data on the client side, and could briefly display stale data while contacting the server - even after the credentials are no longer valid.

Fortunately, each time the user navigates to a list, edit, create or show page, react-admin calls the `authProvider.checkAuth()` method. If this method throws an error, react-admin calls `authProvider.logout()` and redirects the user to the login page. So it's the ideal place to make sure the credentials are still valid.

For instance, to check for the existence of the authentication data in local storage:

```tsx
const authProvider = {
    async checkAuth() {
        if (!localStorage.getItem('auth')) {
            throw new Error();
        }
    },
    // ...
};
```

When `checkAuth()` throws an error, react-admin redirects to the `/login` page by default. You can override this path by throwing an error with a `redirectTo` property:

```tsx
const authProvider = {
    async checkAuth() {
        if (!localStorage.getItem('auth')) {
            const error = new Error();
            error.redirectTo = '/no-access';
            throw error;
        }
    },
    // ...
}
```

**Tip**: If both `authProvider.checkAuth()` and `authProvider.logout()` return a redirect URL, the one from `authProvider.checkAuth()` takes precedence.

When `checkAuth()` throws an error, react-admin displays a notification to the end user. You can customize this message by throwing an error with a particular message:

```tsx
const authProvider = {
    async checkAuth() {
        if (!localStorage.getItem('auth')) {
            throw new Error('login.required'); // react-admin passes the error message to the translation layer
        }
    },
    // ...
};
```

You can also disable this notification completely by rejecting an error with a `false` `message`.

```tsx
const authProvider = {
    async checkAuth() {
        if (!localStorage.getItem('auth')) {
            const error = new Error();
            error.message = false;
            throw error;
        }
    },
    // ...
};
```

### `logout`

If you enable authentication, react-admin adds a logout button in the user menu in the top bar (or in the sliding menu on mobile). When the user clicks on the logout button, this calls the `authProvider.logout()` method, and removes potentially sensitive data stored in [the react-admin Store](./Store.md). Then the user gets redirected to the login page. The two previous sections also illustrated that react-admin can call `authProvider.logout()` itself, when the API returns a 403 error or when the local credentials expire.

<video controls autoplay playsinline muted loop>
  <source src="./img/logout.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

It's the responsibility of the `authProvider.logout()` method to clean up the current authentication data. For instance, if the authentication was a token stored in local storage, here is the code to remove it:

```tsx
const authProvider = {
    async logout() {
        localStorage.removeItem('auth');
    },
    // ...
};
```

The `authProvider.logout()` method is also a good place to notify the authentication backend that the user credentials are no longer valid after logout.

After logout, react-admin redirects the user to the string returned by `authProvider.logout()` - or to the `/login` url if the method returns nothing. You can customize the redirection url by returning a route string, or `false` to disable redirection after logout.

```tsx
const authProvider = {
    async logout() {
        localStorage.removeItem('auth');
        return '/my-custom-login';
    },
    // ...
};
```

### `getIdentity`

Admin components often adapt their behavior based on the current user identity. For instance, a lock system may allow edition only if the lock owner is the current user. Another example is the user menu: it has to display the current user name and avatar.

React-admin delegates the storage of the connected user identity to the `authProvider`. If it exposes a `getIdentity()` method, react-admin will call it to read the user details. 

`getIdentity`should return an object with at least an `id` field. You can also return a `fullName` and an `avatar` field, or any other field you need in your app:

```tsx
const authProvider = {
    async getIdentity() {
        const authCredentials = JSON.parse(localStorage.getItem('auth'));
        const { id, fullName, avatar } = authCredentials;
        return { id, fullName, avatar };
    },
    // ...
};
```

React-admin uses the `fullName` and the `avatar` (an image source, or a data-uri) in the App Bar:

![User identity](./img/identity.png)

**Tip**: You can use the `id` field to identify the current user in your code, by calling the `useGetIdentity` hook:

```jsx
import { useGetIdentity, useGetOne } from 'react-admin';

const PostDetail = ({ id }) => {
    const { data: post, isPending: postLoading } = useGetOne('posts', { id });
    const { identity, isPending: identityLoading } = useGetIdentity();
    if (postLoading || identityLoading) return <>Loading...</>;
    if (!post.lockedBy || post.lockedBy === identity.id) {
        // post isn't locked, or is locked by me
        return <PostEdit post={post} />
    } else {
        // post is locked by someone else and cannot be edited
        return <PostShow post={post} />
    }
}
```

### `handleCallback`

This method is used when integrating a third-party authentication provider such as [Auth0](https://auth0.com/). React-admin provides a route at the `/auth-callback` path, to be used as the callback URL in the authentication service. After logging in using the authentication service, users will be redirected to this route. The `/auth-callback` route calls the `authProvider.handleCallback` method on mount. 

So `handleCallback` lets you process query parameters passed by the third-party authentication service, e.g. to retrieve an authentication token.

Here's an example using Auth0:

```tsx
import { PreviousLocationStorageKey } from 'react-admin';
import { Auth0Client } from './Auth0Client';

const authProvider = {
    async login() { /* Nothing to do here, this function will never be called */ },
    async checkAuth() {
        const isAuthenticated = await client.isAuthenticated();
        if (isAuthenticated) {
            return;
        }
        // not authenticated: save the location that the user tried to access
        localStorage.setItem(PreviousLocationStorageKey, window.location.href);
        // then redirect the user to the Auth0 service
        client.loginWithRedirect({
            authorizationParams: {
                // after login, Auth0 will redirect users back to this page
                redirect_uri: `${window.location.origin}/auth-callback`,
            },
        });
    },
    // A user logged in successfully on the Auth0 service
    // and was redirected back to the /auth-callback route on the app
    async handleCallback() {
        const query = window.location.search;
        if (!query.includes('code=') && !query.includes('state=')) {
            throw new Error('Failed to handle login callback.');
        }
        // If we did receive the Auth0 parameters,
        // get an access token based on the query paramaters
        await Auth0Client.handleRedirectCallback();
    },
    ...
}
```

Once `handleCallback` returns, react-admin redirects the user to the home page, or to the location found in `localStorage.getItem(PreviousLocationStorageKey)`. In the above example, `authProvider.checkAuth()` sets this location to the page the user was trying to access. 

You can override this behavior by returning an object with a `redirectTo` property, as follows:

```tsx
const authProvider = {
    async handleCallback() {
        if (!query.includes('code=') && !query.includes('state=')) {
            throw new Error('Failed to handle login callback.');
        }
        // If we did receive the Auth0 parameters,
        // get an access token based on the query paramaters
        await Auth0Client.handleRedirectCallback();
        return { redirectTo: '/posts' };
    },
    // ...
};
```

### `canAccess`

React-admin has built-in [Access Control](./Permissions.md#access-control) features that you can enable by implementing the `authProvider.canAccess()` method. It receives a permissions object with the following properties:

- `action`: The action to perform on the resource (e.g. `list`, `create`, `update`, `delete`, `show`)
- `resource`: The resource name
- `record` (optional): The record to perform the action on.

`canAccess()` should return a boolean indicating whether users can perform the provided action on the provided resource:

If any errors is thrown by the `canAccess` method, it will be passed to the [`authProvider.checkError`](#checkerror) method.

The simplest implementation is to return `true` for all resources and actions:

```tsx
const authProvider = {
    async canAccess() {
        return true;
    },
    // ...
};
```

More realistically, you would store the user's permissions at login, and check the requested action and resource against these permissions:

```tsx
const authProvider = {
    async canAccess({ action, resource }) {
        // authorizedResources is like ['posts', 'comments', 'users'];
        const { authorizedResources } = JSON.parse(localStorage.getItem('auth'));
        if (!authorizedResources.includes(resource)) {
            return false;
        }
        return true;
    },
    // ...
};
```

Check the [Access Control documentation](./Permissions.md#access-control) for more information on how to use the `canAccess` method.

**Tip**: [The Role-Based Access Control (RBAC) module](./AuthRBAC.md) allows fined-grained permissions in react-admin apps leveraging the `canAccess` method. Check [the RBAC documentation](./AuthRBAC.md#authprovider-methods) for more information.


### `getPermissions`

As an alternative to `canAccess()`, `getPermissions()` lets you return an arbitrary permissions object. This object can be used by React components to enable or disable UI elements based on the user's role.

The permissions can be in any format: a simple string (e.g. `'editor'`), an array of strings (e.g. `['editor', 'admin']`), or a complex object (e.g. `{ posts: 'editor', comments: 'moderator', users: 'admin' }`).

```tsx
const authProvider = {
    async getPermissions({ action, resource }) {
        const { permissions } = JSON.parse(localStorage.getItem('auth'));
        return permissions;
    },
    // ...
};
```

React-admin doesn't use permissions by default, but it provides [the `usePermissions` hook](./usePermissions.md) to retrieve the permissions of the current user. This lets you add the permissions logic that fits your need in your components.

Check the [Access Control documentation](./Permissions.md#permissions) for more information on how to use the `getPermissions` method.

## Request Format

React-admin calls the `authProvider` methods with the following params:

| Method           | Usage                                           | Parameters format  |
| ---------------- | ----------------------------------------------- | ------------------ |
| `login`          | Log a user in                                   | `Object` whatever fields the login form contains |
| `checkError`     | Check if a dataProvider error is an authentication error  | `{ message: string, status: number, body: Object }` the error returned by the `dataProvider` |
| `checkAuth`      | Check credentials before moving to a new route  | `Object` whatever params passed to `useCheckAuth()` - empty for react-admin default routes |
| `logout`         | Log a user out                                  |                    |
| `getIdentity`    | Get the current user identity                   |                    | 
| `handleCallback` | Validate users after third party authentication service redirection                |  |
| `canAccess`      | Check authorization for an action over a resource | `{ action: string, resource: string, record: object }` |
| `getPermissions` | Get the current user credentials                | `Object` whatever params passed to `usePermissions()` - empty for react-admin default routes |

## Response Format

`authProvider` methods must return a Promise. In case of success, the Promise should resolve to the following value:

| Method           | Resolve if                        | Response format |
| ---------------- | --------------------------------- | --------------- |
| `login`          | Login credentials were accepted   | `void | { redirectTo?: string | boolean  }` route to redirect to after login |
| `checkError`     | Error is not an auth error        | `void`          |
| `checkAuth`      | User is authenticated             | `void`          |
| `logout`         | Auth backend acknowledged logout  | `string | false | void` route to redirect to after logout, defaults to `/login` |
| `getIdentity`    | Auth backend returned identity    | `{ id: string | number, fullName?: string, avatar?: string }`  | 
| `handleCallback` | User is authenticated   | `void | { redirectTo?: string | boolean  }` route to redirect to after login |
| `canAccess`      | Auth backend returned authorization | `boolean` |
| `getPermissions` | Auth backend returned permissions | Free format. |

## Error Format

When the auth backend returns an error, the Auth Provider should return a rejected Promise, with the following value: 

| Method           | Reject if                                 | Error format |
| ---------------- | ----------------------------------------- | --------------- |
| `login`          | Login credentials weren't accepted        | `string | { message?: string }` error message to display |
| `checkError`     | Error is an auth error                    | `void | { redirectTo?: string, message?: string | boolean  }` route to redirect to after logout, message to notify the user or `false` to disable notification |
| `checkAuth`      | User is not authenticated                 | `void | { redirectTo?: string, message?: string }` route to redirect to after logout, message to notify the user |
| `logout`         | Auth backend failed to log the user out   | `void` |
| `getIdentity`    | Auth backend failed to return identity    | `Object` free format - returned as `error` when `useGetIdentity()` is called | 
| `handleCallback` | Failed to authenticate users after redirection | `void | { redirectTo?: string, logoutOnFailure?: boolean, message?: string }` |
| `canAccess`      | Auth backend failed to return authorization | `Object` free format - returned as `error` when `useCanAccess()` is called. |
| `getPermissions` | Auth backend failed to return permissions | `Object` free format - returned as `error` when `usePermissions()` is called. The error will be passed to `checkError` |

## Query Cancellation

React-admin supports [Query Cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation), which means that when a component is unmounted, any pending query that it initiated is cancelled. This is useful to avoid out-of-date side effects and to prevent unnecessary network requests.

To enable this feature, your auth provider must have a `supportAbortSignal` property set to `true`.

```tsx
const authProvider = { /* ... */ };
authProvider.supportAbortSignal = true;
```

Now, every call to the auth provider will receive an additional `signal` parameter (an [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) instance). You must pass this signal down to the fetch call:

```tsx
const authProvider = {
    async canAccess({ resource, action, record, signal }) {
        const url = `${API_URL}/can_access?resource=${resource}&action=${action}`;
        const res = await fetch(url, { signal });
        if (!res.ok) {
            throw new HttpError(res.statusText);
        }
        return res.json();
    },
}
```

Some auth providers may already support query cancellation. Check their documentation for details.

**Note**: In development, if your app is using [`<React.StrictMode>`](https://react.dev/reference/react/StrictMode), enabling query cancellation will duplicate the API queries. This is only a development issue and won't happen in production.