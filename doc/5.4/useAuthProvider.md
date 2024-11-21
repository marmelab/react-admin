---
layout: default
title: "useAuthProvider"
---

# `useAuthProvider`

React-admin stores the `authProvider` object in a React context, so it's available from anywhere in your application code. The `useAuthProvider` hook reads this context to let you call the `authProvider` directly.

## Usage 

For instance, here is how to call the Auth Provider to get the identity of the current logged-in user:

```jsx
import { useState, useEffect } from 'react';
import { useAuthProvider } from 'react-admin';

import { Loading, Error } from './MyComponents';

const UserName = ({ userId }) => {
    const authProvider = useAuthProvider();
    const [identity, setIdentity] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        authProvider.getIdentity()
            .then(({ data }) => {
                setIdentity(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            })
    }, [authProvider]);

    if (loading) return <Loading />;
    if (error) return <Error />;
    if (!identity) return null;

    return <>{identity.fullName}</>;
};
```

But the recommended way to query the Data Provider is to use the authProvider method hooks (like [`useGetIdentity`](./useGetIdentity.md) for instance). Using these hooks, you don't have to handle the call state yourself.

```jsx
import { useState, useEffect } from 'react';
import { useGetIdentity } from 'react-admin';

import { Loading, Error } from './MyComponents';

const UserName = ({ userId }) => {
    const { identity, isPending, error } = useGetIdentity();

    if (isPending) return <Loading />;
    if (error) return <Error />;
    if (!identity) return null;

    return <>{identity.fullName}</>;
};
```

## TypeScript

The `useAuthProvider` hook accepts a generic parameter for the `authProvider` type. This is useful when you added custom methods to your `authProvider`:

```tsx
// In src/authProvider.ts
import { AuthProvider } from 'react-admin';

export interface CustomAuthProviderMethods extends AuthProvider {
    refreshToken: () => Promise<any>
}

export const authProvider: CustomAuthProviderMethods = {
    // ...Standard authProvider methods
    refreshToken: () => {
        // Refresh the user authentication token
    }
}

// In src/RefreshToken.tsx
import { useAuthProvider } from 'react-admin';
import { CustomAuthProviderMethods } from './src/authProvider';

const THIRTY_MINUTES = 1000 * 60 * 30;
export const RefreshToken = () => {
    const authProvider = useAuthProvider<CustomAuthProviderMethods>();

    useEffect(() => {
        const interval = useInterval(() => authProvider.refreshToken(), THIRTY_MINUTES);
        return () => clearInterval(interval);
    }, [authProvider]);

    return null;
};
```
