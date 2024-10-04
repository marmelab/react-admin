---
layout: default
title: "security"
---

# Security

<video controls autoplay playsinline muted loop>
  <source src="./img/login.webm" type="video/webm"/>
  <source src="./img/login.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Web applications often need to limit access to specific pages or resources to authenticated users ("Authentication") and ensure that users can only execute actions they are permitted to ("Authorization").

React-admin supports both authentication and authorization, and provides a way to secure your admin app with the authentication strategy of your choice. Since there are many possible strategies (OAuth, MFA, passwordless, magic link, etc.), react-admin delegates this logic to an `authProvider`.

## Enabling Authentication

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

Once an admin has an `authProvider`, react-admin will restrict CRUD pages (the `list`, `edit`, `create`and `show` components of your `Resources`) to authenticated users, and redirect anonymous users to a new page on the `/login` route, which displays a login form asking for a username and password.

## Anatomy Of An `authProvider`

What's an `authProvider`? Just like a `dataProvider`, an `authProvider` is an object that handles authentication and authorization logic. It exposes methods that react-admin calls when needed, and that you can call manually through specialized hooks. The `authProvider` methods must return a Promise.

A typical `authProvider` has the following methods:

```js
const authProvider = {
    // send username and password to the auth server and get back credentials
    async login(params) {/** ... **/},
    // when the dataProvider returns an error, check if this is an authentication error
    async checkError(error) {/** ... **/},
    // when the user navigates, make sure that their credentials are still valid
    async checkAuth(params) {/** ... **/},
    // remove local credentials and notify the auth server that the user logged out
    async logout() {/** ... **/},
    // get the user's profile
    async getIdentity() {/** ... **/},
    // check whether users have the right to perform an action on a resource (optional)
    async canAccess() {/** ... **/},
};
```

Find an existing Auth Provider in the [List of Available Auth Providers](./AuthProviderList.md), or write your own by following the [Building Your Own Auth Provider](./AuthProviderWriting.md) instructions.

## Sending Credentials To The API

The `authProvider` handles the authentication logic, but it's the `dataProvider`'s responsibility to include the user credentials in the requests to the API.

