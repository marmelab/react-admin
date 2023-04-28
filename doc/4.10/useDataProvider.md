---
layout: default
title: "useDataProvider"
---

# `useDataProvider`

React-admin stores the `dataProvider` object in a React context, so it's available from anywhere in your application code. The `useDataProvider` hook exposes the Data Provider to let you call it directly.

For instance, here is how to query the Data Provider for the current user profile:

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

But the recommended way to query the Data Provider is to use the dataProvider method hooks (like [`useGetOne`](./useGetOne.md) for instance).

**Tip**: The `dataProvider` returned by the hook is actually a *wrapper* around your Data Provider. This wrapper logs the user out if the dataProvider returns an error, and if the authProvider sees that error as an authentication error (via `authProvider.checkError()`).

**Tip**: If you use TypeScript, you can specify a record type for more type safety:

```jsx
dataProvider.getOne<Product>('users', { id: 123 })
    .then(({ data }) => {
        //     \- type of data is Product
        // ...
    })
```

