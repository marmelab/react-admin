---
layout: default
title: "The ReferenceManyInput Component"
---

# `<ReferenceManyInput>`

Use `<ReferenceManyInput>` in an `<Edit>` or `<Create>` view to edit one-to-many relationships, e.g. to edit the variants of a product in the product edition view. It's an [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> component, part of the `@react-admin/ra-relationships` package. 

<video controls autoplay playsinline muted loop>
  <source src="./img/reference-many-input.webm" type="video/webm"/>
  <source src="./img/reference-many-input.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

`<ReferenceManyInput>` fetches the related records, and renders them in a sub-form. When users add, remove or update related records, the `<ReferenceManyInput>` component stores these changes locally. When the users actually submit the form, `<ReferenceManyInput>` computes a diff with the existing relationship, and sends the related changes (additions, deletions, and updates) to the server.

**Tip**: If you need to edit an array of *embedded* records, i.e. if the `variants` above are actually embedded in the `product` record, you should use [`<ArrayInput>`](./ArrayInput.md) instead.

**Tip**: If there is only one related record, you should use [`<ReferenceOneInput>`](./ReferenceOneInput.md) instead.

## Usage

An example one-to-many relationship can be found in ecommerce systems: a product has many variants.

```
┌───────────────┐       ┌──────────────┐
│ products      │       │ variants     │
│---------------│       │--------------│
│ id            │───┐   │ id           │
│ name          │   └──╼│ product_id   │
│ price         │       │ sku          │
│ category_id   │       │ size         │
└───────────────┘       │ color        │
                        │ stock        │
                        └──────────────┘
```

You probably want to let users edit variants directly from the product Edition view (instead of having to go to the variant Edition view). `<ReferenceManyInput>` allows to do that.

```jsx
import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    ReferenceInput,
    SelectInput,
} from 'react-admin';
import { ReferenceManyInput } from '@react-admin/ra-relationships';

const ProductEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm>
            <TextInput source="name" />
            <NumberInput source="price" />
            <ReferenceInput source="category_id" reference="categories" />
            <ReferenceManyInput reference="variants" target="product_id">
                <SimpleFormIterator inline>
                    <TextInput source="sku" />
                    <SelectInput source="size" choices={sizes} />
                    <SelectInput source="color" choices={colors} />
                    <NumberInput source="stock" defaultValue={0} />
                </SimpleFormIterator>
            </ReferenceManyInput>
        </SimpleForm>
    </Edit>
);
```

`<ReferenceManyInput>` requires a `reference` and a `target` prop to know which entity to fetch, and a child component (usually a [`<SimpleFormIterator>`](./SimpleFormIterator.md)) to edit the relationship.

`<ReferenceManyInput>` persists the changes in the reference records (variants in the above example) after persisting the changes in the main resource (product in the above example). This means that you can also use `<ReferenceManyInput>` in `<Create>` views.

**Tip**: `<ReferenceManyInput>` cannot be used with `undoable` mutations. You have to set `mutationMode="optimistic"` or `mutationMode="pessimistic"` in the parent `<Edit>` or `<Create>`, as in the example above.

## Props

| Prop           | Required | Type                      | Default                          | Description                                                                                                                                                         |
| -------------- | -------- | ------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `target`       | Required | `string`                  | -                                | Target field carrying the relationship on the referenced resource, e.g. 'user_id'                                                                                   |
| `reference`    | Required | `string`                  | -                                | The name of the resource for the referenced records, e.g. 'books'                                                                                                   |
| `children`     | Required | `Element`                 | -                                | One or several elements that render a list of records based on a `ListContext`                                                                                      |
| `label`        | Optional | `string`                  | `reference`                      | Input label. In i18n apps, the label is passed to the `translate` function. Defaults to the humanized `source` when omitted. Set `label={false}` to hide the label. |
| `helperText`   | Optional | `string`                  | -                                | Text to be displayed under the input                                                                                                                                |
| `source`       | Optional | `string`                  | `id`                             | Name of the field that carries the identity of the current record, used as origin for the relationship                                                              |
| `filter`       | Optional | `Object`                  | -                                | Filters to use when fetching the related records, passed to `getManyReference()`                                                                                    |
| `perPage`      | Optional | `number`                  | 25                               | Maximum number of referenced records to fetch                                                                                                                       |
| `sort`         | Optional | `{ field, order }`        | `{ field: 'id', order: 'DESC' }` | Sort order to use when fetching the related records, passed to `getManyReference()`                                                                                 |
| `defaultValue` | Optional | `array`                   | -                                | Default value of the input.                                                                                                                                         |
| `validate`     | Optional | `Function` &#124; `array` | -                                | Validation rules for the array. See the [Validation Documentation](./Validation.md) for details.                                   |
| `sx`           | Optional | `SxProps`                 | -                                | Material UI shortcut for defining custom styles                                                                                                                             |

## `children`

`<ReferenceManyInput>` creates an `<ArrayInputContext>`, so it accepts the same type of children as `<ArrayInput>`: a Form iterator. React-admin bundles one such iterator: `<SimpleFormIterator>`. It renders one row for each related record, giving the user the ability to add, remove, or edit related records.

