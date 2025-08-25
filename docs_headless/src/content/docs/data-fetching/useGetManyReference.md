---
layout: default
title: "useGetManyReference"
---

# `useGetManyReference`

This hook calls `dataProvider.getManyReference()` when the component mounts. It queries the data provider for a list of records related to another one (e.g. all the comments for a post). It supports filtering, sorting, and pagination.

## Syntax

```jsx
const { data, total, isPending, error, refetch, meta } = useGetManyReference(
    resource,
    { target, id, pagination, sort, filter, meta },
    options
);
```

## Usage

```jsx
import { useGetManyReference, useRecordContext } from 'react-admin';

const PostComments = () => {
    const record = useRecordContext();
    // fetch all comments related to the current record
    const { data, isPending, error } = useGetManyReference(
        'comments',
        { 
            target: 'post_id',
            id: record.id,
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'published_at', order: 'DESC' }
        }
    );
    if (isPending) { return <Loading />; }
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

## Partial Pagination

If your data provider doesn't return the `total` number of records (see [Partial Pagination](./DataProviderWriting.md#partial-pagination)), you can use the `pageInfo` field to determine if there are more records to fetch.

```jsx
import { useState } from 'react';
import { useGetManyReference, useRecordContext } from 'react-admin';

const PostComments = () => {
    const record = useRecordContext();
    const [page, setPage] = useState(1);
    const { data, isPending, pageInfo, error } = useGetManyReference(
        'comments',
        { 
            target: 'post_id',
            id: record.id,
            pagination: { page, perPage: 10 },
            sort: { field: 'published_at', order: 'DESC' }
        }
    );
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    const { hasNextPage, hasPreviousPage } = pageInfo;

    const getNextPage = () => setPage(page + 1);

    return (
        <>
            <ul>
                {data.map(comment => (
                    <li key={comment.id}>{comment.body}</li>
                ))}
            </ul>
            {hasNextPage && <button onClick={getNextPage}>More comments</button>}
        </>
    );
};
```

## TypeScript

The `useGetManyReference` hook accepts a generic parameter for the record type:

```tsx
import { useGetManyReference, useRecordContext } from 'react-admin';

type Post = {
    id: number;
    title: string;
};

type Comment = {
    id: number;
    post_id: string;
    body: string;
    published_at: Date;
}

const PostComments = () => {
    const post = useRecordContext<Post>();
    // fetch all comments related to the current record
    const { data: comments, isPending, error } = useGetManyReference<Comment>(
        'comments',
        { 
            target: 'post_id',
            id: record.id,
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'published_at', order: 'DESC' }
        }
    );
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
        <ul>
            {/* TypeScript knows that comments is of type Comment[] */}
            {comments.map(comment => (
                <li key={comment.id}>{comment.body}</li>
            ))}
        </ul>
    );
};
```