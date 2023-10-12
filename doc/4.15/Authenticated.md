---
layout: default
title: "The Authenticated Component"
---

# `<Authenticated>`

The `<Authenticated>` component calls [the `useAuthState()` hook](./useAuthState.md), and by default optimistically renders its child component - unless the authentication check fails. Use it as an alternative to the `useAuthenticated()` hook when you can't use a hook, or you want to support pessimistic mode by setting `requireAuth` prop, e.g. inside a `<Route element>` commponent:

```jsx
import { Admin, CustomRoutes, Authenticated } from 'react-admin';
import { Route } from 'react-router-dom';

const App = () => (
    <Admin authProvider={authProvider}>
        <CustomRoutes>
            <Route path="/foo" element={<Authenticated><Foo /></Authenticated>} />
            <Route path="/bar" element={<Authenticated requireAuth><Bar /></Authenticated>} />
            <Route path="/anoonymous" element={<Baz />} />
        </CustomRoutes>
    </Admin>
);
```
