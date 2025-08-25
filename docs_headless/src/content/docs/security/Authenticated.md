---
layout: default
title: "The Authenticated Component"
---

# `<Authenticated>`

The `<Authenticated>` component calls [`authProvider.checkAuth()`](./AuthProviderWriting.md#checkauth) on mount. If the current user is authenticated,`<Authenticated>` renders its child component. If the user is not authenticated, it redirects to the login page. While the authentication is being checked, `<Authenticated>` displays a loading component (empty by default).

## Usage

Use it as an alternative to the [`useAuthenticated()`](./useAuthenticated.md) hook when you can't use a hook, e.g. inside a `<Route element>` component:

```jsx
import { Admin, CustomRoutes, Authenticated } from 'react-admin';
import { Route } from 'react-router-dom';

const App = () => (
    <Admin authProvider={authProvider}>
        <CustomRoutes>
            <Route path="/foo" element={<Authenticated><Foo /></Authenticated>} />
            <Route path="/anoonymous" element={<Baz />} />
        </CustomRoutes>
    </Admin>
);
```

## Props

| Prop        | Required | Type        | Default | Description                                                                         |
|-------------| ---------|-------------|---------|-------------------------------------------------------------------------------------|
| `children`  | Required | `ReactNode` |         | The component to render if the user is authenticated.                               |
| `authParams`|          | `any`       | `{}`    | An object containing the parameters to pass to the `authProvider.checkAuth()` call. |
| `loading`   |          | `ReactNode` | `null`  | Component to display while the authentication is being checked.                     |