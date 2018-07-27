import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

import TreeviewNodeContent from './TreeviewNodeContent';
import { getIsNodeExpanded } from './reducers';
import { toggleNode as toggleNodeAction } from './actions';

const getRecordFromNode = ({ __children, __depth, ...record }) => record;

class TreeviewNodeView extends Component {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        classes: PropTypes.object,
        expanded: PropTypes.bool,
        node: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        resource: PropTypes.string.isRequired,
        theme: PropTypes.object.isRequired,
        toggleNode: PropTypes.func.isRequired,
    };

    handleChange = () => {
        const { toggleNode, node } = this.props;

        toggleNode(node.id);
    };

    render() {
        const {
            basePath,
            classes,
            children,
            expanded,
            node,
            onChange,
            resource,
            theme,
        } = this.props;

        return node.__children.length > 0 ? (
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
                    expanded={expanded}
                    onChange={this.handleChange}
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
    }
}

const mapStateToProps = (state, { node }) => ({
    expanded: getIsNodeExpanded(state, node),
});

const TreeviewNode = connect(
    mapStateToProps,
    { toggleNode: toggleNodeAction }
)(TreeviewNodeView);

export default TreeviewNode;
