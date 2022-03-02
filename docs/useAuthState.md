---
layout: default
title: "useAuthState"
---

# `useAuthState`

To avoid rendering a component, and to force waiting for the `authProvider` response, use `useAuthState()` instead of `useAuthenticated()`. It calls `authProvider.checkAuth()` on mount and returns an object with 3 properties:

- `loading`: `true` just after mount, while the `authProvider` is being called. `false` once the `authProvider` has answered.
- `loaded`: the opposite of `loading`.
- `authenticated`: `true` while loading. then `true` or `false` depending on the `authProvider` response.

You can render different content depending on the authenticated status. 

```jsx
import { useAuthState, Loading } from 'react-admin';

const MyPage = () => {
    const { loading, authenticated } = useAuthState();
    if (loading) {
        return <Loading />;
    }
    if (authenticated) {
        return <AuthenticatedContent />;
    } 
    return <AnonymousContent />;
};
```
