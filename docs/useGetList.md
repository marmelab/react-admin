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