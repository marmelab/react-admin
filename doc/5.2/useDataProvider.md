---
layout: default
title: "useDataProvider"
---

# `useDataProvider`

React-admin stores the `dataProvider` object in a React context, so it's available from anywhere in your application code. The `useDataProvider` hook exposes the Data Provider to let you call it directly.

## Syntax

The hook takes no parameter and returns the Data Provider:
```jsx
const dataProvider = useDataProvider();
```

You can then call the Data Provider methods directly:

```jsx
dataProvider.getOne('users', { id: 123 })
    .then(({ data }) => {
        // ...
    })
```

As `dataProvider` methods are asynchronous, it's common to call them in a React `useEffect` (for queries) or in an event handler (for mutations).

**Tip**: The `dataProvider` returned by the `useDataProvider` hook is actually a *wrapper* around your Data Provider. This wrapper logs the user out if the `dataProvider` returns an error, and if the `authProvider` sees that error as an authentication error (via `authProvider.checkError()`).

## Usage

Here is how to query the Data Provider for the current user profile:

```jsx
import { useState, useEffect } from 'react';
import { useDataProvider } from 'react-admin';
import { Loading, Error } from './MyComponents';

const UserProfile = ({ userId }) => {
    const dataProvider = useDataProvider();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        dataProvider.getOne('users', { id: userId })
            .then(({ data }) => {
                setUser(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            })
    }, []);

    if (loading) return <Loading />;
    if (error) return <Error />;
    if (!user) return null;

    return (
        <ul>
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
        </ul>
    )
};
```

In practice, you should seldom use `useDataProvider` to call the dataProvider standard methods (like  `getOne()` or `update()`). The [query hooks](./Actions.md#query-hooks) (like [`useGetOne`](./useGetOne.md)) and [mutation hooks](./Actions.md#mutation-hooks) (like [`useUpdate`](./useUpdate.md)) are much more convenient. 

`useDataProvider` is mostly useful to call custom methods you added to your Data Provider. 

For instance, if your `dataProvider` exposes a `banUser()` method:

```js
const dataProvider = {
    getList: /* ... */,
    getOne: /* ... */,
    getMany: /* ... */,
    getManyReference: /* ... */,
    create: /* ... */,
    update: /* ... */,
    updateMany: /* ... */,
    delete: /* ... */,
    deleteMany: /* ... */,
    banUser: (userId) => {
        return fetch(`/api/user/${userId}/ban`, { method: 'POST' })
            .then(response => response.json());
    },
}
```

It is necessary to use `useDataProvider` in conjunction with React Query's `useMutation` to call this method when the user clicks on a button:

```jsx
import { useDataProvider, Button } from 'react-admin';
import { useMutation } from '@tanstack/react-query';

const BanUserButton = ({ userId }) => {
    const dataProvider = useDataProvider();
    const { mutate, isPending } = useMutation({
        mutationFn: () => dataProvider.banUser(userId)
    });
    return <Button label="Ban" onClick={() => mutate()} disabled={isPending} />;
};
```

## TypeScript

The `useDataProvider` hook accepts a generic parameter for the `dataProvider` type. This is useful when you added custom methods to your `dataProvider`:

```tsx
// In src/dataProvider.ts
import { DataProvider } from 'react-admin';

export interface DataProviderWithCustomMethods extends DataProvider {
    archive: (resource: string, params: {
        id: number;
    }) => Promise<any>
}

export const dataProvider: DataProviderWithCustomMethods = {
    // ...Standard dataProvider methods
    archive: (resource, params) => {
        // Call the archive endpoint and return a promise
    }
}

// In src/ArchiveButton.tsx
import { Button, useDataProvider } from 'react-admin';
import ArchiveIcon from '@mui/icons-material/Archive';
import { DataProviderWithCustomMethods } from './src/dataProvider';

export const ArchiveButton = () => {
    const dataProvider = useDataProvider<DataProviderWithCustomMethods>();
    const record = useRecord();

    return (
        <Button
            label="Archive"
            onClick={() => {
                // TypeScript knows the archive method
                dataProvider.archive('resource', { id: record.id })
            }}
        >
            <ArchiveIcon />
        </Button>
    );
};
```

Besides, all the standard dataProvider methods accept a generic parameter for the record type:

```jsx
dataProvider.getOne<Product>('users', { id: 123 })
    .then(({ data }) => {
        // TypeScript knows that data is of type Product
        // ...
    })
```

