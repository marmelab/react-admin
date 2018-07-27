import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

import TreeviewNodeContent from './TreeviewNodeContent';

const getRecordFromNode = ({ __children, __depth, ...record }) => record;

const TreeviewNode = ({
    basePath,
    classes,
    children,
    node,
    onChange,
    resource,
    theme,
}) =>
    node.__children.length > 0 ? (
        <ListItem
            button
            classes={{
                root: classes.root,
            }}
            dense
            disableGutters
            style={{ paddingLeft: theme.spacing.unit * 4 }}
        >
            <ExpansionPanel
                classes={{
                    root: classes.panel,
                }}
                elevation={0}
            >
                <ExpansionPanelSummary
                    classes={{
                        content: classes.panelSummaryContent,
                        expandIcon: classes.expandIcon,
                        root: classes.panelSummary,
                        expanded: classes.panelSummaryExpanded,
                    }}
                    expandIcon={<KeyboardArrowDown />}
                >
                    <TreeviewNodeContent
                        basePath={basePath}
                        form={`treeview-node-${node.id}`}
                        initialValues={getRecordFromNode(node)}
                        node={node}
                        onSubmit={onChange}
                        resource={resource}
                    >
                        {children}
                    </TreeviewNodeContent>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                    classes={{
                        root: classes.panelDetails,
                    }}
                >
                    <List dense>
                        {node.__children.map(child => (
                            <TreeviewNode
                                key={child.id}
                                basePath={basePath}
                                classes={classes}
                                node={child}
                                onChange={onChange}
                                resource={resource}
                                theme={theme}
                            >
                                {children}
                            </TreeviewNode>
                        ))}
                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </ListItem>
    ) : (
        <ListItem
            button
            classes={{
                root: classes.root,
            }}
            dense
            disableGutters
            style={{ paddingLeft: theme.spacing.unit * 4 }}
        >
            <TreeviewNodeContent
                basePath={basePath}
                form={`treeview-node-${node.id}`}
                initialValues={getRecordFromNode(node)}
                node={node}
                onSubmit={onChange}
                resource={resource}
            >
                {children}
            </TreeviewNodeContent>
        </ListItem>
    );

TreeviewNode.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.node,
    classes: PropTypes.object,
    node: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
};

export default TreeviewNode;
