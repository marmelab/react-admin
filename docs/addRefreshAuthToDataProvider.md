---
layout: default
title: "addRefreshAuthToDataProvider"
---

# `addRefreshAuthToDataProvider`

This helper function wraps an existing [`dataProvider`](./DataProviderIntroduction.md) to support authentication token refreshing mechanisms.

## Usage

Use `addRefreshAuthToDataProvider` to decorate an existing data provider. In addition to the base provider, this function takes a function responsible for refreshing the authentication token if needed.

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

// in src/dataProvider.js
import { addRefreshAuthToDataProvider } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { refreshAuth } from 'refreshAuth';

const baseDataProvider = simpleRestProvider('http://path.to.my.api/');

export const dataProvider = addRefreshAuthToDataProvider(baseDataProvider, refreshAuth);
```

Then, pass the decorated provider to the `<Admin>` component

```jsx
// in src/App.js
import { Admin } from 'react-admin';
import { dataProvider } from './dataProvider';

export const App = () => (
    <Admin dataProvider={dataProvider}>
        {/* ... */}
    </Admin>
)
```

**Tip:** We usually wrap the auth provider's methods in the same way. You can use the [`addRefreshAuthToAuthProvider`](./addRefreshAuthToAuthProvider.md) helper function to do so.

## `provider`

The first argument must be a valid `dataProvider` object - for instance, [any third-party data provider](./DataProviderList.md). 

```jsx
// in src/dataProvider.js
import { addRefreshAuthToDataProvider } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const baseDataProvider = simpleRestProvider('http://path.to.my.api/');

export const dataProvider = addRefreshAuthToDataProvider(baseDataProvider, [ /* refreshAuth function */ ]);
```

## `refreshAuth`

The second argument is a function responsible for refreshing the authentication tokens if needed. It must return a promise.

```jsx
import jsonServerProvider from "ra-data-json-server";
import { refreshAuth } from "./refreshAuth";

export const dataProvider = addRefreshAuthToDataProvider(baseDataProvider, refreshAuth);
```

## See Also

- [`addRefreshAuthToAuthProvider`](./addRefreshAuthToAuthProvider.md)
