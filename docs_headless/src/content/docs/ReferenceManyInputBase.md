---
title: "<ReferenceManyInputBase>"
---

Use `<ReferenceManyInputBase>` in an edition or creation views to edit one-to-many relationships, e.g. to edit the variants of a product in the product edition view.

`<ReferenceManyInputBase>` fetches the related records, and renders them in a sub-form. When users add, remove of update related records, the `<ReferenceManyInputBase>` component stores these changes locally. When the users actually submit the form, `<ReferenceManyInputBase>` computes a diff with the existing relationship, and sends the related changes (additions, deletions, and updates) to the server.

This feature requires a valid is an [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Usage

An example one-to-many relationship can be found in ecommerce systems: a product has many variants.

```txt
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

You probably want to let users edit variants directly from the product Edition view (instead of having to go to the variant Edition view). `<ReferenceManyInputBase>` allows to do that.

```jsx
import { EditBase, Form, ReferenceInputBase } from 'ra-core';
import {
    AutocompleteInput,
    TextInput,
    NumberInput,
    SelectInput,
    SimpleFormIterator
} from 'my-react-admin-ui-library';
import { ReferenceManyInputBase } from '@react-admin/ra-core-ee';

const ProductEdit = () => (
    <EditBase mutationMode="optimistic">
        <Form>
            <TextInput source="name" />
            <NumberInput source="price" />
            <ReferenceInputBase source="category_id" reference="categories">
                <AutocompleteInput />
            </ReferenceInputBase>
            <ReferenceManyInputBase reference="variants" target="product_id">
                <SimpleFormIterator>
                    <TextInput source="sku" />
                    <SelectInput source="size" choices={sizes} />
                    <SelectInput source="color" choices={colors} />
                    <NumberInput source="stock" defaultValue={0} />
                </SimpleFormIterator>
            </ReferenceManyInputBase>
        </Form>
    </EditBase>
);
```

`<ReferenceManyInputBase>` requires a `reference` and a `target` prop to know which entity to fetch, and a child component (usually a `<SimpleFormIterator>`) to edit the relationship.

`<ReferenceManyInputBase>` persists the changes in the reference records (variants in the above example) after persisting the changes in the main resource (product in the above example). This means that you can also use `<ReferenceManyInputBase>` in `<CreateBase>` views.

**Tip**: `<ReferenceManyInputBase>` cannot be used with `undoable` mutations. You have to set `mutationMode="optimistic"` or `mutationMode="pessimistic"` in the parent `<EditBase>` or `<CreateBase>`, as in the example above.

## Props

| Prop              | Required | Type                      | Default                          | Description                                                                                                                                                            |
| ----------------- | -------- | ------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `target`          | Required | `string`                  | -                                | Target field carrying the relationship on the referenced resource, e.g. 'user_id'                                                                                      |
| `reference`       | Required | `string`                  | -                                | The name of the resource for the referenced records, e.g. 'books'                                                                                                      |
| `children`        | Optional | `Element`                 | -                                | One or several elements that render a list of records based on a `ListContext`                                                                                         |
| `defaultValue`    | Optional | `array`                   | -                                | Default value of the input.                                                                                                                                            |
| `filter`          | Optional | `Object`                  | -                                | Filters to use when fetching the related records, passed to `getManyReference()`                                                                                       |
| `mutationOptions` | Optional | `UseMutationOptions`      | -                                | Options for the mutations (`create`, `update` and `delete`)                                                                                                            |
| `perPage`         | Optional | `number`                  | 25                               | Maximum number of referenced records to fetch                                                                                                                          |
| `queryOptions`    | Optional | `UseQueryOptions`         | -                                | Options for the queries (`getManyReferences`)                                                                                                                          |
| `rankSource`    | Optional | `string`                  | -                                | Name of the field used to store the rank of each item. When defined, it enables reordering of the items.                                                 |
| `sort`            | Optional | `{ field, order }`        | `{ field: 'id', order: 'DESC' }` | Sort order to use when fetching the related records, passed to `getManyReference()`                                                                                    |
| `source`          | Optional | `string`                  | `id`                             | Name of the field that carries the identity of the current record, used as origin for the relationship                                                                 |
| `validate`        | Optional | `Function` &#124; `array` | -                                | Validation rules for the array. See the [Validation Documentation](https://marmelab.com/ra-core/validation) for details.                                      |

## `children`

`<ReferenceManyInputBase>` creates an `ArrayInputContext`, so it accepts the same type of children as `<ArrayInput>`: a Form iterator. React-admin bundles one such iterator: `<SimpleFormIterator>`. It renders one row for each related record, giving the user the ability to add, remove, or edit related records.

```jsx
<ReferenceManyInputBase reference="variants" target="product_id">
    <SimpleFormIterator>
        <TextInput source="sku" />
        <SelectInput source="size" choices={sizes} />
        <SelectInput source="color" choices={colors} />
        <NumberInput source="stock" defaultValue={0} />
    </SimpleFormIterator>
</ReferenceManyInputBase>
```

Check out [the `<SimpleFormIterator>` documentation](https://marmelab.com/react-admin/SimpleFormIterator.html) for more details.

## `defaultValue`

When the current record has no related records, `<ReferenceManyInputBase>` renders an empty list with an "Add" button to add related records.

You can use the `defaultValue` prop to populate the list of related records in that case. It must be an array of objects.

```jsx
<ReferenceManyInputBase
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
</ReferenceManyInputBase>
```

## `filter`

You can filter the query used to populate the current values. Use the `filter` prop for that.

```jsx
<ReferenceManyInputBase
    reference="variants"
    target="product_id"
    filter={{ is_published: true }}
>
    ...
</ReferenceManyInputBase>
```

## `perPage`

By default, ra-core-ee restricts the possible values to 25 and displays no pagination control. You can change the limit by setting the `perPage` prop:

```jsx
<ReferenceManyInputBase reference="variants" target="product_id" perPage={10}>
    ...
</ReferenceManyInputBase>
```

## `rankSource`

If the Form iterator you use as `ReferenceManyInputBase` children (e.g. `<SimpleFormIterator>`) provides controls to reorder the items in the list and the related records have a numeric rank field, you can enable the reordering feature by setting the `rankSource` prop.

For example, if the variants have a `rank` field, you can set the `rankSource` prop like this:

```jsx
<ReferenceManyInputBase
    reference="variants"
    target="product_id"
    rankSource="rank"
>
    <SimpleFormIterator>
        <TextInput source="sku" />
        <SelectInput source="size" choices={sizes} />
        <SelectInput source="color" choices={colors} />
        <NumberInput source="stock" defaultValue={0} />
    </SimpleFormIterator>
</ReferenceManyInputBase>
```

Now the variants will be ordered by rank, and whenever the user changes the order of the items, `<ReferenceManyInputBase>` will update the `rank` field of each item accordingly.

## `reference`

The name of the resource to fetch for the related records.

For instance, if you want to display the `variants` of a given `product`, the `reference` name should be `variants`:

```jsx
<ReferenceManyInputBase reference="books" target="author_id">
    ...
</ReferenceManyInputBase>
```

## `sort`

By default, related records appear ordered by id desc. You can change this order by setting the `sort` prop (an object with `field` and `order` properties).

```jsx
<ReferenceManyInputBase
  reference="variants"
  target="product_id"
  sort={{ field: 'sku', order: 'ASC' }}
>
   ...
</ReferenceManyInputBase>
```

## `source`

By default, `<ReferenceManyInputBase>` fetches the `references` for which the `target` field equals the current record `id`. You can customize the field that carries the identity of the current record by setting the `source` prop.

```jsx
<ReferenceManyInputBase reference="variants" target="product_id" source="_id">
    ...
</ReferenceManyInputBase>
```

## `target`

Name of the field carrying the relationship on the referenced resource. For instance, if a `product` has many `variants`, and each variant resource exposes an `product_id` field, the `target` would be `author_id`.

```jsx
<ReferenceManyInputBase reference="variants" target="product_id">
    ...
</ReferenceManyInputBase>
```

## `validate`

Just like regular inputs, you can use the `validate` prop to define custom validation rules for the list of references.

```jsx
import { minLength } from 'ra-core';

const ProductEdit = () => (
    <EditBase mutationMode="optimistic">
        <Form>
            <TextInput source="name" />
            <ReferenceInput source="category_id" reference="categories" />
            <ReferenceManyInputBase
                reference="variants"
                target="product_id"
                validate={[minLength(2, 'Please add at least 2 variants')]}
            >
                ...
            </ReferenceManyInputBase>
        </Form>
    </EditBase>
);
```

## Limitations

-   `<ReferenceManyInputBase>` cannot be used inside an `<ArrayInputBase>` or a `<ReferenceOneInputBase>`.
-   `<ReferenceManyInputBase>` cannot be used with `undoable` mutations in a `<CreateBase>` view.
-   `<ReferenceManyInputBase>` cannot have a `<ReferenceOneInputBase>` or a `<ReferenceManyToManyInputBase>` as one of its children.
-   `<ReferenceManyInputBase>` does not support server side validation.

## Changing An Item's Value Programmatically


You can leverage `react-hook-form`'s [`setValue`](https://react-hook-form.com/docs/useform/setvalue) method to change an item's value programmatically.

However you need to know the `name` under which the input was registered in the form, and this name is dynamically generated depending on the index of the item in the array.

To get the name of the input for a given index, you can leverage the `SourceContext` created by react-admin, which can be accessed using the `useSourceContext` hook.

This context provides a `getSource` function that returns the effective `source` for an input in the current context, which you can use as input name for `setValue`.

Here is an example where we leverage `getSource` and `setValue` to prefill the email input when the 'Prefill email' button is clicked:

```tsx
import { useSourceContext } from 'ra-core';
import { SimpleFormIterator, TextInput } from 'my-react-admin-ui-library';
import { ReferenceManyInputBase } from '@react-admin/ra-core-ee';
import { useFormContext } from 'react-hook-form';

const PrefillEmail = () => {
    const sourceContext = useSourceContext();
    const { setValue, getValues } = useFormContext();

    const onClick = () => {
        const firstName = getValues(sourceContext.getSource('first_name'));
        const lastName = getValues(sourceContext.getSource('last_name'));
        const email = `${
            firstName ? firstName.toLowerCase() : ''
        }.${lastName ? lastName.toLowerCase() : ''}@school.com`;
        setValue(sourceContext.getSource('email'), email);
    };

    return (
        <button onClick={onClick}>
            Prefill email
        </button>
    );
};

const StudentsInput = () => (
    <ReferenceManyInputBase
        reference="students"
        target="teacher_id"
        sort={{ field: 'last_name', order: 'ASC' }}
    >
        <SimpleFormIterator>
            <TextInput source="first_name" helperText={false} />
            <TextInput source="last_name" helperText={false} />
            <TextInput source="email" helperText={false} />
            <PrefillEmail />
        </SimpleFormIterator>
    </ReferenceManyInputBase>
);
```

**Tip:** If you only need the item's index, you can leverage the [`useSimpleFormIteratorItem` hook](https://marmelab.com/react-admin/SimpleFormIterator.html#getting-the-element-index) instead.
