---
title: "<ReferenceOneInputBase>"
---
Use `<ReferenceOneInputBase>` in an `<EditBase>` or `<CreateBase>` view to edit one-to-one relationships, e.g. to edit the details of a book in the book edition view.

This feature requires a valid is an [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Usage

Here is an example one-to-one relationship: a `book` has at most one `book_details` row associated to it.

```txt
┌─────────────┐       ┌──────────────┐
│ book        │       │ book_details │
│-------------│       │--------------│
│ id          │───┐   │ id           │
│ title       │   └──╼│ book_id      │
└─────────────┘       │ year         │
                      │ author       │
                      │ country      │
                      │ genre        │
                      │ pages        │
                      └──────────────┘
```

You probably want to let users edit the book details directly from the book Edition view (instead of having to go to the book details Edition view). `<ReferenceOneInputBase>` allows to do that.

```tsx
import { EditBase, Form } from 'ra-core';
import { TextInput, NumberInput } from 'my-react-admin-ui-library';
import { ReferenceOneInputBase } from '@react-admin/ra-core-ee';

const BookEdit = () => (
    <EditBase mutationMode="optimistic">
        <Form>
            <TextInput source="title" />
            <ReferenceOneInputBase reference="book_details" target="book_id">
                <NumberInput source="year" />
                <TextInput source="author" />
                <TextInput source="country" />
                <TextInput source="genre" />
                <NumberInput source="pages" />
            </ReferenceOneInputBase>
        </Form>
    </EditBase>
);
```

`<ReferenceOneInputBase>` requires a `reference` and a `target` prop to know which entity to fetch, and one or more inputs as its `children` to edit the related record.

`<ReferenceOneInputBase>` persists the changes in the referenced record (book details in the above example) after persisting the changes in the main resource (book in the above example). This means that you can also use `<ReferenceOneInputBase>` in Create views.

**Tip**: `<ReferenceOneInputBase>` does not support optimistic nor undoable mutations. You will need to set `mutationMode="pessimistic"` in the parent Edition component, as in the example above.

## Props

| Prop              | Required | Type                 | Default                         | Description                                                                                                                                                            |
| ----------------- | -------- | -------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `target`          | Required | `string`             | -                               | Target field carrying the relationship on the referenced resource, e.g. 'book_id' |
| `reference`       | Required | `string`             | -                               | The name of the resource for the referenced records, e.g. 'book_details' |
| `children`        | Optional | `Element`            | -                               | One or several input elements that accept a `source` prop |
| `defaultValue`    | Optional | `Object`             | -                               | Default value for the related record (in case it does not yet exist) |
| `error`           | Optional | `Element`            | -                               | The element to display when an error occurs while loading a reference |
| `filter`          | Optional | `Object`             | -                               | Filters to use when fetching the related record, passed to `getManyReference() |
| `loading`         | Optional | `Element`            | -                               | The element to display while loading a reference |
| `mutationOptions` | Optional | `UseMutationOptions` | -                               | Options for the mutations (`create` and `update`) |
| `render`          | Optional | `Function`            | -                               | A function that returns the children to display. Takes precedence over `children` |
| `sort`            | Optional | `{ field, order }`   | `{ field: 'id', order: 'ASC' }` | Sort order to use when fetching the related record, passed to `getManyReference() |
| `source`          | Optional | `string`             | `id`                            | Name of the field that carries the identity of the current record, used as origin for the relationship |
| `queryOptions`    | Optional | `UseQueryOptions`    | -                               | Options for the queries (`getManyReferences`) |

## `children`

`<ReferenceOneInputBase>` expects input components as its children, which will allow to edit the related record.

```jsx
<ReferenceOneInputBase reference="book_details" target="book_id">
    <NumberInput source="year" />
    <TextInput source="author" />
    <TextInput source="country" />
    <TextInput source="genre" />
    <NumberInput source="pages" />
</ReferenceOneInputBase>
```

## `defaultValue`

`<ReferenceOneInputBase>` allows to specify a default value for the related record. This is useful when the current record does not yet have a related record, and you want to pre-fill the related record with some default values.

```jsx
<ReferenceOneInputBase
    reference="book_details"
    target="book_id"
    defaultValue={{ author: 'Gustave Flaubert', year: 1857 }}
>
    ...
</ReferenceOneInputBase>
```

## `filter`

`<ReferenceOneInputBase>` allows to specify filters to use when fetching the related record. This can be useful when you need additional filters to select the related record.

```jsx
<ReferenceOneInputBase
    reference="book_details"
    target="book_id"
    filter={{ reviewed: true }}
>
    ...
</ReferenceOneInputBase>
```

## `error`

To display a custom element when an error occurs while loading the reference, use the `error` prop:

```jsx
<ReferenceOneInputBase
    reference="book_details"
    target="book_id"
    error={<MyError />}
>
    ...
</ReferenceOneInputBase>
```

## `loading`

To display a custom element while loading the reference, use the `loading` prop:

```jsx
<ReferenceOneInputBase
    reference="book_details"
    target="book_id"
    error={<MySkeleton />}
>
    ...
</ReferenceOneInputBase>
```

## `mutationOptions`

Use the `mutationOptions` prop to pass options to the `dataProvider.create()` and `dataProvider.update()` mutations.

For instance, to pass a custom meta:

```tsx
<ReferenceOneInputBase
    reference="book_details"
    target="book_id"
    mutationOptions={{ meta: { foo: 'bar' } }}
>
    ...
</ReferenceOneInputBase>
```

## `reference`

The name of the resource to fetch for the related records.

For instance, if you want to display the `book_details` of a given `book`, the `reference` name should be `book_details`:

```jsx
<ReferenceOneInputBase reference="book_details" target="book_id">
    ...
</ReferenceOneInputBase>
```

## `render`

`<ReferenceOneInputBase>` accepts a `render` function instead of `children` if you want more control over what to display in all possible states.

```jsx
<ReferenceOneInputBase
    reference="book_details"
    target="book_id" 
    render={({ isPending }) => isPending ? <Skeleton /> : (
        <>
            <NumberInput source="year" />
            <TextInput source="author" />
            <TextInput source="country" />
            <TextInput source="genre" />
            <NumberInput source="pages" />
        </>
    )}
/>
```

## `sort`

`<ReferenceOneInputBase>` allows to specify the sort options used when fetching the related record. This can be useful when the relation table does not have an `id` column.

```jsx
<ReferenceOneInputBase
    reference="book_details"
    target="book_id"
    sort={{ field: '_id', order: 'DESC' }}
>
    ...
</ReferenceOneInputBase>
```

## `source`

By default, `<ReferenceManyInputBase>` fetches the `reference` for which the `target` field equals the current record `id`. You can customize the field that carries the identity of the current record by setting the `source` prop.

```jsx
<ReferenceOneInputBase reference="book_details" target="book_id" source="_id">
    ...
</ReferenceOneInputBase>
```

## `target`

Name of the field carrying the relationship on the referenced resource. For instance, if each `book` is linked to a record in `book_details`, and each `book_details` exposes a `book_id` field linking to the `book`, the `target` would be `book_id`.

```jsx
<ReferenceOneInputBase reference="book_details" target="book_id">
    ...
</ReferenceOneInputBase>
```

## `queryOptions`

Use the `queryOptions` prop to pass options to the `dataProvider.getManyReferences()` query that fetches the possible choices.

For instance, to pass a custom meta:

```tsx
<ReferenceOneInputBase
    reference="book_details"
    target="book_id"
    queryOptions={{ meta: { foo: 'bar' } }}
>
    ...
</ReferenceOneInputBase>
```

## Limitations

-   `<ReferenceOneInputBase>` cannot be used inside an `<ArrayInput>` or a `<ReferenceManyInputBase>`.
-   `<ReferenceOneInputBase>` cannot have a `<ReferenceManyInputBase>` or a `<ReferenceManyToManyInputBase>` as one of its children.
-   `<ReferenceOneInputBase>` does not support server side validation.
-   `<ReferenceOneInputBase>` does not support optimistic nor undoable mutations.

## Changing An Item's Value Programmatically

You can leverage `react-hook-form`'s [`setValue`](https://react-hook-form.com/docs/useform/setvalue) method to change the reference record's value programmatically.

However you need to know the `name` under which the inputs were registered in the form, and these names are dynamically generated by `<ReferenceOneInputBase>`.

To get the name of a specific input, you can leverage the `SourceContext` created by react-admin, which can be accessed using the `useSourceContext` hook.

This context provides a `getSource` function that returns the effective `source` for an input in the current context, which you can use as input name for `setValue`.

Here is an example where we leverage `getSource` and `setValue` to update some of the book details when the 'Update book details' button is clicked:

```tsx
import { useSourceContext } from 'ra-core';
import { TextInput, NumberInput } from 'my-react-admin-ui-library';
import { ReferenceOneInputBase } from '@react-admin/ra-core-ee';
import { useFormContext } from 'react-hook-form';

const UpdateBookDetails = () => {
    const sourceContext = useSourceContext();
    const { setValue } = useFormContext();

    const onClick = () => {
        // Generate random values for year and pages
        const year = 1000 + Math.floor(Math.random() * 1000);
        const pages = 100 + Math.floor(Math.random() * 900);
        setValue(sourceContext.getSource('year'), year);
        setValue(sourceContext.getSource('pages'), pages);
    };

    return (
        <Button onClick={onClick} size="small" sx={{ maxWidth: 200 }}>
            Update book details
        </Button>
    );
};

const BookDetails = () => (
    <ReferenceOneInputBase
        reference="book_details"
        target="book_id"
        sort={sort}
        filter={filter}
    >
        <div>
            <NumberInput source="year" />
            <TextInput source="author" />
            <TextInput source="country" />
            <TextInput source="genre" />
            <NumberInput source="pages" />
            <UpdateBookDetails />
        </div>
    </ReferenceOneInputBase>
);
```
