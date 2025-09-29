---
title: "useGetListLive"
---

**Tip**: `ra-core-ee` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

Alternative to `useGetList` that subscribes to live updates on the record list.

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

See the [useGetList](https://marmelab.com/react-admin/useGetList.html) documentation for the full list of parameters and return type.