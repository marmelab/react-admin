---
layout: default
title: "The Pagination Component"
---

# `<Pagination>`

By default, the `<List>` uses the `<Pagination>` component for pagination. This component displays buttons to navigate between pages, including buttons for the surrounding pages.

<video controls autoplay playsinline muted loop>
  <source src="./img/pagination-buttons.webm" type="video/webm"/>
  <source src="./img/pagination-buttons.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


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

**Tip**: Pass an empty array to `rowsPerPageOptions` to disable the rows per page selection.

## Infinite Scroll

On mobile devices, the `<Pagination>` component is not very user friendly. The expected user experience is to reveal more records when the user scrolls to the bottom of the list. This UX is also useful on desktop, for lists with a large number of records.

<video controls autoplay playsinline muted loop width="100%">
  <source src="./img/infinite-book-list.webm" poster="./img/infinite-book-list.webp" type="video/webm">
  Your browser does not support the video tag.
</video>

To achieve this, you can use the `<InfiniteList>` component instead of the `<List>` component.

```diff
import {
-   List,
+   InfiniteList,
    Datagrid,
    TextField,
    DateField
} from 'react-admin';

const BookList = () => (
-   <List>
+   <InfiniteList>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="author" />
        </Datagrid>
-   </List>
+   </InfiniteList>
);
```

`<InfiniteList>` uses a special pagination component, `<InfinitePagination>`, which doesn't display any pagination buttons. Instead, it displays a loading indicator when the user scrolls to the bottom of the list. But you cannot use this `<InfinitePagination>` inside a regular `<List>` component.

For more information, see [the `<InfiniteList>` documentation](./InfiniteList.md).