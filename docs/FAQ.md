---
layout: default
title: "FAQ"
---

# FAQ

- [Can I have custom identifiers/primary keys for my resources?](#can-i-have-custom-identifiersprimary-keys-for-my-resources)
- [I get warning about unique key for child in array](#i-get-warning-about-unique-key-for-child-in-array)
- [A form with validation freezes when rendering](#a-form-with-validation-freezes-when-rendering)
- [How can I customize the UI depending on the user permissions?](#how-can-i-customize-the-ui-depending-on-the-user-permissions)
- [How can I customize forms depending on its inputs values?](#how-can-i-customize-forms-depending-on-its-inputs-values)
- [My Resource is defined but not displayed on the Menu](#my-resource-is-defined-but-not-displayed-on-the-menu)
- [Why React Admin Doesn't Support The Latest Version Of Material-UI?](#why-react-admin-doesnt-support-the-latest-version-of-material-ui)

## Can I have custom identifiers/primary keys for my resources?

React-admin requires that each resource has an `id` field to identify it. If your API uses a different name for the primary key, you have to map that name to `id` in a custom [dataProvider](./DataProviders.md). For instance, to use a field named `_id` as identifier:

```js
const convertHTTPResponse = (response, type, resource, params) => {
    const { headers, json } = response;
    switch (type) {
    case GET_LIST:
        return {
            data: json.map(resource => ({ ...resource, id: resource._id }) ),
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        };
    case UPDATE:
    case DELETE:
    case GET_ONE:
        return { ...json, id: json._id };
    case CREATE:
        return { ...params.data, id: json._id };
    default:
        return json;
    }
};
```

## I get warning about unique key for child in array

When displaying a `Datagrid` component, you get the following warning:

> Warning: Each child in an array or iterator should have a unique "key" prop.
> Check the render method of `DatagridBody`.

This is most probably because the resource does not have an `id` property as expected by react-admin. See the previous FAQ to see how to resolve this: [Can I have custom identifiers/primary keys for my resources?](#can-i-have-custom-identifiersprimary-keys-for-my-resources)

## A form with validation freezes when rendering

You're probably using validator factories directly in the render method of your component:

```jsx
export const CommentEdit = ({ ...props }) => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <DateInput source="created_at" />
            <LongTextInput source="body" validate={minLength(10)} />
        </SimpleForm>
    </Edit>
);
```

Avoid calling functions directly inside the render method:

```jsx
const validateMinLength = minLength(10);

export const CommentEdit = ({ ...props }) => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <DateInput source="created_at" />
            <LongTextInput source="body" validate={validateMinLength} />
        </SimpleForm>
    </Edit>
);
```

This is related to [redux-form](https://github.com/erikras/redux-form/issues/3288).

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
- Show/hide some inputs if the current form values matches specific constraints

For all those cases, you can use the [aor-dependent-input](https://github.com/marmelab/aor-dependent-input) addon.

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

In order to have a specific resource without `list` prop listed on the menu, you have to [write your own custom menu](./Theming.html#using-a-custom-menu).

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

## Why React Admin Doesn't Support The Latest Version Of Material-UI?

React Admin users and third-party libraries maintainers might have noticed that the default UI template [`ra-ui-materialui` has `@material-ui/core@^1.4.0` as dependency](https://github.com/marmelab/react-admin/blob/ae45a2509b391a6ea81cdf9c248ff9d28364b6e1/packages/ra-ui-materialui/package.json#L44) even though the latest version of Material UI is up to 3.x.

We didn't planned to upgrade to Material UI v3 few month ago because the MUI team is quick to develop major versions (which include breaking changes), and our team can't follow them. More details on the [issue #2399](https://github.com/marmelab/react-admin/issues/2399).

As of now, the MUI team already considered a [v4 with major breaking changes including the styling system, React 16.8 support and the usage the hook API as its core](https://github.com/mui-org/material-ui/issues/13663).

Upgrading Material UI on React Admin means a breaking change. The version 2 of React Admin doesn't have one year, so it's unlikely we plan a migration for Material UI v3.

If you are a maintainer of a third-party library based on React Admin, your library have to get the Materiual UI v1.x version as a peer dependency.
