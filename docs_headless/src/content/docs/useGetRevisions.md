---
title: "useGetRevisions"
---
Fetches the list of revisions for a specific record.

This feature requires a valid is an [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Usage

```tsx
import { useGetRevisions } from '@react-admin/ra-core-ee';

const RevisionList = ({ recordId }) => {
    const {
        data: revisions,
        isPending,
        error,
    } = useGetRevisions('products', { recordId });

    if (isPending) return <div>Loading revisions...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <ul>
            {revisions?.map(revision => (
                <li key={revision.id}>
                    {revision.message} - {revision.date}
                </li>
            ))}
        </ul>
    );
};
```

**Parameters:**

- `resource`: The resource name
- `params`: Object with `recordId` property
- `queryOptions?`: Additional React Query options

**Returns:**
A React Query result object with:

- `data`: Array of revision objects
- `isPending`: Loading state
- `error`: Error state if the query failed
- `refetch`: Function to manually refetch data
- All other standard React Query result properties

**Tip:** `queryOptions` supports `onSuccess`, `onError` and `onSettled` callbacks in addition to all standard React Query options.