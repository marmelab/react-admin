import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import { getRecordFromNode } from 'ra-tree-core';
import classNames from 'classnames';

import TreeNodeContent from './TreeNodeContent';
import TreeNodeWithChildren from './TreeNodeWithChildren';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';

const TreeNode = ({ basePath, classes, children, node, resource }) => (
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
};

export default TreeNode;
