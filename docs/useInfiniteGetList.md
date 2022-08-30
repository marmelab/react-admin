---
layout: default
title: "useInfiniteGetList"
---

# `useInfiniteGetList`

This hook calls `dataProvider.getList()` when the component mounts. It returns a list of "pages" of records, and a callback to fetch the previous or next page. It's ideal to render a feed of events or messages, where the total number of records is unknown, and the user requires the next page via a button (or a scroll listener).

![useInfiniteGetList](./img/useInfiniteGetList.gif)

It is based on react-query's [`useInfiniteQuery`](https://react-query-v3.tanstack.com/reference/useInfiniteQuery) hook.

## Syntax

`useInfiniteGetList` works like [`useGetList`](./useGetList.md), except it returns an object with the following shape:

```jsx
const {
    data: { pages, pageParams },
    total,
    pageInfo,
    isLoading, 
    error,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
} = useInfiniteGetList(
    resource,
    { pagination, sort, filter, meta },
    options
);
```

The `data.pages` property is an array records. To render the result of the hook, you must iterate over the `pages`. 

If your data provider doesn't return the `total` number of records (see [Partial Pagination](./DataProviderWriting.md#partial-pagination)), this hook automatically uses the `pageInfo` field to determine if there are more records to fetch.

## Usage

For instance, to render the latest news:

```jsx
import { useInfinteGetList } from 'react-admin';

const LatestNews = () => {
    const { 
        data,
        total,
        isLoading,
        error,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteGetList(
        'posts',
        {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'published_at', order: 'DESC' }
        }
    );
    if (isLoading) { return <p>Loading</p>; }
    if (error) { return <p>ERROR</p>; }

    return (
       <>
           <ul>
               {data?.pages.map(page => 
                    page.data.map(post => 
                        <li key={post.id}>{post.title}</li>
                    )
                )}
           </ul>
           {hasNextPage &&
               <button disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
                   Next page
               </button>
            }
       </>
   );
};
```

Check [react-query's `useInfiniteQuery` documentation](https://react-query-v3.tanstack.com/reference/useInfiniteQuery) for more details and examples.

## `resource`

The first parameter of the `useInfiniteGetList` hook is the name of the resource to fetch.

For instance, to fetch a list of posts:

```jsx
const { data } = useInfiniteGetList(
    'posts', 
    { pagination: { page: 1, perPage: 10 }, sort: { field: 'published_at', order: 'DESC' } }
);
```

## `query`

The second parameter is the query passed to `dataProvider.getList()`. It is an object with the following shape:

```jsx
{
    pagination: { page, perPage },
    sort: { field, order },
    filter: { ... },
    meta: { ...}
}
```

The `perPage` parameter determines the number of records returned in each page.

For instance, to return pages of 25 records each:

```jsx
const { data } = useInfiniteGetList(
    'posts', 
    { pagination: { page: 1, perPage: 25 }, sort: { field: 'published_at', order: 'DESC' } }
);
```

Use the `meta` parameter to pass custom metadata to the data provider. For instance, if the backend suports embedding related records, you can pass the `_embed` parameter to retrieve them.

```jsx
const { data } = useInfiniteGetList(
    'posts', 
    { 
        pagination: { page: 1, perPage: 25 },
        sort: { field: 'published_at', order: 'DESC' }, 
        meta: { _embed: ['author', 'tags'] }
    }
);
```

## `options`

The last argument of the hook contains the query options. It is an object with the following shape:

```jsx
{
    onSuccess: () => { ... },
    onError: () => { ... },
    enabled,
    ...
}
```

For instance, to disable the call to the data provider until a condition is met:

```jsx
const { data } = useInfiniteGetList(
    'posts', 
    { 
        pagination: { page: 1, perPage: 25 }, 
        sort: { field: 'published_at', order: 'DESC' },
        filter: { user_id: user && user.id },
    }
    { enabled: !!user }
);
```

Additional options are passed to react-query's `useQuery` hook. Check the [react-query documentation](https://react-query-v3.tanstack.com/reference/useQuery) for more information.