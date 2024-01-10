---
layout: default
title: "useGetLocks"
---

# `useGetLocks`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> hook gets all the locks for a given resource. Calls `dataProvider.getLocks()` on mount.

## Usage

```jsx
import { useGetLocks } from '@react-admin/ra-realtime';

const { data } = useGetLocks('posts');
```

Here is how to use it in a custom Datagrid, to disable edit and delete buttons for locked records:

{% raw %}
```tsx
const MyPostGrid = () => {
    const resource = useResourceContext();
    const { data: locks } = useGetLocks(resource);
    return (
        <Datagrid
            bulkActionButtons={false}
            sx={{
                '& .MuiTableCell-root:last-child': {
                    textAlign: 'right',
                },
            }}
        >
            <MyPostTitle label="Title" locks={locks} />
            <MyPostActions label="Actions" locks={locks} />
        </Datagrid>
    );
};

const MyPostTitle = ({ label, locks }: { label: string; locks: Lock[] }) => {
    const record = useRecordContext();
    const lock = locks.find(l => l.recordId === record.id);

    return (
        <WrapperField label={label}>
            <TextField source="title" />
            {lock && (
                <span style={{ color: 'red' }}>
                    {` (Locked by ${lock.identity})`}
                </span>
            )}
        </WrapperField>
    );
};

const MyPostActions = ({ label, locks }: { label: string; locks: Lock[] }) => {
    const record = useRecordContext();
    const locked = locks.find(l => l.recordId === record.id);

    return (
        <WrapperField label={label}>
            <DeleteButton disabled={!!locked} />
            <LockableEditButton disabled={!!locked} />
        </WrapperField>
    );
};
```
{% endraw %}
