import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { TreeController } from 'ra-tree-core';

import TreeNode from './TreeNode';
import DefaultTreeNodeContent from './TreeNodeContent';

const styles = theme => ({
    expandIcon: {
        margin: 0,
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    node: {
        display: 'flex',
        // Ensure the user can click the while ListItem to toggle a node
        padding: 0,
        // Add some padding for hierarchy
        paddingLeft: theme.spacing.unit * 4,
    },
    leaf: {
        display: 'flex',
        // Restore default ListItem padding
        paddingTop: theme.spacing.unit * 1.5,
        paddingBottom: theme.spacing.unit * 1.5,
        // Ensure leaf buttons are aligned with node buttons
        paddingRight: theme.spacing.unit * 4,
        position: 'relative',
    },
    panel: {
        background: 'unset',
        display: 'block',
        flexGrow: 1,
    },
    panelDetails: {
        display: 'block',
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

export const Tree = ({
    children,
    classes,
    treeNodeContentComponent,
    ...props
}) => (
    <TreeController {...props}>
        {({ basePath, resource, tree }) => (
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
                        basePath={basePath}
                        classes={{
                            ...classes,
                            root: classes.node,
                        }}
                        node={node}
                        resource={resource}
                        treeNodeContentComponent={treeNodeContentComponent}
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
    ids: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    getTreeFromArray: PropTypes.func,
    onChange: PropTypes.func,
    parentSource: PropTypes.string,
    resource: PropTypes.string.isRequired,
    treeNodeContentComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
};

Tree.defaultProps = {
    classes: {},
    parentSource: 'parent_id',
    treeNodeContentComponent: DefaultTreeNodeContent,
};

export default withStyles(styles)(Tree);
