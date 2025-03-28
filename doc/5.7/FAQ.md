---
layout: default
title: "FAQ"
---

# FAQ

- [Can I have custom identifiers/primary keys for my resources?](#can-i-have-custom-identifiersprimary-keys-for-my-resources)
- [I get a warning about unique key for child in array](#i-get-a-warning-about-unique-key-for-child-in-array)
- [How can I customize forms depending on its inputs values?](#how-can-i-customize-forms-depending-on-its-inputs-values)
- [UI in production build is empty or broken](#ui-in-production-build-is-empty-or-broken)
- [My Resource is defined but not displayed on the Menu](#my-resource-is-defined-but-not-displayed-on-the-menu)
- [I get an error about control being null](#i-get-an-error-about-control-being-null)
- [I get an error about a hook that may be used only in the context of a Router component](#i-get-an-error-about-a-hook-that-may-be-used-only-in-the-context-of-a-router-component)

## Can I have custom identifiers/primary keys for my resources?

React-admin requires that each resource has an `id` field to identify it. If your API uses a different name for the primary key, you have to map that name to `id` in your [dataProvider](./DataProviders.md). For instance, to use a field named `_id` as identifier:

```diff
const dataProvider = {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
-           data: json,
+           data: json.map(resource => ({ ...resource, id: resource._id }) ),
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },
    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
-           data: json,
+           { ...json, id: json._id },
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ 
-           data: json,
+           data: json.map(resource => ({ ...resource, id: resource._id }) ),
        }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
-           data: json,
+           data: json.map(resource => ({ ...resource, id: resource._id }) ),
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ 
-           data: json,
+           { ...json, id: json._id },
        })),

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    }

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
-           data: { ...params.data, id: json.id },
+           data: { ...params.data, id: json._id },
        })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ 
-           data: json,
+           { ...json, id: json._id },
        })),

    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    }
};
```

## I get a warning about unique key for child in array

When displaying a `Datagrid` component, you get the following warning:

> Warning: Each child in an array or iterator should have a unique "key" prop.
> Check the render method of `DatagridBody`.

This is most probably because the resource does not have an `id` property as expected by react-admin. See the previous FAQ to see how to resolve this: [Can I have custom identifiers/primary keys for my resources?](#can-i-have-custom-identifiersprimary-keys-for-my-resources)

## How can I customize forms depending on its inputs values?

Some use cases:

- Show/hide some inputs if another input has a value
- Show/hide some inputs if another input has a specific value
- Show/hide some inputs if the current form value matches specific constraints

For all those cases, you can use the [`<FormDataConsumer>`](https://marmelab.com/react-admin/Inputs.html#linking-two-inputs) component.

## UI in production build is empty or broken

You have probably specified a version requirement for `@mui/material` that is incompatible with the one required by `react-admin`. As a consequence, npm bundled two copies of Material UI in your application, and doesn't work in that case.

Please align your version requirement with the one of the `ra-ui-materialui` package.

See this [issue for more information](https://github.com/marmelab/react-admin/issues/1782).

## My Resource is defined but not displayed on the Menu

You may have declared a resource without `list` prop. But with the default menu, only resources with a `list` prop are shown.

```jsx
<Admin>
    <Resource name="reference" create={PostReference} edit={EditReference} />
</Admin>
```

In order to have a specific resource without `list` prop listed on the menu, you have to [write your own custom menu](./Menu.md).

```jsx
import { Menu } from 'react-admin';

export const MyMenu = () => (
    <Menu>
        <Menu.ResourceItems />
        <Menu.Item to="/reference/create" primaryText="New Reference" />
    </Menu>
);
```

## I get an error about control being null

In a view that contains a form, you may get the following error:

> Cannot read properties of null (reading 'control')

This is most probably because you have multiple versions of the `react-hook-form` package installed, one being a direct dependency in your project and the other brought by react-admin.

First, you can run `npm list react-hook-form` to check if you have duplicate versions.

To dedupe the package you can run `npm dedupe react-hook-form` or `yarn dedupe react-hook-form`.

You may also edit the lockfile manually.

Finally, you can use yarn’s [resolutions](https://yarnpkg.com/configuration/manifest#resolutions) or npm’s [overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides) in your `package.json` file:

```json
{
  "resolutions": {
    "react-hook-form": "7.54.2"
  }
}
```

## I get an error about a hook that may be used only in the context of a Router component

When using custom routing configurations, you may encounter strange error messages like:

> `useLocation()` may be used only in the context of a `<Router>` component

or

> `useNavigate()` may be used only in the context of a `<Router>` component

or 

> `useRoutes()` may be used only in the context of a `<Router>` component

or 

> `useHref()` may be used only in the context of a `<Router>` component.

or

> `<Route>` may be used only in the context of a `<Router>` component

These errors can happen if you added `react-router` and/or `react-router-dom` to your dependencies, and didn't use the same version as react-admin. In that case, your application has two versions of react-router, and the calls you add can't see the react-admin routing context.

You can use the `npm list react-router` and `npm list react-router-dom` commands to check which versions are installed.

If there are duplicates, you need to make sure to use only the same version as react-admin. You can deduplicate them using yarn's [resolutions](https://yarnpkg.com/configuration/manifest#resolutions) or npm’s [overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides).

```js
// in packages.json
{
    // ...
  "resolutions": {
    "react-router-dom": "6.7.0",
    "react-router": "6.7.0"
  }
}
```

This may also happen inside a [Remix](https://remix.run/) application. See [Setting up react-admin for Remix](./Remix.md#setting-up-react-admin-in-remix) for instructions to overcome that problem.