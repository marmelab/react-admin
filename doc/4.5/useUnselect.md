---
layout: default
title: "useUnselect"
---

# `useUnselect`

This hook returns a function that unselects lines in the current `<Datagrid>` that match an array of ids. Pass the name of the resource to the hook as argument.

```jsx
import { useListContext, useUnselect } from 'react-admin';

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