As explained in the [Data providers documentation](./DataProviders.md#adding-custom-headers), `simpleRestProvider` and `jsonServerProvider` take an `httpClient` as second parameter. That's the place where you can change request headers, cookies, etc.

For instance, if the `authProvider` stores an authentication token in localStorage, here is how you can tweak the `dataProvider` to pass this token as an `Authorization` header:

```jsx
import { fetchUtils, Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const { token } = JSON.parse(localStorage.getItem('auth'));
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};
const dataProvider = simpleRestProvider('http://localhost:3000', httpClient);

const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        ...
    </Admin>
);
```

Now the admin is secured: Authenticated users pass their credentials to the API.

If you have a custom REST client, don't forget to add credentials yourself.

## Restricting Access To Custom Pages

When you add custom pages, they are accessible to anonymous users by default. To make them only accessible to authenticated users, call [the `useAuthenticated` hook](./useAuthenticated.md) in the custom page:

```jsx
import { Admin, CustomRoutes, useAuthenticated } from 'react-admin';
import { Route } from 'react-router-dom';

const RestrictedPage = () => {
    const { isPending } = useAuthenticated(); // redirects to login if not authenticated
    if (isPending) return <div>Checking auth...</div>;
    return (
        <div>
            ...
        </div>
    )
};

const AnonymousPage = () => (
    <div>
        ...
    </div>
);

const App = () => (
    <Admin authProvider={authProvider}>
        <CustomRoutes>
            <Route path="/foo" element={<RestrictedPage />} />
            <Route path="/anonymous" element={<AnonymousPage />} />
        </CustomRoutes>
    </Admin>
);
```

Alternatively, you can use [the `<Authenticated>` component](./Authenticated.md), which displays its children only if the user is authenticated:

```jsx
import { Admin, CustomRoutes, Authenticated } from 'react-admin';
import { Route } from 'react-router-dom';

const RestrictedPage = () => (
    <Authenticated>
        <div>
            ...
        </div>
    </Authenticated>
);

const AnonymousPage = () => (
    <div>
        ...
    </div>
);

const App = () => (
    <Admin authProvider={authProvider}>
        <CustomRoutes>
            <Route path="/restricted" element={<RestrictedPage/>} />
            <Route path="/anonymous" element={<AnonymousPage />} />
        </CustomRoutes>
    </Admin>
);
```

## Disabling Anonymous Access

Securing custom pages one by one can be tedious. If you know your app will never accept anonymous access, you can force the app to wait for the `authProvider.checkAuth()` to resolve before rendering the page layout, by setting the `<Admin requireAuth>` prop.

```jsx
const App = () => (
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        requireAuth
    >
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

`requireAuth` also hides the UI until the authentication check is complete, so your app won't reveal any information (menu, resource names, etc) to anonymous users.

## Allowing Anonymous Access

As long as you add an `authProvider`, react-admin restricts access to all the pages declared in the `<Resource>` components. If you want to allow anonymous access to some of these pages, you can set the `disableAuthentication` prop in the page component.

For instance, to let anonymous users access the post list view:

```jsx
const PostList = () => (
    <List disableAuthentication>
        // ...
    </List>
);

const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

`disableAuthentication` is available on the following components and hooks:

- `<Create>`, `<CreateBase>`, `<CreateController>` and `useCreateController`
- `<Edit>`, `<EditBase>`, `<EditController>` and `useEditController`
- `<List>`, `<ListBase>`, `<ListController>` and `useListController`
- `<Show>`, `<ShowBase>`, `<ShowController>` and `useShowController`

## Customizing The Login Component

Using `authProvider` is enough to secure your app if the authentication relies on a username and password.

But what if you want to use an email instead of a username? What if you want to use a Single-Sign-On (SSO) with a third-party authentication service? What if you want to use two-factor authentication?

For all these cases, it's up to you to implement your own `LoginPage` component, which will be displayed under the `/login` route instead of the default username/password form. Pass this component to the [`<Admin loginPage>`](./Admin.md#loginpage) prop:

```jsx
// in src/App.js
import { Admin } from 'react-admin';

import MyLoginPage from './MyLoginPage';

const App = () => (
    <Admin loginPage={MyLoginPage} authProvider={authProvider}>
    ...
    </Admin>
);
```

By default, the login page displays a gradient background. If you just want to change the background, you can use the default Login page component and pass an image URL as the `backgroundImage` prop.

```jsx
// in src/MyLoginPage.js
import { Login } from 'react-admin';

const MyLoginPage = () => (
    <Login
        // A random image that changes everyday
        backgroundImage="https://source.unsplash.com/random/1600x900/daily"
    />
);
```

If you want to build a Login page from scratch, you'll need the [`useLogin` hook](./useLogin.md).

```jsx
// in src/MyLoginPage.js
import { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';

const MyLoginPage = ({ theme }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = e => {
        e.preventDefault();
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

## Logging Out The User

Users can log out by clicking on the user menu in the AppBar. If you want to allow the user to log out from a custom button, or if you want to log them out under specific conditions, you can use the [`useLogout`](./useLogout.md) hook.

```jsx
import { useLogout } from 'react-admin';
import Button from '@mui/material/Button';

const MyLogoutButton = () => {
    const logout = useLogout();
    const handleClick = () => logout();
    return <Button onClick={handleClick}>Logout</Button>;
};
```

**Tip**: By default, react-admin redirects the user to '/login' after they log out. This can be changed by passing the url to redirect to as parameter to the `logout()` function:

```diff
-const handleClick = () => logout();
+const handleClick = () => logout('/custom-login');
```

## Using External Authentication Providers

Instead of the built-in Login page, you can opt for an external authentication provider, such as Auth0, Cognito, or any other OAuth-based service. These services all require a callback URL in the app, to redirect users after login.

React-admin provides a default callback URL at `/auth-callback`. This route calls the `authProvider.handleCallback` method on mount. This means it's the `authProvider`'s job to use the params received from the callback URL to authenticate future API calls.

For instance, here's what a simple authProvider for Auth0 might look like:

```js
import { Auth0Client } from './Auth0Client';

export const authProvider = {
    async login() { /* Nothing to do here, this function will never be called */ },
    async checkAuth() {
        const isAuthenticated = await Auth0Client.isAuthenticated();
        if (isAuthenticated) {
            return;
        }
        // not authenticated: redirect the user to the Auth0 service,
        // where they will be redirected back to the app after login
        Auth0Client.loginWithRedirect({
            authorizationParams: {
                redirect_uri: `${window.location.origin}/auth-callback`,
            },
        });
    },
    // A user logged successfully on the Auth0 service
    // and was redirected back to the /auth-callback route on the app
    async handleCallback() {
        const query = window.location.search;
        if (query.includes('code=') && query.includes('state=')) {
            try {
                // get an access token based on the query paramaters
                await Auth0Client.handleRedirectCallback();
                return;
            } catch (error) {
                console.log('error', error);
                throw error;
            }
        }
        throw new Error('Failed to handle login callback.');
    },
    async logout() {
        const isAuthenticated = await client.isAuthenticated();
            // need to check for this as react-admin calls logout in case checkAuth failed
        if (isAuthenticated) {
            return client.logout({
                returnTo: window.location.origin,
            });
        }
    },
    ...
}
```

It's up to you to decide when to redirect users to the third party authentication service, for instance:

* Directly in the `AuthProvider.checkAuth()` method as above;
* When users click a button on a [custom login page](#customizing-the-login-component)

## Handling Refresh Tokens

[Refresh tokens](https://oauth.net/2/refresh-tokens/) are an important security mechanism. In order to leverage them, you should decorate the `dataProvider` and the `authProvider` so that they can check whether the authentication must be refreshed and actually refresh it.

You can use the [`addRefreshAuthToDataProvider`](./addRefreshAuthToDataProvider.md) and [`addRefreshAuthToAuthProvider`](./addRefreshAuthToAuthProvider.md) functions for this purpose. They accept a `dataProvider` or `authProvider` respectively and a function that should refresh the authentication token if necessary:

```jsx
// in src/refreshAuth.js
import { getAuthTokensFromLocalStorage } from './getAuthTokensFromLocalStorage';
import { refreshAuthTokens } from './refreshAuthTokens';

export const refreshAuth = () => {
    const { accessToken, refreshToken } = getAuthTokensFromLocalStorage();
    if (accessToken.exp < Date.now().getTime() / 1000) {
        // This function will fetch the new tokens from the authentication service and update them in localStorage
        return refreshAuthTokens(refreshToken);
    }
    return Promise.resolve();
}

// in src/authProvider.js
import { addRefreshAuthToAuthProvider } from 'react-admin';
import { refreshAuth } from 'refreshAuth';
const myAuthProvider = {
    // ...Usual AuthProvider methods
};
export const authProvider = addRefreshAuthToAuthProvider(myAuthProvider, refreshAuth);

// in src/dataProvider.js
import { addRefreshAuthToDataProvider } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { refreshAuth } from 'refreshAuth';
const baseDataProvider = simpleRestProvider('http://path.to.my.api/');
export const dataProvider = addRefreshAuthToDataProvider(baseDataProvider, refreshAuth);
```

## Authorization

Access control and permissions let you restrict certain pages to certain users. React-admin provides powerful primitives to implement authorization logic, but they deserve their own documentation page. Read more about [Authorization](./Authorization.md) in the dedicated page.

<video controls autoplay muted loop>
  <source src="./img/AccessControl.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>