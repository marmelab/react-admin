---
layout: default
title: "Writing An Auth Provider"
---

# Writing An Auth Provider

Here is the interface react-admin expect `authProvider` objects to implement.

```jsx
const authProvider = {
    // authentication
    login: params => Promise.resolve(/* ... */),
    checkError: error => Promise.resolve(/* ... */),
    checkAuth: params => Promise.resolve(/* ... */),
    logout: () => Promise.resolve(/* ... */),
    getIdentity: () => Promise.resolve(/* ... */),
    handleCallback: () => Promise.resolve(/* ... */), // for third-party authentication only
    // authorization
    getPermissions: () => Promise.resolve(/* ... */),
};
```

**Tip**: If you're a TypeScript user, you can check that your `authProvider` is correct at compile-time using the `AuthProvider` type.

```tsx
import { AuthProvider } from 'react-admin';

const authProvider: AuthProvider = {
    // ...
};
```

## Example

Here is a complete but fictive implementation of an auth provider. It only accepts user "john" with password "123".

```jsx
const authProvider = {
    login: ({ username, password }) => {
        if (username !== 'john' || password !== '123') {
            return Promise.reject();
        }
        localStorage.setItem('username', username);
        return Promise.resolve();
    },
    logout: () => {
        localStorage.removeItem('username');
        return Promise.resolve();
    },
        checkAuth: () =>
        localStorage.getItem('username') ? Promise.resolve() : Promise.reject(),
    checkError:  (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('username');
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    getIdentity: () =>
        Promise.resolve({
            id: 'user',
            fullName: 'John Doe',
        }),
    getPermissions: () => Promise.resolve(''),
};

export default authProvider;
```

## Step-By-Step

If you have to implement your own auth provider, here is a step-by-step guide to get you started.

### `login`

Once an admin has an `authProvider`, react-admin enables a new page on the `/login` route, which displays a login form asking for a username and password.

![Default Login Form](./img/login-form.png)

Upon submission, this form calls the `authProvider.login({ username, password })` method. React-admin expects this method to return a resolved Promise if the credentials are correct, and a rejected Promise if they're not. 

For instance, to query an authentication route via HTTPS and store the credentials (a token) in local storage, configure the `authProvider` as follows:

```js
// in src/authProvider.js
const authProvider = {
    login: ({ username, password }) =>  {
        const request = new Request('https://mydomain.com/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(auth => {
                localStorage.setItem('auth', JSON.stringify(auth));
            })
            .catch(() => {
                throw new Error('Network error')
            });
    },
    checkAuth: () => {
        // Required for the authentication to work
        return Promise.resolve();
    },
    getPermissions: () => {
        // Required for the authentication to work
        return Promise.resolve();
    },
    // ...
};

export default authProvider;
```

Once the promise resolves, the login form redirects to the previous page, or to the admin index if the user just arrived.

**Tip**: It's a good idea to store credentials in `localStorage`, as in this example, to avoid reconnection when opening a new browser tab. But this makes your application [open to XSS attacks](https://www.redotheweb.com/2015/11/09/api-security.html), so you'd better double down on security, and add an `httpOnly` cookie on the server side, too.

After login, react-admin redirects the user to the location returned by `authProvider.login()` - or to the previous page if the method returns nothing. You can customize the redirection url by returning an object with a `redirectTo` key containing a string or false to disable redirection after login.

```js
// in src/authProvider.js
const authProvider = {
    login: ({ username, password }) =>  {
        const request = new Request('https://mydomain.com/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                // ...
                return { redirectTo: false };
            })
            .catch(() => {
                throw new Error('Network error')
            });
    },
    checkAuth: () => { /* ... */ },
    getPermissions: () => { /* ... */ },
    // ...
};

```
If the login fails, `authProvider.login()` should return a rejected Promise with an Error object. React-admin displays the Error message to the user in a notification.

### `checkError`

When the user credentials are missing or become invalid, a secure API usually answers to the `dataProvider` with an HTTP error code 401 or 403.

Fortunately, each time the `dataProvider` or the `authProvider.getPermissions` returns an error, react-admin calls the `authProvider.checkError()` method. If it returns a rejected promise, react-admin calls the `authProvider.logout()` method immediately, and asks the user to log in again.

So it's up to you to decide which HTTP status codes should let the user continue (by returning a resolved promise) or log them out (by returning a rejected promise).

