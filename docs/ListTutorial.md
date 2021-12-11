---
layout: default
title: "The List Page"
---

# The List Page

The List view displays a list of records, and lets users search for specific records using filters, sorting, and pagination. 

![The List View](./img/list-view.jpg)

This tutorial explains the List view from first principles, and shows how react-admin allows you to reduce the amount of boilerplate code to focus on the business logic. 

## Building A List View By Hand

The List view fetches a list of records and renders them, together with UI controls for filter, sort and pagination. You've probably developed it a dozen times, and in fact you don't need react-admin to build, say, a book List view:

{% raw %}
```jsx
import { useState } from 'react';
import { Title, useGetList } from 'react-admin';
import {
    Card,
    TextField,
    Button,
    Toolbar,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from '@mui/material';

const BookList = () => {
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;
    const { data, total, isLoading } = useGetList('books', {
        filter: { q: filter },
        pagination: { page, perPage },
        sort: { field: 'id', order: 'ASC' }
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <Title title="Book list" />
            <TextField
                label="Search"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                variant="filled"
                size="small"
                margin="dense"
            />
            <Card>
                <Table sx={{ padding: 2 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Year</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(book => (
                            <TableRow key={book.id}>
                                <TableCell>{book.id}</TableCell>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.year}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
            <Toolbar>
                {page > 1 && <Button onClick={() => setPage(page - 1)}>Previous page</Button>}
                {page < total / perPage && <Button onClick={() => setPage(page + 1)}>Next page</Button>}
            </Toolbar>
        </div>
    );
};
```
{% endraw %}

You can pass this `BookList` component as the `list` prop of the `<Resource name="books" />`, and react-admin will render it on the `/books/` path.

This example uses the `useGetList` hook instead of `fetch` because `useGetList` already contains the authentication and request state logic. But you could totally write a List view with `fetch`.

This list is a bit rough in the edges (for instance, typing in the search input makes one call to the dataProvider per character), but it's good enough for the purpose of this chapter. 

## `<Datagrid>` Displays Fields In A Table

Table layouts usually require a lot of code to define the table head, row, columns, etc. React-admin `<Datagrid>` component, together with Field components, can help remove that boilerplate:

```jsx
import { useState } from 'react';
import { Title, useGetList, Datagrid, TextField } from 'react-admin';
import {
    Card,
    TextField,
    Button,
    Toolbar,
} from '@mui/material';


const BookList = () => {
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;
    const currentSort = { field: 'id', order: 'ASC' };
    const { data, total, isLoading } = useGetList('books', {
        filter: { q: filter },
        pagination: { page, perPage },
        sort: currentSort,
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <Title title="Book list" />
            <TextField
                label="Search"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                variant="filled"
                size="small"
                margin="dense"
            />
            <Card>
                <Datagrid data={data} currentSort={currentSort}>
                    <TextField source="id" />
                    <TextField source="title" />
                    <TextField source="author" />
                    <TextField source="year" />
                </Datagrid>
            </Card>
            <Toolbar>
                {page > 1 && <Button onClick={() => setPage(page - 1)}>Previous page</Button>}
                {page < total / perPage && <Button onClick={() => setPage(page + 1)}>Next page</Button>}
            </Toolbar>
        </div>
    );
};
```

`<Datagrid>`does more than the previous table: it renders table headers depending on the current sort, and allows you to change the sort order by clicking a column header. Also, for each row, `<Datagrid>` creates a `RecordContext`, which lets you use react-admin Field and Buttons without explicitely passing the row data.

## `ListContext` Exposes List Data To Descendents

`<Datagrid>` requires a `data` prop to render, but it can grab it from a `ListContext` instead. Creating such a context with `<ListContextProvider>` also allows to use other react-admin components specialized in filtering (`<FilterForm>`) and pagination (`<Pagination>`), and to reduce the boilerplate code even further:

{% raw %}
```jsx
import { useState } from 'react';
import { 
    Title,
    useGetList,
    Datagrid,
    TextField,
    ListContextProvider,
    FilterForm,
    Pagination,
    TextInput
} from 'react-admin';
import { Card } from '@mui/material';

const BookList = () => {
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;
    const currentSort = { field: 'id', order: 'ASC' };
    const { data, total, isLoading } = useGetList('books', {
        filter: { q: filter },
        pagination: { page, perPage },
        sort: currentSort,
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    const filters = [<TextInput label="Search" source="q" size="small" alwaysOn />];
    const filterValues = { q: filter };
    const setFilters = filters => setFilter(filters.q);
    return (
        <ListContextProvider value={{ data, total, page, perPage, setPage, filterValues, setFilters, currentSort }}>
            <div>
                <Title title="Book list" />
                <FilterForm filters={filters} />
                <Card>
                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="title" />
                        <TextField source="author" />
                        <TextField source="year" />
                    </Datagrid>
                </Card>
                <Pagination />
            </div>
        </ListContextProvider>
    );
};
```
{% endraw %}

