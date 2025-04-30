---
layout: default
title: "useRecordContext"
---

# `useRecordContext`

`useRecordContext` grabs the current record. It's available anywhere react-admin manipulates a record, e.g. in a Show page, in a Datagrid row, or in a Reference Field.

<iframe src="https://www.youtube-nocookie.com/embed/YLwx-EZfGFk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

## Usage

The most common use case for `useRecordContext` is to build a custom field. For instance, an author field for a book Show view. 

```jsx
import { useRecordContext, Show, SimpleShowLayout } from 'react-admin';

const BookAuthor = () => {
    const record = useRecordContext();
    if (!record) return null;
    return <span>{record.author}</span>;
};

const BookShow = () => (
    <Show>
        <SimpleShowLayout>
            <BookAuthor />
            ...
        </SimpleShowLayout>
    </Show>
)
```

## Optimistic Rendering

As react-admin uses optimistic rendering, `useRecordContext` may be `undefined` or a cached version of the record on load (see also [Caching](./Caching.md#optimistic-rendering)). Make sure you prepare for that! 

```jsx
const BookAuthor = () => {
    const record = useRecordContext();
    // warning: this will fail on load since record is undefined    
    return <span>{record.author}</span>;
};
```

So make sure you check that the record is defined before using it.

```jsx
const record = useRecordContext();
if (!record) return null;
```

## Availability

As soon as there is a record available, react-admin puts it in a `RecordContext`. This means that `useRecordContext` works out of the box:

- in descendants of the `<Show>` and `<ShowBase>` component
- in descendants of the `<Edit>` and `<EditBase>` component
- in descendants of the `<Create>` and `<CreateBase>` component
- in descendants of the `<Datagrid>` component
- in descendants of the `<SimpleList>` component
- in descendants of the `<ReferenceField>` component

## Inside A Form

Inside `<Edit>` and `<Create>`, `useRecordContext` returns the *initial* record, used to set the initial form values. 

If you want to react to the data entered by the user, use [react-hook-form's `useWatch`](https://react-hook-form.com/docs/usewatch/) instead of `useRecordContext`. It returns the current form values, including the changes made by the user.

For instance if you want to display an additional input when a user marks an order as returned, you can do the following:

```jsx
import { Edit, SimpleForm, BooleanInput, TextInput } from 'react-admin';
import { useWatch } from 'react-hook-form';

const ReturnedReason = () => {
    const isReturned = useWatch({ name: 'returned' });
    return isReturned ? <TextInput source="reason" /> : null;
};

const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="reference" />
            <BooleanInput source="returned" />
            <ReturnedReason />
            ...
        </SimpleForm>
    </Edit>
)
```

## Creating a Record Context

If you have fetched a `record` and you want to make it available to descendants, place it inside a `<RecordContextProvider>` component.

```jsx
import { useGetOne, RecordContextProvider } from 'react-admin';

const RecordFetcher = ({ id, resource, children }) => {
    const { data, isPending, error } = useGetOne(resource, { id });
    if (isPending) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return (
        <RecordContextProvider value={data}>
            {children}
        </RecordContextProvider>
    );
};
```

## Fallback Mode

Some react-admin components accept an optional record prop. These components can be used both inside a `RecordContext`, and with a custom record prop - without creating a custom record context.

You can do the same: just accept a `record` component prop, and pass the props as parameter to the hook. If the record is undefined, `useRecordContext` will return the record from the context. If it is defined, `useRecordContext` will return the record from the props.

{% raw %}
```jsx
const BookAuthor = (props) => {
    const record = useRecordContext(props);
    if (!record) return null;
    return <span>{record.author}</span>;
};

// you can now pass a custom record
<BookAuthor record={{ id: 123, author: 'Leo Tolstoy' }}>
```
{% endraw %}

## TypeScript

The `useRecordContext` hook accepts a generic parameter for the record type:

```tsx
type Book = {
    id: number;
    author: string;
};

const BookAuthor = () => {
    const book = useRecordContext<Book>();
    if (!book) return null;
    // TypeScript knows that book is of type Book
    return <span>{book.author}</span>;
};
```

## See Also

* [`WithRecord`](./WithRecord.md) is the render prop version of the `useRecordContext` hook.
* [`useListContext`](./useListContext.md) is the equivalent for lists.

## API

* [`useRecordContext`]

[`useRecordContext`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/record/useRecordContext.ts
