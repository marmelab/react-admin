---
layout: default
title: "useRefresh"
---

# `useRefresh`

This hook returns a function that forces a refetch of all the active queries, and a rerender of the current view when the data has changed.

```jsx
import { useRefresh } from 'react-admin';

const RefreshButton = () => {
    const refresh = useRefresh();
    const handleClick = () => {
        refresh();
    }
    return <button onClick={handleClick}>Refresh</button>;
};
```

It is common to use it after a mutation, e.g. after deleting a record. 

```jsx
import * as React from 'react';
import { useDelete, useNotify, useRefresh, useRecordContext, Button } from 'react-admin';

const DeleteCommentButton = () => {
    const refresh = useRefresh();
    const record = useRecordContext();
    const notify = useNotify();
    const [deleteOne, { isPending }] = useDelete(
        'comments',
        { id: record.id },
        {
            onSuccess: (data) => {
                refresh();
                notify('Comment deleted');
            },
            onError: (error) => {
                notify(`Comment deletion error: ${error.message}`, { type: 'error' });
            },
        }
    );
    
    return <Button label="delete" onClick={() => deleteOne()} disabled={isPending} />;
};
```
