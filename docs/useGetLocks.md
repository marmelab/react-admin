---
layout: default
title: "useGetLocks"
---

# `useGetLocks`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" alt="React Admin Enterprise Edition icon" /> hook gets all the locks for a given resource. Calls `dataProvider.getLocks()` on mount.

## Usage

```jsx
import { useGetLocks } from '@react-admin/ra-realtime';

const { data } = useGetLocks('posts');
```

Here is how to use it in a custom DataTable, to disable edit and delete buttons for locked records:

{% raw %}
```tsx
const MyPostGrid = () => {
    const resource = useResourceContext();
    const { data: locks } = useGetLocks(resource);
    return (
        <DataTable
            bulkActionButtons={false}
            sx={{
                '& .MuiTableCell-root:last-child': {
                    textAlign: 'right',
                },
            }}
        >
            <DataTable.Col label="Title">
                <MyPostTitle locks={locks} />
            </DataTable.Col>
            <DataTable.Col label="Actions">
                <MyPostActions locks={locks} />
            </DataTable.Col>
        </DataTable>
    );
};

const MyPostTitle = ({ locks }: { locks: Lock[] }) => {
    const record = useRecordContext();
    const lock = locks.find(l => l.recordId === record.id);

    return (
        <>
            <TextField source="title" />
            {lock && (
                <span style={{ color: 'red' }}>
                    {` (Locked by ${lock.identity})`}
                </span>
            )}
        </>
    );
};

const MyPostActions = ({ locks }: { locks: Lock[] }) => {
    const record = useRecordContext();
    const locked = locks.find(l => l.recordId === record.id);

    return (
        <>
            <DeleteButton disabled={!!locked} />
            <LockableEditButton disabled={!!locked} />
        </>
    );
};
```
{% endraw %}
