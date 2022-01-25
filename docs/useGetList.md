---
layout: default
title: "useGetList"
---

# `useGetList`

This hook calls `dataProvider.getList()` when the component mounts. It's ideal for getting a list of records. It supports filtering, sorting, and pagination.

```jsx
// syntax
const { data, total, isLoading, error, refetch } = useGetList(
    resource,
    { pagination, sort, filter, meta },
    options
);

// example
import { useGetList } from 'react-admin';

const LatestNews = () => {
    const { data, isLoading, error } = useGetList(
        'posts',
        { pagination: { page: 1, perPage: 10 }, sort: { field: 'published_at', order: 'DESC' } }
    );
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <ul>
            {data.map(record =>
                <li key={record.id}>{record.title}</li>
            )}
        </ul>
    );
};
```
