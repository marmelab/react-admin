---
title: "CRUD Pages"
sidebar:
  order: 3
---

Most admin and B2B apps start with a few basic screens to manipulate records:

- A list page, including the ability to filter, paginate, and sort the records
- A read-only page displaying the record details
- An edition page, allowing to update the record via a form
- A creation page

We call this type of interface a "CRUD" interface because it allows us to Create, Read, Update, and Delete records.

React-admin's headless architecture provides powerful hooks and Base components to build CRUD interfaces with any UI library.

## Page Components

React-admin provides headless Base components for CRUD operations:

- [`<ListBase>`](./ListBase.md) fetches and manages a list of records
- [`<ShowBase>`](./ShowBase.md) fetches and manages a single record for display
- [`<EditBase>`](./EditBase.md) fetches and manages a record for editing
- [`<CreateBase>`](./CreateBase.md) manages the creation of a new record

Each component reads the parameters from the URL, fetches the data from the data provider, stores the data in a context, and renders its child component.

For example, to display a list of posts, you would use the `<ListBase>` component:

```jsx
import { ListBase } from 'ra-core';
import { DataTable } from './DataTable';

const PostList = () => (
    <ListBase resource="posts">
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="body" />
        </DataTable>
    </ListBase>
);
```

Here, the `<ListBase>` component will call `dataProvider.getList('posts')` to fetch the list of posts and create a `ListContext` to store the data. The `<DataTable>` component will read the data from that `ListContext` and render a row for each post. That's why there is no need to explicitly pass the data to the `<DataTable>` component.

## Page Context

`<ListBase>` and other Base components don't just fetch data; they provide a way to update the page settings:

- Sort field and order
- Current page & page size
- Filters
- Record selection

The [`ListContext`](./useListContext.md) exposes callbacks to update these settings, which you can use in your list UI component to update the data.

```jsx
const listContext = useListContext();
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
} = listContext;
```

## CRUD Routes

You could declare the CRUD routes manually using react-router's `<Route>` component. But it's such a typical pattern that react-admin provides a shortcut: the [`<Resource>`](./Resource.md) component.

```jsx
<Resource
    name="posts"
    list={PostList}     // maps PostList to /posts
    show={PostShow}     // maps PostShow to /posts/:id/show
    edit={PostEdit}     // maps PostEdit to /posts/:id
    create={PostCreate} // maps PostCreate to /posts/create
/>
```

This is the equivalent of the following react-router configuration:

```jsx
import { ResourceContextProvider } from 'ra-core';
import { Routes, Route } from 'react-router-dom';

<ResourceContextProvider value="posts">
    <Routes>
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:id/show" element={<PostShow />} />
        <Route path="/posts/:id" element={<PostEdit />} />
        <Route path="/posts/create" element={<PostCreate />} />
    </Routes>
</ResourceContextProvider>
```

`<Resource>` defines a `ResourceContext` storing the current resource `name`. This context is used by the `<ListBase>`, `<EditBase>`, `<CreateBase>`, and `<ShowBase>` components to determine the resource they should fetch. So when declaring page components with `<Resource>`, you don't need to pass the `resource` prop to them.

```diff
import { ListBase, useListContext } from 'ra-core';

const PostList = () => (
-   <ListBase resource="posts">
+   <ListBase>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="body" />
        </DataTable>
    </ListBase>
);
```

Check [the `<Resource>` documentation](./Resource.md) to learn more about routing and resource context.
