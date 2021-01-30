---
layout: default
title: "FAQ"
---

# FAQ

- [Can I have custom identifiers/primary keys for my resources?](#can-i-have-custom-identifiersprimary-keys-for-my-resources)
- [I get warning about unique key for child in array](#i-get-warning-about-unique-key-for-child-in-array)
- [How can I customize forms depending on its inputs values?](#how-can-i-customize-forms-depending-on-its-inputs-values)
- [UI in production build is empty or broke](#ui-in-production-build-is-empty-or-broke)
- [My Resource is defined but not displayed on the Menu](#my-resource-is-defined-but-not-displayed-on-the-menu)

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
