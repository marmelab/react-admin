# ra-tree-ui-materialui

A Tree component with [material-ui](https://github.com/mui-org/material-ui) to use with [react-admin](https://github.com/marmelab/react-admin).

![`ra-tree-ui-materialui`](https://github.com/marmelab/react-admin/raw/master/docs/img/ra-tree.gif)

## Installation

```sh
npm install --save ra-tree-ui-materialui ra-tree-language-english
# or
yarn add ra-tree-ui-materialui ra-tree-language-english
```

## Usage

With a `categories` ressource having this structure where a category may have a parent category referenced by the `parent_id` field:

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
// in src/tags/list.js
import React from 'react';
import { TextField } from 'react-admin';
import {
    AddChildNodeMenuItem,
    AddNodeAfterMenuItem,
    AddNodeBeforeMenuItem,
    DeleteMenuItem,
    EditMenuItem,
    Tree,
    TreeNode,
    TreeList,
    TreeNodeActions,
    TreeNodeActionsMenu,
} from 'ra-tree-ui-materialui';

const TagNodeActions = props => (
    <TreeNodeActions {...props}>
        <TreeNodeActionsMenu {...props}>
            <AddChildNodeMenuItem />
            <AddNodeBeforeMenuItem />
            <AddNodeAfterMenuItem />
            <EditMenuItem />
            <DeleteMenuItem />
        </TreeNodeActionsMenu>
    </TreeNodeActions>
);

// Disallow dragging of items without parents (top level items)
const canDrag = record => !!record.parent_id;

export const TagsList = (props) => (
    <Tree {...props}>
        <TreeList>
            <TreeNode actions={<TagNodeActions />} canDrag={canDrag}>
                <TextField source="name" />
            </TreeNode>
        </TreeList>
    </Tree>
);
```

`react-admin` will fetch the data and the `Tree` component will build a tree from it. Note that every category which do not have a parent will be considered a root node. Note that we specified a very high `perPage` prop on the `List` component. Indeed, the `Tree` component needs the entire tree to work so you'll have to make sure your API returns all the required items.

## API

### <Tree>

The `Tree` component accepts the following props:

- `parentSource`: The field used as the parent identifier for each node. Defaults to `parent_id`
- `positionSource`: The field used to sort the nodes. Optional.

### <TreeList>

This is the UI container. Does nothing for now but may include advanced selection features in the future. Takes no props.

### <TreeNode>

The `TreeNode` component accepts the following props:

- `actions`: A component displaying actions for each node
- `canDrag`: A function receiving the node's record. Returns a boolean indicating whether this node can be dragged.
- `canDrop`: A function returning a boolean indicating whether the drop is possible. It receives an object with two keys:
  - `dragSource`: The record of the node being dragged
  - `dropTarget`: The record of the node on which the `dragSource` is dragged over
- `undoable`: Enable or disable optimistic updates when moving a node. Defaults to `true`

### <TreeNodeActions>

A component to display actions on a node. There are two ways to use it:

- Put standard react-admin buttons in it such as `EditButton`, `ShowButton`, `CloneButton` or `DeleteButton`
- Put a `TreeNodeActionsMenu` component as its only children and use the menu items components. Note that you should not use standard react-admin buttons in it.

## Roadmap

* `TreeSelectInput` to select a value inside the hierarchical data (with autocomplete showing the matched nodes)
* `TreeNodeField` to show a node and its hierarchie. It should recursively fetch the parents by default, allow a custom function to be supplied to fetch them in one call (`fetchHierarchy`) and fallback to a simple `depth` display (`--|--|--[NODE_LABEL]`) if a `depthSource` is supplied.

## License

This library is licensed under the MIT License, and sponsored by [marmelab](http://marmelab.com).
