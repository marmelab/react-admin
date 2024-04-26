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

- [From react-query v3 to @tanstack/react-query v4](https://tanstack.com/query/v5/docs/react/guides/migrating-to-react-query-4)
- [From @tanstack/react-query v4 to @tanstack/react-query v5](https://tanstack.com/query/v5/docs/react/guides/migrating-to-v5).

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

## Custom Edit or Show Actions No Longer Receive Any Props

React-admin used to inject the `record` and `resource` props to custom edit or show actions. These props are no longer injected in v5. If you need them, you'll have to use the `useRecordContext` and `useResourceContext` hooks instead. But if you use the standard react-admin buttons like `<ShowButton>`, which already uses these hooks, you don't need inject anything.

```diff
-const MyEditActions = ({ data }) => (
+const MyEditActions = () => (
    <TopToolbar>
-       <ShowButton record={data} />
+       <ShowButton />
    </TopToolbar>
);

const PostEdit = () => (
    <Edit actions={<MyEditActions />} {...props}>
        ...
    </Edit>
);
```

## Removed deprecated hooks

The following deprecated hooks have been removed

- `usePermissionsOptimized`. Use `usePermissions` instead.

## `<List hasCreate>` Is No Longer Supported

To force a List view to display a Create button even though the corresponding resource doesn't have a `create` component, pass a custom actions component to the List component:

```diff
-import { List } from 'react-admin';
+import { List, ListActions } from 'react-admin';

const PostList = () => (
-   <List hasCreate>
+   <List actions={<ListActions hasCreate />}>
        ...
    </List>
);
```

## `<Datagrid rowClick>` is no longer `false` by default

`<Datagrid>` will now make the rows clickable as soon as a Show or Edit view is declared on the resource (using the [resource definition](https://marmelab.com/react-admin/Resource.html)).

If you previously relied on the fact that the rows were not clickable by default, you now need to explicitly disable the `rowClick` feature:

```diff
-<Datagrid>
+<Datagrid rowClick={false}>
   ...
</Datagrid>
```

## Updates to `bulkActionButtons` Syntax

The `bulkActionButtons` prop has been moved from the `<List>` component to the `<Datagrid>` component. 

```diff
const PostList = () => (
-   <List bulkActionButtons={<BulkActionButtons />}>
+   <List>
-      <Datagrid>
+      <Datagrid bulkActionButtons={<BulkActionButtons />}>
           ...
       </Datagrid>
   </List>
);
```

Besides, the buttons passed as `bulkActionButtons` no longer receive any prop. If you need the current filter values or the selected ids, you'll have to use the `useListContext` hook:

```diff
-const BulkResetViewsButton = ({ resource, selectedIds }) => {
+const BulkResetViewsButton = () => {
+   const { resource, selectedIds } = useListContext();
    const notify = useNotify();
    const unselectAll = useUnselectAll(resource);
    const [updateMany, { isPending }] = useUpdateMany();

    const handleClick = () => {
        updateMany(
            resource,
            { ids: selectedIds, data: { views: 0 } },
            {
                onSuccess: () => {
                    notify('Views reset');
                    unselectAll();
                },
                onError: () => notify('Views not reset', { type: 'error' }),
            }
        );
    }
    return (
        <Button
            label="Reset views"
            disabled={isPending}
            onClick={() => updateMany()}
        >
            <VisibilityOff />
        </Button>
    );
};
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

## Inputs Have Full Width By Default

In the default theme, all inputs now have full width. This makes forms better looking by default, and facilitates custom form layouts as you can nest inputs under `<Grid>`.

If this breaks your existing form layouts, you can revert to the previous style by resetting the `fullWidth` default prop in the application theme. To do so:

- If you didn't use a custom theme, create one based on the default theme:

```diff
-import { Admin } from 'react-admin';
+import { Admin, defaultTheme } from 'react-admin';
+import { deepmerge } from '@mui/utils';
import { dataProvider } from './dataProvider';

+const theme = deepmerge(defaultTheme, {
+   components: { 
+       MuiFormControl: { defaultProps: { fullWidth: undefined } },
+       MuiTextField: { defaultProps: { fullWidth: undefined } },
+       MuiAutocomplete: { defaultProps: { fullWidth: undefined } },
+       RaSimpleFormIterator: { defaultProps: { fullWidth: undefined } },
+       RaTranslatableInputs: { defaultProps: { fullWidth: undefined } },
+   }
+});

const MyApp = () => (
-   <Admin dataProvider={dataProvider}>
+   <Admin dataProvider={dataProvider} theme={theme}>
        ...
    </Admin>
);
```

- If you used a custom theme, update it to include the following lines:

```diff
const myTheme = {
    // ...
    components: {
        // ...
+       MuiFormControl: { defaultProps: { fullWidth: undefined } },
+       MuiTextField: { defaultProps: { fullWidth: undefined } },
+       MuiAutocomplete: { defaultProps: { fullWidth: undefined } },
+       RaSimpleFormIterator: { defaultProps: { fullWidth: undefined } },
+       RaTranslatableInputs: { defaultProps: { fullWidth: undefined } },
    },
};
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

## `useTheme` no longer accepts a theme object as an optional argument

The useTheme hook no longer accepts a `RaTheme` object as an argument to return a `RaTheme` object; instead, it now only takes an optional default value for the theme **preference** (`ThemeType`, like `"light"` and `"dark"`), and returns the current theme **preference** (`ThemeType`, like `"light"` and `"dark"`) and a setter for the **preference**.

If you're using a theme object to have `useTheme` determine the default value it should use, you should pass the value instead:

```diff
const myThemeObject = {
    ...
    palette: {
        type: "light",
        ...
    }
    ...
};

- const [themeObject, setTheme] = useTheme(myThemeObject)
+ const [themePreference, setTheme] = useTheme(myThemeObject.palette.type)
// Alternatively
+ const [themePreference, setTheme] = const useTheme("light")
// Alternatively, since you usually don't need a default value for the theme preference
+ const [themePreference, setTheme] = useTheme();
```

## `ToggleThemeButton` no longer accepts themes as props

In previous versions, `<ToggleThemeButton>` used to accept `lighTheme` and `darkTheme` props. These props are no longer supported in v5. Instead, you should set the themes in the `<Admin>` component. And by the way, react-admin is smart enough to include the `ToggleThemeButton` in the app bar if you set the themes in `<Admin>`, so you probably don't need to include the button manually anymore. 

```diff
-import { Admin, Layout, AppBar, ToggleThemeButton } from 'react-admin';
+import { Admin } from 'react-admin';
import { dataProvider } from './dataProvider';
import { lightTheme, darkTheme } from './themes';

-const MyAppBar = () => <AppBar toolbar={<ToggleThemeButton lightTheme={lightTheme} darkTheme={darkTheme} />} />
-const MyLayout = (props) => <Layout {...props} appBar={<MyAppBar />} />;

const App = () => (
-   <Admin dataProvider={dataProvider} layout={MyLayout}>
+   <Admin dataProvider={dataProvider} lightTheme={lightTheme} darkTheme={darkTheme}>
       ...
    </Admin>
);
```

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

## `<Datagrid expand>` Components No Longer Receive Any Props

An undocumented features allowed datagrid expand panels to read the current resource, record, and id from their props. This is no longer the case in v5, as expand panels are now rendered without props by `<Datagrid>`. 

If you used these props in your expand components, you'll have to use the `useRecordContext` hook instead:

```diff
-const PostExpandPanel = ({ record, resource, id }) => {
+const PostExpandPanel = () => {
+   const record = useRecordContext();
+   const resource = useResourceContext();
+   const id = record?.id;
    // ...
}
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

## `setFilters` Is No Longer Debounced By Default

If you're using the `useListContext` hook to filter a list, you might have used the `setFilters` function to update the filters. In react-admin v5, the `setFilters` function is no longer debounced by default. If you want to debounce the filters, you'll have to pass `true` as the third argument:

```diff
import { useListContext } from 'react-admin';

const MyFilter = () => {
    const { filterValues, setFilters } = useListContext();
    const handleChange = (event) => {
-       setFilters({ ...filterValues, [event.target.name]: event.target.value });
+       setFilters({ ...filterValues, [event.target.name]: event.target.value }, undefined, true);
    };

    return (
        <form>
            <input name="country" value={filterValues.country} onChange={handleChange} />
            <input name="city" value={filterValues.city} onChange={handleChange} />
            <input name="zipcode" value={filterValues.zipcode} onChange={handleChange} />
        </form>
    );
};
```

## Fields Components Requires The `source` Prop

The `FieldProps` interface now requires the `source` prop to be defined. As a consequence, all the default fields components also require the `source` prop to be defined.
This impacts custom fields that typed their props with the `FieldProps` interface. If your custom field is not meant to be used in a `<Datagrid>`, you may declare the `source` prop optional:

```diff
import { FieldProps, useRecordContext } from 'react-admin';

-const AvatarField = (props: FieldProps) => {
+const AvatarField = (props: Omit<FieldProps, 'source'>) => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <Avatar
            src={record.avatar}
            alt={`${record.first_name} ${record.last_name}`}
            {...props}
        />
    );
}
```

## `warnWhenUnsavedChanges` Changes

The `warnWhenUnsavedChanges` feature is a little more restrictive than before:

- It will open a confirmation dialog (and block the navigation) if a navigation is fired when the form is currently submitting (submission will continue in the background).
- [Due to browser constraints](https://stackoverflow.com/questions/38879742/is-it-possible-to-display-a-custom-message-in-the-beforeunload-popup), the message displayed in the confirmation dialog when closing the browser's tab cannot be customized (it is managed by the browser).

This behavior allows to prevent unwanted data loss in more situations. No changes are required in the code.

However, the `warnWhenUnsavedChanges` now requires a [Data Router](https://reactrouter.com/en/6.22.3/routers/picking-a-router) (a new type of router from react-router) to work. React-admin uses such a data router by default, so the feature works out of the box in v5. 

However, if you use a [custom router](./Routing.md#using-a-custom-router) and the `warnWhenUnsavedChanges` prop, the "warn when unsaved changes" feature will be disabled.

To re-enable it, you'll have to migrate your custom router to use the data router. For instance, if you were using `react-router`'s `BrowserRouter`, you will need to migrate to `createBrowserRouter` and wrap your app in a `RouterProvider`:

```diff
import * as React from 'react';
import { Admin, Resource } from 'react-admin';
import { createRoot } from 'react-dom/client';
-import { BrowserRouter } from 'react-router-dom';
+import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import dataProvider from './dataProvider';
import posts from './posts';

const App = () => (
-    <BrowserRouter>
        <Admin dataProvider={dataProvider}>
            <Resource name="posts" {...posts} />
        </Admin>
-    </BrowserRouter>
);

+const router = createBrowserRouter([{ path: '*', element: <App /> }]);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
-        <App />
+        <RouterProvider router={router} />
    </React.StrictMode>
);
```

**Tip:** Check out the [Migrating to RouterProvider](https://reactrouter.com/en/main/upgrading/v6-data) documentation to learn more about the migration steps and impacts.

## `<Admin history>` Prop Was Removed

The `<Admin history>` prop was deprecated since version 4. It is no longer supported.

The most common use-case for this prop was inside unit tests (and stories), to pass a `MemoryRouter` and control the `initialEntries`.

To that purpose, `react-admin` now exports a `TestMemoryHistory` component that you can use in your tests:

```diff
import { render, screen } from '@testing-library/react';
-import { createMemoryHistory } from 'history';
-import { CoreAdminContext } from 'react-admin';
+import { CoreAdminContext, TestMemoryRouter } from 'react-admin';
import * as React from 'react';

describe('my test suite', () => {
    it('my test', async () => {
-       const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
+           <TestMemoryRouter initialEntries={['/']}>
-             <CoreAdminContext history={history}>
+             <CoreAdminContext>
                <div>My Component</div>
              </CoreAdminContext>
+           </TestMemoryRouter>
        );
        await screen.findByText('My Component');
    });
});
```

### Codemod

To help you migrate your tests, we've created a codemod that will replace the `<Admin history>` prop with the `<TestMemoryRouter>` component.

> **DISCLAIMER**
>
> This codemod was used to migrate the react-admin test suite, but it was never designed to cover all cases, and was not tested against other code bases. You can try using it as basis to see if it helps migrating your code base, but please review the generated changes thoroughly!
>
> Applying the codemod might break your code formatting, so please don't forget to run `prettier` and/or `eslint` after you've applied the codemod!

For `.js` or `.jsx` files:

```sh
npx jscodeshift ./path/to/src/ \
    --extensions=js,jsx \
    --transform=./node_modules/ra-core/codemods/replace-Admin-history.ts
```

For `.ts` or `.tsx` files:

```sh
npx jscodeshift ./path/to/src/ \
    --extensions=ts,tsx \
    --parser=tsx \
    --transform=./node_modules/ra-core/codemods/replace-Admin-history.ts
```

## `<HistoryRouter>` Was Removed

Along with the removal of the `<Admin history>` prop, we also removed the (undocumented) `<HistoryRouter>` component.

Just like for `<Admin history>`, the most common use-case for this component was inside unit tests (and stories), to control the `initialEntries`.

Here too, you can use `TestMemoryHistory` as a replacement:

```diff
import { render, screen } from '@testing-library/react';
-import { createMemoryHistory } from 'history';
-import { CoreAdminContext, HistoryRouter } from 'react-admin';
+import { CoreAdminContext, TestMemoryRouter } from 'react-admin';
import * as React from 'react';

describe('my test suite', () => {
    it('my test', async () => {
-       const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
-           <HistoryRouter history={history}>            
+           <TestMemoryRouter initialEntries={['/']}>
              <CoreAdminContext>
                <div>My Component</div>
              </CoreAdminContext>
-           </HistoryRouter>
+           </TestMemoryRouter>
        );
        await screen.findByText('My Component');
    });
});
```

## TypeScript: `useRecordContext` Returns `undefined` When No Record Is Available

The `useRecordContext` hook reads the current record from the `RecordContext`. This context may be empty (e.g. while the record is being fetched). The return type for `useRecordContext` has been modified to `Record | undefined` instead of `Record` to denote this possibility.

As a consequence, the TypeScript compilation of your project may fail if you don't check the existence of the record before reading it.

To fix this error, your code should handle the case where `useRecordContext` returns `undefined`:

```diff
const MyComponent = () => {
    const record = useRecordContext();
+   if (!record) return null;
    return (
        <div>
            <h1>{record.title}</h1>
            <p>{record.body}</p>
        </div>
    );
};
```

## TypeScript: Page Contexts Are Now Types Instead of Interfaces

The return type of page controllers is now a type. If you were using an interface extending one of:

- `ListControllerResult`,
- `InfiniteListControllerResult`,
- `EditControllerResult`,
- `ShowControllerResult`, or
- `CreateControllerResult`,

you'll have to change it to a type:

```diff
import { ListControllerResult } from 'react-admin';

