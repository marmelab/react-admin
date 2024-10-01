---
layout: default
title: "The FilterButton Component"
---

# `<FilterButton>`

Part of the filter button/form combo, `<FilterButton>` renders whenever you use the `<List filters>` prop. When clicked, it reveals a dropdown of filter names, allowing users to add a new filter input to the filter form.

<video controls autoplay playsinline muted loop>
  <source src="./img/list_filter.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


It's an internal component that you should only need if you build a custom List layout.

## Usage

`<FilterButton>` expects an array of filter inputs as `filters` prop:

```jsx
import {
    CreateButton,
    Datagrid,
    FilterButton,
    FilterForm,
    ListBase,
    Pagination,
    TextField,
    TextInput,
    SearchInput
} from 'react-admin';
import { Stack } from '@mui/material';

const postFilters = [
    <SearchInput source="q" alwaysOn />,
    <TextInput label="Title" source="title" defaultValue="Hello, World!" />,
];

const ListToolbar = () => (
    <Stack direction="row" justifyContent="space-between">
        <FilterForm filters={postFilters} />
        <div>
            <FilterButton filters={postFilters} />
            <CreateButton />
        </div>
    </Stack>
)

const PostList = () => (
    <ListBase>
        <ListToolbar />
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
        </Datagrid>
        <Pagination />
    </ListBase>
)
```

## `disableSaveQuery`

By default, the filter button lets users save a group of filters for later reuse. You can set the `disableSaveQuery` prop in the filter button to disable this feature.

```jsx
const ListToolbar = () => (
    <Stack direction="row" justifyContent="space-between">
        <FilterForm filters={postFilters} />
        <div>
            <FilterButton filters={postFilters} disableSaveQuery />
            <CreateButton />
        </div>
    </Stack>
)
```
