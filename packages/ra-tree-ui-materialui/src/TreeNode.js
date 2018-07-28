import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import { getRecordFromNode, TreeContext } from 'ra-tree-core';
import classNames from 'classnames';

import TreeNodeWithChildren from './TreeNodeWithChildren';

const TreeNodeView = ({
    basePath,
    classes,
    children,
    getTreeState,
    node,
    resource,
    treeNodeContentComponent: TreeNodeContent,
    ...props
}) => (
    <ListItem
        button
        classes={{
            root: classNames(classes.root, {
                [classes.leaf]: node.__children.length === 0,
            }),
        }}
        dense
        disableGutters
    >
        {node.__children.length > 0 ? (
            <TreeNodeWithChildren
                basePath={basePath}
                classes={classes}
                form={`treeview-node-${node.id}`}
                initialValues={getRecordFromNode(node)}
                getTreeState={getTreeState}
                node={node}
                resource={resource}
                treeNodeContentComponent={TreeNodeContent}
                {...props}
            >
                {children}
            </TreeNodeWithChildren>
        ) : (
            <Fragment>
                <TreeNodeContent
                    basePath={basePath}
                    form={`treeview-node-${node.id}`}
                    initialValues={getRecordFromNode(node)}
                    node={node}
                    resource={resource}
                    {...props}
                >
                    {children}
                </TreeNodeContent>
            </Fragment>
        )}
    </ListItem>
);

TreeNodeView.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.node,
    classes: PropTypes.object,
    getTreeState: PropTypes.func.isRequired,
    node: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    treeNodeContentComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]).isRequired,
};

const TreeNode = props => (
    <TreeContext.Consumer>
        {({ getTreeState }) => (
            <TreeNodeView {...props} getTreeState={getTreeState} />
        )}
    </TreeContext.Consumer>
);

export default TreeNode;
