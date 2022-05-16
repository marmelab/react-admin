---
layout: default
title: "useUpdate"
---

# `useUpdate`

This hook allows to call `dataProvider.update()` when the callback is executed, and update a single record based on its `id` and a `data` argument.

```jsx
// syntax
const [update, { data, isLoading, error }] = useUpdate(
    resource,
    { id, data, previousData },
    options
);
```

The `update()` method can be called with the same parameters as the hook:

```jsx
update(
    resource,
    { id, data, previousData },
    options
);
```

This means the parameters can be passed either when calling the hook, or when calling the callback. It's up to you to pick the syntax that best suits your component. If you have the choice, we recommend passing the parameters when calling the `update` callback (second example below).

```jsx
// set params when calling the hook
import { useUpdate } from 'react-admin';

const IncreaseLikeButton = ({ record }) => {
    const diff = { likes: record.likes + 1 };
    const [update, { isLoading, error }] = useUpdate(
        'likes',
        { id: record.id, data: diff, previousData: record }
    );
    const handleClick = () => {
        update()
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Like</button>;
};

// set params when calling the update callback
import { useUpdate } from 'react-admin';

const IncreaseLikeButton = ({ record }) => {
    const diff = { likes: record.likes + 1 };
    const [update, { isLoading, error }] = useUpdate();
    const handleClick = () => {
        update(
            'likes',
            { id: record.id, data: diff, previousData: record }
        )
    }
    if (error) { return <p>ERROR</p>; }
    return <button disabled={isLoading} onClick={handleClick}>Like</button>;
};
```

**Tip**: If you use TypeScript, you can specify the record and error types for more type safety:

```tsx
useUpdate<Product, Error>(undefined, undefined, {
    onError: (error) => {
        // error is an instance of Error.
    },
    onSettled: (data, error) => {
        // data is an instance of Product.
        // error is an instance of Error.
    },
})
```
