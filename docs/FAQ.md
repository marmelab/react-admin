---
layout: default
title: "FAQ"
---

# FAQ

- [Can I have custom identifiers/primary keys for my resources?](#can-i-have-custom-identifiers-primary-keys-for-my-resources)
- [How can I customize the UI depending on the user permissions?](#how-can-i-customize-the-ui-depending-on-the-user-permissions)
- [How can I customize forms depending on its inputs values?](#how-can-i-customize-forms-depending-on-its-inputs-values)

## Can I have custom identifiers/primary keys for my resources?

Admin-on-rest requires that each resource has an `id` field to identify it. If your REST API uses a different name for the primary key, you have to map that name to `id` in a custom [restClient](https://marmelab.com/admin-on-rest/RestClients.md). For instance, to use a field named `_id` as identifier:

```js
const convertHTTPResponseToREST = (response, type, resource, params) => {
    const { headers, json } = response;
    switch (type) {
    case GET_LIST:
        return {
            data: json.map(resource => { ...resource, id: resource._id } ),
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
