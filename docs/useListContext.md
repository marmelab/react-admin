---
layout: default
title: "useListContext"
---

# `useListContext`

The List components (`<List>`, `<ListGuesser>`, `<ListBase>`) take care of fetching the data, and put that data in a context called `ListContext` so that it's available for their descendants. This context also stores filters, pagination, sort state, and provides callbacks to update them. 

Any component can grab information from the `ListContext` using the `useListContext` hook. As a matter of fact, react-admin's `<Datagrid>`, `<FilterForm>`, and `<Pagination>` components all use the `useListContext` hook. Here is what it returns:

```jsx
const {
    // fetched data
    data, // an id-based dictionary of the list data, e.g. { 123: { id: 123, title: 'hello world' }, 456: { ... } }
    ids, // an array listing the ids of the records in the list, e.g [123, 456, ...]
    total, // the total number of results for the current filters, excluding pagination. Useful to build the pagination controls. e.g. 23 
    loaded, // boolean that is false until the data is available
    loading, // boolean that is true on mount, and false once the data was fetched
    // pagination
    page, // the current page. Starts at 1
    setPage, // a callback to change the current page, e.g. setPage(3)
    perPage, // the number of results per page. Defaults to 10
    setPerPage, // a callback to change the number of results per page, e.g. setPerPage(25)
    // sorting
    currentSort, // a sort object { field, order }, e.g. { field: 'date', order: 'DESC' } 
    setSort, // a callback to change the sort, e.g. setSort('name', 'ASC')
    // filtering
    filterValues, // a dictionary of filter values, e.g. { title: 'lorem', nationality: 'fr' }
    setFilters, // a callback to update the filters, e.g. setFilters(filters, displayedFilters)
    displayedFilters, // a dictionary of the displayed filters, e.g. { title: true, nationality: true }
    showFilter, // a callback to show one of the filters, e.g. showFilter('title', defaultValue)
    hideFilter, // a callback to hide one of the filters, e.g. hidefilter('title')
    // row selection
    selectedIds, // an array listing the ids of the selected rows, e.g. [123, 456]
    onSelect, // callback to change the list of selected rows, e.g onSelect([456, 789])
    onToggleItem, // callback to toggle the selection of a given record based on its id, e.g. onToggleItem(456)
    onUnselectItems, // callback to clear the selection, e.g. onUnselectItems();
    // misc
    basePath, // deduced from the location, useful for action buttons
    defaultTitle, // the translated title based on the resource, e.g. 'Posts'
    resource, // the resource name, deduced from the location. e.g. 'posts'
    refetch, // a callback to refresh the list data
} = useListContext();
```

You can find many usage examples of `useListContext` in this page, including:

- [Building a Custom Actions Bar](#actions)
- [Building an Aside Component](#aside-aside-component)
- [Building a Custom Empty Page](#empty-empty-page-component)
- [Building a Custom Filter](#building-a-custom-filter)
- [Building a Custom Sort Control](#building-a-custom-sort-control)
- [Building a Custom Pagination Control](#building-a-custom-pagination-control)
- [Building a Custom Iterator](#using-a-custom-iterator)

**Tip**: [`<ReferenceManyField>`](./Fields.md#referencemanyfield), as well as other relationship-related components, also implement a `ListContext`. That means you can use a `<Datagrid>` of a `<Pagination>` inside these components!