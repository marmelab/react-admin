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

## Drop support for IE11

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

## Upgrading to v4

If you are on react-admin v3, follow the [Upgrading to v4](https://marmelab.com/react-admin/doc/4.16/Upgrade.html) guide before upgrading to v5. 
