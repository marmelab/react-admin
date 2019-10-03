import React from 'react';
import { TextField } from 'react-admin';
import { Tree, TreeNode, TreeList } from 'ra-tree-ui-materialui';

const TagList = props => (
    <Tree {...props}>
        <TreeList>
            <TreeNode>
                <TextField source="name" />
            </TreeNode>
        </TreeList>
    </Tree>
);

export default TagList;
