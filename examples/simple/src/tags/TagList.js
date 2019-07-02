import React from 'react';
import {
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    TextInput,
} from 'react-admin';
import { NodeView, Tree, NodeActions } from 'ra-tree-ui-materialui';

const CustomNodeActions = props => (
    <NodeActions {...props}>
        <EditButton />
        <ShowButton />
        <DeleteButton />
    </NodeActions>
);

const TagList = props => (
    <List style={{ overflow: 'auto' }} {...props} perPage={1000}>
        <Tree enableDragAndDrop parentSource="parent_id">
            <NodeView actions={<CustomNodeActions />}>
                <TextInput source="name" />
            </NodeView>
        </Tree>
    </List>
);

export default TagList;
