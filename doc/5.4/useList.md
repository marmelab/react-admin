---
layout: default
title: "useList"
---

# `useList`

The `useList` hook allows to create a `ListContext` based on local data. `useList` creates callbacks for sorting, paginating, filtering, and selecting records from an array.

Thanks to it, you can display your data inside a [`<Datagrid>`](./Datagrid.md), a [`<SimpleList>`](./SimpleList.md) or an [`<EditableDatagrid>`](./EditableDatagrid.md). 

## Usage

`useList` expects an object as parameter, with at least a `data` property. The data property is an array of records.

```jsx
import {
    useList,
    ListContextProvider,
    Datagrid,
    TextField
} from 'react-admin';

const data = [
    { id: 1, name: 'Arnold' },
    { id: 2, name: 'Sylvester' },
    { id: 3, name: 'Jean-Claude' },
];

const MyComponent = () => {
    const listContext = useList({ data });
    return (
        <ListContextProvider value={listContext}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" />
            </Datagrid>
        </ListContextProvider>
    );
};
```

If you use it with data coming from the `dataProvider`, don't forget to pass the `isPending` prop so that it only manipulates the data once it's available:

```jsx
import { useGetList, useList } from 'react-admin';

const MyComponent = () => {
    const { data, isPending } = useGetList(
        'posts',
        { pagination: { page: 1, perPage: 10 } },
    );
    const listContext = useList({ data, isPending });
    return (
        <ListContextProvider value={listContext}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" />
            </Datagrid>
        </ListContextProvider>
    );
};
```
## Parameters

`useList` expects an object with the following keys:

* [`data`](#data)
* [`filter`](#filter)
* [`filterCallback`](#filtercallback)
* [`isFetching`](#isfetching)
* [`isPending`](#isPending)
* [`page`](#page)
* [`perPage`](#perpage)
* [`sort`](#sort)

## `data`

The data to use to create the `ListContext`. It must be an array of records.

```jsx
const { data } = useList({
    data: [
        { id: 1, name: 'Arnold' },
        { id: 2, name: 'Sylvester' },
        { id: 3, name: 'Jean-Claude' },
    ],
});
```

## `filter`

The initial filter to apply to the data.

```jsx
const { data, total } = useList({
    data: [
        { id: 1, name: 'Arnold' },
        { id: 2, name: 'Sylvester' },
        { id: 3, name: 'Jean-Claude' },
    ],
    filter: { name: 'Arnold' },
});
// data will be [{ id: 1, name: 'Arnold' }] and total will be 1
```

The filtering capabilities are very limited. A filter on a field is a simple string comparison. There is no "greater than" or "less than" operator. You can do a full-text filter by using the `q` filter.

```jsx
const { data, total } = useList({
    data: [
        { id: 1, name: 'Arnold' },
        { id: 2, name: 'Sylvester' },
        { id: 3, name: 'Jean-Claude' },
    ],
    filter: { q: 'arno' },
});
// data will be [{ id: 1, name: 'Arnold' }] and total will be 1
```

## `filterCallback`

Property for custom filter definition. Lets you apply local filters to the fetched data.

```jsx
const { data } = useList({
    data: [
        { id: 1, name: 'Arnold' },
        { id: 2, name: 'Sylvester' },
        { id: 3, name: 'Jean-Claude' },
    ],
    sort: { field: 'name', order: 'ASC' },
    filterCallback: (record) => record.id > 1 && record.name !== 'Jean-Claude'
});
// data will be
// [
//    { id: 2, name: 'Sylvester' }, 
// ]
```

## `isFetching`

This value ends up in the return value. It is used by list iterators (like `<Datagrid>`) to know when to display a loading indicator.

```jsx
import { useGetList, useList } from 'react-admin';

const MyComponent = () => {
    const { data, isFetching } = useGetList(
        'posts',
        { page: 1, perPage: 10 }
    );
    const listContext = useList({ data, isFetching });
    return (
        <ListContextProvider value={listContext}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" />
            </Datagrid>
        </ListContextProvider>
    );
};
```

## `isPending`

This value ends up in the return value. It is used by list iterators (like `<Datagrid>`) to know when to display a loading indicator.

```jsx
import {
    useGetList,
    useList,
    ListContextProvider,
    Datagrid,
    TextField
} from 'react-admin';

const MyComponent = () => {
    const { data, isPending } = useGetList(
        'posts',
        { page: 1, perPage: 10 }
    );
    const listContext = useList({ data, isPending });
    return (
        <ListContextProvider value={listContext}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" />
            </Datagrid>
        </ListContextProvider>
    );
};
```

## `page`

The initial page to apply to the data.

```jsx
const { total, data } = useList({
    data: [
        { id: 1, name: 'Arnold' },
        { id: 2, name: 'Sylvester' },
        { id: 3, name: 'Jean-Claude' },
    ],
    perPage: 2,
    page: 1,
});
// total will be 3 and data will be
// [
//    { id: 1, name: 'Arnold' },
//    { id: 2, name: 'Sylvester' },
// ]
```

## `perPage`

The number of results to get for each page.

```jsx
const { total, data } = useList({
    data: [
        { id: 1, name: 'Arnold' },
        { id: 2, name: 'Sylvester' },
        { id: 3, name: 'Jean-Claude' },
    ],
    perPage: 2,
});
// total will be 3 and data will be
// [
//    { id: 1, name: 'Arnold' }
//    { id: 2, name: 'Sylvester' }, 
// ]
```

## `sort`

The initial sort field and order to apply to the data.

```jsx
const { data } = useList({
    data: [
        { id: 1, name: 'Arnold' },
        { id: 2, name: 'Sylvester' },
        { id: 3, name: 'Jean-Claude' },
    ],
    sort: { field: 'name', order: 'ASC' },
});
// data will be
// [
//    { id: 1, name: 'Arnold' }
//    { id: 3, name: 'Jean-Claude' },
//    { id: 2, name: 'Sylvester' }, 
// ]
```

## Return Value

`useList` returns an object with keys matching the shape of the `ListContext`: 

```jsx
const {
    // Data
    data, // Array of the list records, e.g. [{ id: 123, title: 'hello world' }, { ... }
    total, // Total number of results for the current filters, excluding pagination. Useful to build the pagination controls, e.g. 23      
    isPending, // Boolean, the value of the isPending parameter
    isFetching, // Boolean, the value of the isFetching parameter
    isLoading, // Boolean, the value of the isLoading parameter
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
    defaultTitle, // Empty string
    resource, // undefined
    refetch, // Callback that throws an error, as refetch doesn't make sense for local data
} = useList();
```
