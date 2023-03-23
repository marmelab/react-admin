---
layout: default
title: "The Pagination Component"
---

# `<Pagination>`

By default, the `<List>` uses the `<Pagination>` component for pagination. This component displays buttons to navigate between pages, including buttons for the surrounding pages.

![Pagination buttons](./img/pagination-buttons.gif)

## Usage

By decorating this component, you can create your own variant with a different set of perPage options.

```jsx
// in src/MyPagination.js
import { Pagination } from 'react-admin';

const PostPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />;
```

Then, to use this component instead of the default `<Pagination>`, use the `<List pagination>` prop:

```jsx
import { List } from 'react-admin';
import PostPagination from './PostPagination';

export const PostList = () => (
    <List pagination={<PostPagination />}>
        ...
    </List>
);
```

## `rowsPerPage`

The `<Pagination>` component renders a dropdown allowing users to select how many rows to display per page. You can customize the options of this dropdown by passing a `rowsPerPageOptions` prop.

```jsx
// in src/MyPagination.js
import { Pagination } from 'react-admin';

const PostPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />;
```

## `add label to rowsPerPage `

The `<Pagination>` has customizable label in rowsPerPageOptions prop. You can customize the options of this dropdown by passing a `rowsPerPageOptions` prop as an object array.

```jsx 

import { Pagination } from 'react-admin';

<Pagination
    rowsPerPageOptions={[
        { label: '6 items per page', value: 6 },
        { label: '9 items per page', value: 9 },
        { label: '12 items per page', value: 12 },
    ]}
/>
```
The label is automatically translated, so you can use translation identifiers.
```jsx 
import { useTranslate } from 'react-admin'; 
import { Pagination } from 'react-admin';

const translate = useTranslate();

<Pagination
    rowsPerPageOptions={[
        {
            label: translate('ra.navigation.items_per_page_lable', {
                value: 6,
            }),
            value: 6,
        },
        {
            label: translate('ra.navigation.items_per_page_lable', {
                value: 9,
            }),
            value: 9,
        },
        {
            label: translate('ra.navigation.items_per_page_lable', {
                value: 12,
            }),
            value: 12,
        },
    ]}
/>
```
**Tip**: Pass an empty array to `rowsPerPageOptions` to disable the rows per page selection.
