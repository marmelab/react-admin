---
title: "useUnselect"
---

This hook returns a function that unselects lines in the current data table (see `<DataTableBase>`) that match an array of ids. Pass the name of the resource to the hook as argument.

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

