---
layout: default
title: "useGetListLive"
---

# `useGetListLive`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> hook, alternative to [`useGetList`](./useGetList.md), subscribes to live updates on the record list.

## Usage

```jsx
import { useGetListLive } from '@react-admin/ra-realtime';

const LatestNews = () => {
    const { data, total, isPending, error } = useGetListLive('posts', {
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

The hook will subscribe to live updates on the list of records (topic: `resource/[resource]`) and will refetch the list when a new record is created, or an existing record is updated or deleted.

See [the `useGetList` documentation](./useGetList.md) for the full list of parameters and return type.

## TypeScript

The `useGetListLive` hook accepts a generic parameter for the record type:

```tsx
import { useGetListLive } from '@react-admin/ra-realtime';

type Post = {
    id: number;
    title: string;
};

const LatestNews = () => {
    const { data: posts, total, isPending, error } = useGetListLive<Post>(
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