---
title: "<WithRecord>"
---

`<WithRecord>` grabs the current record from the `RecordContext`. It's the render prop version of [the `useRecordContext` hook](./useRecordContext.md). 

## Usage

The most common use case for `<WithRecord>` is to build a custom field on-the-fly, without creating a new component. For instance, an author field for a book Show view. 

```jsx
import { ShowBase, WithRecord } from 'ra-core';

const BookShow = () => (
    <ShowBase>
        <WithRecord label="author" render={record => <span>{record.author}</span>} />
    </ShowBase>
);
```

Note that if `record` is undefined, `<WithRecord>` doesn't call the `render` callback and renders nothing (or the `empty` prop), so you don't have to worry about this case in your render callback.

## Availability

As soon as there is a record available, react-admin puts it in a `RecordContext`. This means that `<WithRecord>` works out of the box:

- in descendants of the `<ShowBase>` component
- in descendants of the `<EditBase>` component
- in descendants of the `<CreateBase>` component
- in descendants of the `<ReferenceFieldBase>` component
- in descendants of the `<ListIterator>` component

## TypeScript

The `<WithRecord>` component accepts a generic parameter for the record type:

```tsx
import { ShowBase, WithRecord } from 'ra-core';

type Book = {
    id: number;
    author: string;
}

const BookShow = () => (
    <ShowBase>
        <WithRecord<Book>
            label="author"
            render={book => {
                // TypeScript knows that book is of type Book
                return <span>{book.author}</span>}
            }
        />
    </ShowBase>
);
```

## See Also

* [`useRecordContext`](./useRecordContext.md) is the hook version of this component.
* [`<WithListContext>`](./WithListContext.md) is the equivalent for lists.

## API

* [`WithRecord`]

[`WithRecord`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/record/WithRecord.tsx
