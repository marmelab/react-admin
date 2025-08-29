---
title: "useUnselectAll"
---

This hook returns a function that unselects all lines in the current data table (see [`<DataTableBase>`](./DataTableBase.md)). Pass the name of the resource as argument.

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

