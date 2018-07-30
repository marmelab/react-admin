import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { TreeController } from 'ra-tree-core';

import DefaultTreeNode from './TreeNode';
import DefaultTreeNodeContent from './TreeNodeContent';
import DefaultTreeNodeWithChildren from './TreeNodeWithChildren';

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
};

export const Tree = ({
    children,
    classes,
    treeNodeComponent: TreeNode,
    treeNodeWithChildrenComponent,
    treeNodeContentComponent,
    ...props
}) => (
    <TreeController {...props}>
        {({ getTreeState, tree, ...props }) => (
            <List
                classes={{
                    root: classes.root,
                }}
                dense
                disablePadding
            >
                {tree.map(node => (
                    <TreeNode
                        key={node.id}
                        classes={{
                            ...classes,
                            root: classes.node || undefined,
                        }}
                        getTreeState={getTreeState}
                        node={node}
                        treeNodeComponent={TreeNode}
                        treeNodeWithChildrenComponent={
                            treeNodeWithChildrenComponent
                        }
                        treeNodeContentComponent={treeNodeContentComponent}
                        {...props}
                    >
                        {children}
                    </TreeNode>
                ))}
            </List>
        )}
    </TreeController>
);

Tree.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.node,
    classes: PropTypes.object,
    getTreeFromArray: PropTypes.func,
    onChange: PropTypes.func,
    parentSource: PropTypes.string,
    resource: PropTypes.string.isRequired,
    treeNodeComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    treeNodeContentComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
    treeNodeWithChildrenComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
};

Tree.defaultProps = {
    classes: {},
    parentSource: 'parent_id',
    treeNodeComponent: DefaultTreeNode,
    treeNodeWithChildrenComponent: DefaultTreeNodeWithChildren,
    treeNodeContentComponent: DefaultTreeNodeContent,
};

export default withStyles(styles)(Tree);
