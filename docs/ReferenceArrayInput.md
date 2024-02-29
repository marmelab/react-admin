---
layout: default
title: "The ReferenceArrayInput Component"
---

# `<ReferenceArrayInput>`

Use `<ReferenceArrayInput>` to edit an array of reference values, i.e. to let users choose a list of values (usually foreign keys) from another REST endpoint.

<video controls autoplay playsinline muted loop>
  <source src="./img/reference-array-input.webm" type="video/webm"/>
  <source src="./img/reference-array-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

For instance, a post record has a `tag_ids` field, which is an array of foreign keys to tags record. 

```
┌──────────────┐       ┌────────────┐
│ post         │       │ tags       │
│--------------│       │------------│
│ id           │   ┌───│ id         │
│ title        │   │   │ name       │
│ body         │   │   └────────────┘
│ tag_ids      │───┘
└──────────────┘             
```

To make the `tag_ids` for a `post` editable, use the following:

```jsx
import { Edit, SimpleForm, TextInput, ReferenceArrayInput } from 'react-admin';

const PostEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" />
            <ReferenceArrayInput source="tags_ids" reference="tags" />
        </SimpleForm>
    </Edit>
);
```

`<ReferenceArrayInput>` requires a `source` and a `reference` prop.

`<ReferenceArrayInput>` uses the array of foreign keys to fetch the related records. It also grabs the list of possible choices for the field. For instance, if the `PostEdit` component above is used to edit the following post:

```js
{
    id: 1234,
    title: "Lorem Ipsum",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    tag_ids: [1, 23, 4]
}
```

Then `<ReferenceArrayInput>` will issue the following queries:

```js
dataProvider.getMany('tags', { ids: [1, 23, 4] });
dataProvider.getList('tags', { 
    filter: {},
    sort: { field: 'id', order: 'DESC' },
    pagination: { page: 1, perPage: 25 }
});
```

`<ReferenceArrayInput>` renders an [`<AutocompleteArrayInput>`](./AutocompleteArrayInput.md) to let the user select the related record. Users can narrow down the choices by typing a search term in the input. This modifies the query sent to the `dataProvider` as follows:

```js
dataProvider.getList('tags', { 
    filter: { q: ['search term'] },
    sort: { field: 'id', order: 'DESC' },
    pagination: { page: 1, perPage: 25 }
});
```

