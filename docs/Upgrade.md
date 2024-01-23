---
layout: default
title: "Upgrading to v5"
---

# Upgrading to v5

## React 18

React-admin v5 uses React 18. If you use react-admin as a library in your own application, you'll have to upgrade to React 18 as well.

The React team has published a [migration guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide) to help you upgrade. On most projects, this should be a matter of updating the root file of your application:

```diff
-import { render } from 'react-dom';
-const container = document.getElementById('app');
-render(<App tab="home" />, container);
+import { createRoot } from 'react-dom/client';
+const container = document.getElementById('app');
+const root = createRoot(container); // createRoot(container!) if you use TypeScript
+root.render(<App tab="home" />);
```

React 18 adds out-of-the-box performance improvements by doing more batching by default. 

## IE11 Is No Longer Supported

React-admin v5 uses React 18, which dropped support for Internet Explorer. If you need to support IE11, you'll have to stay on react-admin v4.

## Use `@tanstack/react-query` instead of `react-query`

React-admin now uses `react-query` v5 instead of v3. The library name has changed to `@tanstack/react-query` (but it's almost the same API).
 
If you used `react-query` directly in your code, you'll have to update it, following their migration guides:

- [From react-query v3 to @transtack/query v4](https://tanstack.com/query/v5/docs/react/guides/migrating-to-react-query-4) 
- [From @transtack/query v4 to @transtack/query v5](https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5).

Here is a focus of the most important changes. 

The package has been renamed to `@tanstack/react-query` so you'll have to change your imports:

```diff
-import { useQuery } from 'react-query';
+import { useQuery } from '@tanstack/react-query';
```

All react-query hooks, `queryClient` and `queryCache` methods now accept a single object argument:

```diff
- useQuery(key, fn, options)
+ useQuery({ queryKey, queryFn, ...options })
- useInfiniteQuery(key, fn, options)
+ useInfiniteQuery({ queryKey, queryFn, ...options })
- useMutation(fn, options)
+ useMutation({ mutationFn, ...options })
- useIsFetching(key, filters)
+ useIsFetching({ queryKey, ...filters })
- useIsMutating(key, filters)
+ useIsMutating({ mutationKey, ...filters })

- queryClient.isFetching(key, filters)
+ queryClient.isFetching({ queryKey, ...filters })
- queryClient.ensureQueryData(key, filters)
+ queryClient.ensureQueryData({ queryKey, ...filters })
- queryClient.getQueriesData(key, filters)
+ queryClient.getQueriesData({ queryKey, ...filters })
- queryClient.setQueriesData(key, updater, filters, options)
+ queryClient.setQueriesData({ queryKey, ...filters }, updater, options)
- queryClient.removeQueries(key, filters)
+ queryClient.removeQueries({ queryKey, ...filters })
- queryClient.resetQueries(key, filters, options)
+ queryClient.resetQueries({ queryKey, ...filters }, options)
- queryClient.cancelQueries(key, filters, options)
+ queryClient.cancelQueries({ queryKey, ...filters }, options)
- queryClient.invalidateQueries(key, filters, options)
+ queryClient.invalidateQueries({ queryKey, ...filters }, options)
- queryClient.refetchQueries(key, filters, options)
+ queryClient.refetchQueries({ queryKey, ...filters }, options)
- queryClient.fetchQuery(key, fn, options)
+ queryClient.fetchQuery({ queryKey, queryFn, ...options })
- queryClient.prefetchQuery(key, fn, options)
+ queryClient.prefetchQuery({ queryKey, queryFn, ...options })
- queryClient.fetchInfiniteQuery(key, fn, options)
+ queryClient.fetchInfiniteQuery({ queryKey, queryFn, ...options })
- queryClient.prefetchInfiniteQuery(key, fn, options)
+ queryClient.prefetchInfiniteQuery({ queryKey, queryFn, ...options })

- queryCache.find(key, filters)
+ queryCache.find({ queryKey, ...filters })
- queryCache.findAll(key, filters)
+ queryCache.findAll({ queryKey, ...filters })
```

### Codemod

Fortunately, React Query comes with [codemods](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5#codemod) to make the migration easier.

> **DISCLAIMER**
>
> The codemod is a best efforts attempt to help you migrate the breaking change. Please review the generated code thoroughly! Also, there are edge cases that cannot be found by the codemod, so please keep an eye on the log output.
>
> Applying the codemod might break your code formatting, so please don't forget to run `prettier` and/or `eslint` after you've applied the codemod!

Once you have added `@tanstack/react-query` to your dependencies, you can run a codemod like so:

For `.js` or `.jsx` files:

```sh
npx jscodeshift ./path/to/src/ \
    --extensions=js,jsx \
    --transform=./node_modules/@tanstack/react-query/build/codemods/src/v4/replace-import-specifier.js
```

For `.ts` or `.tsx` files:

```sh
npx jscodeshift ./path/to/src/ \
    --extensions=ts,tsx \
    --parser=tsx \
    --transform=./node_modules/@tanstack/react-query/build/codemods/src/v4/replace-import-specifier.js
```

Here are the available codemods you may need to run on your codebase:

- `v4/replace-import-specifier.js`
- `v4/key-transformation.js`
- `v5/remove-overloads/remove-overloads.js`
- `v5/is-loading/is-loading.js`
- `v5/keep-previous-data/keep-previous-data.js`
- `v5/rename-properties/rename-properties.js`
- `v5/rename-hydrate/rename-hydrate.js`

Check out React Query [codemod documentation](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5#codemod) for more information.

## `<Admin menu>` Is No Longer Supported

The `<Admin menu>` prop was deprecated since 4.0. It's no longer supported. If you want to customize the application menu, you'll have to do it in a custom Layout instead:

```diff
-import { Admin } from 'react-admin';
+import { Admin, Layout } from 'react-admin';
import { MyMenu } from './MyMenu';

+const MyLayout = ({ children }) => (
+    <Layout menu={MyMenu}>{children}</Layout>
+);

const App = () => (
-   <Admin menu={MyMenu} dataProvider={dataProvider}>
+   <Admin layout={MyLayout} dataProvider={dataProvider}>
        ...
    </Admin>
);
```

## Custom Layout No Longer Receives Props

React-admin used to inject 4 props to [custom layouts](https://marmelab.com/react-admin/Admin.html#layout): `children`, `dashboard`, `menu`, and `title`. In react-admin v5, only the `children` prop is injected.

This means that you'll need to use hooks to get the other props:

```diff
+import { useHasDashboard, useDefaultTitle } from 'react-admin';

-const MyLayout = ({ children, dashboard, title }) => (
+const MyLayout = ({ children }) => {
-   const hasDashboard = !!dashboard;
+   const hasDashboard = useHasDashboard();
+   const title = useDefaultTitle();
    // ...
}

const App = () => (
    <Admin layout={MyLayout} dataProvider={dataProvider}>
        ...
    </Admin>
);
```

As for the `menu` prop, it's no longer injected by react-admin because the `<Admin menu>` prop is no longer supported. But you can still customize the menu of the default Layout as before:

```tsx
import { Layout } from 'react-admin';
import { MyMenu } from './MyMenu';

const MyLayout = ({ children }) => (
    <Layout menu={MyMenu}>{children}</Layout>
);

const App = () => (
    <Admin layout={MyLayout} dataProvider={dataProvider}>
        ...
    </Admin>
);
```

## Custom App Bars No Longer Receive Props

React-admin used to inject 2 props to [custom app bars](https://marmelab.com/react-admin/Layout.html#appbar): `open`, and `title`. These deprecated props are no longer injected in v5. If you need them, you'll have to use hooks:

```diff
+import { useSidebarState, useDefaultTitle } from 'react-admin';

-const MyAppBar = ({ open, title }) => (
+const MyAppBar = () => {
+   const [open] = useSidebarState();
+   const title = useDefaultTitle();
    // ...
}

const MyLayout = ({ children }) => (
    <Layout appBar={MyAppBar}>{children}</Layout>
);
```

## Custom Menu No Longer Receive Props

React-admin used to inject one prop to [custom menus](https://marmelab.com/react-admin/Layout.html#menu): `hasDashboard`. This deprecated prop is no longer injected in v5. If you need it, you'll have to use the `useHasDashboard` hook instead:

```diff
+import { useHasDashboard } from 'react-admin';

-const MyMenu = ({ hasDashboard }) => (
+const MyMenu = () => {
+   const hasDashboard = useHasDashboard();
    // ...
}

const MyLayout = ({ children }) => (
    <Layout menu={MyMenu}>{children}</Layout>
);
```

## Custom Error Page No Longer Receives Title

React-admin injects several props to [custom error pages](https://marmelab.com/react-admin/Layout.html#error), including the default app `title`. This prop is no longer injected in v5. If you need it, you'll have to use the `useDefaultTitle` hook instead:

```diff
+import { useDefaultTitle } from 'react-admin';

-const MyError = ({ error, errorInfo, title }) => (
+const MyError = ({ error, errorInfo }) => {
+   const title = useDefaultTitle();
    // ...
}

const MyLayout = ({ children }) => (
    <Layout error={MyError}>{children}</Layout>
);
```

## Custom Catch All No Longer Receives Title

React-admin used to inject the default app `title` to [custom catch all pages](https://marmelab.com/react-admin/Admin.html#catchall). This prop is no longer injected in v5. If you need it, you'll have to use the `useDefaultTitle` hook instead:

```diff
+import { useDefaultTitle } from 'react-admin';

-const MyCatchAll = ({ title }) => (
+const MyCatchAll = () => {
+   const title = useDefaultTitle();
    // ...
}

const App = () => (
    <Admin catchAll={MyCatchAll} dataProvider={dataProvider}>
        ...
    </Admin>
);
```
```

## Removed deprecated hooks

The following deprecated hooks have been removed

- `usePermissionsOptimized`. Use `usePermissions` instead.

## `<Datagrid rowClick>` is no longer `false` by default

`<Datagrid>` will now make the rows clickable as soon as a Show or Edit view is declared on the resource (using the [resource definition](https://marmelab.com/react-admin/Resource.html)).

If you previously relied on the fact that the rows were not clickable by default, you now need to explicitly disable the `rowClick` feature:

```diff
-<Datagrid>
+<Datagrid rowClick={false}>
   ...
</Datagrid>
```

## Dark Theme Is Available By Default

In addition to the light theme, React-admin v5 includes a [dark theme](https://marmelab.com/react-admin/AppTheme.html#light-and-dark-themes), renders a theme switcher in the app bar, and chooses the default theme based on the user OS preferences.

If you don't need the dark mode feature, you'll have to explicitly disable it:

```diff
-<Admin>
+<Admin darkTheme={null}>
   ...
</Admin>
```

## Links are now underlined by default

In the default theme, links are now underlined by default.

If you use the `<Link>` component from `react-admin`, and you want to remove the underline, set the `underline` prop to `none`:

```diff
import { Link } from 'react-admin';

const MyComponent = () => (
-   <Link to="/foo">Foo</Link>
+   <Link to="/foo" underline="none">Foo</Link>
);
```

Some react-admin component use `<Link>` under the hood, and will also render underlined links:

- `<Count>`
- `<EmailField>`
- `<FileField>`
- `<ReferenceField>`
- `<ReferenceManyCount>`
- `<UrlField>`

`<SingleFieldList>` still disables the underline by default.

To remove the underline in these components, use the `sx` prop. For instance, to remove the underline in `<ReferenceField>`:

{% raw %}
```diff
const CompanyField = () => (
-   <ReferenceField source="company_id" reference="companies" />
+   <ReferenceField source="company_id" reference="companies" sx={{
+      '& a': { textDecoration: 'none' }
+   }} />
)
```
{% endraw %}

## `<SimpleFormIterator>` no longer clones its children

We've changed the implementation of `<SimpleFormIterator>`, the companion child of `<ArrayInput>`. This internal change is mostly backwards compatible, with one exception: defining the `disabled` prop on the `<ArrayInput>` component does not disable the children inputs anymore. If you relied on this behavior, you now have to specify the `disabled` prop on each input:

```diff
<ArrayInput disabled={someCondition}>
   <SimpleFormIterator>
-      <TextInput source="lastName" />
-      <TextInput source="firstName" />
+      <TextInput source="lastName" disabled={someCondition} />
+      <TextInput source="firstName" disabled={someCondition} />
   </SimpleFormIterator>
</ArrayInput>
```

## `<FormDataConsumer>` no longer passes a `getSource` function

When using `<FormDataConsumer>` inside an `<ArrayInput>`, the child function no longer receives a `getSource` callback. We've made all Input components able to work seamlessly inside an `<ArrayInput>`, so it's no longer necessary to transform their source with `getSource`:

```diff
import { Edit, SimpleForm, TextInput, ArrayInput, SelectInput, FormDataConsumer } from 'react-admin';

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <ArrayInput source="authors">
                <SimpleFormIterator>
                    <TextInput source="name" />
                    <FormDataConsumer>
                        {({
                            formData, // The whole form data
                            scopedFormData, // The data for this item of the ArrayInput
-                           getSource,
                        }) =>
                            scopedFormData && getSource && scopedFormData.name ? (
                                <SelectInput
-                                    source={getSource('role')}
+                                    source="role" // Will translate to "authors[0].role"
                                    choices={[{ id: 1, name: 'Head Writer' }, { id: 2, name: 'Co-Writer' }]}
                                />
                            ) : null
                        }
                    </FormDataConsumer>
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
);
```

## Upgrading to v4

If you are on react-admin v3, follow the [Upgrading to v4](https://marmelab.com/react-admin/doc/4.16/Upgrade.html) guide before upgrading to v5. 
