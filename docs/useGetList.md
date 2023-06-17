---
layout: default
title: "useGetList"
---

# `useGetList`

This hook calls `dataProvider.getList()` when the component mounts. It's ideal for getting a list of records. It supports filtering, sorting, and pagination.


## Syntax

```jsx
const { data, total, isLoading, error, refetch } = useGetList(
    resource,
    { pagination, sort, filter, meta },
    options
);
```

## Usage

```jsx
import { useGetList } from 'react-admin';

const LatestNews = () => {
    const { data, total, isLoading, error } = useGetList(
        'posts',
        { 
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'published_at', order: 'DESC' }
        }
    );
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <>
            <h1>Latest news</h1>
            <ul>
                {data.map(record =>
                    <li key={record.id}>{record.title}</li>
                )}
            </ul>
            <p>{data.length} / {total} articles</p>
        </>
    );
};
```

## Partial Pagination

If your data provider doesn't return the `total` number of records (see [Partial Pagination](./DataProviderWriting.md#partial-pagination)), you can use the `pageInfo` field to determine if there are more records to fetch.

```jsx
import { useState } from 'react';
import { useGetList } from 'react-admin';

const LatestNews = () => {
    const [page, setPage] = useState(1);
    const { data, pageInfo, isLoading, error } = useGetList(
        'posts',
        { 
            pagination: { page, perPage: 10 },
            sort: { field: 'published_at', order: 'DESC' }
        }
    );
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    const { hasNextPage, hasPreviousPage } = pageInfo;

    const getNextPage = () => setPage(page + 1);

    return (
        <>
            <h1>Latest news</h1>
            <ul>
                {data.map(record =>
                    <li key={record.id}>{record.title}</li>
                )}
            </ul>
            {hasNextPage && <button onClick={getNextPage}>More articles</button>}
        </>
    );
};
```

Alternately, you can use [the `useInfiniteGetList` hook](./useInfiniteGetList.md) to keep the previous pages on screen while loading new pages - just like users see older content when they scroll down their feed on social media. 

## Live Updates

If you want to subscribe to live updates on the list of records (topic: `resource/[resource]`), use [the `useGetListLive` hook](./useGetListLive.md) instead.

```diff
-import { useGetList } from 'react-admin';
+import { useGetListLive } from '@react-admin/ra-realtime';

const LatestNews = () => {
-   const { data, total, isLoading, error } = useGetList('posts', {
+   const { data, total, isLoading, error } = useGetListLive('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'published_at', order: 'DESC' },
    });
    if (isLoading) {
        return <Loading />;
    }
    if (error) {
        return <p>ERROR</p>;
    }

    return (
        <ul>
            {data.map(item => (
                <li key={item.id}>{item.title}</li>
            ))}
        </ul>
    );
};
```

The `data` will automatically update when a new record is created, or an existing record is updated or deleted.

## TypeScript

The `useGetList` hook accepts a generic parameter for the record type:

```tsx
import { useGetList } from 'react-admin';

type Post = {
    id: number;
    title: string;
};

const LatestNews = () => {
    const { data: posts, total, isLoading, error } = useGetList<Post>(
        'posts',
        { 
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'published_at', order: 'DESC' }
        }
    );
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <>
            <h1>Latest news</h1>
            <ul>
                {/* TypeScript knows that posts is of type Post[] */}
                {posts.map(post =>
                    <li key={post.id}>{post.title}</li>
                )}
            </ul>
            <p>{posts.length} / {total} articles</p>
        </>
    );
};
```