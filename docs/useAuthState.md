---
layout: default
title: "useAuthState"
---

# `useAuthState`

To avoid rendering a component, and to force waiting for the `authProvider` response, use `useAuthState()` instead of [`useAuthenticated()`](./useAuthenticated.md). It calls [`authProvider.checkAuth()`](./AuthProviderWriting.md#checkauth)  on mount and returns a state object:

- Loading: `{ isPending: true }`
- Authenticated: `{ isPending: false, authenticated: true }`
- Not authenticated: `{ isPending: false, authenticated: false }`

You can render different content depending on the authenticated state.

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