For instance, to log the user out for both 401 and 403 codes:

```js
// in src/authProvider.js
export default {
    login: ({ username, password }) => { /* ... */ },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    // ...
};
```

When `authProvider.checkError()` returns a rejected Promise, react-admin redirects to the `/login` page, or to the `error.redirectTo` url. That means you can override the default redirection as follows:

```js
// in src/authProvider.js
export default {
    login: ({ username, password }) => { /* ... */ },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            return Promise.reject({ redirectTo: '/credentials-required' });
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    // ...
};
```

It's possible to not log the user out, and to instead redirect them. You can do this by passing `error.logoutUser = false` to the `Promise.reject` along with an `error.redirectTo` url.

```js
// in src/authProvider.js
export default {
    login: ({ username, password }) => { /* ... */ },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            return Promise.reject({ redirectTo: '/unauthorized', logoutUser: false });
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    // ...
};
```

When `authProvider.checkError()` returns a rejected Promise, react-admin displays a notification to the end user, unless the `error.message` is `false`. That means you can disable or customize the notification on error as follows:

```js
// in src/authProvider.js
export default {
    login: ({ username, password }) => { /* ... */ },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            return Promise.reject({ message: false });
            //return Promise.reject({ message: 'Unauthorized user!' });
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    // ...
};
```

### `checkAuth`

Redirecting to the login page whenever a REST response uses a 401 status code is usually not enough. React-admin keeps data on the client side, and could briefly display stale data while contacting the server - even after the credentials are no longer valid.

Fortunately, each time the user navigates to a list, edit, create or show page, react-admin calls the `authProvider.checkAuth()` method. If this method returns a rejected Promise, react-admin calls `authProvider.logout()` and redirects the user to the login page. So it's the ideal place to make sure the credentials are still valid.

For instance, to check for the existence of the authentication data in local storage:

```js
// in src/authProvider.js
export default {
    login: ({ username, password }) => { /* ... */ },
    checkError: (error) => { /* ... */ },
    checkAuth: () => localStorage.getItem('auth')
        ? Promise.resolve()
        : Promise.reject(),
    // ...
};
```

If the promise is rejected, react-admin redirects by default to the `/login` page. You can override where to redirect the user in `checkAuth()`, by rejecting an object with a `redirectTo` property:

```js
// in src/authProvider.js
export default {
    login: ({ username, password }) => { /* ... */ },
    checkError: (error) => { /* ... */ },
    checkAuth: () => localStorage.getItem('auth')
        ? Promise.resolve()
        : Promise.reject({ redirectTo: '/no-access' }),
    // ...
}
```

**Tip**: If both `authProvider.checkAuth()` and `authProvider.logout()` return a redirect URL, the one from `authProvider.checkAuth()` takes precedence.

If the promise is rejected, react-admin displays a notification to the end user. You can customize this message by rejecting an error with a `message` property:

```js
// in src/authProvider.js
export default {
    login: ({ username, password }) => { /* ... */ },
    checkError: (error) => { /* ... */ },
    checkAuth: () => localStorage.getItem('auth')
        ? Promise.resolve()
        : Promise.reject({ message: 'login.required' }), // react-admin passes the error message to the translation layer
    // ...
}
```

You can also disable this notification completely by rejecting an error with a `message` with a `false` value:

```js
// in src/authProvider.js
export default {
    login: ({ username, password }) => { /* ... */ },
    checkError: (error) => { /* ... */ },
    checkAuth: () => localStorage.getItem('auth')
        ? Promise.resolve()
        : Promise.reject({ message: false }),
    // ...
}
```

### `logout`

If you enable authentication, react-admin adds a logout button in the user menu in the top bar (or in the sliding menu on mobile). When the user clicks on the logout button, this calls the `authProvider.logout()` method, and removes potentially sensitive data sored in [the react-admin Store](./Store.md). Then the user gets redirected to the login page. The two previous sections also illustrated that react-admin can call `authProvider.logout()` itself, when the API returns a 403 error or when the local credentials expire. 

It's the responsibility of the `authProvider.logout()` method to clean up the current authentication data. For instance, if the authentication was a token stored in local storage, here is the code to remove it:

```js
// in src/authProvider.js
export default {
    login: ({ username, password }) => { /* ... */ },
    checkError: (error) => { /* ... */ },
    checkAuth: () => { /* ... */ },
    logout: () => {
        localStorage.removeItem('auth');
        return Promise.resolve();
    },
    // ...
};
```

