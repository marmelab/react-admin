---
layout: default
title: "WithListContext"
---

# `<WithListContext>`

`<WithListContext>` executes its `render` function using the current `ListContext` as parameter. It's the render prop version of [the `useListContext` hook](./useListContext.md).

Use it to render a list of records already fetched.

## Usage

The most common use case for `<WithListContext>` is to build a custom list view on-the-fly, without creating a new component, in a place where records are available inside a `ListContext`. 

For instance, a list of book tags fetched via [`<ReferenceArrayField>`](./ReferenceArrayField.md): 

```jsx
import { List, Datagrid, TextField, ReferenceArrayField, WithListContext } from 'react-admin';
import { Chip, Stack } from '@mui/material';

const BookList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <ReferenceArrayField label="Tags" reference="tags" source="tag_ids">
                <WithListContext render={({ isLoading, data }) => (
                    !isLoading && (
                        <Stack direction="row" spacing={1}>
                            {data.map(tag => (
                                <Chip key={tag.id} label={tag.name} />
                            ))}
                        </Stack>
                    )
                )} />
            </ReferenceArrayField>
        </Datagrid>
    </List>
);
```

![List of tags](./img/reference-array-field.png)

The equivalent with `useListContext` would require an intermediate component:

```jsx
import { List, Datagrid, TextField, ReferenceArrayField, WithListContext } from 'react-admin';

const BookList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <ReferenceArrayField label="Tags" reference="tags" source="tag_ids">
                <TagList />
            </ReferenceArrayField>
        </Datagrid>
    </List>
);

const TagList = () => {
    const { isLoading, data } = useListContext();
    return isLoading 
        ? null
        : (
            <Stack direction="row" spacing={1}>
                {data.map(tag => (
                    <Chip key={tag.id} label={tag.name} />
                ))}
            </Stack>
        );
};
```

Whether you use `<WithListContext>` or `useListContext` is a matter of coding style.

## Props

`<WithListContext>` accepts a single `render` prop, which should be a function.

## `render`

A function which will be called with the current [`ListContext`](./useListContext.md) as argument. It should return a React element.

The [`ListContext`](./useListContext.md) contains the fetched array of records under the `data` key. You can use it to render a list of records:

```jsx
<WithListContext render={({ data }) => (
    <ul>
        {data.map(record => (
            <li key={record.id}>{record.title}</li>
        ))}
    </ul>
)}>
```

As a reminder, the [`ListContext`](./useListContext.md) is an object with the following properties:

```jsx
<WithListContext render={({
    // fetched data
    data, // an array of the list records, e.g. [{ id: 123, title: 'hello world' }, { ... }]
    total, // the total number of results for the current filters, excluding pagination. Useful to build the pagination controls, e.g. 23      
    isLoading, // boolean that is true until the data is available for the first time
    isFetching, // boolean that is true while the data is being fetched, and false once the data is fetched
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
}) => ( ... )}>
```

## Availability

Whenever you use a react-admin component to fetch a list of records, react-admin stores the data in a [`ListContext`](./useListContext.md). Consequently, `<WithListContext>` works in any component that is a descendant of:

- the [`<List>`](./ListBase.md), [`<InfiniteList>`](./InfiniteList.md), and [`<ListBase>`](./ListBase.md) components
- the [`<ArrayField>`](./ArrayField.md) component
- the [`<ReferenceManyField>`](./ReferenceManyField.md) component
- the [`<ReferenceArrayField>`](./ReferenceArrayField.md) component

## Building a Chart

A common use case is to build a chart based on the list data. For instance, the following component fetches a list of fruit prices (using `<ListBase>`), and draws a line chart with the data using [ReCharts](https://recharts.org/en-US):

![Chart based on ListContext](./img/WithListContext-chart.png)

```jsx
import { ListBase, WithListContext } from 'react-admin';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const FruitChart = () => (
    <ListBase resource="fruits" disableSyncWithLocation perPage={100}>
        <WithListContext
            render={({ data }) => (
                <LineChart width={700} height={300} data={data}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Line dataKey="apples" type="monotone" stroke="#8884d8" />
                    <Line dataKey="blueberries" type="monotone" stroke="#82ca9d" />
                    <Line dataKey="carrots" type="monotone" stroke="#ffc658" />
                </LineChart>
            )}
        />
    </ListBase>
);
```

## Building a Refresh Button

Another use case is to create a button that refreshes the current list. As the [`ListContext`](./useListContext.md) exposes the `refetch` function, it's as simple as:

```jsx
import { WithListContext } from 'react-admin'; 

const RefreshListButton = () => (
    <WithListContext render={({ refetch }) => (
        <button onClick={refetch}>Refresh</button>
    )} />
);
```