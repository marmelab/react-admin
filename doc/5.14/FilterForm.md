---
layout: default
title: "The FilterForm Component"
---

# `<FilterForm>`

Part of the filter button/form combo, `<FilterForm>` renders whenever you use the `<List filters>` prop. It renders the filter inputs that are `alwaysOn`, and the ones that were enabled by the user by using the `<FilterButton>`. The `<FilterForm>` has no submit button: it modifies the list filters as the user types in the form (with a debounce to avoid too many requests).

<video controls autoplay playsinline muted loop>
  <source src="./img/list_filter.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


It's an internal component that you should only need if you build a custom List layout.

## Usage

`<FilterForm>` expects an array of filter inputs as `filters` prop:

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
