---
layout: default
title: "The FilterButton Component"
storybook_path: ra-ui-materialui-list-filter-filterbutton--basic
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

{% raw %}
```jsx
import {
    CreateButton,
    DataTable,
    FilterButton,
    FilterForm,
    ListBase,
    Pagination,
    TextInput,
    SearchInput
} from 'react-admin';
import { Stack } from '@mui/material';

const postFilters = [
    <SearchInput source="q" alwaysOn />,
    <TextInput label="Title" source="title" defaultValue="Hello, World!" />,
];

const ListToolbar = () => (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
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
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="body" />
        </DataTable>
        <Pagination />
    </ListBase>
)
```
{% endraw %}

## `disableSaveQuery`

By default, the filter button lets users save a group of filters for later reuse. You can set the `disableSaveQuery` prop in the filter button to disable this feature.

{% raw %}
```jsx
const ListToolbar = () => (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <FilterForm filters={postFilters} />
        <div>
            <FilterButton filters={postFilters} disableSaveQuery />
            <CreateButton />
        </div>
    </Stack>
)
```
{% endraw %}
