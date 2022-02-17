---
layout: default
title: "The ReferenceArrayInput Component"
---

# `<ReferenceArrayInput>`

Use `<ReferenceArrayInput>` to edit an array of reference values, i.e. to let users choose a list of values (usually foreign keys) from another REST endpoint.

`<ReferenceArrayInput>` fetches the related resources (using `dataProvider.getMany()`) as well as possible resources (using `dataProvider.getList()`) in the reference endpoint.

For instance, if the post object has many tags, a post resource may look like:

```json
{
    "id": 1234,
    "tag_ids": [1, 23, 4]
}
```

Then `<ReferenceArrayInput>` would fetch a list of tag resources from these two calls:

```
http://myapi.com/tags?id=[1,23,4]
http://myapi.com/tags?page=1&perPage=25
```

Once it receives the deduplicated reference resources, this component delegates rendering to its child component, by providing the possible choices through the `ChoicesContext`. This context value can be accessed with the [`useChoicesContext`](./useChoicesContext.md) hook.

This means you can use `<ReferenceArrayInput>` with [`<SelectArrayInput>`](./SelectArrayInput.md), or with the component of your choice, provided they detect a `ChoicesContext` is available and get their choices from it.

The component expects a `source` and a `reference` attributes. For instance, to make the `tag_ids` for a `post` editable:

```jsx
import { ReferenceArrayInput, SelectArrayInput } from 'react-admin';

<ReferenceArrayInput source="tag_ids" reference="tags">
    <SelectArrayInput optionText="name" />
</ReferenceArrayInput>
```

![SelectArrayInput](./img/select-array-input.gif)

You can tweak how this component fetches the possible values using the `perPage`, `sort`, and `filter` props.

{% raw %}
```jsx
// by default, fetches only the first 25 values. You can extend this limit
// by setting the `perPage` prop.
<ReferenceArrayInput
    source="tag_ids"
    reference="tags"
    perPage={100}
>
    <SelectArrayInput optionText="name" />
</ReferenceArrayInput>

// by default, orders the possible values by id desc. You can change this order
// by setting the `sort` prop (an object with `field` and `order` properties).
<ReferenceArrayInput
    source="tag_ids"
    reference="tags"
    sort={{ field: 'title', order: 'ASC' }}
>
    <SelectArrayInput optionText="name" />
</ReferenceArrayInput>

// you can filter the query used to populate the possible values. Use the
// `filter` prop for that.
<ReferenceArrayInput
    source="tag_ids"
    reference="tags"
    filter={{ is_published: true }}
>
    <SelectArrayInput optionText="name" />
</ReferenceArrayInput>
```
{% endraw %}

**Tip**: `<ReferenceArrayInput>` can also be used with an `<AutocompleteArrayInput>` to allow filtering the choices. By default, it will fetch the choices on mount, but you can prevent this by using the `enableGetChoices`. This prop should be a function that receives the `filterValues` as parameter and return a boolean. In order to also hide the choices when `enableGetChoices` returns `false`, you should use `shouldRenderSuggestions` on the `<AutocompleteArrayInput>`:

```jsx
<ReferenceArrayInput
    label="Tags"
    reference="tags"
    source="tags"
    enableGetChoices={({ q }) => (q ? q.length >= 2 : false)}
>
    <AutocompleteArrayInput
        shouldRenderSuggestions={value => value.length >= 2}
    />
</ReferenceArrayInput>
```

`<ReferenceArrayInput>` also accepts the [common input props](./Inputs.md#common-input-props).
