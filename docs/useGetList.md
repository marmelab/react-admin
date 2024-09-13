---
layout: default
title: "useGetList"
---

# `useGetList`

This hook calls `dataProvider.getList()` when the component mounts. It's ideal for getting a list of records. It supports filtering, sorting, and pagination.


## Syntax

```jsx
const { data, total, isPending, error, refetch, meta } = useGetList(
    resource,
    {
        pagination: { page, perPage },
        sort: { field, order },
        filter,
        meta
    },
    options
);
```

The `meta` argument is optional. It can be anything you want to pass to the data provider, e.g. a list of fields to show in the result. It is distinct from the `meta` property of the response, which may contain additional metadata returned by the data provider.

The `options` parameter is optional, and is passed to [react-query's `useQuery` hook](https://tanstack.com/query/v5/docs/react/reference/useQuery). It may contain the following options:

* `cacheTime`
* `enabled`
* `initialData`
* `initialDataUpdatedAt`
* `isDataEqual`
* `keepPreviousData`
* `meta`
* `notifyOnChangeProps`
* `notifyOnChangePropsExclusions`
* `onError`
* `onSettled`
* `onSuccess`
* `placeholderData`
* `queryKeyHashFn`
* `refetchInterval`
* `refetchIntervalInBackground`
* `refetchOnMount`
* `refetchOnReconnect`
* `refetchOnWindowFocus`
* `retry`
* `retryOnMount`
* `retryDelay`
* `select`
* `staleTime`
* `structuralSharing`
* `suspense`
* `useErrorBoundary`

Check [react-query's `useQuery` hook documentation](https://tanstack.com/query/v5/docs/react/reference/useQuery) for details on each of these options.

The react-query [query key](https://tanstack.com/query/v5/docs/react/guides/query-keys) for this hook is `[resource, 'getList', { pagination, sort, filter, meta }]`.

## Usage

Call the `useGetList` hook when you need to fetch a list of records from the data provider.

```jsx
import { useGetList } from 'react-admin';

const LatestNews = () => {
    const { data, total, isPending, error } = useGetList(
        'posts',
        { 
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'published_at', order: 'DESC' }
        }
    );
    if (isPending) { return <Loading />; }
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

## Rendering Data

If you want to use the result in a react-admin iterator component like [`<Datagrid>`](./Datagrid.md), [`<SimpleList>`](./SimpleList.md), or [`<SingleFieldList>`](./SingleFieldList.md), you must first create a [`ListContext`](./useListContext.md) with the data. The [`useList`](./useList.md) hook does that for you:

```jsx
import {
    useGetList,
    useList,
    ListContextProvider,
    Datagrid,
    TextField,
    DateField,
    NumberField,
    Pagination
} from 'react-admin';

const LatestNews = () => {
    const { data, isPending, error } = useGetList(
        'posts',
        { pagination: { page: 1, perPage: 100 } },
    );
    if (error) { return <p>ERROR</p>; }
    const listContext = useList({ 
        data,
        isPending,
        perPage: 10,
        sort: { field: 'published_at', order: 'DESC' }
    });
    return (
        <ListContextProvider value={listContext}>
            <h1>Latest news</h1>
            <Datagrid>
                <TextField source="title" />
                <DateField source="published_at" />
                <NumberField source="views" />
            </Datagrid>
            <Pagination />
        </ListContextProvider>
    );
};
```

In this example, the `useGetList` hook fetches all the posts, and displays a list of the 10 most recent posts in a `<Datagrid>`. The `<Pagination>` component allows the user to navigate through the list. Users can also sort the list by clicking on the column headers.

## Passing Additional Arguments

If you need to pass additional arguments to the data provider, you can pass them in the `meta` argument.

For example, if you want to embed related records in the response, and your data provider supports the `embed` meta parameter, you can pass it like this:

```jsx
const { data, total, isPending, error } = useGetList(
    'posts',
    { 
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'published_at', order: 'DESC' },
        // Pass extra parameters using the meta argument
        meta: { embed: ['author', 'category'] }
    }
);
```

**Tip**: Don't mix the `meta` parameter with the `meta` property of the response (see below). Although they share the same name, they are not related.

## Accessing Response Metadata

If your backend returns additional metadata along with the records, you can access it in the `meta` property of the result.

```jsx
const { 
    data,
    total,
    isPending,
    error,
    // access the extra response details in the meta property
    meta
} = useGetList('posts', { pagination: { page: 1, perPage: 10 }});
```

**Tip**: Don't mix the `meta` property of the response with the `meta` parameter (see above). Although they share the same name, they are not related.

## Partial Pagination

If your data provider doesn't return the `total` number of records (see [Partial Pagination](./DataProviderWriting.md#partial-pagination)), you can use the `pageInfo` field to determine if there are more records to fetch.

```jsx
import { useState } from 'react';
import { useGetList } from 'react-admin';

const LatestNews = () => {
    const [page, setPage] = useState(1);
    const { data, pageInfo, isPending, error } = useGetList(
        'posts',
        { 
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

## Fetching Related Records

If you plan on using `useGetList` to fetch a list of records related to another one (e.g. the comments for a post), you're better off using [the `<ReferenceManyField>` component](./ReferenceManyField.md). It will handle the loading state for you, and display a loading spinner while the data is being fetched.

```jsx
import { ReferenceManyField } from 'react-admin';

const PostComments = () => {
    return (
        <ReferenceManyField reference="comments" target="post_id">
            <Datagrid>
                <DateField source="created_at" />
                <TextField source="author" />
                <TextField source="body" />
            </Datagrid>
        </ReferenceManyField>
    );
};
```

is the equivalent of:

```jsx
import { useGetList } from 'react-admin';

const PostComments = () => {
    const record = useRecordContext();
    const { data, isPending, error } = useGetList(
        'comments',
        { filter: { post_id: record.id } }
    );
    if (isPending) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    const listContext = useList({ data });
    return (
        <ListContextProvider value={listContext}>
            <Datagrid>
                <DateField source="created_at" />
                <TextField source="author" />
                <TextField source="body" />
            </Datagrid>
        </ListContextProvider>
    );
};
```

## Refreshing The List

If you want to refresh the list, you can use the `refetch` function returned by the hook:

```jsx
import { useGetList } from 'react-admin';

const LatestNews = () => {
    const { data, total, isPending, error, refetch } = useGetList(/* ... */);
    if (isPending) { return <Loading />; }
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
            <button onClick={() => refetch()}>Refresh</button>
        </>
    );
};
```

## Live Updates

If you want to subscribe to live updates on the list of records (topic: `resource/[resource]`), use [the `useGetListLive` hook](./useGetListLive.md) instead.

```diff
-import { useGetList } from 'react-admin';
+import { useGetListLive } from '@react-admin/ra-realtime';

const LatestNews = () => {
-   const { data, total, isPending, error } = useGetList('posts', {
+   const { data, total, isPending, error } = useGetListLive('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'published_at', order: 'DESC' },
    });
    if (isPending) {
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
    const { data: posts, total, isPending, error } = useGetList<Post>(
        'posts',
        { 
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'published_at', order: 'DESC' }
        }
    );
    if (isPending) { return <Loading />; }
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