import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    expandIcon: {
        margin: 0,
    },
    root: {
        alignItems: 'baseline',
        display: 'flex',
        padding: 0,
        flexGrow: 1,
    },
    node: {
        alignItems: 'baseline',
        display: 'flex',
        padding: 0,
        flexGrow: 1,
        paddingLeft: theme.spacing.unit * 4,
    },
    leaf: {
        display: 'flex',
        flexGrow: 1,
        // Restore default ListItem padding
        paddingTop: theme.spacing.unit * 1.5,
        paddingBottom: theme.spacing.unit * 1.5,
        paddingRight: theme.spacing.unit * 4,
        paddingLeft: theme.spacing.unit * 4,
        position: 'relative',
    },

    panel: {
        background: 'transparent',
        display: 'block',
        flexGrow: 1,
        margin: 0,
    },
    panelDetails: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
    },
    panelSummary: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: 0,
        padding: 0,
    },
    panelSummaryContent: {
        alignItems: 'center',
        margin: 0,
    },
    panelSummaryExpanded: {
        margin: '0 !important',
    },
    handle: {
        cursor: 'crosshair',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
    },
    draggingOver: {
        background: theme.palette.action.hover,
    },
});

const TreeNode = ({
    basePath,
    canDrop,
    children,
    classes,
    connectDropTarget,
    isOver,
    isOverCurrent,
    itemType,
    node,
    resource,
    treeNodeComponent,
    treeNodeWithChildrenComponent: TreeNodeWithChildren,
    treeNodeContentComponent: TreeNodeContent,
    ...props
}) =>
    connectDropTarget(
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
                {node.children.length > 0 ? (
                    <TreeNodeWithChildren
                        key={`TreeNodeWithChildren${node.id}`}
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
                            key={`TreeNodeContent_${node.id}`}
                            basePath={basePath}
                            node={node}
                            resource={resource}
                            isLeaf={true}
                            cancelDropOnChildren={!!itemType}
                            onDrop={
                                isOver && canDrop
                                    ? event => {
                                          event.persit();
                                          event.preventDefault();
                                      }
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

TreeNode.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.node,
    classes: PropTypes.object,
    node: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    treeNodeComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    treeNodeContentComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]).isRequired,
    treeNodeWithChildrenComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
};

TreeNode.defaultProps = {
    connectDropTarget: target => target,
};

export default withStyles(styles)(TreeNode);
