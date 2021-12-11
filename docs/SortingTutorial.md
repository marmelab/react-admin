---
layout: default
title: "Sorting the List"
---

# Sorting the List

<table><tbody><tr style="border:none">
<td style="width:55%;border:none;">
<a title="<Datagrid> column sort" href="./img/sort-column-header.gif"><img src="./img/sort-column-header.gif" /></a>
</td>
<td style="width:45%;border:none;">
<a title="<SortButton> Component" href="./img/sort-button.gif"><img src="./img/sort-button.gif" /></a>
</td>
</tr></tbody></table>

React-admin does its best to offer a powerful sort functionality, and to get out of the way when you want to go further. 

The next sections explain how to use the sort functionality. And first, a few explanations about the inner workings of sorting in react-admin:

- [Sort Query Parameter](#sort-query-parameter)
- [Linking To A Pre-Sorted List](#linking-to-a-pre-sorted-list)

React-admin proposes several UI components to let users see and modify sort parameters, and gives you the tools to build custom ones.

- The `<Datagrid>` Column Headers
  - [Usage](#using-datagrid-headers-to-modify-list-sort)
  - [Disabling Sorting](#disabling-sorting)
  - [Specifying A Sort Field](#specifying-a-sort-field)
  - [Specifying The Sort Order](#specifying-the-sort-order)
- The `<SortButton>` Component
  - [Usage](#the-sortbutton-component)
- [Building A Custom Sort Control](#building-a-custom-sort-control)

## Sort Query Parameter

Just like for the filters, the List view uses the `sort` and `order` query parameters to determine the sort field and order passed to `dataProvider.getList()`.

Here is a typical List URL:

> https://myadmin.dev/#/posts?displayedFilters=%7B%22commentable%22%3Atrue%7D&filter=%7B%22commentable%22%3Atrue%2C%22q%22%3A%22lorem%20%22%7D&order=DESC&page=1&perPage=10&sort=published_at

Once decoded, this URL reveals the intended sort:

```
sort=published_at
order=DESC
```

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

## Using Datagrid Headers To Modify List Sort

![Sort Column Header](./img/sort-column-header.gif)

If you're using a `<Datagrid>` inside the List view, then the column headers are buttons allowing users to change the list sort field and order. This feature requires no configuration and works out fo the box. The next sections explain how you can disable or modify the field used for sorting on a particular column.

## Disabling Sorting

It is possible to disable sorting for a specific `<Field>` by passing a `sortable` property set to `false`:

{% raw %}
```jsx
// in src/posts.js
import { List, Datagrid, TextField } from 'react-admin';

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" sortable={false} />
            <TextField source="title" />
            <TextField source="body" />
        </Datagrid>
    </List>
);
```
{% endraw %}

## Specifying A Sort Field

By default, a column is sorted by the `source` property. To define another attribute to sort by, set it via the `<Field sortBy>` property:

{% raw %}
```jsx
// in src/posts.js
import { List, Datagrid, TextField } from 'react-admin';

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <ReferenceField label="Post" source="id" reference="posts" sortBy="title">
                <TextField source="title" />
            </ReferenceField>
            <FunctionField
                label="Author"
                sortBy="last_name"
                render={record => `${record.author.first_name} ${record.author.last_name}`}
            />
            <TextField source="body" />
        </Datagrid>
    </List>
);
```
{% endraw %}

## Specifying The Sort Order

By default, when the user clicks on a column header, the list becomes sorted in the ascending order. You change this behavior by setting the `sortByOrder` prop to `"DESC"` in a `<Datagrid>` `<Field>`:

```jsx
// in src/posts.js
import * as React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <ReferenceField label="Post" source="id" reference="posts" sortByOrder="DESC">
                <TextField source="title" />
            </ReferenceField>
            <FunctionField
                label="Author"
                sortBy="last_name"
                sortByOrder="DESC"
                render={record => `${record.author.first_name} ${record.author.last_name}`}
            />
            <TextField source="body" />
        </Datagrid>
    </List>
);
```

## The `<SortButton>` Component

![Sort Button](./img/sort-button.gif)

Some List views don't have a natural UI for sorting - e.g. the `<SimpleList>`, or a list of images, don't have column headers like the `<Datagrid>`. For these cases, react-admin offers the `<SortButton>`, which displays a dropdown list of fields that the user can choose to sort on.

`<SortButton>` expects one prop: `fields`, the list of fields it should allow to sort on. For instance, here is how to offer a button to sort on the `reference`, `sales`, and `stock` fields:

```jsx
import * as React from 'react';
import { TopToolbar, SortButton, CreateButton, ExportButton } from 'react-admin';

const ListActions = () => (
    <TopToolbar>
        <SortButton fields={['reference', 'sales', 'stock']} />
        <CreateButton basePath="/products" />
        <ExportButton />
    </TopToolbar>
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
