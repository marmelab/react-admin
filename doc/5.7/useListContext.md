---
layout: default
title: "useListContext"
---

# `useListContext`

Whenever react-admin displays a List, it creates a `ListContext` to store the list data, as well as filters, pagination, sort state, and callbacks to update them.

The `ListContext` is available to descendants of:

- `<List>`,
- `<ListGuesser>`,
- `<ListBase>`,
- `<ReferenceArrayField>`,
- `<ReferenceManyField>`

All descendant components can therefore access the list context, using the `useListContext` hook. As a matter of fact, react-admin's `<Datagrid>`, `<FilterForm>`, and `<Pagination>` components all use the `useListContext` hook.

## Usage

Call `useListContext` in a component, then use this component as a descendant of a `List` component.

```jsx
// in src/posts/Aside.js
import { Typography } from '@mui/material';
import { useListContext } from 'react-admin';

export const Aside = () => {
    const { data, isPending } = useListContext();
    if (isPending) return null;
    return (
        <div>
            <Typography variant="h6">Posts stats</Typography>
            <Typography variant="body2">
                Total views: {data.reduce((sum, post) => sum + post.views, 0)}
            </Typography>
        </div>
    );
};

// in src/posts/PostList.js
import { List, Datagrid, TextField } from 'react-admin';
import Aside from './Aside';

export const PostList = () => (
    <List aside={<Aside />}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="views" />
        </Datagrid>
    </List>
);
```

## Return Value

`useListContext` returns an object with the following keys:

```jsx
const {
    // Data
    data, // Array of the list records, e.g. [{ id: 123, title: 'hello world' }, { ... }
    total, // Total number of results for the current filters, excluding pagination. Useful to build the pagination controls, e.g. 23      
    meta, // Additional information about the list, like facets & statistics
    isPending, // Boolean, true until the data is available
    isFetching, // Boolean, true while the data is being fetched, false once the data is fetched
    isLoading, // Boolean, true until the data is fetched for the first time
    // Pagination
    page, // Current page. Starts at 1
    perPage, // Number of results per page. Defaults to 25
    setPage, // Callback to change the page, e.g. setPage(3)
    setPerPage, // Callback to change the number of results per page, e.g. setPerPage(25)
    hasPreviousPage, // Boolean, true if the current page is not the first one
    hasNextPage, // Boolean, true if the current page is not the last one
    // Sorting
    sort, // Sort object { field, order }, e.g. { field: 'date', order: 'DESC' }
    setSort, // Callback to change the sort, e.g. setSort({ field: 'name', order: 'ASC' })
    // Filtering
    filterValues, // Dictionary of filter values, e.g. { title: 'lorem', nationality: 'fr' }
    displayedFilters, // Dictionary of displayed filters, e.g. { title: true, nationality: true }
    setFilters, // Callback to update the filters, e.g. setFilters(filters, displayedFilters)
    showFilter, // Callback to show one of the filters, e.g. showFilter('title', defaultValue)
    hideFilter, // Callback to hide one of the filters, e.g. hideFilter('title')
    // Record selection
    selectedIds, // Array listing the ids of the selected records, e.g. [123, 456]
    onSelect, // Callback to change the list of selected records, e.g. onSelect([456, 789])
    onToggleItem, // Callback to toggle the record selection for a given id, e.g. onToggleItem(456)
    onUnselectItems, // Callback to clear the record selection, e.g. onUnselectItems();
    // Misc
    defaultTitle, // Translated title based on the resource, e.g. 'Posts'
    resource, // Resource name, deduced from the location. e.g. 'posts'
    refetch, // Callback for fetching the list data again
} = useListContext();
```

## Declarative Version

`useListContext` often forces you to create a new component just to access the list context. If you prefer a declarative approach based on render props, you can use [the `<WithListContext>` component](./WithListContext.md) instead:

```jsx
import { WithListContext } from 'react-admin';
import { Typography } from '@mui/material';

export const Aside = () => (
    <WithListContext render={({ data, isPending }) => 
        !isPending && (
            <div>
                <Typography variant="h6">Posts stats</Typography>
                <Typography variant="body2">
                    Total views: {data.reduce((sum, post) => sum + post.views, 0)}
                </Typography>
            </div>
    )} />
);
```

## Using `setFilters` to Update Filters

The `setFilters` method is used to update the filters. It takes three arguments:

- `filters`: an object containing the new filter values
- `displayedFilters`: an object containing the new displayed filters
- `debounced`: set to true to debounce the call to setFilters (false by default)

You can use it to update the filters in a custom filter component:

```jsx
import { useState } from 'react';
import { useListContext } from 'react-admin';

const CustomFilter = () => {
    const { filterValues, setFilters } = useListContext();
    const [formValues, setFormValues] = useState(filterValues);

    const handleChange = (event) => {
        setFormValues(formValues => ({
            ...formValues,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setFilters(filterFormValues);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="country" value={formValues.country} onChange={handleChange} />
            <input name="city" value={formValues.city} onChange={handleChange} />
            <input name="zipcode" value={formValues.zipcode} onChange={handleChange} />
            <input type="submit">Filter</input>
        </form>
    );
};
```

## TypeScript

The `useListContext` hook accepts a generic parameter for the record type:

```tsx
import { Typography } from '@mui/material';
import { List, Datagrid, TextField, useListContext } from 'react-admin';

type Post = {
    id: number;
    title: string;
    views: number;
};

export const Aside = () => {
    const { data: posts, isPending } = useListContext<Post>();
    if (isPending) return null;
    return (
        <div>
            <Typography variant="h6">Posts stats</Typography>
            <Typography variant="body2">
                {/* TypeScript knows that posts is of type Post[] */}
                Total views: {posts.reduce((sum, post) => sum + post.views, 0)}
            </Typography>
        </div>
    );
};

export const PostList = () => (
    <List aside={<Aside />}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="views" />
        </Datagrid>
    </List>
);
```

## Recipes

You can find many usage examples of `useListContext` in the documentation, including:

- [Adding a Side Component with `<List actions>`](./List.md#aside)
- [Building a Custom Actions Bar via `<List actions>`](./List.md#actions)
- [Building a Custom Empty Page via `<List empty>`](./List.md#empty)
- [Building a Custom Filter](./FilteringTutorial.md#building-a-custom-filter)
- [Building a Custom Sort Control](./ListTutorial.md#building-a-custom-sort-control)
- [Building a Custom Pagination Control](./ListTutorial.md#building-a-custom-pagination)
- [Building a Custom Iterator](./ListTutorial.md#building-a-custom-iterator)

**Tip**: [`<ReferenceManyField>`](./ReferenceManyField.md), as well as other relationship-related components, also implement a `ListContext`. That means you can use a `<Datagrid>` of a `<Pagination>` inside these components!
