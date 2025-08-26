---
title: "Introduction"
---

The List view displays a list of records, and lets users search for specific records using filters, sorting, and pagination.

![The List View](../img/list-view.jpg)

This tutorial explains the List view from first principles, and shows how react-admin's headless components allow you to reduce the amount of boilerplate code to focus on the business logic. 

## From Pure React To React-Admin

The List view fetches a list of records and renders them, together with UI controls for filter, sort and pagination. 

To better understand how to use the various ra-core hooks and components dedicated to listing, let's start by building such a list view by hand.

### A List View Built By Hand

You've probably developed it a dozen times, and in fact you don't need react-admin to build, say, a book List view:

```tsx
import { useState } from 'react';
import { useGetList } from 'ra-core';

const BookList = () => {
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;
    const { data, total, isPending } = useGetList('books', {
        filter: { q: filter },
        pagination: { page, perPage },
        sort: { field: 'id', order: 'ASC' }
    });
    if (isPending) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h1>Book list</h1>
            <input
                placeholder="Search"
                value={filter}
                onChange={e => setFilter(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map(book => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.year}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                {page > 1 && <button onClick={() => setPage(page - 1)}>Previous page</button>}
                {page < (total || 0) / perPage && <button onClick={() => setPage(page + 1)}>Next page</button>}
            </div>
        </div>
    );
};
```

You can pass this `BookList` component as the `list` prop of the `<Resource name="books" />`, and react-admin will render it on the `/books/` path.

This example uses the `useGetList` hook instead of `fetch` because `useGetList` already contains the authentication and request state logic. But you could totally write a List view with `fetch`.

This list is a bit rough around the edges (for instance, typing in the search input makes one call to the dataProvider per character), but it's good enough for the purpose of this chapter. 

### Custom Components for List UI

Since ra-core doesn't provide built-in UI components, you'll need to create your own. Let's start by creating reusable components for table display, filters, and pagination:

```tsx
// FilterForm.tsx
import { useState } from 'react';
import { useListContext } from 'ra-core';

const FilterForm = ({ filters }) => {
    const { filterValues, setFilters } = useListContext();
    
    const handleChange = (key, value) => {
        const newValues = { ...filterValues, [key]: value };
        setFilters(newValues);
    };
    
    return (
        <div style={{ marginBottom: '1rem' }}>
            {filters.map(filter => (
                <input
                    key={filter.source}
                    placeholder={filter.label}
                    value={filterValues[filter.source] || ''}
                    onChange={e => handleChange(filter.source, e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                />
            ))}
        </div>
    );
};
```

```tsx
// Pagination.tsx
import { useListContext } from 'ra-core';

const Pagination = () => {
    const { page, setPage, total, perPage } = useListContext();
    const totalPages = Math.ceil((total || 0) / perPage);
    
    return (
        <div>
            {page > 1 && (
                <button onClick={() => setPage(page - 1)}>
                    Previous page
                </button>
            )}
            <span> Page {page} of {totalPages} </span>
            {page < totalPages && (
                <button onClick={() => setPage(page + 1)}>
                    Next page
                </button>
            )}
        </div>
    );
};
```

```tsx
// BookTable.tsx
import { useListContext } from 'ra-core';

const BookTable = () => {
    const { data } = useListContext();
    
    return (
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Year</th>
                </tr>
            </thead>
            <tbody>
                {data?.map(book => (
                    <tr key={book.id}>
                        <td>{book.id}</td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.year}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
```

### `ListContext` Exposes List Data To Descendants

React-admin provides a `ListContext` to share list data between components. Creating such a context with `<ListContextProvider>` allows you to use the custom components we just created and access list data through the `useListContext` hook:

```tsx
import { useState } from 'react';
import { useGetList, ListContextProvider, useListContext } from 'ra-core';
import { FilterForm } from './FilterForm';
import { Pagination } from './Pagination';
import { BookTable } from './BookTable';

const BookList = () => {
    const [filter, setFilter] = useState({});
    const [page, setPage] = useState(1);
    const perPage = 10;
    const sort = { field: 'id', order: 'ASC' };
    
    const { data, total, isPending } = useGetList('books', {
        filter,
        pagination: { page, perPage },
        sort,
    });
    
    if (isPending) {
        return <div>Loading...</div>;
    }
    
    const filters = [{ source: 'q', label: 'Search' }];
    
    return (
        <ListContextProvider value={{ 
            data: data || [], 
            total: total || 0, 
            page, 
            perPage,
            setPage, 
            filterValues: filter,
            setFilters: setFilter,
            sort 
        }}>
            <div>
                <h1>Book list</h1>
                <FilterForm filters={filters} />
                <BookTable />
                <Pagination />
            </div>
        </ListContextProvider>
    );
};
```

This approach allows you to access the list data in any descendant component using the `useListContext` hook, as shown in the `Pagination` and `BookTable` components above.

