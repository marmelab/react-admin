---
title: "useRecordContext"
---

`useRecordContext` grabs the current record. It's available anywhere ra-core manipulates a record, e.g. in a Show page, in a DataTable row, or in a Reference Field.

<iframe src="https://www.youtube-nocookie.com/embed/YLwx-EZfGFk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

## Usage

The most common use case for `useRecordContext` is to build a custom field. For instance, an author field for a book Show view. 

```jsx
import { useRecordContext, ShowBase } from 'ra-core';

const BookAuthor = () => {
    const record = useRecordContext();
    if (!record) return null;
    return <span>{record.author}</span>;
};

const BookShow = () => (
    <ShowBase>
        <BookAuthor />
        ...
    </ShowBase>
)
```

## Optimistic Rendering

As ra-core uses optimistic rendering, `useRecordContext` may be `undefined` or a cached version of the record on load (see also [Caching](./Caching.md#optimistic-rendering)). Make sure you prepare for that! 

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

As soon as there is a record available, ra-core puts it in a `RecordContext`. This means that `useRecordContext` works out of the box:

- in descendants of the `<ShowBase>` component
- in descendants of the `<EditBase>` component
- in descendants of the `<CreateBase>` component
- in descendants of the `<RecordsIterator>` component
- in descendants of the `<ReferenceFieldBase>` component

## Inside A Form

Inside `<Edit>` and `<Create>`, `useRecordContext` returns the *initial* record, used to set the initial form values. 

If you want to react to the data entered by the user, use [react-hook-form's `useWatch`](https://react-hook-form.com/docs/usewatch/) instead of `useRecordContext`. It returns the current form values, including the changes made by the user.

For instance if you want to display an additional input when a user marks an order as returned, you can do the following:

```jsx
import { EditBase, Form } from 'ra-core';
import { useWatch } from 'react-hook-form';
import { TextInput } from './TextInput';
import { BooleanInput } from './BooleanInput';

const ReturnedReason = () => {
    const isReturned = useWatch({ name: 'returned' });
    return isReturned ? <TextInput source="reason" /> : null;
};

const OrderEdit = () => (
    <EditBase>
        <Form>
            <TextInput source="reference" />
            <BooleanInput source="returned" />
            <ReturnedReason />
            ...
        </Form>
    </EditBase>
)
```

## Creating a Record Context

If you have fetched a `record` and you want to make it available to descendants, place it inside a `<RecordContextProvider>` component.

```jsx
import { useGetOne, RecordContextProvider } from 'ra-core';

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

Some ra-core components accept an optional record prop. These components can be used both inside a `RecordContext`, and with a custom record prop - without creating a custom record context.

You can do the same: just accept a `record` component prop, and pass the props as parameter to the hook. If the record is undefined, `useRecordContext` will return the record from the context. If it is defined, `useRecordContext` will return the record from the props.

```jsx
const BookAuthor = (props) => {
    const record = useRecordContext(props);
    if (!record) return null;
    return <span>{record.author}</span>;
};

// you can now pass a custom record
<BookAuthor record={{ id: 123, author: 'Leo Tolstoy' }}>
```

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
