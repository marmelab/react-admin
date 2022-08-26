---
layout: default
title: "useGetRecordId"
---

# `useGetRecordId`

This hook returns the current `recordId`. `recordId` is obtained from parameters if passed as a parameter, or from the `RecordContext` if there is one, or, lastly, from the react-router URL.

`useGetRecordId` takes optional argument `recordId` if used inside a RecordContextProvider or if recordId can be guessed from the URL

```jsx
import { useListContext, useUnselect } from 'react-admin';

const DisplayRecordCurrentId = () => {
    const recordId = useGetRecordId();

    return (
        <p>
            {`Current record id: ${recordId}`}
        </p>
    );
};
```

