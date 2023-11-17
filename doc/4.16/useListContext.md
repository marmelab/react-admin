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
    const { data, isLoading } = useListContext();
    if (isLoading) return null;
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

The `useListContext` hook returns an object with the following keys:

```jsx
const {
    // fetched data
    data, // an array of the list records, e.g. [{ id: 123, title: 'hello world' }, { ... }]
    total, // the total number of results for the current filters, excluding pagination. Useful to build the pagination controls, e.g. 23      
    isFetching, // boolean that is true while the data is being fetched, and false once the data is fetched
    isLoading, // boolean that is true until the data is available for the first time
    // pagination
    page, // the current page. Starts at 1
    perPage, // the number of results per page. Defaults to 25
    setPage, // a callback to change the page, e.g. setPage(3)
    setPerPage, // a callback to change the number of results per page, e.g. setPerPage(25)
    hasPreviousPage, // boolean, true if the current page is not the first one
    hasNextPage, // boolean, true if the current page is not the last one
    // sorting
    sort, // a sort object { field, order }, e.g. { field: 'date', order: 'DESC' }
    setSort, // a callback to change the sort, e.g. setSort({ field: 'name', order: 'ASC' })
    // filtering
    filterValues, // a dictionary of filter values, e.g. { title: 'lorem', nationality: 'fr' }
    displayedFilters, // a dictionary of the displayed filters, e.g. { title: true, nationality: true }
    setFilters, // a callback to update the filters, e.g. setFilters(filters, displayedFilters)
    showFilter, // a callback to show one of the filters, e.g. showFilter('title', defaultValue)
    hideFilter, // a callback to hide one of the filters, e.g. hideFilter('title')
    // record selection
    selectedIds, // an array listing the ids of the selected rows, e.g. [123, 456]
    onSelect, // callback to change the list of selected rows, e.g. onSelect([456, 789])
    onToggleItem, // callback to toggle the selection of a given record based on its id, e.g. onToggleItem(456)
    onUnselectItems, // callback to clear the selection, e.g. onUnselectItems();
    // misc
    defaultTitle, // the translated title based on the resource, e.g. 'Posts'
    resource, // the resource name, deduced from the location. e.g. 'posts'
    refetch, // callback for fetching the list data again
} = useListContext();
```

## Declarative Version

`useListContext` often forces you to create a new component just to access the list context. If you prefer a declarative approach based on render props, you can use [the `<WithListContext>` component](./WithListContext.md) instead:

```jsx
import { WithListContext } from 'react-admin';
import { Typography } from '@mui/material';

export const Aside = () => (
    <WithListContext render={({ data, isLoading }) => 
        !isLoading && (
            <div>
                <Typography variant="h6">Posts stats</Typography>
                <Typography variant="body2">
                    Total views: {data.reduce((sum, post) => sum + post.views, 0)}
                </Typography>
            </div>
    )} />
);
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
    const { data: posts, isLoading } = useListContext<Post>();
    if (isLoading) return null;
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
