# ra-tree-core

A component to display hierarchized data in [react-admin](https://github.com/marmelab/react-admin). This package is UI agnostic. It provides redux actions, reducers and a component using render prop.

## Installation

```sh
npm install --save ra-tree-core
# or
yarn add ra-tree-core
```

## Usage

With a categories ressource having this structure where a category may have a parent category referenced by the `parent_id` field:

```json
[
    { "id": 1, "name": "Clothing" },
    { "id": 2, "name": "Men", "parent_id": 1 },
    { "id": 3, "name": "Suits", "parent_id": 2 },
    { "id": 4, "name": "Slacks", "parent_id": 3 },
    { "id": 5, "name": "Jackets", "parent_id": 3 },
    { "id": 6, "name": "Women", "parent_id": 1 },
    { "id": 7, "name": "Dresses", "parent_id": 6 },
    { "id": 8, "name": "Evening Gowns", "parent_id": 7 },
    { "id": 9, "name": "Sun Dresses", "parent_id": 7 },
    { "id": 10, "name": "Skirts", "parent_id": 6 },
    { "id": 11, "name": "Blouses", "parent_id": 6 }
]
```

```js
// in src/category/list.js
import React from 'react';
import {
    List,
    TextField,
} from 'react-admin';
import { TreeController } from 'ra-tree-core';
import TreeNode from './TreeNode';

export const CategoriesList = (props) => (
    <List {...props}>
        <TreeController>
            {({ tree }) => (
                <Fragment>
                    {tree.map(node => <TreeNode node={node} />)}
                </Fragment>
            )}
        </TreeController>
    </List>
);
```

`react-admin` will fetch the data and the `TreeController` component will build a tree from it. Note that every category which do not have a parent will be considered a root node. The `TreeController` component will call its children function which is responsible for the actual rendering.

## API

### <TreeController>

Meant to be used as the child of the [`List`](https://marmelab.com/react-admin/List.html#the-list-component), [`ReferenceManyField`](https://marmelab.com/react-admin/Fields.html#referencemanyfield) or [ReferenceArrayField](https://marmelab.com/react-admin/Fields.html#referencearrayfield) components.

The `TreeController` accepts the following props:

- `getTreeFromArray`: The function used to build the tree from the fetched data. It defaults to one using [performant-array-to-tree](https://github.com/philipstanislaus/performant-array-to-tree)
- `getTreeState`: A function which must return the tree state root from the redux state in case you mounted it on a different key than `tree`. It will be called with a single `state` argument which is the redux state.
- `children`: A function which will be called with a single object argument having the following props
  - `tree`: an array of the root nodes. Each node have the following properties:
    - `children`: an array of its child nodes
    - `depth`: a number indicating its depth in the hierarchy
    - `record`: the node's original data
  - `getIsNodeExpanded`: a function which takes a node identifier and returns a boolean indicating whether this node is expanded
  - `toggleNode`: a function which takes a node identifier and toggles its expanded state
  - `expandNode`: a function which takes a node identifier and explicitly expands it
  - `closeNode`: a function which takes a node identifier and explicitly closes it
  - any additional props received by the `TreeController` component
- `parentSource`: The field used as the parent identifier for each node. Defaults to `parent_id`

## Roadmap

- Support nested set hierarchical data
- `TreeSelectInputController` to select a value inside the hierarchical data (with autocomplete showing the matched nodes)
- `TreeInputController` to edit a field containing hierarchical data as json
- `TreeNodeFieldController` to show a node and its hierarchie. It should recursively fetch the parents by default, accepting a custom function to fetch them in one call (`fetchHierarchy`).

## License

This library is licensed under the MIT License, and sponsored by [marmelab](http://marmelab.com).