## `useListController` Handles Controller Logic

The initial logic that grabs the records from the API, handles the filter and pagination state, and creates callbacks to change them is also common, and react-admin exposes [the `useListController` hook](./useListController.md) to do it. It returns an object that fits perfectly the format expected by `<ListContextProvider>`:

```jsx
import { 
    Title,
    useListController,
    Datagrid,
    TextField,
    ListContextProvider,
    FilterForm,
    Pagination,
    TextInput
} from 'react-admin';
import { Card } from '@mui/material';

const BookList = () => {
    const listContext = useListController();
    if (listContext.isLoading) {
        return <div>Loading...</div>;
    }
    const filters = [<TextInput label="Search" source="q" size="small" alwaysOn />];
    return (
        <ListContextProvider value={context}>
            <div>
                <Title title="Book list" />
                <FilterForm filters={filters} />
                <Card>
                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="title" />
                        <TextField source="author" />
                        <TextField source="year" />
                    </Datagrid>
                </Card>
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

## `<ListBase>`: Component Version Of The Controller

As calling the List controller and putting its result into a context is also common, react-admin provides [the `<ListBase>` component](./ListBase.md) to do it. So the example can be further simplified to the following: 

```jsx
import { 
    Title,
    ListBase,
    Datagrid,
    TextField,
    FilterForm,
    Pagination,
    TextInput
} from 'react-admin';
import { Card } from '@mui/material';

const filters = [<TextInput label="Search" source="q" size="small" alwaysOn />];

const BookList = () => (
    <ListBase>
        <div>
            <Title title="Book list" />
            <FilterForm filters={filters} />
            <Card>
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="title" />
                    <TextField source="author" />
                    <TextField source="year" />
                </Datagrid>
            </Card>
            <Pagination />
        </div>
    </ListBase>
);
```

Notice that we're not handling the loading state manually anymore. In fact, the `<Datagrid>` component can render a skeleton while the data is being fetched.

## `useListContext` Accesses The List Context

Using the `<ListBase>` component has one drawback: you can no longer access the list context (`data`, `total`, etc.) in the component. Instead, you have to access it from the `ListContext` using [the `useListContext` hook](./useListContext.md).

The following example illustrates the usage of `useListContext` with a custom pagination component:

```jsx
import { useListContext } from 'react-admin';
import { Toolbar, Button } from '@mui/core';

const Pagination = () => {
    const { page, setPage, total } = useListContext();
    return (
        <Toolbar>
            {page > 1 && <Button onClick={() => setPage(page - 1)}>Previous page</Button>}
            {page < total / 10 && <Button onClick={() => setPage(page + 1)}>Next page</Button>}
        </Toolbar>
    )
}
```

## `<List>` Renders Title, Filters, And Pagination

`<ListBase>` is a headless component: it renders only its children. But almost every List view needs a wrapping `<div>`, a title, filters, pagination, a material-UI `<Card>`, etc. That's why react-admin provides [the `<List>` component](./List.md), which includes the `<ListBase>` component and a "classic" layout to reduce the boilerplate even further:

```jsx
import { 
    List,
    Datagrid,
    TextField,
    TextInput
} from 'react-admin';
import { Card } from '@mui/material';

const filters = [<TextInput label="Search" source="q" size="small" alwaysOn />];

const BookList = () => (
    <List filters={filters}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="year" />
        </Datagrid>
    </List>
);
```

Now compare this code snippet with the first snippet in this page: it's much shorter, and more expressive! By encapsulating common CRUD logic, react-admin reduces the amount of code you need to write, and lets you focus on the business logic. As you've seen with the List controller and context, there is no magic: it's just standard React hooks and components designed for B2B apps and web developers with deadlines.

## `<ListGuesser>`: Zero-Configuration List

Sometimes typing `<Datagrid>` and a few `<Field>` components is too much - for instance if you want to prototype an admin for many resources, or search data through an API without worrying about the actual data structure.

For these cases, react-admin provides a `<ListGuesser>` component that will guess the datagrid columns from the data. It's a bit like the `<List>` component, but it doesn't require any configuration.

```jsx
import { Admin, Resource, ListGuesser } from 'react-admin';

