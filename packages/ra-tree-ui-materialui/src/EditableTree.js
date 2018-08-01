import React, { Fragment } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { TreeController } from 'ra-tree-core';

import Tree, { styles } from './Tree';
import DragLayer from './DragLayer';
import DefaultDragPreview from './DragPreview';
import EditableTreeNode from './EditableTreeNode';
import EditableTreeNodeContent from './EditableTreeNodeContent';
import TreeNodeWithChildren from './TreeNodeWithChildren';
import RootDropTarget from './RootDropTarget';

export const EditableTree = ({
    allowDropOnRoot,
    children,
    classes,
    dragPreviewComponent,
    treeNodeComponent: TreeNode,
    treeNodeWithChildrenComponent,
    treeNodeContentComponent,
    parentSource,
    ...props
}) => (
    <TreeController parentSource={parentSource} {...props}>
        {({ getTreeState, tree, ...props }) => (
            <Fragment>
                <DragLayer dragPreviewComponent={dragPreviewComponent} />
                <List
                    classes={{
                        root: classes.root,
                    }}
                    dense
                    disablePadding
                >
                    {allowDropOnRoot ? (
                        <RootDropTarget parentSource={parentSource} />
                    ) : null}
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
            </Fragment>
        )}
    </TreeController>
);

EditableTree.propTypes = {
    ...Tree.propTypes,
    allowDropOnRoot: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
};

EditableTree.defaultProps = {
    ...Tree.defaultProps,
    allowDropOnRoot: true,
    submitOnEnter: true,
    dragPreviewComponent: DefaultDragPreview,
    treeNodeComponent: EditableTreeNode,
    treeNodeContentComponent: EditableTreeNodeContent,
    treeNodeWithChildrenComponent: TreeNodeWithChildren,
};

export default compose(
    withStyles(styles),
    DragDropContext(HTML5Backend)
)(EditableTree);