-interface MyListControllerResult extends ListControllerResult {
+type MyListControllerResult = ListControllerResult & {
    customProp: string;
};
```

## TypeScript: Stronger Types For Page Contexts

The return type of page context hooks is now smarter. This concerns the following hooks:

- `useListContext`,
- `useEditContext`,
- `useShowContext`, and
- `useCreateContext`

Depending on the fetch status of the data, the type of the `data`, `error`, and `isPending` properties will be more precise:

- Loading: `{ data: undefined, error: undefined, isPending: true }`
- Success: `{ data: <Data>, error: undefined, isPending: false }`
- Error: `{ data: undefined, error: <Error>, isPending: false }`
- Error After Refetch: `{ data: <Data>, error: <Error>, isPending: false }`

This means that TypeScript may complain if you use the `data` property without checking if it's defined first. You'll have to update your code to handle the different states:

```diff
const MyCustomList = () => {
    const { data, error, isPending } = useListContext();
    if (isPending) return <Loading />;
+   if (error) return <Error />;
    return (
        <ul>
            {data.map(record => (
                <li key={record.id}>{record.name}</li>
            ))}
        </ul>
    );
};
```

Besides, these hooks will now throw an error when called outside of a page context. This means that you can't use them in a custom component that is not a child of a `<List>`, `<ListBase>`, `<Edit>`, `<EditBase>`, `<Show>`, `<ShowBase>`, `<Create>`, or `<CreateBase>` component.

## TypeScript: `EditProps` and `CreateProps` now expect a `children` prop

`EditProps` and `CreateProps` now expect a `children` prop, just like `ListProps` and `ShowProps`. If you were using these types in your custom components, you'll have to update them:

```diff
-const ReviewEdit = ({ id }: EditProps) => (
+const ReviewEdit = ({ id }: Omit<EditProps, 'children'>) => (
   <Edit id={id}>
        <SimpleForm>
            ...
```

## List Components Can No Longer Be Used In Standalone

An undocumented feature allowed some components designed for list pages to be used outside of a list page, by relying on their props instead of the `ListContext`. This feature was removed in v5.

This concerns the following components:

- `<BulkActionsToolbar>`
- `<BulkDeleteWithConfirmButton>`
- `<BulkDeleteWithUndoButton>`
- `<BulkExportButton>`
- `<BulkUpdateWithConfirmButton>`
- `<BulkUpdateWithUndoButton>`
- `<EditActions>`
- `<ExportButton>`
- `<FilterButton>`
- `<FilterForm>`
- `<ListActions>`
- `<Pagination>`
- `<UpdateWithConfirmButton>`
- `<UpdateWithUndoButton>`

To continue using these components, you'll have to wrap them in a `<ListContextProvider>` component:

```diff
const MyPagination = ({
    page,
    perPage,
    total,
    setPage,
    setPerPage,
}) => {
    return (
-       <Pagination page={page} perPage={perPage} total={total} setPage={setPage} setPerPage={setPerPage} />
+       <ListContextProvider value={{ page, perPage, total, setPage, setPerPage }}>
+           <Pagination />
+       </ListContextProvider>
    );
};
```

The following components are not affected and can still be used in standalone mode:

- `<Datagrid>`
- `<SimpleList>`
- `<SingleFieldList>`

## Inputs No Longer Require To Be Touched To Display A Validation Error

In previous versions, validation errors were only displayed after the input was touched or the form was submitted. In v5, validation errors are fully entrusted to the form library (`react-hook-form`), which is responsible to decide when to display them.

**Tip:** You can use the [`mode`](https://react-hook-form.com/docs/useform#mode) prop to configure the validation strategy to your needs (`onSubmit`, `onBlur`, `onChange`, or `onTouched`).

For most use-cases this will have no impact, because `react-hook-form` works the same way (it will wait for an input to be touched before triggering its validation).

But this should help with some advanced cases, for instance if some validation errors need to be displayed on untouched fields.

It will also improve the user experience, as the form `isValid` state will be consistent with error messages displayed on inputs, regardless of whether they have been touched or not.

## `<InputHelperText touched>` Prop Was Removed

The `<InputHelperText>` component no longer accepts a `touched` prop. This prop was used to display validation errors only if the input was touched. This behavior is now handled by `react-hook-form`.

If you were using this prop, you can safely remove it.

## `useCheckAuth` No Longer Accepts A `disableNotification` Param

The `useCheckAuth` hook no longer accepts the deprecated `disableNotification` param. To disable the "Authentication required" notification when calling `checkAuth`, `authProvider.checkAuth()` should return a rejected promise with the value `{ message: false }`:

```ts
const authProvider: AuthProvider = {
    //...
    checkAuth: () => Promise.reject({ message: false }),
}
```

## `useLogoutIfAccessDenied` No Longer Accepts A `disableNotification` Param

The `useLogoutIfAccessDenied` hook no longer accepts the deprecated `disableNotification` param. To disable the "Authentication required" notification when `checkError` is called, `authProvider.checkError()` should return a rejected promise with the value `{ message: false }`:

```ts
const authProvider: AuthProvider = {
    //...
    checkError: () => Promise.reject({ message: false }),
}
```

Or the `useLogoutIfAccessDenied` hook could be called with an error param as follows:

```ts
const logoutIfAccessDenied = useLogoutIfAccessDenied();
logoutIfAccessDenied(new Error('Denied'));
```
## `onError` Type From `ra-core` Was Removed

The `onError` type from `ra-core` was removed. Use `OnError` instead.

## `linkToRecord` Helper Was Removed

The `linkToRecord` helper was removed. Use [`useCreatePath`](https://marmelab.com/react-admin/Routing.html#linking-to-a-page) instead.

## `resolveRedirectTo` Helper Was Removed

The `resolveRedirectTo` helper was removed. Use [`useCreatePath`](https://marmelab.com/react-admin/Routing.html#linking-to-a-page) instead.

## `formClassName` Prop Of `FieldProps` Type Was Removed

The deprecated `formClassName` prop of `FieldProps` type has been removed as it is no longer used.

## `formClassName` Prop Of `CommonInputProps` Type Was Removed

The deprecated `formClassName` prop of `CommonInputProps` type has been removed as it is no longer used.

## Upgrading to v4

If you are on react-admin v3, follow the [Upgrading to v4](https://marmelab.com/react-admin/doc/4.16/Upgrade.html) guide before upgrading to v5.
