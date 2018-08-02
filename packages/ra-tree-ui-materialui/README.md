# ra-tree-ui-materialui

A Tree component with [material-ui](https://github.com/mui-org/material-ui) to use with [react-admin](https://github.com/marmelab/react-admin).

## Installation

```sh
npm install --save ra-tree-ui-materialui
# or
yarn add ra-tree-ui-materialui
```

## Dependencies

If you want to enable [edition](#editable) (with drag and drop), ensure you also installed the [react-dnd](https://github.com/react-dnd/react-dnd) and the `react-dnd-html5-backend` packages

```sh
npm install --save react-dnd react-dnd-html5-backend
# or
yarn add react-dnd react-dnd-html5-backend
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
import { Tree } from 'ra-tree-ui-materialui';

export const CategoriesList = (props) => (
    <List {...props}>
        <Tree>
            <TextField source="name" />
            <EditButton />
            <DeleteButton />
        </Tree>
    </List>
);
```

`react-admin` will fetch the data and the `Tree` component will build a tree from it. Note that every category which do not have a parent will be considered a root node.

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
import { EditableTree } from 'ra-tree-ui-materialui';

const CategoriesList = () => (
    <List {...this.props}>
        <EditableTree>
            <TextInput source="name" /> {/* Quick name edition */}
            <SaveButton />
            <EditButton />
            <DeleteButton />
        </EditableTree>
    </List>
);
```

## Roadmap

* Support nested set hierarchical data
* `TreeSelectInput` to select a value inside the hierarchical data (with autocomplete showing the matched nodes)
* `TreeInput` to edit a field containing hierarchical data as json
* `TreeNodeField` to show a node and its hierarchie. It should recursively fetch the parents by default, allow a custom function to be supplied to fetch them in one call (`fetchHierarchy`) and fallback to a simple `depth` display (`--|--|--[NODE_LABEL]`) if a `depthSource` is supplied.

## License

This library is licensed under the MIT License, and sponsored by [marmelab](http://marmelab.com).
