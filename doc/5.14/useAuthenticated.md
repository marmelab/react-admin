---
layout: default
title: "useAuthenticated"
---

# `useAuthenticated`

This hook checks if the current user is authenticated by calling the [`authProvider.checkAuth()`](./AuthProviderWriting.md#checkauth) method on mount, and redirects to login if the method throws an error.

React-admin uses this hook in page components (e.g., the `<Edit>` component) to forbid access to unauthenticated users.

## Usage

If you add [custom pages](./Admin.md#adding-custom-pages), and you want to restrict access to authenticated users, use `useAuthenticated()` as follows:

```tsx
// in src/MyPage.js
import { useAuthenticated } from 'react-admin';

const MyPage = () => {
    const { isPending } = useAuthenticated(); // redirects to login if not authenticated
    if (isPending) return <div>Checking auth...</div>;
    return (
        <div>
            ...
        </div>
    )
};

export default MyPage;
```

Since `authProvider.checkAuth()` is an asynchronous function, the `useAuthenticated` hook returns an object with a `isPending` property set to `true` while the check is in progress. You can use this property to display a loading indicator until the check is complete.

If you want to render different content depending on the authenticated status, you can use [the `useAuthState` hook](./useAuthState.md) instead.

## Parameters

`useAuthenticated` accepts an options object as its only argument, with the following properties:

- `params`: the parameters to pass to `authProvider.checkAuth()`
- `logoutOnFailure`: a boolean indicating whether to call `authProvider.logout` if the check fails. Defaults to `true`.

Additional parameters are passed as options to the `useQuery` call. That allows you to add side effects, meta parameters, retryDelay, etc.

The `params` option allows you to add authentication logic depending on the context of the call:

```tsx
const MyPage = () => {
    useAuthenticated({ params: { foo: 'bar' } }); // calls authProvider.checkAuth({ foo: 'bar' })
    return (
        <div>
            ...
        </div>
    )
};
```

## Component Version

The [`<Authenticated>`](./Authenticated.md) component wraps the `useAuthenticated` hook, renders its child if the user is authenticated, or redirects to login otherwise.

It is useful when you can't use hooks, for instance because of the rules of hooks.

```jsx
import { Authenticated } from 'react-admin';

const MyAuthenticatedPage = () => (
    <Authenticated>
        <MyPage />
    </Authenticated>
);
```
