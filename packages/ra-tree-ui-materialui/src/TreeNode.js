import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

export const styles = theme => ({
    expandIcon: {
        margin: 0,
    },
    root: {
        display: 'flex',
        // Ensure the user can click the while ListItem to toggle a node
        padding: 0,
        // Add some padding for hierarchy
        paddingLeft: theme.spacing.unit * 4,
        flexGrow: 1,
    },
    leaf: {
        display: 'flex',
        flexGrow: 1,
        // Restore default ListItem padding
        paddingTop: theme.spacing.unit * 1.5,
        paddingBottom: theme.spacing.unit * 1.5,
        // Ensure leaf buttons are aligned with node buttons
        paddingLeft: theme.spacing.unit * 6,
        paddingRight: theme.spacing.unit * 4,
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
        // Apply default ListItem padding
        paddingTop: theme.spacing.unit * 1.5,
        paddingBottom: theme.spacing.unit * 1.5,
    },
    panelSummaryContent: {
        alignItems: 'center',
        margin: 0,
    },
    panelSummaryExpanded: {
        margin: '0 !important',
    },
});

const TreeNode = ({
    basePath,
    classes,
    children,
    node,
    resource,
    treeNodeComponent,
    treeNodeWithChildrenComponent: TreeNodeWithChildren,
    treeNodeContentComponent: TreeNodeContent,
    ...props
}) => (
    <ListItem
        button
        classes={{
            root: classNames(classes.root, {
                [classes.leaf]: node.children.length === 0,
            }),
        }}
        dense
        disableGutters
    >
        {node.children.length > 0 ? (
            <TreeNodeWithChildren
                basePath={basePath}
                classes={classes}
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
                    {...props}
                >
                    {children}
                </TreeNodeContent>
            </Fragment>
        )}
    </ListItem>
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

export default withStyles(styles)(TreeNode);
