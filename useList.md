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

If you use it with data coming from the `dataProvider`, don't forget to pass the `isLoading` prop so that it only manipulates the data once it's available:

```jsx
import { useGetList, useList } from 'react-admin';

const MyComponent = () => {
    const { data, isLoading } = useGetList(
        'posts',
        { page: 1, perPage: 10 }
    );
    const listContext = useList({ data, isLoading });
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

The `useGetList` parameter accepts the following options:

* [`filter`](#filter)
* [`isFetching`](#isfetching)
* [`isLoading`](#isloading)
* [`page`](#page)
* [`perPage`](#perpage)
* [`sort`](#sort)

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

## `isLoading`

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
    const { data, isLoading } = useGetList(
        'posts',
        { page: 1, perPage: 10 }
    );
    const listContext = useList({ data, isLoading });
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
//    { id: 3, name: 'Jean-Claude' },
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

`useGetList` returns an object matching the shape of the `ListContext`: 

The `useListContext` hook returns an object with the following keys:

```jsx
const {
    // fetched data
    data, // a paginated, sorted, and filtered array of records, e.g. [{ id: 123, title: 'hello world' }, { ... }]
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
    defaultTitle, // empty string
    resource, // undefined
    refetch, // a function that throws an error, as refetch doesn't make sense for local data
} = getGetList({ data });
```
