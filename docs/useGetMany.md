---
layout: default
title: "useGetMany"
---

# `useGetMany`

This hook calls `dataProvider.getMany()` when the component mounts. It queries the data provider for several records, based on an array of `ids`.

```jsx
// syntax
const { data, isLoading, error, refetch } = useGetMany(
    resource,
    { ids, meta },
    options
);

// example
import { useGetMany, useRecordContext } from 'react-admin';

const PostTags = () => {
    const record = useRecordContext();
    const { data, isLoading, error } = useGetMany(
        'tags',
        { ids: record.tagIds }
    );
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
         <ul>
             {data.map(tag => (
                 <li key={tag.id}>{tag.name}</li>
             ))}
         </ul>
     );
};
```

`useGetMany` deduplicates and aggregates the calls made for a given resource during a render pass. This means that if a page makes several calls to `useGetMany` for a given resource, react-admin will only call the `dataProvider.getMany()` once.

```jsx
// three calls to useGetMany on the same resource
useGetMany('tags', { ids: [1, 2, 3] });
useGetMany('tags', { ids: [3, 4, 5] });
useGetMany('tags', { ids: [5, 6, 7] });

// will result in a single call to the dataProvider
dataProvider.getMany('tags', { ids: [1, 2, 3, 4, 5, 6, 7] });
```

React-admin uses `useGetMany` in [the `<ReferenceField>` component](./ReferenceField.md), to overcome the n+1 problem when using this component in a list. 

## TypeScript

The `useGetMany` hook accepts a generic parameter for the record type:

```tsx
import { useGetMany, useRecordContext } from 'react-admin';

type Post = {
    id: number;
    title: string;
    tagIds: number[];
};

type Tag = {
    id: number;
    name: string;
}

const PostTags = () => {
    // record is of type Post
    const record = useRecordContext<Post>();
    // data is of type Tag[]
    const { data, isLoading, error } = useGetMany(
        'tags',
        { ids: record.tagIds }
    );
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return (
         <ul>
             {data.map(tag => (
                 <li key={tag.id}>{tag.name}</li>
             ))}
         </ul>
     );
};
```