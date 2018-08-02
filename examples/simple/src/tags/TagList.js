import React from 'react';
import {
    DeleteButton,
    EditButton,
    List,
    SaveButton,
    ShowButton,
    TextInput,
} from 'react-admin';
import { EditableTree, TreeNodeActions } from 'ra-tree-ui-materialui';

const TagList = props => (
    <List {...props} perPage={1000}>
        <EditableTree parentSource="parent_id">
            <TextInput source="name" />
            <TreeNodeActions>
                <SaveButton variant="flat" />
                <EditButton />
                <ShowButton />
                <DeleteButton />
            </TreeNodeActions>
        </EditableTree>
    </List>
);

export default TagList;
