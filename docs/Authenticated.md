---
layout: default
title: "The Authenticated Component"
---

# `<Authenticated>`

The `<Authenticated>` component calls [the `useAuthenticated()` hook](./useAuthenticated.md), and renders its child component - unless the authentication check fails. Use it as an alternative to the `useAuthenticated()` hook when you can't use a hook, e.g. inside a `<Route element>` commponent:

```jsx
import { Admin, CustomRoutes, Authenticated } from 'react-admin';

const App = () => (
    <Admin authProvider={authProvider}>
        <CustomRoutes>
            <Route path="/foo" element={<Authenticated><Foo /></Authenticated>} />
            <Route path="/bar" element={<Authenticated><Bar /></Authenticated>} />
            <Route path="/anoonymous" element={<Baz />} />
        </CustomRoutes>
    </Admin>
);
```
