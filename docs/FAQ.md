---
layout: default
title: "FAQ"
---

# FAQ

- [FAQ](#faq)
  - [Can I have custom identifiers/primary keys for my resources?](#can-i-have-custom-identifiersprimary-keys-for-my-resources)
  - [I get warning about unique key for child in array](#i-get-warning-about-unique-key-for-child-in-array)
  - [How can I customize the UI depending on the user permissions?](#how-can-i-customize-the-ui-depending-on-the-user-permissions)
  - [How can I customize forms depending on its inputs values?](#how-can-i-customize-forms-depending-on-its-inputs-values)
  - [UI in production build is empty or broke](#ui-in-production-build-is-empty-or-broke)
  - [My Resource is defined but not displayed on the Menu](#my-resource-is-defined-but-not-displayed-on-the-menu)
  - [Why Doesn't React Admin Support The Latest Version Of Material-UI?](#why-doesnt-react-admin-support-the-latest-version-of-material-ui)

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

## I get warning about unique key for child in array

When displaying a `Datagrid` component, you get the following warning:

> Warning: Each child in an array or iterator should have a unique "key" prop.
> Check the render method of `DatagridBody`.

This is most probably because the resource does not have an `id` property as expected by react-admin. See the previous FAQ to see how to resolve this: [Can I have custom identifiers/primary keys for my resources?](#can-i-have-custom-identifiersprimary-keys-for-my-resources)

## How can I customize the UI depending on the user permissions?

Some fairly common use cases which may be dependent on the user permissions:

- Specific views
- Having parts of a view (fields, inputs) differents for specific users
- Hiding or displaying menu items

For all those cases, you can use the [aor-permissions](https://github.com/marmelab/aor-permissions) addon.

## How can I customize forms depending on its inputs values?

Some use cases:

- Show/hide some inputs if another input has a value
- Show/hide some inputs if another input has a specific value
- Show/hide some inputs if the current form value matches specific constraints

For all those cases, you can use the [`<FormDataConsumer>`](https://marmelab.com/react-admin/Inputs.html#linking-two-inputs) component.

## UI in production build is empty or broke

You have probably specified a version requirement for `@material-ui/core` that is incompatible with the one required by `react-admin`. As a consequence, npm bundled two copies of `material-ui` in your application, and `material-ui` doesn't work in that case.

Please align your version requirement with the one of the `ra-ui-materialui` package.

See this [issue for more information](https://github.com/marmelab/react-admin/issues/1782).

## My Resource is defined but not displayed on the Menu

You can declare a resource without `list` prop, to manage reference for example:

```jsx
<Admin>
    <Resource name="reference" create={PostReference} edit={EditReference} />
</Admin>
```

But with the default menu, resources without `list` prop aren't shown.

In order to have a specific resource without `list` prop listed on the menu, you have to [write your own custom menu](./Theming.md#using-a-custom-menu).

```jsx
 const MyMenu = ({ resources, onMenuClick, logout }) => (
    <div>
        {resources.map(resource => (
            <MenuItemLink to={`/${resource.name}`} primaryText={resource.name} onClick={onMenuClick} />
        ))}
        <MenuItemLink to="/reference/create" primaryText="New Reference" onClick={onMenuClick} />
    </div>
);
```

## Why Doesn't React Admin Support The Latest Version Of Material-UI?

React Admin users and third-party libraries maintainers might have noticed that the default UI template `ra-ui-materialui` [has `@material-ui/core@^1.4.0` as dependency](https://github.com/marmelab/react-admin/blob/ae45a2509b391a6ea81cdf9c248ff9d28364b6e1/packages/ra-ui-materialui/package.json#L44) even though the latest version of Material UI is already 3.x.

We chose not to upgrade to Material UI v3 when it was released because the MUI team was already hard at work preparing the next major version ([which includes major breaking changes](https://github.com/mui-org/material-ui/issues/13663)). In fact, material-ui published a release schedule for one major version every 6 months. This means that developers using material-ui have to upgrade their codebase every six months to get the latest updates. On the other hand, react-admin plans to release a major version once every year, minimizing the upgrade work for developers. This gain in stability is a trade-off - react-admin users can't use the latest version of material-ui for about half a year.

Feel free to discuss this policy in [issue #2399](https://github.com/marmelab/react-admin/issues/2399).

If you are a maintainer of a third-party library based on React Admin, your library has to add material-ui v1.x as a peer dependency.
