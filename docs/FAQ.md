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

Your `@material-ui/core` and `@material-ui/icons` version specified in `package.json` should be the same version used by `react-admin`.
See this [issue for more information](https://github.com/marmelab/react-admin/issues/1782).
