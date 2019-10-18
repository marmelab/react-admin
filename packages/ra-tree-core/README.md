# ra-tree-core

A component to display hierarchized data in [react-admin](https://github.com/marmelab/react-admin). This package is UI agnostic. It provides redux actions, reducers and a component using render prop.

## Installation

```sh
npm install --save ra-tree-core
# or
yarn add ra-tree-core
```

## Usage

With a `categories` resource having this structure where a category may have a parent category referenced by the `parent_id` field:

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

First, you need to register the tree reducer and the translations:

```js
// in App.js
import React from 'react';
import { Admin, Resource, mergeTranslations } from 'react-admin';
import { reducer as tree } from 'ra-tree-ui-materialui';
import englishMessages from 'ra-language-english';
import treeEnglishMessages from 'ra-tree-language-english';

import dataProvider from './dataProvider';
import posts from './posts';
import tags from './tags';

const messages = {
    'en': mergeTranslations(englishMessages, treeEnglishMessages),
};
const i18nProvider = locale => messages[locale];

const App = () => (
    <Admin
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        locale="en"
        // Note that you cannot name it anything other than `tree`
        customReducers={{ tree }}
    >
        <Resource name="posts" {...posts} />
        <Resource name="tags" {...tags} />
    </Admin>
)
```

You can then use the tree components:

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
    <TreeController resource="categories" {...props}>
        {({ tree }) => (
            <Fragment>
                {tree.map(node => <TreeNode node={node} />)}
            </Fragment>
        )}
    </TreeController>
);
```

The `TreeController` component calls the `dataProvider` for the `categories` resource, and build an internal tree structure based on the results. Note that every category which does not have a parent will be considered a root node. The `TreeController` component then calls its child function, which is responsible for the actual rendering.

Note that your `dataProvider` must handle three new verbs: `GET_TREE_ROOT_NODES`, `GET_TREE_CHILDREN_NODES`, and `MOVE_NODE`.

### `GET_TREE_ROOT_NODES`

Should fetch the root nodes for the specified resource. It receives no parameters and should return an array of records as its `data`.

### `GET_TREE_CHILDREN_NODES`

Should fetch the leaves of the specified node. It receives the following parameter:

- `id`: the identifier of the node for which we want to fetch the leaves

The `dataProvider` should return an array of records as its `data`. 

### `MOVE_NODE`

Called when a node is moved either to a new parent, or to a new position. It receives the following parameters:

- `data`: the new node, updated
- `previousData`: the node before the update

**Note**: It is your responsibility to correctly update the siblings if necessary according to the new node position.

## API

### <TreeController>

Meant to be used as an alternative to the [`ListController`](https://marmelab.com/react-admin/List.html#the-list-component) component.

The `TreeController` accepts the following props:

- `children`: A function which will be called with a single object argument having the following props
  - `nodes`: an array of the root nodes identifiers
  - `toggleNode`: a function which takes a node identifier and toggles its expanded state
  - `expandNode`: a function which takes a node identifier and explicitly expands it
  - `closeNode`: a function which takes a node identifier and explicitly closes it
  - any additional props received by the `TreeController` component
- `parentSource`: The field used as the parent identifier for each node. Defaults to `parent_id`
- `positionSource`: The field used to order nodes. Optional.

### Actions

This package also exports several actions to interact with the Tree:

- `crudGetTreeRootNodes`: Called automatically by the `<TreeController>` component, trigger a fetch of the root nodes.
- `crudGetTreeChildrenNodes`: Trigger a fetch of the leaves for a specific node.
- `crudMoveNode`: Trigger a fetch which will update a node parent and its position (if specified).
- `toggleNode`, `expandNode` and `closeNode` to control if a node is expanded.

## Roadmap

- Support nested set hierarchical data
- `TreeSelectInputController` to select a value inside the hierarchical data (with autocomplete showing the matched nodes)
- `TreeNodeFieldController` to show a node and its hierarchy. It should recursively fetch the parents by default, accepting a custom function to fetch them in one call (`fetchHierarchy`).

## License

This library is licensed under the MIT License, and sponsored by [marmelab](http://marmelab.com).
