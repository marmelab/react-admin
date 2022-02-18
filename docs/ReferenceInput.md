---
layout: default
title: "The ReferenceInput Component"
---

# `<ReferenceInput>`

Use `<ReferenceInput>` for foreign-key values, for instance, to edit the `post_id` of a `comment` resource. This component fetches the related record (using `dataProvider.getMany()`) as well as possible choices (using `dataProvider.getList()` in the reference resource). It delegates the rendering to its child component by providing the possible choices through the `ChoicesContext`. This context value can be accessed with the [`useChoicesContext`](./useChoicesContext.md) hook.

This means you can use `<ReferenceInput>` with any of [`<SelectInput>`](./SelectInput.md), [`<AutocompleteInput>`](./AutocompleteInput.md), or [`<RadioButtonGroupInput>`](./RadioButtonGroupInput.md), or even with the component of your choice, provided they detect a `ChoicesContext` is available and get their choices from it.

The component expects a `source` and a `reference` attributes. For instance, to make the `post_id` for a `comment` editable:

```jsx
import { ReferenceInput, SelectInput } from 'react-admin';

<ReferenceInput label="Post" source="post_id" reference="posts">
    <SelectInput optionText="title" />
</ReferenceInput>
```

![ReferenceInput](./img/reference-input.gif)

## Properties

| Prop               | Required | Type                                        | Default                          | Description                                                                                                       |
|--------------------|----------|---------------------------------------------|----------------------------------|-------------------------------------------------------------------------------------------------------------------|
| `filter`           | Optional | `Object`                                    | `{}`                             | Permanent filters to use for getting the suggestion list                                                          |
| `page`             | Optional | `number`                                    | 1                                | The current page number                                                                                           |
| `perPage`          | Optional | `number`                                    | 25                               | Number of suggestions to show                                                                                     |
| `reference`        | Required | `string`                                    | ''                               | Name of the reference resource, e.g. 'posts'.                                                                     |
| `sort`             | Optional | `{ field: String, order: 'ASC' or 'DESC' }` | `{ field: 'id', order: 'DESC' }` | How to order the list of suggestions                                                                              |
| `enableGetChoices` | Optional | `({q: string}) => boolean`                  | `() => true`                     | Function taking the `filterValues` and returning a boolean to enable the `getList` call.                          |


**Note**: `<ReferenceInput>` doesn't accept the [common input props](./Inputs.md#common-input-props) is the responsability of children to apply them.

## Usage

You can tweak how this component fetches the possible values using the `page`, `perPage`, `sort`, and `filter` props.

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
