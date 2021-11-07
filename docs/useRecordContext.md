---
layout: default
title: "useRecordContext"
---

# `useRecordContext`

`useRecordContext` grabs the current record. It's available anywhere react-admin manipulates a record, e.g. in a Show page, in a Datagrid row, or in a Reference Field.

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

As react-admin uses optimistic rendering, `useRecordContext` may return an undefined record on load. Make sure you prepare for that! 

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

- in descendents of the `<Show>` and `<ShowBase>` component
- in descendents of the `<Edit>` and `<EditBase>` component
- in descendents of the `<Create>` and `<CreateBase>` component
- in descendents of the `<Datagrid>` component
- in descendents of the `<SimpleList>` component
- in descendents of the `<ReferenceField>` component

## Creating a Record Context

If you have fetched a `record` and you want to make it available to descendants, place it inside a `<RecordContextProvider>` component.

```jsx
import { useGetOne, RecordContextProvider } from 'react-admin';

const RecordFetcher = ({ id, resource, children }) => {
    const { data, loading, error } = useGetOne(resource, id);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return (
        <RecordContextProvider record={data}>
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

## See Also

* [`WithRecord`](./WithRecord.md) is the render prop version of the `useRecordContext` hook.

## API

* [`useRecordContext`]

[`useRecordContext`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/useRecordContext.tsx