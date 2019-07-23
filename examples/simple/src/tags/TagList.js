import React from 'react';
import { DeleteButton, EditButton, ShowButton, TextInput } from 'react-admin';
import { NodeView, Tree, NodeActions } from 'ra-tree-ui-materialui';

const CustomNodeActions = props => (
    <NodeActions {...props}>
        <EditButton />
        <ShowButton />
        <DeleteButton />
    </NodeActions>
);

const TagList = props => (
    <Tree enableDragAndDrop parentSource="parent_id" {...props}>
        <NodeView actions={<CustomNodeActions />}>
            <TextInput source="name" />
        </NodeView>
    </Tree>
);

export default TagList;
