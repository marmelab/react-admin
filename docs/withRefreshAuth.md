---
layout: default
title: "withRefreshAuth"
---

# `withRefreshAuth`

This helper function wraps existing [`dataProviders`](./DataProviderIntroduction.md) and [`authProviders`]('./Authentication.md') to support authentication token refreshing mechanisms.

## Usage

Use `withRefreshAuth` to decorate an existing data provider or auth provider (usually both). In addition to the base provider, this function takes a function responsible for refreshing the authentication token if needed.

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
import { withRefreshAuth } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { refreshAuth } from 'refreshAuth';

const baseDataProvider = simpleRestProvider('http://path.to.my.api/');

export const dataProvider = withRefreshAuth(baseDataProvider, refreshAuth);

// in src/authProvider.js
import { withRefreshAuth } from 'react-admin';
import { refreshAuth } from 'refreshAuth';

const myAuthProvider = {
    // ...Usual AuthProvider methods
};

export const authProvider = withRefreshAuth(myAuthProvider, refreshAuth);
```

Then, inject the decorated providers in the `<Admin>` component:

```jsx
// in src/App.js
import { Admin } from 'react-admin';
import { authProvider } from './authProvider';
import { dataProvider } from './dataProvider';

export const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        {/* ... */}
    </Admin>
)
```

## `provider`

The first argument must be a valid `dataProvider` or `authProvider` object - for instance, [any third-party data provider](./DataProviderList.md). 

```jsx
// in src/dataProvider.js
import { withRefreshAuth } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const baseDataProvider = simpleRestProvider('http://path.to.my.api/');

export const dataProvider = withRefreshAuth(baseDataProvider, [ /* refreshAuth function */ ]);
```

## `refreshAuth`

The second argument is a function responsible for refreshing the authentication tokens if needed. It must return a promise.

```jsx
import jsonServerProvider from "ra-data-json-server";
import { refreshAuth } from "./refreshAuth";

export const dataProvider = withRefreshAuth(baseDataProvider, refreshAuth);
```