const App = () => (
    <Admin dataProvider={...}>
        <Resource name="posts" list={ListGuesser} />
    </Admin>
);
```

`<ListGuesser>` is also a good way to bootstrap a List view, as it outputs the code that it generated for the List into the console. Copy and paste that code in a custom List component, and you can start customizing the list view in no time.

## Sorting the List

The List view uses the `sort` and `order` query parameters to determine the sort field and order passed to `dataProvider.getList()`.

Here is a typical List URL:

> https://myadmin.dev/#/posts?displayedFilters=%7B%22commentable%22%3Atrue%7D&filter=%7B%22commentable%22%3Atrue%2C%22q%22%3A%22lorem%20%22%7D&order=DESC&page=1&perPage=10&sort=published_at

Once decoded, this URL reveals the intended sort:

```
sort=published_at
order=DESC
```

If you're using a `<Datagrid>` inside the List view, then the column headers are buttons allowing users to change the list sort field and order. This feature requires no configuration and works out fo the box. Check [the `<Datagrid>` documentation](./Datagrid.md#customizing-the-sort-order-for-columns) to see how to disable or modify the field used for sorting on a particular column.

![Sort Column Header](./img/sort-column-header.gif)

If you're using another List layout, check [the `<SortButton>` component](./SortButton.md): It's a standalone button that allows users to change the list sort field and order.

![Sort Button](./img/sort-button.gif)

## Linking to a Pre-Sorted List

As the sort values are taken from the URL, you can link to a pre-sorted list by setting the `sort` and `order` query parameters.

For instance, if you have a list of posts ordered by publication date, and you want to provide a button to sort the list by number of views descendent:

{% raw %}
```jsx
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';

const SortByViews = () => (
    <Button
        color="primary"
        component={Link}
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
    </Button>
);
```
{% endraw %}

**Tip**: You have to pass *all* the query string parameters - not just `sort` and `order`. That's a current limitation of react-admin.

## Using Another Layout

On Mobile, `<Datagrid>` doesn't work well - the screen is too narrow. You can use the `<SimpleList>` component instead. It's a drop-in replacement for `<Datagrid>`.

```jsx
import { 
    List,
    SimpleList,
    TextInput
} from 'react-admin';
import { Card } from '@mui/material';

const filters = [<TextInput label="Search" source="q" size="small" alwaysOn />];

const BookList = () => (
    <List filters={filters}>
        <SimpleList 
            primaryText={record => <i>record.title</i>}
            secondaryText={record => <>By {record.author} ({record.year})</>}
        />
    </List>
);
```

React-admin offers many more List layouts: [`<EditableDatagrid>`](./EditableDatagrid.md), [`<TreeWithDetails>`](./Tree.md), [`<Calendar>`](./Calendar.md), etc. The `<List>` component accepts any component as child - even components of your own! 

## Building a Custom Layout

In some cases, neither the `<Datagrid>` nor the `<SimpleList>` components allow to display the records in an optimal way for a given task. In these cases, pass your layout component directly as children of the `<List>` component. As `<List>` takes care of fetching the data and putting it in a `ListContext`, you can leverage [the `useListContext` hook](./useListContext.md) to get the list data. 

{% raw %}
```jsx
import { List, useListContext } from 'react-admin';
import { Stack, Typography } from '@mui/icons-material/Star';

const SimpleBookList = () => {
    const { data } = useListContext();
    return (
        <Stack spacing={2} sx={{ padding: 2 }}>
            {data.map(book => (
                <Typography key={book.id}>
                    <i>{book.title}</i>, by {book.author} ({book.year})
                </Typography>
            ))}
        </Stack>
    );
}

