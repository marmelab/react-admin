---
layout: default
title: "The SelectColumnsButton Component"
---

# `<SelectColumnsButton>`

This button lets users show or hide columns in a Datagrid. It must be used in conjunction with [`<DatagridConfigurable>`](./Datagrid.md#configurable).

<video controls autoplay playsinline muted loop>
  <source src="./img/SelectColumnsButton.webm" type="video/webm"/>
  <source src="./img/SelectColumnsButton.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


## Usage

Add the `<SelectColumnsButton>` component to the `<List actions>` prop:

```jsx
import {
    DatagridConfigurable,
    List,
    SelectColumnsButton,
    TextField,
    TopToolbar,
} from "react-admin";

const PostListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
    </TopToolbar>
);

const PostList = () => (
    <List actions={<PostListActions />}>
        <DatagridConfigurable>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </DatagridConfigurable>
    </List>
);
```

**Note**: `<SelectColumnsButton>` doesn't work with `<Datagrid>` - you must use [`<DatagridConfigurable>`](./Datagrid.md#configurable) instead.

If you want to add the `<SelectColumnsButton>` to the usual List Actions, use the following snippet:

```jsx
const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
        <FilterButton />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);
```

## `preferenceKey`

If you include `<SelectColumnsButton>` in a page that has more than one `<DatagridConfigurable>` (e.g. in a dasboard), you have to link the two components by giving them the same `preferenceKey`:

```jsx
const BookList = () => {
    const { data, total, isPending } = useGetList('books', {
        pagination: { page: 1, perPage: 10 },
        sort,
    });
    return (
        <div>
            <SelectColumnsButton preferenceKey="books.datagrid" />
            <DatagridConfigurable
                preferenceKey="books.datagrid"
                data={data}
                total={total}
                isPending={isPending}
                sort={sort}
                bulkActionButtons={false}
            >
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
            </DatagridConfigurable>
        </div>
    );
};
```

## Adding a label to unlabeled columns

The inspector used by `<SelectColumnsButton>` uses the field's `source` (or `label` when it's a string) prop to display the column name. If you use non-field children (e.g. action buttons), then it's your responsibility to wrap them in a component with a `label` prop, that will be used by the inspector. You can use a [`<WrapperField>`](./WrapperField.md) for that purpose:

```tsx
const PostList = () => (
    <List>
        <DatagridConfigurable>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
            <WrapperField label="Actions">
                <EditButton />
            </WrapperField>
        </DatagridConfigurable>
    </List>
);
```

**Tip:** You may need to clear your local storage to reflect the changes, as react-admin saves the computed column names in the Store. For the same reason, your users may need to log out and in again to see the changes. Alternatively, you can leverage [Store Invalidation](./Store.md#store-invalidation) to do it automatically.
