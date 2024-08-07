---
layout: default
title: "useGetTree"
---

# `useGetTree`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> hook is exposed by [the `ra-tree` module](https://react-admin-ee.marmelab.com/documentation/ra-tree), a package dedicated to handling tree structures. It's ideal for fetching a tree structure from the API, e.g. a list of categories.

It calls `dataProvider.getTree()` (one of the new `dataProvider` methods supported by `ra-tree`) when the component mounts, and returns the tree nodes in a flat array.

<video controls autoplay playsinline muted loop>
  <source src="https://react-admin-ee.marmelab.com/assets/ra-tree-overview.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Usage

Use it like other `dataProvider` hooks:

```jsx
import { useGetTree, getRCTree, Tree } from '@react-admin/ra-tree';

const Categories = () => {
    const { data, isLoading, error } = useGetTree('categories');
    if (isLoading) { return <Loading />; }
    if (error) { return <p>ERROR</p>; }

    return <Tree treeData={getRCTree(data)} />;
};
```

`data` will contain an array of `TreeRecord` objects. A `TreeRecord` contains at least an `id` field and a `children` field (an array of child ids). For instance:

```js
[
  { id: 1, title: 'foo1', children: [3, 4] },
  { id: 2, title: 'foo2', children: [] },
  { id: 3, title: 'foo3', children: [5] },
  { id: 4, title: 'foo4', children: [] },
  { id: 5, title: 'foo5', children: [] },
]
 ```

 The `<Tree>` component is a wrapper for [rc-tree's `<Tree>`](https://github.com/react-component/tree#tree-props), with Material Design style. It expects a `treeData` prop containing a tree of nodes with a special format (hence the `getRCTree` converter).

## Other Tree Hooks

`useGetTree` is one of many hooks added by `ra-tree`. This package recommends adding several methods to the `dataProvider`, and has one hook for each method.

**Read methods**

-   `getTree(resource)`
-   `getRootNodes(resource)`
-   `getParentNode(resource, { childId })`
-   `getChildNodes(resource, { parentId })`

These methods return Promises for `TreeRecord` objects.

**Write methods**

-   `moveAsNthChildOf(resource, { source, destination, position, meta })`: `source` and `destination` are `TreeRecord` objects, and `position` a zero-based integer
-   `moveAsNthSiblingOf(resource, { source, destination, position, meta })`
-   `addRootNode(resource, { data, meta })`
-   `addChildNode(resource, { parentId, data, position, meta })`
-   `deleteBranch(resource, { id, data, meta })`: `id` is the identifier of the node to remove, and `data` its content

Check [the `ra-tree` documentation](https://react-admin-ee.marmelab.com/documentation/ra-tree) for more details.
