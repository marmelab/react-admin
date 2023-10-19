---
layout: default
title: "useUpdateMany"
---

# `useUpdateMany`

This hook allows to call `dataProvider.updateMany()` when the callback is executed, and update an array of records based on their `ids` and a `data` argument.

## Syntax

```jsx
const [updateMany, { data, isLoading, error }] = useUpdateMany(
    resource,
    { ids, data },
    options
);
```

The `updateMany()` method can be called with the same parameters as the hook:

```jsx
updateMany(
    resource,
    { ids, data },
    options
);
```

So, should you pass the parameters when calling the hook, or when executing the callback? It's up to you; but if you have the choice, we recommend passing the parameters when calling the `updateMany` callback (second example below).

## Usage

```jsx
// set params when calling the hook
import { useUpdateMany, useListContext } from 'react-admin';

const BulkResetViewsButton = () => {
    const { selectedIds } = useListContext();
    const [updateMany, { isLoading, error }] = useUpdateMany(
        'posts',
        { ids: selectedIds, data: { views: 0 } }
    );
    const handleClick = () => {
        updateMany();
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Reset views</button>;
};

// set params when calling the updateMany callback
import { useUpdateMany, useListContext } from 'react-admin';

const BulkResetViewsButton = () => {
    const { selectedIds } = useListContext();
    const [updateMany, { isLoading, error }] = useUpdateMany();
    const handleClick = () => {
        updateMany(
            'posts',
            { ids: selectedIds, data: { views: 0 } }
        );
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Reset views</button>;
};
```

## TypeScript

The `useUpdateMany` hook accepts a generic parameter for the record type and another for the error type:

```tsx
useUpdateMany<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // TypeScript knows that error is of type Error
    },
    onSettled: (data, error) => {
        // TypeScript knows that data is of type Product[]
        // TypeScript knows that error is of type Error
    },
})
```
