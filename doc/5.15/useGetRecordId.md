---
layout: default
title: "useGetRecordId"
---

# `useGetRecordId`

Accessing the current `recordId` can sometimes be tricky, because it depends on the context in which your component is used.

This hook makes it easier to get current `recordId`. 

It will try to obtain it from these 3 sources, in this order:
1. from the `recordId` parameter provided directly to the hook
2. from the current `RecordContext`
3. from the react-router location

This hook accepts a single parameter, `recordId`, which is optional if used inside a `RecordContextProvider` or if `recordId` can be guessed from the URL.

```jsx
import { useGetRecordId } from 'react-admin';

const DisplayRecordCurrentId = () => {
    const recordId = useGetRecordId();

    return (
        <p>
            {`Current record id: ${recordId}`}
        </p>
    );
};
```

