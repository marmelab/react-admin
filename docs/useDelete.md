---
layout: default
title: "useDelete"
---

# `useDelete`

This hook allows calling `dataProvider.delete()` when the callback is executed and deleting a single record based on its `id`. 

```jsx
// syntax
const [deleteOne, { data, isLoading, error }] = useDelete(
    resource,
    { id, previousData },
    options
);
```

The `deleteOne()` method can be called with the same parameters as the hook:

```jsx
deleteOne(
    resource,
    { id, previousData },
    options
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the `deleteOne` callback (second example below).

```jsx
// set params when calling the hook
import { useDelete } from 'react-admin';

const DeleteButton = ({ record }) => {
    const [deleteOne, { isLoading, error }] = useDelete(
        'likes',
        { id: record.id, previousData: record }
    );
    const handleClick = () => {
        deleteOne();
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Delete</button>;
};

// set params when calling the deleteOne callback
import { useDelete } from 'react-admin';

const DeleteButton = ({ record }) => {
    const [deleteOne, { isLoading, error }] = useDelete();
    const handleClick = () => {
        deleteOne(
            'likes',
            { id: record.id , previousData: record }
        );
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Delete</div>;
};
```
