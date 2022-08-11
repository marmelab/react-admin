---
layout: default
title: "useGetTree"
---

# `useGetTree`

This [Enterprise Edition](https://marmelab.com/ra-enterprise)<img class="icon" src="./img/premium.svg" /> hook is exposed by [the `ra-tree` module](https://marmelab.com/ra-enterprise/modules/ra-tree). It calls `dataProvider.getTree()` when the component mounts. It's ideal for getting nodes of the tree structure.

![useGetTree](https://marmelab.com/ra-enterprise/modules/assets/ra-tree-overview.gif)

## Syntax

```jsx
const { data, error, isLoading, isFetching } = useGetTree(
    resource,
    { meta },
    options
);
```

## Usage

```jsx
import { useGetTree } from '@react-admin/ra-tree';
const Categories = () => {
    const { data, isLoading, error } = useGetTree('categories');
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }
    return <Tree tree={data} />;
};
```

`{ data }` will contains TreeRecord objects. A TreeRecord contains at least an id field and a children field (an array of child ids). For instance:

```js
[
  { id: 1, title: 'foo1', children: [3, 4] },
  { id: 2, title: 'foo2', children: [] },
  { id: 3, title: 'foo3', children: [5] },
  { id: 4, title: 'foo4', children: [] },
  { id: 5, title: 'foo5', children: [] },
]
 ```

Check [the `ra-tree` documentation](https://marmelab.com/ra-enterprise/modules/ra-tree) for more details.