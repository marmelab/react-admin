---
layout: default
title: "useUnselectAll"
---

# `useUnselectAll`

This hook returns a function that unselects all lines in the current `<Datagrid>`. Pass the name of the resource as argument.

```jsx
import { useUnselectAll } from 'react-admin';

const UnselectAllButton = () => {
    const unselectAll = useUnselectAll();
    const handleClick = () => {
        unselectAll('posts');
    }
    return <button onClick={handleClick}>Unselect all</button>;
};
```

The resource can be passed to the `useUnselectAll` hook or to the `unselectAll` callback; it is up to you.
