---
title: "useGetMany"
---

This hook calls `dataProvider.getMany()` when the component mounts. It queries the data provider for several records, based on an array of `ids`.

## Syntax

```jsx
const { data, isPending, error, refetch } = useGetMany(
    resource,
    { ids, meta },
    options
);
```

## Usage

```jsx
import { useGetMany, useRecordContext } from 'ra-core';

const PostTags = () => {
    const record = useRecordContext();
    const { data, isPending, error } = useGetMany(
        'tags',
        { ids: record.tagIds }
    );
    if (isPending) { return <div>Loading...</div>; }
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

`useGetMany` deduplicates and aggregates the calls made for a given resource during a render pass. This means that if a page makes several calls to `useGetMany` for a given resource, ra-core will only call the `dataProvider.getMany()` once.

```jsx
// three calls to useGetMany on the same resource
useGetMany('tags', { ids: [1, 2, 3] });
useGetMany('tags', { ids: [3, 4, 5] });
useGetMany('tags', { ids: [5, 6, 7] });

// will result in a single call to the dataProvider
dataProvider.getMany('tags', { ids: [1, 2, 3, 4, 5, 6, 7] });
```

Ra-core uses `useGetMany` in [the `<ReferenceFieldBase>` component](./ReferenceFieldBase.md), to overcome the n+1 problem when using this component in a list. 

## TypeScript

The `useGetMany` hook accepts a generic parameter for the record type:

```tsx
import { useGetMany, useRecordContext } from 'ra-core';

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
    const post = useRecordContext<Post>();

    const { data: tags, isPending, error } = useGetMany<Tag>(
        'tags',
        { ids: post.tagIds }
    );
    if (isPending) { return <div>Loading...</div>; }
    if (error) { return <p>ERROR</p>; }
    return (
        <ul>
            {/* TypeScript knows that tags is of type Tag[] */}
            {tags.map(tag => (
                <li key={tag.id}>{tag.name}</li>
            ))}
        </ul>
    );
};
```