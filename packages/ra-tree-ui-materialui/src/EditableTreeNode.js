import React, { Component, Fragment } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import ListItem from '@material-ui/core/ListItem';
import IconDragHandle from '@material-ui/icons/DragHandle';
import { withStyles } from '@material-ui/core/styles';
import { crudUpdate as crudUpdateAction } from 'ra-core';

import { DROP_TARGET_TYPE } from './constants';
import TreeNode, { styles as getDefaultStyles } from './TreeNode';

const styles = theme => {
    const defaultStyles = getDefaultStyles(theme);
    return {
        ...defaultStyles,
        root: {
            display: 'flex',
        },
        node: {
            ...defaultStyles.root,
            alignItems: 'baseline',
            paddingLeft: theme.spacing.unit * 6,
        },
        handle: {
            cursor: 'crosshair',
            marginRight: theme.spacing.unit * 2,
        },
        draggingOver: {
            background: theme.palette.action.hover,
        },
    };
};

class EditableTreeNode extends Component {
    static propTypes = TreeNode.propTypes;

    render() {
        const {
            basePath,
            canDrop,
            children,
            classes,
            connectDragPreview,
            connectDragSource,
            connectDropTarget,
            isDragging,
            isOver,
            isOverCurrent,
            itemType,
            node,
            resource,
            treeNodeComponent,
            treeNodeWithChildrenComponent: TreeNodeWithChildren,
            treeNodeContentComponent: TreeNodeContent,
            ...props
        } = this.props;
        return connectDropTarget(
            <div className={classes.root}>
                <ListItem
                    button
                    classes={{
                        root: classNames({
                            [classes.node]: node.children.length > 0,
                            [classes.leaf]: node.children.length === 0,
                            [classes.draggingOver]: isOverCurrent,
                        }),
                    }}
                    dense
                    disableGutters
                >
                    {connectDragSource(
                        <div className={classes.handle}>
                            <IconDragHandle />
                        </div>
                    )}

                    {node.children.length > 0 ? (
                        <TreeNodeWithChildren
                            basePath={basePath}
                            cancelDropOnChildren={!!itemType}
                            classes={classes}
                            /*
                                Override the isExpanded prop managed through redux on hover.
                                Set it to undefined when not hovering to fall back to redux state
                                so that it stay expanded if it was before
                            */
                            isExpanded={isOver && canDrop ? true : undefined}
                            node={node}
                            resource={resource}
                            treeNodeComponent={treeNodeComponent}
                            treeNodeWithChildrenComponent={TreeNodeWithChildren}
                            treeNodeContentComponent={TreeNodeContent}
                            {...props}
                        >
                            {children}
                        </TreeNodeWithChildren>
                    ) : (
                        <Fragment>
                            <TreeNodeContent
                                basePath={basePath}
                                node={node}
                                resource={resource}
                                isLeaf={true}
                                cancelDropOnChildren={!!itemType}
                                onDrop={
                                    isOver && canDrop
                                        ? event => event.preventDefault()
                                        : undefined
                                }
                                {...props}
                            >
                                {children}
                            </TreeNodeContent>
                        </Fragment>
                    )}
                </ListItem>
            </div>
        );
    }
}

const isDraggingAParent = (props, monitor) => {
    const draggedNode = monitor.getItem();

    if (!draggedNode) {
        return false;
    }
    let node = props.node;

    while (node) {
        // If the dragged node is a parent of the current node, it can't be dropped
        if (draggedNode.id === node.id) {
            return false;
        }
        node = node.parent;
    }

    return true;
};

const dropTargetSpecs = {
    drop(props, monitor) {
        if (monitor.isOver({ shallow: true })) {
            return props.node;
        }

        return undefined;
    },
    canDrop(props, monitor) {
        return !props.isDragging || isDraggingAParent(props, monitor);
    },
};

const dropTargetConnect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
});

const dragSourceSpecs = {
    beginDrag(props) {
        return props.node;
    },
    endDrag({ basePath, crudUpdate, node, parentSource, resource }, monitor) {
        if (!monitor.didDrop()) {
            return;
        }

        const droppedOnNode = monitor.getDropResult();
        if (
            typeof droppedOnNode.id === 'undefined' ||
            droppedOnNode.id === node.record[parentSource]
        ) {
            return;
        }

        crudUpdate(
            resource,
            node.record.id,
            { ...node.record, [parentSource]: droppedOnNode.id },
            node.record,
            basePath,
            false
        );
    },
};

const dragSourceConnect = (connect, monitor) => ({
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
});

export default compose(
    connect(
        undefined,
        { crudUpdate: crudUpdateAction }
    ),
    DragSource(DROP_TARGET_TYPE, dragSourceSpecs, dragSourceConnect),
    DropTarget(DROP_TARGET_TYPE, dropTargetSpecs, dropTargetConnect),
    withStyles(styles)
)(EditableTreeNode);