The `useListContext` hook provides access to all list state and methods:
- `data`: Array of records
- `total`: Total number of records
- `page`: Current page number
- `setPage`: Function to change the page
- `filterValues`: Current filter values
- `setFilters`: Function to update filters
- `sort`: Current sort configuration

### `useListController` Handles Controller Logic

The initial logic that grabs the records from the API, handles the filter and pagination state, and creates callbacks to change them is also common, and react-admin exposes [the `useListController` hook](./useListController.md) to do it. It returns an object that fits perfectly the format expected by `<ListContextProvider>`:

```diff
-import { useState } from 'react';
import { 
-   useGetList,
+   useListController,
    ListContextProvider,
} from 'ra-core';
import { FilterForm } from './FilterForm';
import { Pagination } from './Pagination';
import { BookTable } from './BookTable';

const BookList = () => {
-   const [filter, setFilter] = useState({});
-   const [page, setPage] = useState(1);
-   const perPage = 10;
-   const sort = { field: 'id', order: 'ASC' };
-   
-   const { data, total, isPending } = useGetList('books', {
-       filter,
-       pagination: { page, perPage },
-       sort,
-   });
-   
-   if (isPending) {
-       return <div>Loading...</div>;
-   }
+   const listContext = useListController();
+   if (listContext.isPending) {
+       return <div>Loading...</div>;
+   }
    
    const filters = [{ source: 'q', label: 'Search' }];
    
    return (
-       <ListContextProvider value={{ 
-           data: data || [], 
-           total: total || 0, 
-           page, 
-           perPage,
-           setPage, 
-           filterValues: filter,
-           setFilters: setFilter,
-           sort 
-       }}>
+       <ListContextProvider value={listContext}>
            <div>
                <h1>Book list</h1>
                <FilterForm filters={filters} />
                <BookTable />
                <Pagination />
            </div>
        </ListContextProvider>
    );
};
```

Notice that `useListController` doesn't need the 'books' resource name - it relies on the `ResourceContext`, set by the `<Resource>` component, to guess it.

React-admin's List controller does much, much more than the code it replaces above:

- it uses sensible defaults for the sort and pagination state,
- it stores the list state (sort, pagination, filters) in the URL to make the page bookmarkable,
- it memorises this state to let users find the same filters when they come back to the list,
- it allows to select records for bulk actions,
- it debounces the calls to the API when the user types text in the filter form,
- it keeps the current data on screen while a new page is being fetched,
- it changes the current page if it's empty,
- it translates the title 

### `<ListBase>`: Component Version Of The Controller

As calling the List controller and putting its result into a context is also common, react-admin provides [the `<ListBase>` component](./ListBase.md) to do it. So the example can be further simplified to the following: 

```diff
import { 
-   useListController,
-   ListContextProvider,
+   ListBase,
} from 'ra-core';
import { FilterForm } from './FilterForm';
import { Pagination } from './Pagination';
import { BookTable } from './BookTable';

+const filters = [{ source: 'q', label: 'Search' }];

const BookList = () => {
-   const listContext = useListController();
-   if (listContext.isPending) {
-       return <div>Loading...</div>;
-   }
-   
-   const filters = [{ source: 'q', label: 'Search' }];
-   
    return (
-       <ListContextProvider value={listContext}>
+       <ListBase>
            <div>
                <h1>Book list</h1>
                <FilterForm filters={filters} />
                <BookTable />
                <Pagination />
            </div>
-       </ListContextProvider>
+       </ListBase>
    );
};
```

Notice that we're not handling the loading state manually anymore. In fact, `<ListBase>` can handle the loading state internally and only render its children when data is available.

## A Complete List View

With all these components, we can build a complete, maintainable list view:

```tsx
// in src/books/BookList.tsx
import { ListBase } from 'ra-core';
import { FilterForm } from './FilterForm';
import { Pagination } from './Pagination';
import { BookTable } from './BookTable';

const filters = [{ source: 'q', label: 'Search' }];

const BookList = () => (
    <ListBase>
        <div>
            <h1>Book list</h1>
            <FilterForm filters={filters} />
            <BookTable />
            <Pagination />
        </div>
    </ListBase>
);
```

The code is now concise, maintainable, and contains all the necessary logic for:
- Fetching the records from the API
- Handling filter and pagination state
- Managing loading and error states
- Storing state in the URL for bookmarkability
- Debouncing filter changes

React-admin's headless components provide a robust foundation for building custom user interfaces while taking care of the complex data management logic under the hood.

## Building a Custom List Layout

With headless components, you're responsible for building your own list display. You can leverage the `useListContext` hook to get the list data and build whatever UI you need:

```tsx
import { ListBase, useListContext } from 'ra-core';

type Book = {
    id: number;
    title: string;
    author: string;
    year: number;
};

const BookListView = () => {
    const { data } = useListContext<Book>();
    return (
        <div style={{ padding: '16px' }}>
            {data.map(book => (
                <div key={book.id} style={{ marginBottom: '16px', border: '1px solid #ccc', padding: '8px' }}>
                    <h3><em>{book.title}</em></h3>
                    <p>by {book.author} ({book.year})</p>
                </div>
            ))}
        </div>
    );
};

const BookList = () => (
    <ListBase>
        <BookListView />
    </ListBase>
);
```

