---
layout: default
title: "The ReferenceInput Component"
---

# `<ReferenceInput>`

Use `<ReferenceInput>` for foreign-key values, for instance, to edit the `company_id` of a `contact` resource. 

<video controls autoplay playsinline muted loop>
  <source src="./img/reference-input.webm" type="video/webm"/>
  <source src="./img/reference-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

For instance, a contact record has a `company_id` field, which is a foreign key to a company record. 

```
┌──────────────┐       ┌────────────┐
│ contacts     │       │ companies  │
│--------------│       │------------│
│ id           │   ┌───│ id         │
│ first_name   │   │   │ name       │
│ last_name    │   │   │ address    │
│ company_id   │───┘   └────────────┘
└──────────────┘             
```

To make the `company_id` for a `contact` editable, use the following syntax:

```jsx
import { Edit, SimpleForm, TextInput, ReferenceInput } from 'react-admin';

const ContactEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <ReferenceInput source="company_id" reference="companies" />
        </SimpleForm>
    </Edit>
);
```

`<ReferenceInput>` requires a `source` and a `reference` prop.

`<ReferenceInput>` uses the foreign key value to fetch the related record. It also grabs the list of possible choices for the field. For instance, if the `ContactEdit` component above is used to edit the following contact:

```js
{
    id: 123,
    first_name: 'John',
    last_name: 'Doe',
    company_id: 456
}
```

Then `<ReferenceInput>` will issue the following queries:

```js
dataProvider.getMany('companies', { ids: [456] });
dataProvider.getList('companies', { 
    filter: {},
    sort: { field: 'id', order: 'DESC' },
    pagination: { page: 1, perPage: 25 }
});
```

`<ReferenceInput>` renders an [`<AutocompleteInput>`](./AutocompleteInput.md) to let the user select the related record. Users can narrow down the choices by typing a search term in the input. This modifies the query sent to the `dataProvider` as follows:

```js
dataProvider.getList('companies', { 
    filter: { q: ['search term'] },
    sort: { field: 'id', order: 'DESC' },
    pagination: { page: 1, perPage: 25 }
});
```

