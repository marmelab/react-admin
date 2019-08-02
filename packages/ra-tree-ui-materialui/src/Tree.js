import React, { Children, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { TreeController } from 'ra-tree-core';
import { DragDropContext } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';

import draggable from './draggable';
import droppable from './droppable';
import DragLayer from './DragLayer';
import DefaultDragPreview from './DragPreview';
import DefaultTreeNode from './TreeNode';
import DefaultTreeNodeContent from './TreeNodeContent';
import DefaultTreeNodeWithChildren from './TreeNodeWithChildren';
import RootDropTarget from './RootDropTarget';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
});

const sanitizeRestProps = ({
    currentSort,
    defaultTitle,
    displayedFilters,
    filterValues,
    getTreeState,
    hasBulkActions,
    hasCreate,
    hideFilter,
    isLoading,
    loadedOnce,
    perPage,
    selectedIds,
    setFilters,
    setPage,
    setPerPage,
    setSelectedIds,
    setSort,
    showFilter,
    ...rest
}) => rest;

const warnAboutChildren = () =>
    console.warn(
        // eslint-disable-line
        `You passed multiple children to the Tree component. You must either pass it a NodeView or a NodeForm component as its only child:

    <Tree>
        <NodeView>
            <TextField source="name" />
        </NodeView>
    </Tree>

    // Or

    <Tree>
        <NodeForm>
            <TextInput source="name" />
        </NodeForm>
    </Tree>

If you need actions on each node, use the actions prop on either the NodeView or NodeForm component:

    const MyNodeActions = props => (
        <NodeActions {...props}>
            <EditButton />
            <ShowButton />
            <DeleteButton />
        </NodeActions>
    );

    <Tree>
        <NodeView actions={<MyNodeActions />}>
            <TextField source="name" />
        </NodeView>
    </Tree>

    // Or

    const MyNodeActions = props => (
        <NodeActions {...props}>
            <SaveButton variant="text" />
            <IgnoreFormProps>
                <EditButton />
                <ShowButton />
                <DeleteButton />
            </IgnoreFormProps>
        </NodeActions>
    );

    <Tree>
        <NodeForm actions={<MyNodeActions />}>
            <TextInput source="name" />
        </NodeForm>
    </Tree>
`
    );

const Tree = ({
    allowDropOnRoot,
    children,
    dragPreviewComponent,
    enableDragAndDrop,
    parentSource,
    treeNodeComponent,
    treeNodeWithChildrenComponent,
    treeNodeContentComponent,
    ...props
}) => {
    useEffect(() => {
        const childrenCount = Children.count(children);

        if (childrenCount > 1 && process.env.NODE_ENV !== 'production') {
            warnAboutChildren();
        }
    }, [children]);

    const classes = useStyles();

    const Container = enableDragAndDrop
        ? DragDropContext(
              TouchBackend({
                  enableKeyboardEvents: true,
                  enableMouseEvents: true,
                  enableTouchEvents: true,
              })
          )('div')
        : Fragment;

    const TreeNode = enableDragAndDrop
        ? droppable(treeNodeComponent)
        : treeNodeComponent;

    const TreeNodeContent = enableDragAndDrop
        ? draggable(treeNodeContentComponent)
        : treeNodeContentComponent;

    return (
        <TreeController parentSource={parentSource} {...props}>
            {({ getTreeState, tree, ...controllerProps }) => (
                <Container>
                    {enableDragAndDrop ? (
                        <DragLayer
                            dragPreviewComponent={dragPreviewComponent}
                        />
                    ) : null}
                    <List
                        classes={{
                            root: classes.root,
                        }}
                        dense
                        disablePadding
                    >
                        {enableDragAndDrop && allowDropOnRoot ? (
                            <RootDropTarget parentSource={parentSource} />
                        ) : null}
                        {tree.map(node => (
                            <TreeNode
                                key={`TreeNode_${node.id}`}
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
                                treeNodeContentComponent={TreeNodeContent}
                                {...sanitizeRestProps(controllerProps)}
                            >
                                {children}
                            </TreeNode>
                        ))}
                    </List>
                </Container>
            )}
        </TreeController>
    );
};

Tree.propTypes = {
    allowDropOnRoot: PropTypes.bool,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.node,
    enableDragAndDrop: PropTypes.bool,
    getTreeFromArray: PropTypes.func,
    parentSource: PropTypes.string,
    resource: PropTypes.string.isRequired,
    dragPreviewComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
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
    parentSource: 'parent_id',
    dragPreviewComponent: DefaultDragPreview,
    treeNodeComponent: DefaultTreeNode,
    treeNodeContentComponent: DefaultTreeNodeContent,
    treeNodeWithChildrenComponent: DefaultTreeNodeWithChildren,
};

export default Tree;
