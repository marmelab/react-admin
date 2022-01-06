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
    { ids },
    options
);

// example
import { useGetMany } from 'react-admin';

const PostTags = ({ record }) => {
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