See [Customizing the filter query](#customizing-the-filter-query) below for more information about how to change `filter` prop based on the `<AutocompleteInput>` search term.

You can tweak how `<ReferenceInput>` fetches the possible values using the `page`, `perPage`, `sort`, and `filter` props.

You can replace the default `<AutocompleteInput>` by another choice input. To do so, pass the choice input component as `<ReferenceInput>` child. For instance, to use a `<SelectInput>`:

```jsx
import { ReferenceInput, SelectInput } from 'react-admin';

<ReferenceInput source="company_id" reference="companies">
    <SelectInput />
</ReferenceInput>
```

See the [`children`](#children) section for more details.

## Props

| Prop               | Required | Type                                        | Default                          | Description                                                                                    |
|--------------------|----------|---------------------------------------------|----------------------------------|------------------------------------------------------------------------------------------------|
| `source`           | Required | `string`                                    | -                                | Name of the entity property to use for the input value                                         |
| `reference`        | Required | `string`                                    | ''                               | Name of the reference resource, e.g. 'companies'.                                                  |
| `children`         | Optional | `ReactNode`                                 | `<Autocomplete Input/>`          | The actual selection component                                                                 |
| `enableGet Choices` | Optional | `({q: string}) => boolean`                  | `() => true`                     | Function taking the `filterValues` and returning a boolean to enable the `getList` call.       |
| `filter`           | Optional | `Object`                                    | `{}`                             | Permanent filters to use for getting the suggestion list                                       |
| `label`            | Optional | `string`                                    | -                                | Useful only when `ReferenceInput` is in a Filter array, the label is used as the Filter label. |
| `page`             | Optional | `number`                                    | 1                                | The current page number                                                                        |
| `perPage`          | Optional | `number`                                    | 25                               | Number of suggestions to show                                                                  |
| `queryOptions`     | Optional | [`UseQueryOptions`](https://tanstack.com/query/v3/docs/react/reference/useQuery)                       | `{}`                             | `react-query` client options                                                                   |
| `sort`             | Optional | `{ field: String, order: 'ASC' or 'DESC' }` | `{ field:'id', order:'DESC' }` | How to order the list of suggestions                                                           |

**Note**: `<ReferenceInput>` doesn't accept the [common input props](./Inputs.md#common-input-props) (like `label`) ; it is the responsibility of the child component to apply them.

## `children`

By default, `<ReferenceInput>` renders an [`<AutocompleteInput>`](./AutocompleteInput.md) to let end users select the reference record.

You can pass a child component to customize the way the reference selector is displayed.

For instance, to customize the input label, set the `label` prop on the child component:

```jsx
import { ReferenceInput, AutocompleteInput } from 'react-admin';

<ReferenceInput source="company_id" reference="companies">
    <AutocompleteInput label="Employer" />
</ReferenceInput>
```

You can also use [`<SelectInput>`](./SelectInput.md) or [`<RadioButtonGroupInput>`](./RadioButtonGroupInput.md) instead of [`<AutocompleteInput>`](./AutocompleteInput.md).

```jsx
import { ReferenceInput, SelectInput } from 'react-admin';

<ReferenceInput source="company_id" reference="companies">
    <SelectInput />
</ReferenceInput>
```

You can even use a component of your own as child, provided it detects a `ChoicesContext` is available and gets their choices from it.

The choices context value can be accessed with the [`useChoicesContext`](./useChoicesContext.md) hook.

## `enableGetChoices`

You can make the `getList()` call lazy by using the `enableGetChoices` prop. This prop should be a function that receives the `filterValues` as parameter and return a boolean. This can be useful when using an `AutocompleteInput` on a resource with a lot of data. The following example only starts fetching the options when the query has at least 2 characters:

```jsx
<ReferenceInput
     source="company_id"
     reference="companies"
     enableGetChoices={({ q }) => q && q.length >= 2}
/>
```

## `filter`

You can filter the query used to populate the possible values. Use the `filter` prop for that.

{% raw %}
```jsx
<ReferenceInput source="company_id" reference="companies" filter={{ is_published: true }} />
```
{% endraw %}

**Note**: When users type a search term in the `<AutocompleteInput>`, this doesn't affect the `filter` prop. Check the [Customizing the filter query](#customizing-the-filter-query) section below for details on how that filter works.

## `format`

By default, children of `<ReferenceInput>` transform `null` values from the `dataProvider` into empty strings. 

If you want to change this behavior, you have to pass a custom `format` prop to the `<ReferenceInput>` *child component*, because  **`<ReferenceInput>` doesn't have a `format` prop**. It is the responsibility of the child component to format the input value.

For instance, if you want to transform an option value before rendering, and the selection control is an `<AutocompleteInput>` (the default), set [the `<AutocompleteInput format>` prop](./Inputs.md#format) as follows:

```jsx
import { ReferenceInput, AutocompleteInput } from 'react-admin';

<ReferenceInput source="company_id" reference="companies">
    <AutocompleteInput format={value => value == null ? 'not defined' : value} />
</ReferenceInput>
```

The same goes if the child is a `<SelectInput>`:

```jsx
import { ReferenceInput, SelectInput } from 'react-admin';

<ReferenceInput source="company_id" reference="companies">
    <SelectInput format={value => value === undefined ? 'not defined' : null} />
</ReferenceInput>
```

## `label`

In an `<Edit>` or `<Create>` view, the `label` prop has no effect. `<ReferenceInput>` has no label, it simply renders its child (an `<AutocompleteInput>` by default). If you need to customize the label, set the `label` prop on the child element:

```jsx
import { ReferenceInput, AutocompleteInput } from 'react-admin';

<ReferenceInput source="company_id" reference="companies">
    <AutocompleteInput label="Employer" />
</ReferenceInput>
```

In a Filter form, react-admin uses the `label` prop to set the Filter label. So in this case, the `label` prop is not ignored, but you also have to set it on the child input.

```jsx
const filters = [
    <ReferenceInput label="Employer" source="company_id" reference="companies">
        <AutocompleteInput label="Employer" />
    </ReferenceInput>,
];
```

## `parse`

By default, children of `<ReferenceInput>` transform the empty form value (an empty string) into `null` before passing it to the `dataProvider`. 

If you want to change this behavior, you have to pass a custom `parse` prop to the `<ReferenceInput>` *child component*, because  **`<ReferenceInput>` doesn't have a `parse` prop**. It is the responsibility of the child component to parse the input value.

For instance, if you want to transform an option value before submission, and the selection control is an `<AutocompleteInput>` (the default), set [the `<AutocompleteInput parse>` prop](./Inputs.md#parse) as follows:

```jsx
import { ReferenceInput, AutocompleteInput } from 'react-admin';

<ReferenceInput source="company_id" reference="companies">
    <AutocompleteInput parse={value => value === 'not defined' ? null : value} />
</ReferenceInput>
```

The same goes if the child is a `<SelectInput>`:

```jsx
import { ReferenceInput, SelectInput } from 'react-admin';

<ReferenceInput source="company_id" reference="companies">
    <SelectInput parse={value => value === 'not defined' ? undefined : null} />
</ReferenceInput>
```

## `perPage`

By default, `<ReferenceInput>` fetches only the first 25 values. You can extend this limit by setting the `perPage` prop.

```jsx
<ReferenceInput source="company_id" reference="companies" perPage={100} />
```

This prop is mostly useful when using [`<SelectInput>`](./SelectInput.md) or [`<RadioButtonGroupInput>`](./RadioButtonGroupInput.md) as child, as the default `<AutocompleteInput>` child allows to filter the possible choices with a search input.

## `reference`

The name of the reference resource. For instance, in a contact form, if you want to edit the contact employer, the reference should be "companies".

```jsx
<ReferenceInput source="company_id" reference="companies" />
```

`<ReferenceInput>` will use the reference resource [`recordRepresentation`](./Resource.md#recordrepresentation) to display the selected record and the list of possible records. So for instance, if the `companies` resource is defined as follows:

```jsx
<Resource name="companies" recordRepresentation="name" />
```

Then `<ReferenceInput>` will display the company name in the input and in the list of possible values.

You can override this default by specifying the `optionText` prop in the child component. For instance, for an `<AutocompleteInput>`:

```jsx
<ReferenceInput source="company_id" reference="companies">
    <AutocompleteInput optionText="reference" />
</ReferenceInput>
```

## `queryOptions`

Use the `queryOptions` prop to pass options to the `dataProvider.getList()` query that fetches the possible choices.

For instance, to pass [a custom `meta`](./Actions.md#meta-parameter):

{% raw %}
```jsx
<ReferenceInput 
    source="company_id"
    reference="companies"
    queryOptions={{ meta: { foo: 'bar' } }}
/>
```
{% endraw %}

## `sort`

By default, `<ReferenceInput>` orders the possible values by `id` desc. 

You can change this order by setting the `sort` prop (an object with `field` and `order` properties).

{% raw %}
```jsx
<ReferenceInput
    source="company"
    reference="companies"
    sort={{ field: 'name', order: 'ASC' }}
/>
```
{% endraw %}

## `source`

The name of the property in the record that contains the identifier of the selected record.

For instance, if a contact contains a reference to a company via a `company_id` property:

```js
{
    id: 456,
    firstName: "John",
    lastName: "Doe",
    company_id: 12,
}
```

Then to display a selector for the contact company, you should call `<ReferenceInput>` as follows:

```jsx
<ReferenceInput source="company_id" reference="companies" />
```

## Customizing The Filter Query

By default, `<ReferenceInput>` renders an `<AutocompleteInput>`, which lets users type a search term to filter the possible values. `<ReferenceInput>` calls `dataProvider.getList()` using the search term as filter, using the format `filter: { q: [search term] }`.

If you want to customize the conversion between the search term and the query filter to match the filtering capabilities of your API, use the [`<AutocompleteInput filterToQuery>`](./AutocompleteInput.md#filtertoquery) prop.

```jsx
const filterToQuery = searchText => ({ name_ilike: `%${searchText}%` });

<ReferenceInput source="company_id" reference="companies">
    <AutocompleteInput filterToQuery={filterToQuery} />
</ReferenceInput>
```

## Tree Structure

If the reference resource is a tree, use [`<ReferenceNodeInput>`](./ReferenceNodeInput.md) instead of `<ReferenceInput>`.

<video controls autoplay playsinline muted loop>
  <source src="./img/ReferenceNodeInput-TreeInput-basic.webm" type="video/webm"/>
  <source src="./img/ReferenceNodeInput-TreeInput-basic.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

For instance, to edit the category of a product and let the user choose the category in a tree:

```tsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
import { ReferenceNodeInput } from '@react-admin/ra-tree';

const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" />
            <ReferenceNodeInput
                source="category_id"
                reference="categories"
            />
        </SimpleForm>
    </Edit>
);
```


## Performance 

Why does `<ReferenceInput>` use the `dataProvider.getMany()` method with a single value `[id]` instead of `dataProvider.getOne()` to fetch the record for the current value?

Because when there may be many `<ReferenceInput>` for the same resource in a form (for instance when inside an `<ArrayInput>`), react-admin *aggregates* the calls to `dataProvider.getMany()` into a single one with `[id1, id2, ...]`.

This speeds up the UI and avoids hitting the API too much.