// use the custom list layout as <List> child
const BookList = () => (
    <List emptyWhileLoading>
        <SimpleBookList />
    </List>
);
```
{% endraw %}

**Tip**: With `emptyWhileLoading` turned on, the `<List>` component doesn't render its child component until the data is available. Without this flag, the `<SimpleBookList>` component would render even during the loading phase, break at `data.map()`. 

You can also handle the loading state inside a custom list layout by grabbing the `isLoading` variable from the `ListContext`, but `emptyWhileLoading` is usually more convenient.

## Building a Custom Filter

![Filters with submit button](./img/filter_with_submit.gif)

If neither the Filter button/form combo nor the `<FilterList>` sidebar match your need, you can always build your own. React-admin provides shortcuts to facilitate the development of custom filters.

For instance, by default, the filter button/form combo doesn't provide a submit button, and submits automatically after the user has finished interacting with the form. This provides a smooth user experience, but for some APIs, it can cause too many calls. 

In that case, the solution is to process the filter when users click on a submit button, rather than when they type values in form inputs. React-admin doesn't provide any component for that, but it's a good opportunity to illustrate the internals of the filter functionality. We'll actually provide an alternative implementation to the Filter button/form combo.

To create a custom filter UI, we'll have to override the default List Actions component, which will contain both a Filter Button and a Filter Form, interacting with the List filters via the ListContext.

### Filter Callbacks

The new element can use the `useListContext()` hook to interact with the URI query parameter more easily. The hook returns the following constants:

- `filterValues`: Value of the filters based on the URI, e.g. `{"commentable":true,"q":"lorem "}`
- `setFilters()`: Callback to set the filter values, e.g. `setFilters({"commentable":true})`
- `displayedFilters`: Names of the filters displayed in the form, e.g. `['commentable','title']`
- `showFilter()`: Callback to display an additional filter in the form, e.g. `showFilter('views')`
- `hideFilter()`: Callback to hide a filter in the form, e.g. `hideFilter('title')`

Let's use this knowledge to write a custom `<List>` component that filters on submit.

### Custom Filter Button

The `<PostFilterButton>` shows the filter form on click. We'll take advantage of the `showFilter` function:

```jsx
import { useListContext } from 'react-admin';
import { Button } from "@mui/material";
import ContentFilter from "@mui/icons-material/FilterList";

const PostFilterButton = () => {
    const { showFilter } = useListContext();
    return (
        <Button
            size="small"
            color="primary"
            onClick={() => showFilter("main")}
            startIcon={<ContentFilter />}
        >
            Filter
        </Button>
    );
};
```

Normally, `showFilter()` adds one input to the `displayedFilters` list. As the filter form will be entirely hidden or shown, we use `showFilter()` with a virtual "main" input, which represents the entire form. 

### Custom Filter Form

Next is the filter form component, displayed only when the "main" filter is displayed (i.e. when a user has clicked the filter button). The form inputs appear directly in the form, and the form submission triggers the `setFilters()` callback passed as parameter. We'll use `react-final-form` to handle the form state:

{% raw %}
```jsx
import * as React from 'react';
import { Form } from 'react-final-form';
import { Box, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TextInput, NullableBooleanInput, useListContext } from 'react-admin';

const PostFilterForm = () => {
  const {
    displayedFilters,
    filterValues,
    setFilters,
    hideFilter
  } = useListContext();

  if (!displayedFilters.main) return null;

  const onSubmit = (values) => {
    if (Object.keys(values).length > 0) {
      setFilters(values);
    } else {
      hideFilter("main");
    }
  };

  const resetFilter = () => {
    setFilters({}, []);
  };

  return (
    <div>
      <Form onSubmit={onSubmit} initialValues={filterValues}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box display="flex" alignItems="flex-end" mb={1}>
              <Box component="span" mr={2}>
                {/* Full-text search filter. We don't use <SearchFilter> to force a large form input */}
                <TextInput
                  resettable
                  helperText={false}
                  source="q"
                  label="Search"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment>
                        <SearchIcon color="disabled" />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box component="span" mr={2}>
                {/* Commentable filter */}
                <NullableBooleanInput helperText={false} source="commentable" />
              </Box>
              <Box component="span" mr={2} mb={1.5}>
                <Button variant="outlined" color="primary" type="submit">
                  Filter
                </Button>
              </Box>
              <Box component="span" mb={1.5}>
                <Button variant="outlined" onClick={resetFilter}>
                  Close
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Form>
    </div>
  );
};
```
{% endraw %}

### Using The Custom Filters in The List Actions

To finish, create a `<ListAction>` component and pass it to the `<List>` component using the `actions` prop:

```jsx
import { TopToolbar, ExportButton } from 'react-admin';
import { Box } from '@mui/material';

const ListActions = () => (
  <Box width="100%">
    <TopToolbar>
      <PostFilterButton />
      <ExportButton />
    </TopToolbar>
    <PostFilterForm />
  </Box>
);

