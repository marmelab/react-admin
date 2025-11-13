---
layout: default
title: "useGetLocksLive"
---

# `useGetLocksLive`

Use the `useGetLocksLive` hook to get the locks in real time. This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" alt="React Admin Enterprise Edition icon" /> hook calls `dataProvider.getLocks()` for the current resource on mount, and subscribes to live updates on the `lock/[resource]` topic.

This means that if a lock is acquired or released by another user while the current user is on the page, the return value will be updated.

## Usage

{% raw %}
```jsx
import { List, useRecordContext } from 'react-admin';
import LockIcon from '@mui/icons-material/Lock';
import { useGetLocksLive } from '@react-admin/ra-realtime';

const LockField = ({ locks }) => {
    const record = useRecordContext();
    if (!record) return null;
    const lock = locks?.find(lock => lock.recordId === record?.id);
    if (!lock) return <Box sx={{ width: 20 }} />;
    return <LockIcon fontSize="small" color="disabled" />;
};

const PostList = () => {
    const { data: locks } = useGetLocksLive();
    return (
        <List>
            <DataTable>
                <DataTable.Col source="title" />
                <DataTable.Col>
                    <LockField locks={locks} />
                </DataTable.Col>
            </DataTable>
        </List>
    );
};
```
{% endraw %}

`useGetLocksLive` reads the current resource from the `ResourceContext`. You can provide it explicitly if you are not in such a context:

```jsx
const { data: locks } = useGetLocksLive('posts');
```
