---
title: "useUnselect"
---

This hook returns a function that unselects lines in a data table (see `<DataTableBase>`) that match an array of ids. Pass the name of the resource to the hook as the 1st argument.

The 2nd optional argument accepts `storeKey`. It should match with the `storeKey` used in `useListController`.

Returned function accepts boolean as the 2nd `fromAllStoreKeys` argument - if `true`, then it will unselect the records across all storeKeys used with this resource.

```jsx
import { useListContext, useUnselect } from 'ra-core';

const UnselectButton = () => {
    const { resource, selectedIds } = useListContext();
    const unselect = useUnselect(resource);

    const handleClick = () => {
        unselect(selectedIds);
    };

    return (
        <button onClick={handleClick}>
            {`Unselect ${selectedIds.length} records`}
        </button>
    );
};
```

