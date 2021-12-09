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
    const setFilters = (filters: any) => setFilter(filters.q);
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

Using the `<ListBase>` component has one drawback: you can no longer access the list context (`data`, `total`, etc) in the component. Instead, you have to access it from the `ListContext` using [the `useListContext` hook](./useListContext.md).

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

React-admin offers many more List layouts: `<EditableDatagrid>`, `<TreeWithDetails>`, `<Calendar>`, etc. The `<List>` component accepts any component as child - even components of your own! 

## Building a Custom Layout

In some cases, neither the `<Datagrid>` nor the `<SimpleList>` components allow to display the records in an optimal way for a given task. In these cases, pass your layout component directly as children of the `<List>` component. As `<List>` takes care of fetching the data and putting it in a `ListContext`, you can leverage the `useListContext` hook to get the list data. 

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

## Third-Party Components

You can find more List components for react-admin in third-party repositories.

- [ra-customizable-datagrid](https://github.com/fizix-io/ra-customizable-datagrid): plugin that allows to hide / show columns dynamically.
- [ra-datagrid](https://github.com/marmelab/ra-datagrid): Integration of [Material-ui's `<Datagrid>`](https://material-ui.com/components/data-grid/) into react-admin.
