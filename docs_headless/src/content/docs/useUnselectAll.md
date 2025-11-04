---
title: "useUnselectAll"
---

This hook returns a function that unselects all lines in a data table (see `<DataTableBase>`). Pass the name of the resource as the 1st argument.

The 2nd optional argument accepts `storeKey`. It should match with the `storeKey` used in `useListController`.

Returned function accepts a boolean `fromAllStoreKeys` argument - if `true`, then it will unselect all records across all storeKeys used with this resource.

```jsx
import { useUnselectAll } from 'ra-core';

const UnselectAllButton = () => {
    const unselectAll = useUnselectAll('posts');
    const handleClick = () => {
        unselectAll();
    }
    return <button onClick={handleClick}>Unselect all</button>;
};
```