export const PostList = (props) => (
    <List {...props} actions={<ListActions />}>
        ...
    </List>
);
```

**Tip**: No need to pass any `filters` to the list anymore, as the `<PostFilterForm>` component will display them.

You can use a similar approach to offer alternative User Experiences for data filtering, e.g. to display the filters as a line in the datagrid headers.

## Building a Custom Pagination

The [`<Pagination>`](./Pagination.md) component gets the following constants from [the `useListContext` hook](#uselistcontext):

* `page`: The current page number (integer). First page is `1`.
* `perPage`: The number of records per page.
* `setPage`: `Function(page: number) => void`. A function that set the current page number.
* `total`: The total number of records.
* `actions`: A component that displays the pagination buttons (default: `<PaginationActions>`)
* `limit`: An element that is displayed if there is no data to show (default: `<PaginationLimit>`)

If you want to replace the default pagination by a "<previous - next>" pagination, create a pagination component like the following:

```jsx
import { useListContext } from 'react-admin';
import { Button, Toolbar } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

const PostPagination = () => {
    const { page, perPage, total, setPage } = useListContext();
    const nbPages = Math.ceil(total / perPage) || 1;
    return (
        nbPages > 1 &&
            <Toolbar>
                {page > 1 &&
                    <Button color="primary" key="prev" onClick={() => setPage(page - 1)}>
                        <ChevronLeft />
                        Prev
                    </Button>
                }
                {page !== nbPages &&
                    <Button color="primary" key="next" onClick={() => setPage(page + 1)}>
                        Next
                        <ChevronRight />
                    </Button>
                }
            </Toolbar>
    );
}

export const PostList = (props) => (
    <List {...props} pagination={<PostPagination />}>
        ...
    </List>
);
```

But if you just want to change the color property of the pagination button, you can extend the existing components:

```jsx
import {
    List,
    Pagination as RaPagination,
    PaginationActions as RaPaginationActions,
} from 'react-admin';

export const PaginationActions = props => <RaPaginationActions {...props} color="secondary" />;

export const Pagination = props => <RaPagination {...props} ActionsComponent={PaginationActions} />;

export const UserList = props => (
    <List {...props} pagination={<Pagination />} >
        //...
    </List>
);
```

## Building a Custom Sort Control

When neither the `<Datagrid>` or the `<SortButton>` fit your UI needs, you have to write a custom sort control. As with custom filters, this boils down to grabbing the required data and callbacks from the `ListContext`. Let's use the `<SortButton>` source as an example usage of `currentSort` and `setSort`:

```jsx
import * as React from 'react';
import { Button, Menu, MenuItem, Tooltip, IconButton } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useListSortContext, useTranslate } from 'react-admin';

const SortButton = ({ fields }) => {
    // currentSort is an object { field, order } containing the current sort
    // setSort is a callback (field, order) => void allowing to change the sort field and order
    const { currentSort, setSort } = useListSortContext();
    // rely on the translations to display labels like 'Sort by sales descending'
    const translate = useTranslate();
    // open/closed state for dropdown
    const [anchorEl, setAnchorEl] = React.useState(null);

    // mouse handlers
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleChangeSort = (event) => {
        const field = event.currentTarget.dataset.sort;
        setSort(
            field,
            field === currentSort.field
                ? inverseOrder(currentSort.order)
                : 'ASC'
        );
        setAnchorEl(null);
    };

    // English stranslation is 'Sort by %{field} %{order}'
    const buttonLabel = translate('ra.sort.sort_by', {
        field: translate(`resources.products.fields.${currentSort.field}`),
        order: translate(`ra.sort.${currentSort.order}`),
    });

    return (<>
        <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            color="primary"
            onClick={handleClick}
            startIcon={<SortIcon />}
            endIcon={<ArrowDropDownIcon />}
            size="small"
        >
            {buttonLabel}
        </Button>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            {fields.map(field => (
                <MenuItem
                    onClick={handleChangeSort}
                    // store the sort field in the element dataset to avoid creating a new click handler for each item (better for performance)
                    data-sort={field}
                    key={field}
                >
                    {translate(`resources.products.fields.${field}`)}{' '}
                    {translate(
                        `ra.sort.${
                            currentSort.field === field
                                ? inverseOrder(currentSort.order)
                                : 'ASC'
                        }`
                    )}
                </MenuItem>
            ))}
        </Menu>
    </>);
};

const inverseOrder = sort => (sort === 'ASC' ? 'DESC' : 'ASC');

export default SortButton;
```

## Third-Party Components

You can find more List components for react-admin in third-party repositories.

- [ra-customizable-datagrid](https://github.com/fizix-io/ra-customizable-datagrid): plugin that allows to hide / show columns dynamically.
- [ra-datagrid](https://github.com/marmelab/ra-datagrid): Integration of [Material-ui's `<Datagrid>`](https://material-ui.com/components/data-grid/) into react-admin.
