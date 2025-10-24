---
title: "useGetListLive"
---

`useGetListLive` is an alternative to `useGetList` that subscribes to live updates on the record list.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

```tsx
import { useGetListLive } from '@react-admin/ra-core-ee';

const LatestNews = () => {
    const { data, total, isLoading, error } = useGetListLive('posts', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'published_at', order: 'DESC' },
    });
    if (isLoading) {
        return <div>Loading...</div>;
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

See the [useGetList](./useGetList.md) documentation for the full list of parameters and return type.