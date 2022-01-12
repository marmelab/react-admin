---
layout: default
title: "useGetManyReference"
---

# `useGetManyReference`

This hook calls `dataProvider.getManyReference()` when the component mounts. It queries the data provider for a list of records related to another one (e.g. all the comments for a post). It supports filtering, sorting, and pagination.

```jsx
// syntax
const { data, total, isLoading, error, refetch } = useGetManyReference(
    resource,
    { target, id, pagination, sort, filter },
    options
);

// example
import { useGetManyReference } from 'react-admin';

const PostComments = ({ record }) => {
    // fetch all comments related to the current record
    const { data, isLoading, error } = useGetManyReference(
        'comments',
        { 
            target: 'post_id',
            id: record.id,
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'published_at', order: 'DESC' }
        }
    );
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <ul>
            {data.map(comment => (
                <li key={comment.id}>{comment.body}</li>
            ))}
        </ul>
    );
};
```
