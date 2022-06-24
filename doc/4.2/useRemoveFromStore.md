---
layout: default
title: "useRemoveFromStore"
---

# `useRemoveFromStore`

This hook allows to remove a value from the [Store](./Store.md). 

## Syntax

```jsx
import { useRemoveFromStore } from 'react-admin';

const remove = useRemoveFromStore();
remove(key);
```

The `key` should be a string, and is used to access local storage. It can be passed either when calling the hook, or when calling the callback:

```jsx
const remove = useRemoveFromStore(key);
remove();
```

## Example

```jsx
import { useRemoveFromStore } from 'react-admin';
import { Button } from '@mui/material';

const ResetPreferences = () => {
    const removeItem = useRemoveFromStore();
    return (
        <>
            <Button onClick={() => removeItem('sidebar.open')}>
                Reset sidebar
            </Button>
            <Button onClick={() => removeItem('locale')}>
                Reset locale
            </Button>
            <Button onClick={() => removeItem('theme')}>
                Reset theme
            </Button>
        </>
    );
};
```
