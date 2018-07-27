import React from 'react';
import {
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    TextField,
} from 'react-admin';
import { Tree, TreeNodeActions } from 'ra-tree-ui-materialui';

const TagList = props => (
    <List {...props} perPage={1000}>
        <Tree parentSource="parent_id">
            <TextField source="name" />
            <TreeNodeActions>
                <EditButton />
                <ShowButton />
                <DeleteButton />
            </TreeNodeActions>
        </Tree>
    </List>
);

export default TagList;
