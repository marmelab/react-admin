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
const TagList = props => (
    <Tree {...props}>
        <TreeList>
            <TreeNode actions={<TagNodeActions />}>
                <TextField source="name" />
            </TreeNode>
        </TreeList>
    </Tree>
);

export default TagList;
