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

Once it receives the deduplicated reference resources, this component delegates rendering to a subcomponent, by providing the possible choices through the `ReferenceArrayInputContext`. This context value can be accessed with the [`useReferenceArrayInputContext`](#usereferencearrayinputcontext) hook.

This means you can use `<ReferenceArrayInput>` with [`<SelectArrayInput>`](./SelectArrayInput.md), or with the component of your choice, provided it supports the `choices` attribute.

The component expects a `source` and a `reference` attributes. For instance, to make the `tag_ids` for a `post` editable:

```jsx
import { ReferenceArrayInput, SelectArrayInput } from 'react-admin';

<ReferenceArrayInput source="tag_ids" reference="tags">
    <SelectArrayInput optionText="name" />
</ReferenceArrayInput>
```

![SelectArrayInput](./img/select-array-input.gif)

**Note**: You **must** add a `<Resource>` for the reference resource - react-admin needs it to fetch the reference data. You can omit the list prop in this reference if you want to hide it in the sidebar menu.

```jsx
<Admin dataProvider={myDataProvider}>
    <Resource name="posts" list={PostList} edit={PostEdit} />
    <Resource name="tags" />
</Admin>
```

Set the `allowEmpty` prop when you want to add an empty choice with a value of `null` in the choices list.
Disabling `allowEmpty` does not mean that the input will be required. If you want to make the input required, you must add a validator as indicated in [Validation Documentation](./CreateEdit.md#validation). Enabling the `allowEmpty` props just adds an empty choice (with `null` value) on top of the options, and makes the value nullable.

```jsx
import { ReferenceArrayInput, SelectArrayInput } from 'react-admin';

<ReferenceArrayInput source="tag_ids" reference="tags" allowEmpty>
    <SelectArrayInput optionText="name" />
</ReferenceArrayInput>
```

**Tip**: `allowEmpty` is set by default for all Input components passed as `<List filters>`.

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

In addition to the `ReferenceArrayInputContext`, `<ReferenceArrayInput>` also sets up a `ListContext` providing access to the records from the reference resource in a similar fashion to that of the `<List>` component. This `ListContext` value is accessible with the [`useListContext`](./useListContext.md) hook.

`<ReferenceArrayInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `useReferenceArrayInputContext`

The [`<ReferenceArrayInput>`](./ReferenceArrayInput.md) hook takes care of fetching the data, and putting that data in a context called `ReferenceArrayInputContext` so that it’s available for its descendants. This context also stores filters, pagination, sort state, and provides callbacks to update them.

Any component descendant of `<ReferenceArrayInput>` can grab information from the `ReferenceArrayInputContext` using the `useReferenceArrayInputContext` hook. Here is what it returns:

```js
const {
    choices, // An array of records matching both the current input value and the filters
    error, // A potential error that may have occured while fetching the data
    warning, // A potential warning regarding missing references 
    loaded, // boolean that is false until the data is available
    loading, // boolean that is true on mount, and false once the data was fetched
    setFilter, // a callback to update the filters, e.g. setFilters({ q: 'query' })
    setPagination, // a callback to change the pagination, e.g. setPagination({ page: 2, perPage: 50 })
    setSort, // a callback to change the sort, e.g. setSort({ field: 'name', order: 'DESC' })
} = useReferenceArrayInputContext();
```
