import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import { getRecordFromNode } from 'ra-tree-core';
import classNames from 'classnames';

import TreeNodeWithChildren from './TreeNodeWithChildren';

const TreeNode = ({
    basePath,
    classes,
    children,
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

TreeNode.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.node,
    classes: PropTypes.object,
    node: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    treeNodeContentComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]).isRequired,
};

export default TreeNode;
