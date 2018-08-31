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

const App = () => (
    <Admin
        dataProvider={dataProvider}
        locale="en"
        messages={messages}
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
    EditButton,
    DeleteButton,
} from 'react-admin';
import { Tree, NodeView, NodeActions } from 'ra-tree-ui-materialui';

const CategoriesActions = props => (
    <NodeActions {...props}>
        <EditButton />
        <DeleteButton />
    </NodeActions>
);

export const CategoriesList = (props) => (
    <List {...props} perPage={10000}>
        <Tree>
            <NodeView actions={<CategoriesActions />}>
                <TextField source="name" />
            </NodeView>
        </Tree>
    </List>
);
```

`react-admin` will fetch the data and the `Tree` component will build a tree from it. Note that every category which do not have a parent will be considered a root node. Note that we specified a very high `perPage` prop on the `List` component. Indeed, the `Tree` component needs the entire tree to work so you'll have to make sure your API returns all the required items.

## Editable

Requires [react-dnd](https://github.com/react-dnd/react-dnd) to be installed. See [Dependencies](#dependencies).

```js
import React, { Component } from 'react';
import {
    List,
    EditButton,
    DeleteButton,
    SaveButton,
    TextInput,
} from 'react-admin';
import { IgnoreFormProps, Tree, NodeForm, NodeActions } from 'ra-tree-ui-materialui';

const CategoriesActions = props => (
    <NodeActions {...props}>
        <SaveButton />
        <IgnoreFormProps> {/* This is important to not get warnings about unknown props with those buttons */}
            <EditButton />
            <DeleteButton />
        </IgnoreFormProps>
    </NodeActions>
)

const CategoriesList = () => (
    <List {...this.props}>
        <Tree>
            <NodeForm actions={<CategoriesActions />}>
                <TextInput source="name" /> {/* Quick name edition */}
            </NodeForm>
        </Tree>
    </List>
);
```

## Enabling Drag & Drop

You can enable drag & drop by adding the following props:

- `enableDragAndDrop`: Enable drag & drop. This will show drag handles on every nodes
- `allowDropOnRoot`: Setting this prop to `true` will add a root drop zone at the top of the list. Dropping node on it will set their parent to null
- `dragPreviewComponent`: Customize the preview of the currently dragged node by passing your own component. You can leverage the existing `DragPreview` component and adjusts its content. See [DragPreview](#dragpreview)
- `undoableDragDrop`: Enable optimistic updates from drag & drop operations. Defaults to `true`

```js
// in src/category/list.js
import React from 'react';
import {
    List,
    TextField,
} from 'react-admin';
import { Tree } from 'ra-tree-ui-materialui';

export const CategoriesList = (props) => (
    <List {...props}>
        <Tree allowDropOnRoot enableDragAndDrop>
            <NodeView>
                <TextField source="name" />
            </NodeView>
        </Tree>
    </List>
);
```

## API

### <Tree>

The `Tree` component accepts the following props:

- `enableDragAndDrop`: Enable drag & drop. This will show drag handles on every node
- `allowDropOnRoot`: Setting this prop to `true` will add a root drop zone at the top of the list. Dropping nodes on it will set their parent to null
- `dragPreviewComponent`: Customize the preview of the currently dragged node by passing your own component. You can leverage the existing `DragPreview` component and adjusts its content. See [DragPreview](#dragpreview)
- `getTreeFromArray`: The function used to build the tree from the fetched data. By default, uses a function based on [performant-array-to-tree](https://github.com/philipstanislaus/performant-array-to-tree)
- `getTreeState`: A function which must return the tree state root from the redux state in case you mounted it on a different key than `tree`. It will be called with a single `state` argument which is the redux state.
- `children`: A function which will be called with a single object argument having the following props
  - `tree`: an array of the root nodes. Each node have the following properties:
    - `children`: an array of its child nodes
    - `depth`: a number indicating its depth in the hierarchy
    - `record`: the node's original data
  - any additional props received by the `TreeController` component
- `parentSource`: The field used as the parent identifier for each node. Defaults to `parent_id`

### <NodeView>

The `NodeView` component accepts the following props:

- `actions`: A component displaying actions for each node

### <NodeForm>

The `NodeForm` component accepts the following props:

- `actions`: A component displaying actions for each node
- `submitOnEnter`: Enable or disable the automated form submission on enter
- `undoable`: Enable or disable optimistic updates when editing a node. Defaults to `true`

### <DragPreview>

By default, the `DragPreview` component will display the node identifier and, if it has children, the number of its children.

Instead of making a full custom preview component, you can use the `DragPreview` and pass it a child, either a react element or a function. The function will be called with the current `node` and the `translate` function.

```jsx
import React from 'react';
import { List, TextField } from 'react-admin';
import { DragPreview, Tree } from 'ra-tree-ui-materialui';

const TagDragPreview = props => (
    <DragPreview {...props}>
        {({ node }) => node.record.name}
    </DragPreview>
);

const TagList = props => (
    <List {...props} perPage={1000}>
        <Tree
            enableDragAndDrop
            dragPreviewComponent={TagDragPreview}
        >
            <NodeView>
                <TextField source="name" />
            </NodeView>
        </TreeShow>
    </List>
);

export default TagList;
```

## Roadmap

* Support async fetch of nodes
* `TreeSelectInput` to select a value inside the hierarchical data (with autocomplete showing the matched nodes)
* `TreeInput` to edit a field containing hierarchical data as json
* `TreeNodeField` to show a node and its hierarchie. It should recursively fetch the parents by default, allow a custom function to be supplied to fetch them in one call (`fetchHierarchy`) and fallback to a simple `depth` display (`--|--|--[NODE_LABEL]`) if a `depthSource` is supplied.
* Support nested set hierarchical data

## License

This library is licensed under the MIT License, and sponsored by [marmelab](http://marmelab.com).
