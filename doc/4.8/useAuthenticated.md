---
layout: default
title: "useAuthenticated"
---

# `useAuthenticated`

If you add [custom pages](./Actions.md), you may need to secure access to pages manually. That's the purpose of the `useAuthenticated()` hook, which calls the `authProvider.checkAuth()` method on mount, and redirects to login if it returns a rejected Promise.

```jsx
// in src/MyPage.js
import { useAuthenticated } from 'react-admin';

const MyPage = () => {
    useAuthenticated(); // redirects to login if not authenticated
    return (
        <div>
            ...
        </div>
    )
};

export default MyPage;
```

`useAuthenticated` accepts an options object as its only argument, with the following properties:
- `enabled`: whether it should check for an authenticated user (`true` by default)
- `params`: the parameters to pass to `checkAuth`

If you call `useAuthenticated()` with a `params` option, those parameters are passed to the `authProvider.checkAuth` call. That allows you to add authentication logic depending on the context of the call:

```jsx
const MyPage = () => {
    useAuthenticated({ params: { foo: 'bar' } }); // calls authProvider.checkAuth({ foo: 'bar' })
    return (
        <div>
            ...
        </div>
    )
};
```

The `useAuthenticated` hook is optimistic: it doesn't block rendering during the `authProvider` call. In the above example, the `MyPage` component renders even before getting the response from the `authProvider`. If the call returns a rejected promise, the hook redirects to the login page, but the user may have seen the content of the `MyPage` component for a brief moment.

If you want to render different content depending on the authenticated status, you can use [the `useAuthState` hook](./useAuthState.md) instead.
