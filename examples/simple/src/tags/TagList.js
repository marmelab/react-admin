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

// Disallow dragging of items without parent (top level items)
const canDrag = record => !!record.parent_id;

const TagList = props => (
    <Tree positionSource="position" {...props}>
        <TreeList>
            <TreeNode actions={<TagNodeActions />} canDrag={canDrag}>
                <TextField source="name" />
            </TreeNode>
        </TreeList>
    </Tree>
);

export default TagList;
