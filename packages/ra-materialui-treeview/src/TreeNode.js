import React from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';

import TreeNodeContent from './TreeNodeContent';
import TreeNodeWithChildren from './TreeNodeWithChildren';
import getRecordFromNode from './getRecordFromNode';

const TreeNode = ({
    basePath,
    classes,
    children,
    node,
    onChange,
    resource,
    theme,
}) => (
    <ListItem
        button
        classes={{
            root: classes.root,
        }}
        dense
        disableGutters
        style={{ paddingLeft: theme.spacing.unit * 4 }}
    >
        {node.__children.length > 0 ? (
            <TreeNodeWithChildren
                basePath={basePath}
                classes={classes}
                form={`treeview-node-${node.id}`}
                initialValues={getRecordFromNode(node)}
                node={node}
                onChange={onChange}
                resource={resource}
                theme={theme}
            >
                {children}
            </TreeNodeWithChildren>
        ) : (
            <TreeNodeContent
                basePath={basePath}
                form={`treeview-node-${node.id}`}
                initialValues={getRecordFromNode(node)}
                node={node}
                onSubmit={onChange}
                resource={resource}
            >
                {children}
            </TreeNodeContent>
        )}
    </ListItem>
);

TreeNode.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.node,
    classes: PropTypes.object,
    node: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
};

export default TreeNode;