```jsx
<ReferenceManyInput reference="variants" target="product_id">
    <SimpleFormIterator>
        <TextInput source="sku" />
        <SelectInput source="size" choices={sizes} />
        <SelectInput source="color" choices={colors} />
        <NumberInput source="stock" defaultValue={0} />
    </SimpleFormIterator>
</ReferenceManyInput>
```

Check out [the `<SimpleFormIterator>` documentation](./SimpleFormIterator.md) for more details.

## `defaultValue`

When the current record has no related records, `<ReferenceManyInput>` renders an empty list with an "Add" button to add related records.

You can use the `defaultValue` prop to populate the list of related records in that case. It must be an array of objects.

```jsx
<ReferenceManyInput
    reference="variants"
    target="product_id"
    defaultValue={[
        { sku: 'SKU_1', size: 'S', color: 'black', stock: 0 },
        { sku: 'SKU_2', size: 'M', color: 'black', stock: 0 },
        { sku: 'SKU_3', size: 'L', color: 'black', stock: 0 },
        { sku: 'SKU_4', size: 'XL', color: 'black', stock: 0 },
    ]}
>
    <SimpleFormIterator>
        <TextInput source="sku" />
        <SelectInput source="size" choices={sizes} />
        <SelectInput source="color" choices={colors} />
        <NumberInput source="stock" defaultValue={0} />
    </SimpleFormIterator>
</ReferenceManyInput>
```

## `filter`

You can filter the query used to populate the current values. Use the `filter` prop for that.

{% raw %}

```jsx
<ReferenceManyInput
    reference="variants"
    target="product_id"
    filter={{ is_published: true }}
>
    ...
</ReferenceManyInput>
```

{% endraw %}

## `helperText`

If you need to display a text below the input (usually to explain the expected data to the user), use the `helperText` prop.

```jsx
<ReferenceManyInput
    reference="variants"
    target="product_id"
    helperText="Enter at least 5 variants for each product"
>
    ...
</ReferenceManyInput>
```

## `label`

By default, `<ReferenceManyInput>` humanizes the `reference` name to build a label. You can customize the label by passing the `label` prop.

```jsx
<ReferenceManyInput
    reference="variants"
    target="product_id"
    label="Product variants"
>
    ...
</ReferenceManyInput>
```

React-admin uses [the i18n system](./Translation.md) to translate the label, so you can use translation keys to have one label for each language supported by the interface:

```jsx
<ReferenceManyInput
    reference="variants"
    target="product_id"
    label="resource.products.fields.variants"
>
    ...
</ReferenceManyInput>
```

## `perPage`

By default, react-admin restricts the possible values to 25 and displays no pagination control. You can change the limit by setting the `perPage` prop:

```jsx
<ReferenceManyInput reference="variants" target="product_id" perPage={10}>
    ...
</ReferenceManyInput>
```

## `reference`

The name of the resource to fetch for the related records.

For instance, if you want to display the `variants` of a given `product`, the `reference` name should be `variants`:

```jsx
<ReferenceManyInput reference="books" target="author_id">
    ...
</ReferenceManyInput>
```

## `sort`

By default, related records appear ordered by id desc. You can change this order by setting the `sort` prop (an object with `field` and `order` properties).

{% raw %}

```jsx
<ReferenceManyInput
    reference="variants"
    target="product_id"
    sort={{ field: 'sku', order: 'ASC' }}
>
   ...
</ReferenceManyInput>
```

{% endraw %}

## `source`

By default, `<ReferenceManyInput>` ferchers the `references` for which the `target` field equals the current record `id`. You can customize the field that carries the identity of the current record by setting the `source` prop.

```jsx
<ReferenceManyInput reference="variants" target="product_id" source="_id">
    ...
</ReferenceManyInput>
```

## `sx`

You can override the style of the root component (a Material UI [`<FormControl>`](https://mui.com/material-ui/api/form-control/)) and its child components by setting the `sx` prop.

{% raw %}

```jsx
<ReferenceManyInput
    reference="variants"
    target="product_id"
    sx={{ marginLeft: 2 }}
>
   ...
</ReferenceManyInput>
```

{% endraw %}

## `target`

Name of the field carrying the relationship on the referenced resource. For instance, if a `product` has many `variants`, and each variant resource exposes an `product_id` field, the `target` would be `author_id`.

```jsx
<ReferenceManyInput reference="variants" target="product_id">
    ...
</ReferenceManyInput>
```

## `validate`

Just like regular inputs, you can use the `validate` prop to define custom validation rules for the list of references.

```jsx
import { minLength } from 'react-admin';

const ProductEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm>
            <TextInput source="name" />
            <ReferenceInput source="category_id" reference="categories" />
            <ReferenceManyInput
                reference="variants"
                target="product_id"
                validate={[minLength(2, 'Please add at least 2 variants')]}
            >
                ...
            </ReferenceManyInput>
        </SimpleForm>
    </Edit>
);
```
