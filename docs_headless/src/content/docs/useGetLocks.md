---
title: "useGetLocks"
---

**Tip**: `ra-core-ee` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

Get all the locks for a given resource. Calls `dataProvider.getLocks()` on mount.

```tsx
// simple Usage
const { data } = useGetLocks('posts');
```

Here is how to use it in a custom list, to disable edit and delete buttons for locked records:

```tsx
import { WithListContext, useRecordContext } from 'ra-core';
import { useGetLocks, type Lock } from '@react-admin/ra-core-ee';
import { DeleteButton } from '@components/ui/DeleteButton';
import { LockableEditButton } from '@components/ui/DeleteButton';

const MyPostGrid = () => {
    const resource = useResourceContext();
    const { data: locks } = useGetLocks(resource);
    return (
        <ul>
            <WithListContext
                render={({ data, isPending }) => isPending ? null : (
                    <li className="flex justify-space-between">
                        <MyPostTitle locks={locks} />
                        <MyPostActions locks={locks} />
                    </li>
                )}
            />
        </ul>
    );
};

const MyPostTitle = ({ locks }: { locks: Lock[] }) => {
    const record = useRecordContext();
    const lock = locks.find(l => l.recordId === record.id);

    return (
        <div className="flex gap-4">
            <WithRecord label="title" render={record => <span>{record.title}</span>} />} />
            {lock && (
                <span style={{ color: 'red' }}>
                    {` (Locked by ${lock.identity})`}
                </span>
            )}
        </div>
    );
};

const MyPostActions = ({ locks }: { locks: Lock[] }) => {
    const record = useRecordContext();
    const locked = locks.find(l => l.recordId === record.id);

    return (
        <div className="flex gap-4">
            <DeleteButton disabled={!!locked} />
            <LockableEditButton disabled={!!locked} />
        </div>
    );
};
```