<video controls autoplay playsinline muted loop>
  <source src="./img/logout.webm" type="video/webm"/>
  <source src="./img/logout.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


The `authProvider.logout()` method is also a good place to notify the authentication backend that the user credentials are no longer valid after logout.

After logout, react-admin redirects the user to the string returned by `authProvider.logout()` - or to the `/login` url if the method returns nothing. You can customize the redirection url by returning a route string, or `false` to disable redirection after logout. 

```js
// in src/authProvider.js
export default {
    login: ({ username, password }) => { /* ... */ },
    checkError: (error) => { /* ... */ },
    checkAuth: () => { /* ... */ },
    logout: () => {
        localStorage.removeItem('auth');
        return Promise.resolve('/my-custom-login');
    },
    // ...
};
```

### `getIdentity`

React-admin can display the current user name and avatar on the top right side of the screen. To enable this feature, implement the `authProvider.getIdentity()` method:

```js
// in src/authProvider.js
const authProvider = {
    login: ({ username, password }) => { /* ... */ },
    checkError: (error) => { /* ... */ },
    checkAuth: () => { /* ... */ },
    logout: () => { /* ... */ },
    getIdentity: () => {
        try {
            const { id, fullName, avatar } = JSON.parse(localStorage.getItem('auth'));
            return Promise.resolve({ id, fullName, avatar });
        } catch (error) {
            return Promise.reject(error);
        }
    }
    // ...
};

export default authProvider;
```

React-admin uses the `fullName` and the `avatar` (an image source, or a data-uri) in the App Bar:

![User identity](./img/identity.png)

**Tip**: You can use the `id` field to identify the current user in your code, by calling the `useGetIdentity` hook:

```jsx
import { useGetIdentity, useGetOne } from 'react-admin';

const PostDetail = ({ id }) => {
    const { data: post, isLoading: postLoading } = useGetOne('posts', { id });
    const { identity, isLoading: identityLoading } = useGetIdentity();
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

### `getPermissions`

This method should return the user permissions. It can be any format you want - a simple string (e.g. `'editor'`), an array of strings (e.g. `['editor', 'admin']`), or a complex object (e.g. `{ posts: 'editor', comments: 'moderator', users: 'admin' }`).

React-admin doesn't use permissions by default, but it provides [the `usePermissions` hook](./usePermissions.md) to retrieve the permissions of the current user. This lets you add the permissions logic that fits your need in your components. 

[The Role-Based Access Control (RBAC) module](./AuthRBAC.md) allows fined-grained permissions in react-admin apps, and specifies a custom return format for `authProvider.getPermissions()`. Check [the RBAC documentation](./AuthRBAC.md#authprovider-methods) for more information.

### `handleCallback`

This method is used when integrating a third-party authentication provider such as [Auth0](https://auth0.com/). React-admin provides a route at the `/auth-callback` path, to be used as the callback URL in the authentication service. After logging in using the authentication service, users will be redirected to this route. The `/auth-callback` route calls the `authProvider.handleCallback` method on mount. 

So `handleCallback` lets you process query parameters passed by the third-party authentication service, e.g. to retrieve an authentication token.

Here's an example using Auth0:

```jsx
import { PreviousLocationStorageKey } from 'react-admin';
import { Auth0Client } from './Auth0Client';

export const authProvider = {
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

Once `handleCallback` returns a resolved Promise, react-admin redirects the user to the home page, or to the location found in `localStorage.getItem(PreviousLocationStorageKey)`. In the above example, `authProvider.checkAuth()` sets this location to the page the user was trying to access. 

You can override this behavior by returning an object with a `redirectTo` property, as follows:

```jsx
async handleCallback() {
    if (!query.includes('code=') && !query.includes('state=')) {
        throw new Error('Failed to handle login callback.');
    }
    // If we did receive the Auth0 parameters,
    // get an access token based on the query paramaters
    await Auth0Client.handleRedirectCallback();
    return { redirectTo: '/posts' };
},
```

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
| `getPermissions` | Auth backend returned permissions | `Object | Array` free format - the response will be returned when `usePermissions()` is called |

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
| `getPermissions` | Auth backend failed to return permissions | `Object` free format - returned as `error` when `usePermissions()` is called. The error will be passed to `checkError` |

