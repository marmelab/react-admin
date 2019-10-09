import React from 'react';
import { TextField } from 'react-admin';
import {
    Tree,
    TreeNode,
    TreeList,
    TreeNodeActions,
} from 'ra-tree-ui-materialui';
import { EditButton } from 'ra-ui-materialui';

const TagNodeActions = props => (
    <TreeNodeActions {...props}>
        <EditButton />
    </TreeNodeActions>
);

// Disallow dragging of items without parents (top level items)
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