See [Customizing the filter query](#customizing-the-filter-query) below for more information about how to change `filter` prop based on the `<AutocompleteArrayInput>` search term.

You can tweak how `<ReferenceArrayInput>` fetches the possible values using the `page`, `perPage`, `sort`, and `filter` props.

You can replace the default `<AutocompleteArrayInput>` with another choice input, by setting a child component. For instance, to use a `<SelectArrayInput>`:

```jsx
import { ReferenceArrayInput, SelectArrayInput } from 'react-admin';

<ReferenceArrayInput source="tag_ids" reference="tags">
    <SelectArrayInput />
</ReferenceArrayInput>
```

See the [`children`](#children) section for more details.

## Props

| Prop               | Required | Type                                        | Default                            | Description                                                                                                         |
|--------------------|----------|---------------------------------------------|------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| `source`           | Required | `string`                                    | -                                | Name of the entity property to use for the input value                                                                |
| `reference`        | Required | `string`                                    | ''                                 | Name of the reference resource, e.g. 'posts'.                                                                       |
| `children`         | Optional | `ReactNode`                                 | `<Autocomplete ArrayInput/>`          | The actual selection component                                                                                   |
| `enableGet Choices` | Optional | `({q: string}) => boolean`                  | `() => true`                       | Function taking the `filterValues` and returning a boolean to enable the `getList` call.                           |
| `filter`           | Optional | `Object`                                    | `{}`                               | Permanent filters to use for getting the suggestion list                                                            |
| `label`            | Optional | `string`                                    | -                                  | Useful only when `ReferenceArrayInput` is in a Filter array, the label is used as the Filter label.                 |
| `page`             | Optional | `number`                                    | 1                                  | The current page number                                                                                             |
| `perPage`          | Optional | `number`                                    | 25                                 | Number of suggestions to show                                                                                       |
| `queryOptions`     | Optional | [`UseQueryOptions`](https://tanstack.com/query/v3/docs/react/reference/useQuery) | `{}` | `react-query` client options     |
| `sort`             | Optional | `{ field: String, order: 'ASC' or 'DESC' }` | `{ field: 'id', order: 'DESC' }`   | How to order the list of suggestions                                                                                |

**Note**: `<ReferenceArrayInput>` doesn't accept the [common input props](./Inputs.md#common-input-props) ; it is the responsability of children to apply them.

## `children`

By default, `<ReferenceInput>` renders an [`<AutocompleteArrayInput>`](./AutocompleteArrayInput.md) to let end users select the reference record.

You can pass a child component to customize the way the reference selector is displayed.

For instance, to customize the input label set the `label` prop on the child component:

```jsx
import { ReferenceArrayInput, AutocompleteArrayInput } from 'react-admin';

<ReferenceArrayInput source="tags_ids" reference="tags">
    <AutocompleteArrayInput label="code" />
</ReferenceArrayInput>
```

The child can be:

- [`<SelectArrayInput>`](./SelectArrayInput.md)
- [`<AutocompleteArrayInput>`](./AutocompleteArrayInput.md)
- [`<DualListInput>`](./DualListInput.md)
- [`<CheckboxGroupInput>`](./CheckboxGroupInput.md),

```jsx
import { ReferenceArrayInput, SelectInput } from 'react-admin';

<ReferenceArrayInput source="tags_ids" reference="tags">
    <SelectArrayInput />
</ReferenceArrayInput>
```

You can even use a component of your own as child, provided it detects a `ChoicesContext` is available and gets their choices from it.

The choices context value can be accessed with the [`useChoicesContext`](./useChoicesContext.md) hook.

## `enableGetChoices`

You can make the `getList()` call lazy by using the `enableGetChoices` prop. This prop should be a function that receives the `filterValues` as parameter and return a boolean. This can be useful when using an `<AutocompleteArrayInput>` on a resource with a lot of data. The following example only starts fetching the options when the query has at least 2 characters:

```jsx
<ReferenceArrayInput
     source="tags_ids"
     reference="tags"
     enableGetChoices={({ q }) => q && q.length >= 2}
/>
```

## `filter`

You can filter the query used to populate the possible values. Use the `filter` prop for that.

{% raw %}
```jsx
<ReferenceArrayInput source="tags_ids" reference="tags" filter={{ is_published: true }} />
```
{% endraw %}

**Note**: When users type a search term in the `<AutocompleteArrayInput>`, this doesn't affect the `filter` prop. Check the [Customizing the filter query](#customizing-the-filter-query) section below for details on how that filter works.

## `format`

If you want to format the input value before displaying it, you have to pass a custom `format` prop to the `<ReferenceArrayInput>` *child component*, because  **`<ReferenceArrayInput>` doesn't have a `format` prop**. It is the responsibility of the child component to format the input value.

For instance, if you want to transform an option value before rendering, and the selection control is an `<AutocompleteArrayInput>` (the default), set [the `<AutocompleteArrayInput format>` prop](./Inputs.md#format) as follows:

```jsx
import { ReferenceArrayInput, AutocompleteArrayInput } from 'react-admin';

<ReferenceArrayInput source="tags_ids" reference="tags">
    <AutocompleteArrayInput format={value => value == null ? 'not defined' : value} />
</ReferenceArrayInput>
```

The same goes if the child is a `<SelectArrayInput>`:

```jsx
import { ReferenceArrayInput, SelectArrayInput } from 'react-admin';

<ReferenceArrayInput source="tags_ids" reference="tags">
    <SelectArrayInput format={value => value === undefined ? 'not defined' : null} />
</ReferenceArrayInput>
```

## `label`

In an `<Edit>` or `<Create>` view, the `label` prop has no effect. `<ReferenceArrayInput>` has no label, it simply renders its child (an `<AutocompleteArrayInput>` by default). If you need to customize the label, set the `label` prop on the child element:

```jsx
import { ReferenceArrayInput, AutocompleteArrayInput } from 'react-admin';

<ReferenceArrayInput source="tags_ids" reference="tags">
    <AutocompleteArrayInput label="Post tags" />
</ReferenceArrayInput>
```

In a Filter form, react-admin uses the `label` prop to set the Filter label. So in this case, the `label` prop is not ignored, but you also have to set it on the child input.

```jsx
const filters = [
    <ReferenceArrayInput label="Post tags" source="tags_ids" reference="tags">
        <AutocompleteArrayInput label="Post tags" />
    </ReferenceArrayInput>,
];
```

## `parse`

By default, children of `<ReferenceArrayInput>` transform the empty form value (an empty string) into `null` before passing it to the `dataProvider`. 

If you want to change this behavior, you have to pass a custom `parse` prop to the `<ReferenceArrayInput>` *child component*, because  **`<ReferenceArrayInput>` doesn't have a `parse` prop**. It is the responsibility of the child component to parse the input value.

For instance, if you want to transform an option value before submission, and the selection control is an `<AutocompleteArrayInput>` (the default), set [the `<AutocompleteArrayInput parse>` prop](./Inputs.md#parse) as follows:

```jsx
import { ReferenceArrayInput, AutocompleteArrayInput } from 'react-admin';

<ReferenceArrayInput source="tags_ids" reference="tags">
    <AutocompleteArrayInput parse={value => value === 'not defined' ? null : value} />
</ReferenceArrayInput>
```

The same goes if the child is a `<SelectArrayInput>`:

```jsx
import { ReferenceArrayInput, SelectArrayInput } from 'react-admin';

<ReferenceArrayInput source="tags_ids" reference="tags">
    <SelectArrayInput parse={value => value === 'not defined' ? undefined : null} />
</ReferenceArrayInput>
```

## `perPage`

By default, `<ReferenceArrayInput>` fetches only the first 25 values. You can extend this limit by setting the `perPage` prop.

```jsx
<ReferenceArrayInput source="tags_ids" reference="tags" perPage={100} />
```

This prop is mostly useful when using [`<SelectArrayInput>`](./SelectArrayInput.md) or [`<CheckboxGroupInput>`](./CheckboxGroupInput.md) as child, as the default `<AutocompleteArrayInput>` child allows to filter the possible choices with a search input.

## `queryOptions`

Use the `queryOptions` prop to pass options to the `dataProvider.getList()` query that fetches the possible choices.

For instance, to pass [a custom `meta`](./Actions.md#meta-parameter):

{% raw %}
```jsx
<ReferenceArrayInput 
    source="tag_ids"
    reference="tags"
    queryOptions={{ meta: { foo: 'bar' } }}
/>
```
{% endraw %}

## `reference`

The name of the reference resource. For instance, in a post form, if you want to edit the post tags, the reference should be "tags".

```jsx
<ReferenceArrayInput source="tags_ids" reference="tags" />
```

`<ReferenceArrayInput>` will use the reference resource [`recordRepresentation`](./Resource.md#recordrepresentation) to display the selected record and the list of possible records. So for instance, if the `tags` resource is defined as follows:

```jsx
<Resource name="tags" recordRepresentation="name" />
```

Then `<ReferenceArrayInput>` will display the company name in the input and the list of possible values.

You can override this default by specifying the `optionText` prop in the child component. For instance, for an `<AutocompleteArrayInput>`:

```jsx
<ReferenceArrayInput source="tags_ids" reference="tags">
    <AutocompleteArrayInput optionText="reference" />
</ReferenceArrayInput>
```

## `sort`

By default, `<ReferenceArrayInput>` orders the possible values by `id` desc. 

You can change this order by setting the `sort` prop (an object with `field` and `order` properties).

{% raw %}
```jsx
<ReferenceArrayInput 
    source="tag_ids"
    reference="tags"
    sort={{ field: 'name', order: 'ASC' }}
/>
```
{% endraw %}

## `source`

The name of the property in the record that contains the array of identifiers of the selected record.

For instance, if a post contains a reference to tags via a `tag_ids` property:

```js
{
    id: 456,
    title: "Hello, world!",
    tag_ids: [123, 456]
}
```

Then to display a selector for the post tags, you should call `<ReferenceArrayInput>` as follows:

```jsx
<ReferenceArrayInput source="tags_ids" reference="tags" />
```

## Customizing The Filter Query

By default, `<ReferenceArrayInput>` renders an `<AutocompleteArrayInput>`, which lets users type a search term to filter the possible values. `<ReferenceArrayInput>` calls `dataProvider.getList()` using the search term as filter, using the format `filter: { q: [search term] }`.

If you want to customize the conversion between the search term and the query filter to match the filtering capabilities of your API, use the [`<AutocompleteArrayInput filterToQuery>`](./AutocompleteArrayInput.md#filtertoquery) prop.

```jsx
const filterToQuery = searchText => ({ name_ilike: `%${searchText}%` });

<ReferenceArrayInput source="tags_ids" reference="tags">
    <AutocompleteArrayInput filterToQuery={filterToQuery} />
</ReferenceArrayInput>
```
