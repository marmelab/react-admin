# ra-materialui-treeview

A treeview component with [material-ui](https://github.com/mui-org/material-ui) to use with [react-admin](https://github.com/marmelab/react-admin).

## Installation

```sh
npm install --save ra-materialui-treeview
# or
yarn add ra-materialui-treeview
```

## Dependencies

If you want to enable [edition](#editable) (with drag and drop), ensure you also installed [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)

```sh
npm install --save react-beautiful-dnd
# or
yarn add react-beautiful-dnd
```

## Usage

With a category ressource having this shape:

```json
[
    { id: 1, name: 'Clothing' },
    { id: 2, name: 'Men', parent_id: 1 },
    { id: 3, name: 'Suits', parent_id: 2 },
    { id: 4, name: 'Slacks', parent_id: 3 },
    { id: 5, name: 'Jackets', parent_id: 3 },
    { id: 6, name: 'Women', parent_id: 1 },
    { id: 7, name: 'Dresses', parent_id: 6 },
    { id: 8, name: 'Evening Gowns', parent_id: 7 },
    { id: 9, name: 'Sun Dresses', parent_id: 7 },
    { id: 10, name: 'Skirts', parent_id: 6 },
    { id: 11, name: 'Blouses', parent_id: 6 },
]
```

```js
import React from 'react';
import {
    List,
    TextField,
} from 'react-admin';
import Treeview from 'ra-materialui-treeview';

export const CategoriesList = (props) => (
    <List {...props}>
        <Treeview>
            <TextField source="name" />
        </Treeview>
    </List>
);
```

## Editable

Requires [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) to be installed. See [Dependencies](#dependencies).

```js
import React, { Component } from 'react';
import {
    List,
    EditButton,
    DeleteButton,
    SaveButton,
    TextInput,
} from 'react-admin';
import Treeview from 'ra-materialui-treeview';

const CategoriesList = () => (
    <List {...this.props}>
        <Treeview>
            <TextInput source="name" /> {/* Quick name edition */}
            <SaveButton />
            <EditButton />
            <DeleteButton />
        </Treeview>
    </List>
);
```

## Roadmap

* Support nested set hierarchical data
* `TreeviewSelectInput` to select a value inside the hierarchical data (with autocomplete showing the matched nodes)
* `TreeviewInput` to edit a field containing hierarchical data as json
* `TreeviewNodeField` to show a node and its hierarchie. It should recursively fetch the parents by default, allow a custom function to be supplied to fetch them in one call (`fetchHierarchy`) and fallback to a simple `depth` display (`--|--|--[NODE_LABEL]`) if a `depthSource` is supplied.

## License

This library is licensed under the MIT License, and sponsored by [marmelab](http://marmelab.com).
