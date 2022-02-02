---
layout: default
title: "useUnselectAll"
---

# `useUnselectAll`

This hook returns a function that unselects all lines in the current `<Datagrid>`. Pass the name of the resource as argument.

```jsx
import { useUnselectAll } from 'react-admin';

const UnselectAllButton = () => {
    const unselectAll = useUnselectAll('posts');
    const handleClick = () => {
        unselectAll();
    }
    return <button onClick={handleClick}>Unselect all</button>;
};
```

