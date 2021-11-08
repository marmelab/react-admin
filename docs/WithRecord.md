---
layout: default
title: "WithRecord"
---

# `WithRecord`

`<WithRecord>` grabs the current record from the `RecordContext`. It's the render prop version of [the `useRecordContext` hook](./useContextProvider.md). 

## Usage

The most common use case for `<WithRecord>` is to build a custom field on-the-fly, without creating a new component. For instance, an author field for a book Show view. 

```jsx
import { Show, SimpleShowLayout, WithRecord } from 'react-admin';

const BookShow = () => (
   <Show>
      <SimpleShowLayout>
         <WithRecord render={record => <span>{record.author}</span>} />
     </SimpleShowLayout>
  </Show>
);
```

Note that if `record` is undefined, `<WithRecord>` doesn't call the `render` callback and renders nothing, so you don't have to worry about this case in your render callback.

## Availability

As soon as there is a record available, react-admin puts it in a `RecordContext`. This means that `<WithRecord>` works out of the box:

- in descendents of the `<Show>` and `<ShowBase>` component
- in descendents of the `<Edit>` and `<EditBase>` component
- in descendents of the `<Create>` and `<CreateBase>` component
- in descendents of the `<Datagrid>` component
- in descendents of the `<SimpleList>` component
- in descendents of the `<ReferenceField>` component

## See Also

* [`useRecordContext`](./useRecordContext.md) is the hook version of this component.

## API

* [`WithRecord`]

[`WithRecord`]: https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/controller/record/WithRecord.tsx