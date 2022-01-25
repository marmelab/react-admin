---
layout: default
title: "The ReferenceInput Component"
---

# `<ReferenceInput>`

Use `<ReferenceInput>` for foreign-key values, for instance, to edit the `post_id` of a `comment` resource. This component fetches the related record (using `dataProvider.getMany()`) as well as possible choices (using `dataProvider.getList()` in the reference resource), then delegates rendering to a subcomponent, to which it passes the possible choices as the `choices` attribute.

This means you can use `<ReferenceInput>` with any of [`<SelectInput>`](./SelectInput.md), [`<AutocompleteInput>`](./AutocompleteInput.md), or [`<RadioButtonGroupInput>`](./RadioButtonGroupInput.md), or even with the component of your choice, provided it supports the `choices` attribute.

The component expects a `source` and a `reference` attributes. For instance, to make the `post_id` for a `comment` editable:

```jsx
import { ReferenceInput, SelectInput } from 'react-admin';

<ReferenceInput label="Post" source="post_id" reference="posts">
    <SelectInput optionText="title" />
</ReferenceInput>
```

![ReferenceInput](./img/reference-input.gif)

**Note**: You **must** add a `<Resource>` for the reference resource - react-admin needs it to fetch the reference data. You *can* omit the `list` prop in this reference if you want to hide it in the sidebar menu.

```jsx
<Admin dataProvider={myDataProvider}>
    <Resource name="comments" list={CommentList} />
    <Resource name="posts" />
</Admin>
```

## Properties

| Prop               | Required | Type                                        | Default                               | Description                                                                                                           |
|--------------------|----------|---------------------------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `allowEmpty`       | Optional | `boolean`                                   | `false`                               | If true, add an empty item to the list of choices to allow for empty value                                            |
| `filter`           | Optional | `Object`                                    | `{}`                                  | Permanent filters to use for getting the suggestion list                                                              |
| `filterToQuery`    | Optional | `string` => `Object`                        | `searchText => ({ q: [searchText] })` | How to transform the searchText (passed e.g. by an `<AutocompleteArrayInput>`) into a parameter for the data provider |
| `perPage`          | Optional | `number`                                    | 25                                    | Number of suggestions to show                                                                                         |
| `reference`        | Required | `string`                                    | ''                                    | Name of the reference resource, e.g. 'posts'.                                                                         |
| `sort`             | Optional | `{ field: String, order: 'ASC' or 'DESC' }` | `{ field: 'id', order: 'DESC' }`      | How to order the list of suggestions                                                                                  |
| `enableGetChoices` | Optional | `({q: string}) => boolean`                  | `() => true`                          | Function taking the `filterValues` and returning a boolean to enable the `getList` call.                              |


`<ReferenceInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## Usage

Set the `allowEmpty` prop when you want to add an empty choice with a value of `null` in the choices list.
Disabling `allowEmpty` does not mean that the input will be required. If you want to make the input required, you must add a validator as indicated in [Validation Documentation](./CreateEdit.md#validation). Enabling the `allowEmpty` props just adds an empty choice (with `null` value) on top of the options, and makes the value nullable.

```jsx
import { ReferenceInput, SelectInput } from 'react-admin';

<ReferenceInput label="Post" source="post_id" reference="posts" allowEmpty>
    <SelectInput optionText="title" />
</ReferenceInput>
```

**Tip**: `allowEmpty` is set by default for all Input components passed as `<List filters>`:

```jsx
const commentFilters = [
    <ReferenceInput label="Post" source="post_id" reference="posts"> // no need for allowEmpty
        <SelectInput optionText="title" />
    </ReferenceInput>
];
```

You can tweak how this component fetches the possible values using the `perPage`, `sort`, and `filter` props.

{% raw %}
```jsx
// by default, fetches only the first 25 values. You can extend this limit
// by setting the `perPage` prop.
<ReferenceInput
    source="post_id"
    reference="posts"
    perPage={100}
>
    <SelectInput optionText="title" />
</ReferenceInput>

// by default, orders the possible values by id desc. You can change this order
// by setting the `sort` prop (an object with `field` and `order` properties).
<ReferenceInput
    source="post_id"
    reference="posts"
    sort={{ field: 'title', order: 'ASC' }}
>
    <SelectInput optionText="title" />
</ReferenceInput>

// you can filter the query used to populate the possible values. Use the
// `filter` prop for that.
<ReferenceInput
    source="post_id"
    reference="posts"
    filter={{ is_published: true }}
>
    <SelectInput optionText="title" />
</ReferenceInput>
```
{% endraw %}

The child component may further filter results (that's the case, for instance, for `<AutocompleteInput>`). ReferenceInput passes a `setFilter` function as prop to its child component. It uses the value to create a filter for the query - by default `{ q: [searchText] }`. You can customize the mapping
`searchText => searchQuery` by setting a custom `filterToQuery` function prop:

```jsx
<ReferenceInput
    source="post_id"
    reference="posts"
    filterToQuery={searchText => ({ title: searchText })}
>
    <AutocompleteInput optionText="title" />
</ReferenceInput>
```

The child component receives the following props from `<ReferenceInput>`:

- `loading`: whether the request for possible values is loading or not
- `filter`: the current filter of the request for possible values. Defaults to `{}`.
- `pagination`: the current pagination of the request for possible values. Defaults to `{ page: 1, perPage: 25 }`.
- `sort`: the current sorting of the request for possible values. Defaults to `{ field: 'id', order: 'DESC' }`.
- `error`: the error message if the form validation failed for that input
- `warning`: the warning message if the form validation failed for that input
- `onChange`: function to call when the value changes
- `setFilter`: function to call to update the filter of the request for possible values
- `setPagination`: : function to call to update the pagination of the request for possible values
- `setSort`: function to call to update the sorting of the request for possible values

**Tip** You can make the `getList()` call lazy by using the `enableGetChoices` prop. This prop should be a function that receives the `filterValues` as parameter and return a boolean. This can be useful when using an `AutocompleteInput` on a resource with a lot of data. The following example only starts fetching the options when the query has at least 2 characters:

```jsx
<ReferenceInput
     source="post_id"
     reference="posts"
     enableGetChoices={({ q }) => q.length >= 2}>
    <AutocompleteInput optionText="title" />
</ReferenceInput>
```

**Tip**: Why does `<ReferenceInput>` use the `dataProvider.getMany()` method with a single value `[id]` instead of `dataProvider.getOne()` to fetch the record for the current value? Because when there are many `<ReferenceInput>` for the same resource in a form (for instance when inside an `<ArrayInput>`), react-admin *aggregates* the calls to `dataProvider.getMany()` into a single one with `[id1, id2, ...]`. This speeds up the UI and avoids hitting the API too much.
