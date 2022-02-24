---
layout: default
title: "The FilterForm Component"
---

# `<FilterForm>`

Part of the filter button/form combo, `<FilterForm>` renders whenever you use the `<List filters>` prop. It renders the filter inputs that are `alwaysOn`, and the ones that were enabled by the user by using the `<FilterButton>`. The `<FilterForm>` has no submit button: it modifies the list filters as the user types in the form (with a debounce to avoid too many requests).

![filter button/from combo](./img/list_filter.gif)

It's an internal component that you should only need if you build a custom List layout. 

## Usage

`<FilterForm>` expects an array of filter inputs as `filters` prop:

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
} from 'react-admin';
import { Stack } from '@mui/material';

const postFilters = [
    <TextInput label="Search" source="q" alwaysOn />,
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

