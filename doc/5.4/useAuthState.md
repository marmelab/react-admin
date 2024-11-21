---
layout: default
title: "useAuthState"
---

# `useAuthState`

If you want to check if the user is authenticated and decide what to render based on the result, use the `useAuthState` hook. It calls the `authProvider.checkAuth()` method on mount and returns a state object.

- Loading: `{ isPending: true }`
- Authenticated: `{ isPending: false, authenticated: true }`
- Not authenticated: `{ isPending: false, authenticated: false }`
- Error: `{ isPending: false, error: Error }`

Contrary to [`useAuthenticated()`](./useAuthenticated.md), `useAuthState` does not redirect to the login page if the user is not authenticated.

## Usage

Use `useAuthState()` to render different content depending on the authenticated state.

```jsx
import { useAuthState, Loading } from 'react-admin';

const MyPage = () => {
    const { isPending, authenticated } = useAuthState();
    if (isPending) {
        return <Loading />;
    }
    if (authenticated) {
        return <AuthenticatedContent />;
    } 
    return <AnonymousContent />;
};
```
