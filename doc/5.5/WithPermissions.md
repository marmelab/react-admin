---
layout: default
title: "WithPermissions"
---

# `<WithPermissions>`

The `<WithPermissions>` component calls `useAuthenticated()` and `useGetPermissions()` hooks, which relies on the `authProvider.getPermissions()` to retrieve the user's permissions, and injects `permissions` to its child component. Use it as an alternative to the `usePermissions()` hook when you can’t use a hook, e.g. inside a `<Route element>` component:

{% raw %}
```jsx
import { Admin, CustomRoutes, WithPermissions } from "react-admin";
import { Route } from "react-router-dom";

const App = () => (
    <Admin authProvider={authProvider}>
        <CustomRoutes>
            <Route
                path="/foo"
                element={
                    <WithPermissions
                        authParams={{ foo: "bar" }}
                        component={Foo}
                        {...fooProps}
                    />
                }
            />
        </CustomRoutes>
    </Admin>
);
```
{% endraw %}
