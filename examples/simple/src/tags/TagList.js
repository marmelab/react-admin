import React from 'react';
import {
    DeleteButton,
    EditButton,
    List,
    SaveButton,
    ShowButton,
    TextInput,
} from 'react-admin';
import { Tree, TreeNodeActions } from 'ra-materialui-treeview';

const TagList = props => (
    <List {...props} perPage={1000}>
        <Tree parentSource="parent_id">
            <TextInput source="name" />
            <TreeNodeActions>
                <SaveButton variant="flat" />
                <EditButton />
                <ShowButton />
                <DeleteButton />
            </TreeNodeActions>
        </Tree>
    </List>
);

export default TagList;
