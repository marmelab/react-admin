---
title: "addRefreshAuthToAuthProvider"
---

This helper function wraps an existing [`authProvider`](./Authentication.md) to support authentication token refreshing mechanisms.

## Usage

Use `addRefreshAuthToAuthProvider` to decorate an existing auth provider. In addition to the base provider, this function takes a function responsible for refreshing the authentication token if needed.

Here is a simple example that refreshes an expired JWT token when needed:

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
import { addRefreshAuthToAuthProvider } from 'ra-core';
import { refreshAuth } from 'refreshAuth';

const myAuthProvider = {
    // ...Usual AuthProvider methods
};

export const authProvider = addRefreshAuthToAuthProvider(myAuthProvider, refreshAuth);
```

Then, pass the decorated provider to the `<CoreAdmin>` component

```jsx
// in src/App.js
import { CoreAdmin } from 'ra-core';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';

export const App = () => (
    <CoreAdmin dataProvider={dataProvider} authProvider={authProvider}>
        {/* ... */}
    </CoreAdmin>
)
```

**Tip:** We usually wrap the data provider's methods in the same way. You can use the [`addRefreshAuthToDataProvider`](./addRefreshAuthToDataProvider.md) helper function to do so.

## `provider`

The first argument must be a valid `authProvider` object - for instance, [any third-party auth provider](./AuthProviderList.md). 

```jsx
// in src/authProvider.js
import { addRefreshAuthToAuthProvider } from 'ra-core';

const myAuthProvider = {
    // ...Usual AuthProvider methods
};

export const authProvider = addRefreshAuthToAuthProvider(myAuthProvider, [ /* refreshAuth function */ ]);
```

## `refreshAuth`

The second argument is a function responsible for refreshing the authentication tokens if needed. It must return a promise.

```jsx
import { refreshAuth } from "./refreshAuth";

export const authProvider = addRefreshAuthToAuthProvider(myAuthProvider, refreshAuth);
```

## See Also

- [`addRefreshAuthToDataProvider`](./addRefreshAuthToDataProvider.md)