Alternatively, you can use the `WithListContext` component if you prefer a render prop pattern:

```tsx
import { ListBase, WithListContext } from 'ra-core';

type Book = {
    id: number;
    title: string;
    author: string;
    year: number;
};

const BookList = () => (
    <ListBase>
        <WithListContext<Book> render={({ data }) => (
            <div style={{ padding: '16px' }}>
                {data.map(book => (
                    <div key={book.id} style={{ marginBottom: '16px', border: '1px solid #ccc', padding: '8px' }}>
                        <h3><em>{book.title}</em></h3>
                        <p>by {book.author} ({book.year})</p>
                    </div>
                ))}
            </div>
        )} />
    </ListBase>
);
```

You can handle the loading state by checking the `isPending` variable from the `ListContext`, or use the `emptyWhileLoading` prop on `<ListBase>` to prevent rendering until data is available.

## Filtering the List

One of the most important features of the List page is the ability to search for records. To build custom filter controls, refer to [the Filter documentation](./FilteringTutorial.md) which contains information on how to build your own filter UI using headless components from ra-core.

## Sorting the List

The List view uses the `sort` and `order` query parameters to determine the sort field and order passed to `dataProvider.getList()`.

Here is a typical List URL:

> https://myadmin.dev/#/posts?displayedFilters=%7B%22commentable%22%3Atrue%7D&filter=%7B%22commentable%22%3Atrue%2C%22q%22%3A%22lorem%20%22%7D&order=DESC&page=1&perPage=10&sort=published_at

Once decoded, this URL reveals the intended sort:

```
sort=published_at
order=DESC
```

For headless components, you'll need to build your own sorting controls using the `useListSortContext` hook to access and modify the current sort state.


## Linking to a Pre-Sorted List

As the sort values are taken from the URL, you can link to a pre-sorted list by setting the `sort` and `order` query parameters.

For instance, if you have a list of posts ordered by publication date, and you want to provide a button to sort the list by number of views descendant:

```tsx
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';

const SortByViews = () => (
    <Link
        to={{
            pathname: '/posts',
            search: stringify({
                page: 1,
                perPage: 25,
                sort: 'nb_views',
                order: 'DESC',
                filter: {},
            }),
        }}
    >
        Sort by views 
    </Link>
);
```

**Tip**: You have to pass *all* the query string parameters - not just `sort` and `order`. That's a current limitation of react-admin.

## Building a Custom Sort Control

When you need custom sort controls for your headless implementation, you can use the `useListSortContext` hook to access and modify the current sort state:

```tsx
import { useListSortContext } from 'ra-core';

const SortButton = ({ fields }) => {
    const { sort, setSort } = useListSortContext();
    
    const handleSort = (field) => {
        setSort({
            field,
            order: field === sort.field ? inverseOrder(sort.order) : 'ASC'
        });
    };

    const inverseOrder = (order) => (order === 'ASC' ? 'DESC' : 'ASC');

    return (
        <div>
            <label>Sort by: </label>
            <select 
                value={sort.field || ''} 
                onChange={(e) => handleSort(e.target.value)}
            >
                <option value="">Choose field...</option>
                {fields.map(field => (
                    <option key={field.value} value={field.value}>
                        {field.label} ({sort.field === field.value ? inverseOrder(sort.order) : 'ASC'})
                    </option>
                ))}
            </select>
        </div>
    );
};

// Usage
const sortFields = [
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'year', label: 'Year' }
];

const BookList = () => (
    <ListBase>
        <div>
            <h1>Books</h1>
            <SortButton fields={sortFields} />
            <BookTable />
        </div>
    </ListBase>
);
```

## Building a Custom Pagination

For custom pagination controls, use the `useListContext` hook to access pagination state and controls:

```tsx
import { useListContext } from 'ra-core';

const CustomPagination = () => {
    const { page, hasPreviousPage, hasNextPage, setPage, total, perPage } = useListContext();
    
    if (!hasPreviousPage && !hasNextPage) return null;
    
    const totalPages = Math.ceil(total / perPage);
    
    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px' }}>
            <button 
                onClick={() => setPage(page - 1)}
                disabled={!hasPreviousPage}
            >
                Previous
            </button>
            
            <span>
                Page {page} of {totalPages} ({total} items)
            </span>
            
            <button 
                onClick={() => setPage(page + 1)}
                disabled={!hasNextPage}
            >
                Next
            </button>
        </div>
    );
};

// Usage in your list
const BookList = () => (
    <ListBase>
        <div>
            <h1>Books</h1>
            <BookTable />
            <CustomPagination />
        </div>
    </ListBase>
);
```


